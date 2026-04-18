"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LobbyPage() {
  const { currentUser, loading, logout, updateAvatar } = useAuth();
  const router = useRouter();

  // Public rooms
  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // Avatar Color Picker
  const [showColorPicker, setShowColorPicker] = useState(false);
  const predefinedColors = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"
  ];

  // Join by passkey
  const [passkeyInput, setPasskeyInput] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Create room modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Auth guard
  useEffect(() => {
    if (!loading && !currentUser) router.push("/login");
  }, [currentUser, loading, router]);

  // Fetch public rooms
  const fetchRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/public`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchRooms();
  }, [currentUser]);

  // Join a public room by its ID
  const handleJoinPublic = async (roomId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/room/${data.room._id}`);
      } else {
        alert(data.message || "Failed to join room");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  // Join a private room by passkey
  const handleJoinByPasskey = async (e) => {
    e.preventDefault();
    setJoinError("");
    if (!passkeyInput.trim()) return;

    setIsJoining(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey: passkeyInput }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/room/${data.room._id}`);
      } else {
        setJoinError(data.message || "Room not found or invalid passkey");
      }
    } catch (err) {
      setJoinError("Server error. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  // Create room
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreateError("");
    if (!newRoomName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRoomName, isPrivate }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        setNewRoomName("");
        setIsPrivate(false);
        router.push(`/room/${data.room._id}`);
      } else {
        setCreateError(data.message || "Failed to create room");
      }
    } catch (err) {
      setCreateError("Server error. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading || !currentUser) return null;

  return (
    <div className="min-h-screen bg-[#080b14] text-white font-sans overflow-hidden relative">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 -left-20 w-[520px] h-[520px] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-5%] w-[480px] h-[480px] rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-8">

        {/* ── Header ── */}
        <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded" />
              Lobby
            </h1>
            <p className="text-slate-400 text-sm">Browse public spaces or join a private room with a passkey.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Avatar chip with Color Picker */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/6 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <div
                  className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: currentUser.avatar || "#6366f1" }}
                />
                <span className="text-sm font-medium text-slate-200">{currentUser.username}</span>
              </button>

              {showColorPicker && (
                <div className="absolute top-full right-0 mt-2 p-3 bg-[#0e1420] border border-white/10 rounded-xl shadow-xl z-50 w-48">
                  <div className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Change Color</div>
                  <div className="grid grid-cols-4 gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        onClick={async () => {
                          await updateAvatar(color);
                          setShowColorPicker(false);
                        }}
                        className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: currentUser.avatar === color ? "white" : "transparent"
                        }}
                        title={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={async () => { await logout(); router.push("/"); }}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium transition-colors"
            >
              Log out
            </button>
            <button
              onClick={() => { setIsModalOpen(true); setCreateError(""); }}
              className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-[0_0_20px_-4px_rgba(99,102,241,0.5)]"
            >
              + Create Room
            </button>
          </div>
        </header>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Public Rooms ── */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Public Spaces
              </h2>
              <button
                onClick={fetchRooms}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            {isLoadingRooms ? (
              <div className="flex justify-center items-center h-56">
                <div className="w-7 h-7 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-56 rounded-2xl bg-white/4 border border-white/8 text-center px-6">
                <div className="text-3xl mb-3">🏜️</div>
                <p className="text-slate-400 font-medium mb-1">No public spaces yet</p>
                <p className="text-slate-600 text-sm">Create one and invite your team!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <RoomCard key={room._id} room={room} onJoin={() => handleJoinPublic(room._id)} />
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Join by Passkey ── */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-slate-200 mb-5 flex items-center gap-2">
              <span className="text-lg">🔑</span>
              Join Private Room
            </h2>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                Got a passkey from your team? Enter it below to join their private workspace.
              </p>
              <form onSubmit={handleJoinByPasskey}>
                <input
                  type="text"
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value.toUpperCase());
                    setJoinError("");
                  }}
                  placeholder="e.g. A9F2B4"
                  maxLength={8}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-500 focus:outline-none text-center text-xl font-mono tracking-widest text-white placeholder:text-white/20 mb-3"
                  required
                />

                {joinError && (
                  <div className="flex items-center gap-2 text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
                    <span>⚠️</span> {joinError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isJoining}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
                >
                  {isJoining ? "Joining..." : "Enter Workspace →"}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/8 text-center">
                <p className="text-xs text-slate-600">
                  Private room passkeys are shown in the room's top bar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Create Room Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e1420] border border-white/10 rounded-2xl p-7 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-100 mb-1">Create a New Room</h2>
            <p className="text-slate-500 text-sm mb-6">
              Public rooms appear in the lobby. Private rooms need a passkey to join.
            </p>

            <form onSubmit={handleCreateRoom}>
              {/* Room Name */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. Design Sprint, Chill Lounge"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-500 focus:outline-none text-slate-200 text-sm"
                  required
                  autoFocus
                />
              </div>

              {/* Visibility Toggle */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/30 border border-white/8">
                  <button
                    type="button"
                    onClick={() => setIsPrivate(false)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${!isPrivate
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-300"
                      }`}
                  >
                    <span className="flex items-center gap-1">
                      <img src="/logo.png" alt="Logo" className="w-3.5 h-3.5 rounded-sm" />
                      Public
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(true)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${isPrivate
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-300"
                      }`}
                  >
                    🔒 Private
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {isPrivate
                    ? "A unique passkey will be auto-generated. Share it with your team."
                    : "This room will appear in the public lobby."}
                </p>
              </div>

              {createError && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
                  <span>⚠️</span> {createError}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create & Enter →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Room Card Component ──
function RoomCard({ room, onJoin }) {
  const [joining, setJoining] = useState(false);

  const handleClick = async () => {
    setJoining(true);
    await onJoin();
    setJoining(false);
  };

  return (
    <div className="group p-5 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h3 className="text-base font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors leading-tight">
          {room.name}
        </h3>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium shrink-0 ml-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {room.activeUsers?.length ?? 0} online
        </span>
      </div>

      {room.description && (
        <p className="text-xs text-slate-500 leading-relaxed -mt-2">
          {room.description}
        </p>
      )}

      <button
        onClick={handleClick}
        disabled={joining}
        className="w-full py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white text-sm font-medium transition-all disabled:opacity-50"
      >
        {joining ? "Joining..." : "Join Space"}
      </button>
    </div>
  );
}
