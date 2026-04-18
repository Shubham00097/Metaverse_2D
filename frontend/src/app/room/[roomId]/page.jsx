"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../../context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import "../room.css";

import GameCanvas from "../../component/GameCanvas";
import TopBar from "../../component/TopBar";
import UserSidebar from "../../component/UserSidebar";
import VideoGrid from "../../component/VideoGrid";
import ChatPanel from "../../component/ChatPanel";
import BottomControls from "../../component/BottomControls";
import MiniMap from "../../component/MiniMap";
import ProximityActions from "../../component/ProximityActions";
import useWebRTC from "../../hooks/useWebRTC";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export default function RoomPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId;

  const [roomName, setRoomName] = useState("Loading space...");
  const [roomPasskey, setRoomPasskey] = useState("");
  const [roomError, setRoomError] = useState(false);

  const [connected, setConnected] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [toast, setToast] = useState(null);
  const [userMediaStatus, setUserMediaStatus] = useState({});

  const currentUserRef = useRef(null);

  // ── WebRTC Proximity Audio ──
  const { micEnabled, camEnabled, toggleMic, toggleCam, activeCalls, peerReady, localStream, remoteStreams, peerIdMap } = useWebRTC(
    socket,
    localUser,
    users,
    nearbyUsers
  );

  const showToast = useCallback((text, type = "info") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Auth Check ──
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [loading, currentUser, router]);

  // ── Fetch Room Info ──
  useEffect(() => {
    if (!roomId || !currentUser) return;
    const fetchRoom = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setRoomName(data.name || "Virtual Space");
          setRoomPasskey(data.passkey || "");
        } else {
          setRoomError(true);
          router.push("/lobby");
        }
      } catch (err) {
        console.error("Failed to fetch room", err);
        setRoomError(true);
      }
    };
    fetchRoom();
  }, [roomId, currentUser, router]);

  // ── Initialization ──
  useEffect(() => {
    if (currentUser && !localUser && roomId) {
      const spawnX = 200 + Math.random() * 400;
      const spawnY = 150 + Math.random() * 300;

      const initializedUser = {
        userId: currentUser.userId,
        username: currentUser.username,
        color: currentUser.avatar || "#6366f1", // fallback color
        x: spawnX,
        y: spawnY,
      };

      setLocalUser(initializedUser);
      currentUserRef.current = initializedUser;

      if (!socket.connected) {
        socket.connect();
      }
    }
  }, [currentUser, localUser, roomId]);

  // ── Socket Events ──
  useEffect(() => {
    if (!currentUserRef.current || !roomId) return; // Only bind if initialized

    const onConnect = () => {
      setConnected(true);
      console.log("✅ Connected:", socket.id);

      // Use currentUserRef.current so we don't need localUser in the dependency array
      socket.emit("join-room", {
        roomId: roomId,
        ...currentUserRef.current
      });
    };

    const onDisconnect = () => {
      setConnected(false);
      console.log("❌ Disconnected");
    };

    const onRoomState = ({ users: roomUsers }) => {
      console.log("📦 Room state:", roomUsers);
      setUsers(roomUsers.filter((u) => u.userId !== currentUserRef.current?.userId));
    };

    const onUserJoined = ({ userId, username, color, x, y }) => {
      console.log(`👋 ${username} joined`);
      if (userId === currentUserRef.current?.userId) return; // Prevent duplicate keys

      setUsers((prev) => {
        if (prev.find((u) => u.userId === userId)) return prev;
        return [...prev, { userId, username, color, x, y }];
      });
      showToast(`${username} joined the room`, "info");
    };

    const onUserMoved = ({ userId, x, y }) => {
      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, x, y } : u))
      );
    };

    const onUserLeft = ({ userId }) => {
      setUsers((prev) => {
        const user = prev.find((u) => u.userId === userId);
        if (user) showToast(`${user.username} left the room`, "warning");
        return prev.filter((u) => u.userId !== userId);
      });
    };

    const onReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const onUserEmoji = ({ userId, emoji }) => {
      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, emoji } : u))
      );
      setTimeout(() => {
        setUsers((prev) =>
          prev.map((u) => (u.userId === userId ? { ...u, emoji: null } : u))
        );
      }, 3000);
    };

    const onUserCamStatus = ({ userId, enabled }) => {
      setUserMediaStatus(prev => ({ ...prev, [userId]: { ...prev[userId], cam: enabled } }));
    };

    const onUserMicStatus = ({ userId, enabled }) => {
      setUserMediaStatus(prev => ({ ...prev, [userId]: { ...prev[userId], mic: enabled } }));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("room-state", onRoomState);
    socket.on("user-joined", onUserJoined);
    socket.on("user-moved", onUserMoved);
    socket.on("user-left", onUserLeft);
    socket.on("receive_message", onReceiveMessage);
    socket.on("user-emoji", onUserEmoji);
    socket.on("user-cam-status", onUserCamStatus);
    socket.on("user-mic-status", onUserMicStatus);

    // If socket is already connected when this runs
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room-state", onRoomState);
      socket.off("user-joined", onUserJoined);
      socket.off("user-moved", onUserMoved);
      socket.off("user-left", onUserLeft);
      socket.off("receive_message", onReceiveMessage);
      socket.off("user-emoji", onUserEmoji);
      socket.off("user-cam-status", onUserCamStatus);
      socket.off("user-mic-status", onUserMicStatus);
    };
  }, [roomId, showToast]);

  const handleMove = useCallback((x, y) => {
    if (!currentUserRef.current || !roomId) return;
    currentUserRef.current = { ...currentUserRef.current, x, y };
    setLocalUser((prev) => ({ ...prev, x, y }));

    socket.emit("move", {
      roomId: roomId,
      userId: currentUserRef.current.userId,
      x,
      y,
    });
  }, [roomId]);

  const handleSendMessage = useCallback((text) => {
    if (!localUser || !roomId) return;
    const msg = {
      user: localUser.username,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      color: localUser.color,
    };
    socket.emit("send_message", msg);
  }, [localUser, roomId]);

  const handleEmoji = useCallback((emoji) => {
    if (!localUser || !roomId) return;
    socket.emit("emoji-reaction", {
      roomId: roomId,
      userId: localUser.userId,
      emoji,
    });
    setLocalUser((prev) => ({ ...prev, emoji }));
    setTimeout(() => {
      setLocalUser((prev) => ({ ...prev, emoji: null }));
    }, 3000);
  }, [localUser, roomId]);

  const handleToggleMic = useCallback(() => {
    toggleMic();
    socket.emit("mic-status", { roomId, userId: localUser?.userId, enabled: !micEnabled });
  }, [toggleMic, micEnabled, roomId, localUser]);

  const handleToggleCam = useCallback(() => {
    toggleCam();
    socket.emit("cam-status", { roomId, userId: localUser?.userId, enabled: !camEnabled });
  }, [toggleCam, camEnabled, roomId, localUser]);

  const handleLeave = useCallback(async () => {
    socket.disconnect();
    setLocalUser(null);
    setUsers([]);
    setMessages([]);
    router.push("/lobby");
  }, [router]);

  const handleNearbyChange = useCallback((nearby) => {
    setNearbyUsers(nearby);
  }, []);

  const allUsers = localUser ? [{ ...localUser }, ...users] : users;

  if (roomError) return null;

  if (loading || !currentUser || !localUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: 'white' }}>
        <h2>Loading metaverse...</h2>
      </div>
    );
  }

  return (
    <div className="room-wrapper">
      <GameCanvas
        currentUser={localUser}
        users={users}
        onMove={handleMove}
        onNearbyChange={handleNearbyChange}
      />

      <TopBar
        roomName={roomName}
        passkey={roomPasskey}
        userCount={allUsers.length}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleMinimap={() => setShowMinimap(!showMinimap)}
      />

      {showSidebar && activeCalls.length > 0 ? (
        <VideoGrid
          currentUser={localUser}
          users={allUsers}
          activeCalls={activeCalls}
          localStream={localStream}
          remoteStreams={remoteStreams}
          peerIdMap={peerIdMap}
          micEnabled={micEnabled}
          camEnabled={camEnabled}
          userMediaStatus={userMediaStatus}
        />
      ) : (
        <UserSidebar
          users={allUsers}
          currentUserId={localUser?.userId}
          visible={showSidebar}
          activeCalls={activeCalls}
        />
      )}

      <ChatPanel
        messages={messages}
        currentUser={localUser}
        onSend={handleSendMessage}
      />

      <BottomControls
        onLeave={handleLeave}
        onEmoji={handleEmoji}
        micEnabled={micEnabled}
        onToggleMic={handleToggleMic}
        camEnabled={camEnabled}
        onToggleCam={handleToggleCam}
        peerReady={peerReady}
        activeCallCount={activeCalls.length}
      />

      <MiniMap
        currentUser={localUser}
        users={users}
        visible={showMinimap}
      />

      <ProximityActions
        nearbyUsers={nearbyUsers}
        activeCalls={activeCalls}
        peerReady={peerReady}
      />

      {activeCalls.length > 0 && (
        <div className="audio-status-indicator">
          <div className="audio-status-wave">
            <span /><span /><span /><span />
          </div>
          <span className="audio-status-text">
            Connected with {activeCalls.length} {activeCalls.length === 1 ? "person" : "people"}
          </span>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.text}
        </div>
      )}

      <MovementHint />
    </div>
  );
}

function MovementHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;
  return (
    <div className="movement-hint">
      Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to move
    </div>
  );
}
