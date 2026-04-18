"use client";
import { useRef, useEffect, useCallback } from "react";

// ── Room Configuration ──
const TILE = 40;
const COLS = 20;
const ROWS = 15;
const WORLD_W = COLS * TILE;
const WORLD_H = ROWS * TILE;
const MOVE_SPEED = 3;
const INTERACTION_RADIUS = 100;

// ── Furniture Layout ──
const FURNITURE = [
  // Tables
  { type: "table", x: 7, y: 2, w: 3, h: 2, color: "#4a3728" },
  { type: "table", x: 13, y: 8, w: 2, h: 2, color: "#4a3728" },
  // Sofa
  { type: "sofa", x: 1, y: 8, w: 3, h: 2, color: "#5b4a8a" },
  // Chairs
  { type: "chair", x: 5, y: 5, w: 1, h: 1, color: "#6b5b3a" },
  { type: "chair", x: 12, y: 5, w: 1, h: 1, color: "#6b5b3a" },
  { type: "chair", x: 16, y: 10, w: 1, h: 1, color: "#6b5b3a" },
  // Plants
  { type: "plant", x: 1, y: 1, w: 1, h: 1 },
  { type: "plant", x: 17, y: 1, w: 1, h: 1 },
  { type: "plant", x: 15, y: 5, w: 1, h: 1 },
  { type: "plant", x: 2, y: 12, w: 1, h: 1 },
  { type: "plant", x: 17, y: 12, w: 1, h: 1 },
  // Bookshelf
  { type: "shelf", x: 0, y: 4, w: 1, h: 3, color: "#5a4020" },
  // Rug
  { type: "rug", x: 6, y: 6, w: 5, h: 4, color: "rgba(124, 58, 237, 0.08)" },
  // Whiteboard
  { type: "board", x: 8, y: 0, w: 4, h: 1, color: "#f5f5f5" },
];

