"use client";
import { useEffect, useRef } from "react";

function VideoTile({ stream, isLocal, user, isMuted, isCamOff }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video-tile group">
      {/* Fallback avatar if cam is off or no stream */}
      {(!stream || isCamOff) ? (
        <div className="video-avatar-fallback">
          <div className="video-avatar-circle" style={{ background: user?.color || "#6366f1" }}>
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Always mute local video to prevent echo
          className={`video-element ${isLocal ? "mirrored" : ""}`}
        />
      )}

      {/* Overlay controls & info */}
      <div className="video-overlay">
        <div className="video-user-name">
          {user?.username} {isLocal && "(You)"}
        </div>
        <div className={`video-mic-status ${isMuted ? "muted" : "active"}`}>
          {isMuted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          )}
        </div>
      </div>
      
      {/* Active speaker highlight ring (simulated if unmuted) */}
      {!isMuted && !isLocal && <div className="video-active-ring" />}
    </div>
  );
}

export default function VideoGrid({ 
  currentUser, 
  users, 
  activeCalls, 
  localStream, 
  remoteStreams, 
  peerIdMap, 
  micEnabled, 
  camEnabled,
  userMediaStatus // { [userId]: { mic: boolean, cam: boolean } }
}) {
  // If we only have ourselves and no active calls, we can either hide the grid or show just ourselves.
  // For a "room", usually we want to see ourselves.
  const allTiles = [];

  // Local user tile
  allTiles.push({
    userId: currentUser.userId,
    user: currentUser,
    stream: localStream,
    isLocal: true,
    isMuted: !micEnabled,
    isCamOff: !camEnabled
  });

  // Remote users in active calls
  activeCalls.forEach(userId => {
    const user = users.find(u => u.userId === userId);
    if (!user) return;
    const peerId = peerIdMap[userId];
    const stream = remoteStreams[peerId];
    
    // Check if we have remote status via socket, default to active if unknown
    const remoteStatus = userMediaStatus[userId] || { mic: true, cam: true };

    allTiles.push({
      userId,
      user,
      stream,
      isLocal: false,
      isMuted: !remoteStatus.mic,
      isCamOff: !remoteStatus.cam
    });
  });

  // Determine grid layout class based on number of participants
  let gridClass = "video-grid-1";
  if (allTiles.length === 2) gridClass = "video-grid-2";
  else if (allTiles.length >= 3 && allTiles.length <= 4) gridClass = "video-grid-4";
  else if (allTiles.length >= 5) gridClass = "video-grid-auto";

  return (
    <div className="video-sidebar glass-panel">
      <div className="sidebar-header">
        <span className="sidebar-title">Live Call ({allTiles.length})</span>
      </div>
      <div className={`video-grid-container ${gridClass}`}>
        {allTiles.map(tile => (
          <VideoTile
            key={tile.userId}
            stream={tile.stream}
            isLocal={tile.isLocal}
            user={tile.user}
            isMuted={tile.isMuted}
            isCamOff={tile.isCamOff}
          />
        ))}
      </div>
    </div>
  );
}
