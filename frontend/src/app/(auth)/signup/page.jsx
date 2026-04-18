"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import "../../room/room.css";

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

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await signup(username, email, password, selectedColor);
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to sign up.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="join-overlay" style={{ zIndex: 10 }}>
      <div className="join-card glass-panel" style={{ maxWidth: "400px" }}>
        <div className="join-logo overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="join-title">Create Account</h1>
        <p className="join-subtitle">Join the Metaverse Room</p>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            className="join-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            maxLength={20}
            autoFocus
          />
          <input
            type="email"
            className="join-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <input
            type="password"
            className="join-input"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />

          <div style={{ marginTop: "10px" }}>
            <span className="color-picker-label" style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Choose your avatar color</span>
            <div className="color-picker-row" style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              {COLORS.map((color) => (
                <div
                  key={color}
                  className={`color-swatch ${selectedColor === color ? "selected" : ""}`}
                  style={{ 
                    background: color, 
                    width: "24px", 
                    height: "24px", 
                    borderRadius: "50%", 
                    cursor: "pointer",
                    border: selectedColor === color ? "2px solid white" : "none",
                    boxShadow: selectedColor === color ? `0 0 10px ${color}` : "none"
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {error && <div style={{ color: "#ef4444", fontSize: "14px", marginTop: "5px" }}>{error}</div>}

          <button className="join-btn" type="submit" disabled={isSubmitting} style={{ marginTop: "5px" }}>
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "12px", color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
          Already have an account? <Link href="/login" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "bold" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
