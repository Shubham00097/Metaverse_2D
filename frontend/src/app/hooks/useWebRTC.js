"use client";
import { useRef, useEffect, useCallback, useState } from "react";
import Peer from "peerjs";

/**
 * useWebRTC — Manages PeerJS connections for proximity-based audio.
 * 
 * Fixed for React StrictMode (Next.js dev mode runs effects twice).
 */
export default function useWebRTC(socket, currentUser, users, nearbyUsers) {
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const activeCallsRef = useRef({});
  const peerIdMapRef = useRef({});

  const [myPeerId, setMyPeerId] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [activeCalls, setActiveCalls] = useState([]);
  const [peerReady, setPeerReady] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  // ── Helpers ──
  function updateActiveCalls() {
    const ids = [];
    Object.keys(activeCallsRef.current).forEach((peerId) => {
      const entry = Object.entries(peerIdMapRef.current).find(
        ([, pid]) => pid === peerId
      );
      if (entry) ids.push(entry[0]);
    });
    setActiveCalls([...ids]);
  }

  function playRemoteStream(peerId, stream) {
    console.log("🔊 Adding remote stream from:", peerId);
    setRemoteStreams((prev) => ({ ...prev, [peerId]: stream }));
    updateActiveCalls();
  }

  function cleanupCall(peerId) {
    setRemoteStreams((prev) => {
      const next = { ...prev };
      delete next[peerId];
      return next;
    });
    delete activeCallsRef.current[peerId];
    updateActiveCalls();
  }

  function fullCleanup() {
    Object.values(activeCallsRef.current).forEach((c) => {
      try { c.close(); } catch (e) {}
    });
    activeCallsRef.current = {};
    setRemoteStreams({});

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);

    if (peerRef.current && !peerRef.current.destroyed) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    setPeerReady(false);
    setMyPeerId(null);
    setActiveCalls([]);
  }

  // ── Initialize Peer & microphone ──
  useEffect(() => {
    if (!currentUser || !socket) return;

    let cancelled = false;

    // Clean any previous state (handles React StrictMode double-mount)
    fullCleanup();

    async function init() {
      // 1. Capture microphone & camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: true,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        localStreamRef.current = stream;
        setLocalStream(stream);
        console.log("🎤 Mic/Cam captured OK");
      } catch (err) {
        console.warn("🎤 Mic/Cam denied or unavailable:", err.message);
        // Continue — can still hear others
      }

      if (cancelled) return;

      // 2. Create PeerJS
      const peer = new Peer();

      peer.on("open", (id) => {
        if (cancelled) { peer.destroy(); return; }
        console.log("📡 PeerJS ready, ID:", id);
        peerRef.current = peer;
        setMyPeerId(id);
        setPeerReady(true);

        socket.emit("share-peer-id", {
          userId: currentUser.userId,
          peerId: id,
        });
      });

      // Auto-answer incoming calls
      peer.on("call", (call) => {
        if (cancelled) return;
        console.log("📞 Incoming call from:", call.peer);

        if (localStreamRef.current) {
          call.answer(localStreamRef.current);
        } else {
          call.answer(new MediaStream());
        }

        call.on("stream", (remoteStream) => {
          console.log("🔊 Got stream from:", call.peer);
          playRemoteStream(call.peer, remoteStream);
        });

        call.on("close", () => cleanupCall(call.peer));
        call.on("error", (err) => {
          console.error("Call error:", err);
          cleanupCall(call.peer);
        });

        activeCallsRef.current[call.peer] = call;
        updateActiveCalls();
      });

      peer.on("error", (err) => {
        console.warn("⚠️ PeerJS warning:", err.type, err);
      });

      peer.on("disconnected", () => {
        if (!cancelled && peer && !peer.destroyed) {
          console.warn("⚠️ PeerJS disconnected, reconnecting...");
          peer.reconnect();
        }
      });
    }

    init();

    return () => {
      cancelled = true;
      fullCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.userId, socket]);

  // ── Listen for peer IDs ──
  useEffect(() => {
    if (!socket) return;

    const handler = ({ userId, peerId }) => {
      console.log(`🔗 Peer ID received: ${userId} → ${peerId}`);
      peerIdMapRef.current[userId] = peerId;
    };

    socket.on("user-peer-id", handler);
    return () => socket.off("user-peer-id", handler);
  }, [socket]);

  // ── Proximity calling ──
  const prevNearbyRef = useRef("");

  useEffect(() => {
    if (!peerReady || !peerRef.current || !currentUser) return;

    const nearbyIds = nearbyUsers.map((u) => u.userId).sort().join(",");
    if (nearbyIds === prevNearbyRef.current) return;
    prevNearbyRef.current = nearbyIds;

    const nearbySet = new Set(nearbyUsers.map((u) => u.userId));

    // Call nearby users
    nearbyUsers.forEach((u) => {
      const remotePeerId = peerIdMapRef.current[u.userId];
      if (!remotePeerId) {
        console.log(`⏳ Waiting for peerId of ${u.username}...`);
        return;
      }
      if (activeCallsRef.current[remotePeerId]) return;
      if (!localStreamRef.current) {
        console.warn("⚠️ No local stream, can't initiate call");
        return;
      }

      console.log(`📞 Calling ${u.username} (${remotePeerId})`);
      const call = peerRef.current.call(remotePeerId, localStreamRef.current);
      if (!call) { console.error("call() returned null"); return; }

      call.on("stream", (rs) => {
        console.log(`🔊 Stream from ${u.username}`);
        playRemoteStream(remotePeerId, rs);
      });
      call.on("close", () => cleanupCall(remotePeerId));
      call.on("error", (e) => { console.error("Call err:", e); cleanupCall(remotePeerId); });

      activeCallsRef.current[remotePeerId] = call;
      updateActiveCalls();
    });

    // Hang up users who moved away
    Object.entries(activeCallsRef.current).forEach(([peerId, call]) => {
      const uid = Object.entries(peerIdMapRef.current).find(([, p]) => p === peerId)?.[0];
      if (uid && !nearbySet.has(uid)) {
        console.log(`📵 Disconnecting ${uid}`);
        call.close();
        cleanupCall(peerId);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nearbyUsers, peerReady, currentUser]);

  // ── Toggle mic ──
  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) return;
    const track = localStreamRef.current.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicEnabled(track.enabled);
      console.log(`🎤 Mic ${track.enabled ? "ON" : "OFF"}`);
    }
  }, []);

  // ── Toggle cam ──
  const toggleCam = useCallback(() => {
    if (!localStreamRef.current) return;
    const track = localStreamRef.current.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamEnabled(track.enabled);
      console.log(`📷 Cam ${track.enabled ? "ON" : "OFF"}`);
    }
  }, []);

  return { myPeerId, micEnabled, camEnabled, toggleMic, toggleCam, activeCalls, peerReady, localStream, remoteStreams, peerIdMap: peerIdMapRef.current };
}
