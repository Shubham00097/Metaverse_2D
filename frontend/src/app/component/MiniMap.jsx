"use client";
import { useRef, useEffect } from "react";
import { WORLD_W, WORLD_H, FURNITURE } from "./GameCanvas";

export default function MiniMap({ currentUser, users, visible }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const W = 160;
    const H = 120;
    canvas.width = W;
    canvas.height = H;

    const scaleX = W / WORLD_W;
    const scaleY = H / WORLD_H;

    // Background
    ctx.fillStyle = "#0d0d20";
    ctx.fillRect(0, 0, W, H);

    // Room border
    ctx.strokeStyle = "rgba(124, 58, 237, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Furniture
    FURNITURE.forEach((f) => {
      if (f.type === "rug") return;
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.fillRect(
        f.x * 40 * scaleX,
        f.y * 40 * scaleY,
        f.w * 40 * scaleX,
        f.h * 40 * scaleY
      );
    });

    // Other users
    users.forEach((u) => {
      ctx.beginPath();
      ctx.arc(u.x * scaleX, u.y * scaleY, 3, 0, Math.PI * 2);
      ctx.fillStyle = u.color;
      ctx.fill();
    });

    // Current user (larger, with glow)
    const cx = currentUser.x * scaleX;
    const cy = currentUser.y * scaleY;

    // Glow
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = currentUser.color + "40";
    ctx.fill();

    // Dot
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = currentUser.color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.stroke();

  }, [currentUser, users, visible]);

  if (!visible) return null;

  return (
    <div className="minimap-container glass-panel">
      <span className="minimap-label">MAP</span>
      <canvas ref={canvasRef} />
    </div>
  );
}
