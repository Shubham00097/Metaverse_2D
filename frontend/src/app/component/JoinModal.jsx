"use client";
import { useState } from "react";

const COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#f59e0b", // amber
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
];

export default function JoinModal({ connected, onJoin }) {
  const [username, setUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleJoin = () => {
    if (!username.trim() || !connected) return;
    onJoin({ username: username.trim(), color: selectedColor });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleJoin();
  };

  return (
    <div className="join-overlay">
      <div className="join-card glass-panel">
        <div className="join-logo overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="join-title">Metaverse Room</h1>
        <p className="join-subtitle">Enter your name and pick an avatar to join the room</p>

        <input
          type="text"
          className="join-input"
          placeholder="Your display name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          maxLength={20}
        />

        <span className="color-picker-label">Choose your avatar color</span>
        <div className="color-picker-row">
          {COLORS.map((color) => (
            <div
              key={color}
              className={`color-swatch ${selectedColor === color ? "selected" : ""}`}
              style={{ background: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>

        <button
          className="join-btn"
          onClick={handleJoin}
          disabled={!username.trim() || !connected}
        >
          {connected ? "Enter Room →" : "Connecting..."}
        </button>

        <div
          className="join-status"
          style={{ background: connected ? "#22c55e" : "#ef4444" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
          {connected ? "Connected to server" : "Connecting..."}
        </div>
      </div>
    </div>
  );
}
