"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import "../../room/room.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await login(email, password);
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to log in.");
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
        <h1 className="join-title">Welcome Back</h1>
        <p className="join-subtitle">Log in to enter the Metaverse Room</p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="email"
            className="join-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            autoFocus
          />
          <input
            type="password"
            className="join-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />

          {error && <div style={{ color: "#ef4444", fontSize: "14px", marginTop: "-5px" }}>{error}</div>}

          <button className="join-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p style={{ marginTop: "20px", color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
          Don't have an account? <Link href="/signup" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "bold" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