export default function GameCanvas({ currentUser, users, onMove, onNearbyChange }) {
  const canvasRef = useRef(null);
  const keysRef = useRef({});
  const posRef = useRef({ x: currentUser.x, y: currentUser.y });
  const animRef = useRef(null);
  const lastEmitRef = useRef(0);

  // Keep posRef synced with currentUser prop
  useEffect(() => {
    posRef.current = { x: currentUser.x, y: currentUser.y };
  }, [currentUser.x, currentUser.y]);

  // ── Draw Frame ──
  const draw = useCallback((ctx, w, h) => {
    const cx = posRef.current.x;
    const cy = posRef.current.y;

    // Camera: center on player
    const camX = Math.max(0, Math.min(cx - w / 2, WORLD_W - w));
    const camY = Math.max(0, Math.min(cy - h / 2, WORLD_H - h));

    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(-camX, -camY);

    // ── Floor ──
    ctx.fillStyle = "#12122a";
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= WORLD_W; x += TILE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, WORLD_H);
      ctx.stroke();
    }
    for (let y = 0; y <= WORLD_H; y += TILE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(WORLD_W, y);
      ctx.stroke();
    }

    // ── Walls ──
    ctx.fillStyle = "#1e1e3a";
    ctx.fillRect(0, 0, WORLD_W, 4);
    ctx.fillRect(0, 0, 4, WORLD_H);
    ctx.fillRect(WORLD_W - 4, 0, 4, WORLD_H);
    ctx.fillRect(0, WORLD_H - 4, WORLD_W, 4);

    // Wall accent line
    ctx.strokeStyle = "rgba(124, 58, 237, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, WORLD_W - 4, WORLD_H - 4);

    // ── Furniture ──
    FURNITURE.forEach((f) => {
      const fx = f.x * TILE;
      const fy = f.y * TILE;
      const fw = f.w * TILE;
      const fh = f.h * TILE;

      switch (f.type) {
        case "rug":
          ctx.fillStyle = f.color;
          ctx.beginPath();
          roundRect(ctx, fx + 4, fy + 4, fw - 8, fh - 8, 12);
          ctx.fill();
          break;

        case "table":
          ctx.fillStyle = f.color;
          roundRect(ctx, fx + 4, fy + 4, fw - 8, fh - 8, 6);
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 1;
          roundRect(ctx, fx + 4, fy + 4, fw - 8, fh - 8, 6);
          ctx.stroke();
          break;

        case "sofa":
          ctx.fillStyle = f.color;
          roundRect(ctx, fx + 2, fy + 2, fw - 4, fh - 4, 10);
          ctx.fill();
          // cushions
          ctx.fillStyle = "rgba(255,255,255,0.06)";
          for (let i = 0; i < f.w; i++) {
            roundRect(ctx, fx + i * TILE + 6, fy + 6, TILE - 12, fh - 12, 6);
            ctx.fill();
          }
          break;

        case "chair":
          ctx.fillStyle = f.color;
          ctx.beginPath();
          ctx.arc(fx + TILE / 2, fy + TILE / 2, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.1)";
          ctx.lineWidth = 1;
          ctx.stroke();
          break;

        case "plant":
          // pot
          ctx.fillStyle = "#8B4513";
          roundRect(ctx, fx + 12, fy + 22, 16, 12, 3);
          ctx.fill();
          // leaves
          ctx.fillStyle = "#22c55e";
          ctx.beginPath();
          ctx.arc(fx + 20, fy + 16, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#16a34a";
          ctx.beginPath();
          ctx.arc(fx + 16, fy + 12, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(fx + 24, fy + 14, 6, 0, Math.PI * 2);
          ctx.fill();
          break;

        case "shelf":
          ctx.fillStyle = f.color;
          roundRect(ctx, fx + 2, fy + 2, fw - 4, fh - 4, 4);
          ctx.fill();
          // shelves
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          for (let i = 1; i < f.h; i++) {
            ctx.fillRect(fx + 4, fy + i * TILE - 1, fw - 8, 2);
          }
          // books
          const bookColors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b"];
          for (let i = 0; i < f.h; i++) {
            for (let j = 0; j < 3; j++) {
              ctx.fillStyle = bookColors[(i * 3 + j) % bookColors.length];
              ctx.fillRect(fx + 8 + j * 10, fy + i * TILE + 6, 7, TILE - 14);
            }
          }
          break;

        case "board":
          ctx.fillStyle = f.color;
          roundRect(ctx, fx + 4, fy + 2, fw - 8, fh - 4, 4);
          ctx.fill();
          ctx.strokeStyle = "#888";
          ctx.lineWidth = 2;
          roundRect(ctx, fx + 4, fy + 2, fw - 8, fh - 4, 4);
          ctx.stroke();
          // text lines
          ctx.fillStyle = "#ccc";
          for (let i = 0; i < 3; i++) {
            ctx.fillRect(fx + 16 + i * 50, fy + 10, 30, 3);
            ctx.fillRect(fx + 16 + i * 50, fy + 18, 20, 3);
          }
          break;
      }
    });

    // ── Proximity rings & connection lines ──
    const allUsers = [
      { ...currentUser, x: posRef.current.x, y: posRef.current.y },
      ...users,
    ];
    const nearby = [];

    users.forEach((u) => {
      const dx = u.x - posRef.current.x;
      const dy = u.y - posRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < INTERACTION_RADIUS) {
        nearby.push(u);

        // Connection line
        ctx.save();
        ctx.strokeStyle = "rgba(124, 58, 237, 0.25)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(posRef.current.x, posRef.current.y);
        ctx.lineTo(u.x, u.y);
        ctx.stroke();
        ctx.restore();

        // Glow on nearby user
        ctx.save();
        ctx.beginPath();
        ctx.arc(u.x, u.y, 28, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(124, 58, 237, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    });

    // ── Other Avatars ──
    users.forEach((u) => {
      drawAvatar(ctx, u.x, u.y, u.color, u.username, false, u.emoji);
    });

    // ── Current User Avatar ──
    drawAvatar(ctx, posRef.current.x, posRef.current.y, currentUser.color, currentUser.username, true, currentUser.emoji);

    ctx.restore();

    // Report nearby users
    if (onNearbyChange) {
      onNearbyChange(nearby);
    }
  }, [currentUser, users, onNearbyChange]);

  // ── Draw Avatar Helper ──
  function drawAvatar(ctx, x, y, color, name, isCurrentUser, emoji) {
    const radius = 16;

    // Glow for current user
    if (isCurrentUser) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
      const glow = ctx.createRadialGradient(x, y, radius, x, y, radius + 12);
      glow.addColorStop(0, color + "40");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.restore();
    }

    // Shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y + radius + 4, 12, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fill();
    ctx.restore();

    // Body circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Outline
    ctx.strokeStyle = isCurrentUser ? "#fff" : "rgba(255,255,255,0.2)";
    ctx.lineWidth = isCurrentUser ? 2.5 : 1;
    ctx.stroke();

    // Initial letter
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name.charAt(0).toUpperCase(), x, y);

    // Username label
    ctx.font = "600 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.85)";

    // Label background
    const tw = ctx.measureText(name).width + 10;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    roundRect(ctx, x - tw / 2, y - radius - 20, tw, 16, 4);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.fillText(name, x, y - radius - 12);

    // Emoji floating
    if (emoji) {
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.fillText(emoji, x, y - radius - 30);
    }
  }

  // ── Rounded Rect Helper ──
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Game Loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let running = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      if (!running) return;

      // Process keys → move
      const keys = keysRef.current;
      let dx = 0, dy = 0;

      if (keys["ArrowUp"] || keys["w"] || keys["W"]) dy -= MOVE_SPEED;
      if (keys["ArrowDown"] || keys["s"] || keys["S"]) dy += MOVE_SPEED;
      if (keys["ArrowLeft"] || keys["a"] || keys["A"]) dx -= MOVE_SPEED;
      if (keys["ArrowRight"] || keys["d"] || keys["D"]) dx += MOVE_SPEED;

      if (dx !== 0 || dy !== 0) {
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
          dx *= 0.707;
          dy *= 0.707;
        }

        // Collision Check Function
        const checkCollision = (cx, cy, r) => {
          for (const f of FURNITURE) {
            if (f.type === "rug") continue; // Can walk on rugs

            const fx = f.x * TILE;
            const fy = f.y * TILE;
            const fw = f.w * TILE;
            const fh = f.h * TILE;

            // Find closest point on rect to circle center
            const closestX = Math.max(fx, Math.min(cx, fx + fw));
            const closestY = Math.max(fy, Math.min(cy, fy + fh));

            const distanceX = cx - closestX;
            const distanceY = cy - closestY;
            const distanceSquared = distanceX * distanceX + distanceY * distanceY;

            if (distanceSquared < r * r) return true; // Collision!
          }
          return false;
        };

        const radius = 16;
        let dxFinal = dx;
        let dyFinal = dy;

        // Check X axis independently for sliding effect
        if (checkCollision(posRef.current.x + dxFinal, posRef.current.y, radius)) {
          dxFinal = 0;
        }

        // Check Y axis independently
        if (checkCollision(posRef.current.x + dxFinal, posRef.current.y + dyFinal, radius)) {
          dyFinal = 0;
        }

        let newX = posRef.current.x + dxFinal;
        let newY = posRef.current.y + dyFinal;

        // Clamp to world bounds
        newX = Math.max(20, Math.min(WORLD_W - 20, newX));
        newY = Math.max(20, Math.min(WORLD_H - 20, newY));

        posRef.current = { x: newX, y: newY };

        // Throttle emit to ~20 times/sec
        const now = Date.now();
        if (now - lastEmitRef.current > 50) {
          lastEmitRef.current = now;
          onMove(newX, newY);
        }
      }

      draw(ctx, canvas.width, canvas.height);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [draw, onMove]);

  // ── Key Handlers ──
  useEffect(() => {
    const down = (e) => {
      // Don't capture keys when typing in chat
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      keysRef.current[e.key] = true;
    };
    const up = (e) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}

// Export constants for MiniMap
export { TILE, COLS, ROWS, WORLD_W, WORLD_H, FURNITURE, INTERACTION_RADIUS };
