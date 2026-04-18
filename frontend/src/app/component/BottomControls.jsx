"use client";
import { useState } from "react";

const EMOJIS = ["👋", "😂", "❤️", "🔥", "👍", "🎉", "💯", "✨"];

export default function BottomControls({
  onLeave,
  onEmoji,
  micEnabled = false,
  onToggleMic,
  camEnabled = false,
  onToggleCam,
  peerReady = false,
  activeCallCount = 0,
}) {
  const [showEmoji, setShowEmoji] = useState(false);

  const handleEmoji = (emoji) => {
    onEmoji(emoji);
    setShowEmoji(false);
  };

  return (
    <div className="bottom-controls glass-panel">
      {/* Mic — now wired to WebRTC */}
      <button
        className={`control-btn ${micEnabled ? "active" : "muted"}`}
        onClick={onToggleMic}
        disabled={!peerReady}
      >
        {micEnabled ? "🎤" : "🔇"}
        <span className="control-tooltip">
          {!peerReady ? "Initializing…" : micEnabled ? "Mute" : "Unmute"}
        </span>
        {/* Active call indicator dot */}
        {activeCallCount > 0 && <span className="call-indicator-dot" />}
      </button>

      {/* Cam */}
      <button
        className={`control-btn ${camEnabled ? "active" : "muted"}`}
        onClick={onToggleCam}
        disabled={!peerReady}
      >
        {camEnabled ? "📷" : "🚫"}
        <span className="control-tooltip">
          {!peerReady ? "Initializing…" : camEnabled ? "Stop Video" : "Start Video"}
        </span>
      </button>

      <div className="control-divider" />

      {/* Emoji */}
      <div style={{ position: "relative" }}>
        <button
          className="control-btn"
          onClick={() => setShowEmoji(!showEmoji)}
        >
          😊
          <span className="control-tooltip">React</span>
        </button>

        {showEmoji && (
          <div className="emoji-picker-popup">
            {EMOJIS.map((e) => (
              <button
                key={e}
                className="emoji-option"
                onClick={() => handleEmoji(e)}
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="control-divider" />

      {/* Leave */}
      <button className="control-btn leave" onClick={onLeave}>
        🚪
        <span className="control-tooltip">Leave Room</span>
      </button>
    </div>
  );
}
