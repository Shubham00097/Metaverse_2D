"use client";
import { useState } from "react";

export default function TopBar({ roomName, passkey, userCount, onToggleSidebar, onToggleMinimap }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const copyPasskey = () => {
    if (!passkey) return;
    navigator.clipboard.writeText(passkey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center">
      {/* Top Bar Content */}
      <div 
        className={`top-bar glass-panel !relative !top-auto !left-auto !transform-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-y-4 opacity-100 mt-0" : "-translate-y-full opacity-0 pointer-events-none -mt-4"
        }`}
      >
        <div className="top-bar-title">
          <img src="/logo.png" alt="Logo" className="pt-1 w-10 h-9 rounded object-cover" />
          <span>{roomName}</span>
        </div>

        <div className="top-bar-divider" />

        {passkey && (
          <>
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg border border-white/10">
              <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">Passkey:</span>
              <span className="text-sm font-mono tracking-widest text-indigo-300 font-bold">{passkey}</span>
              <button 
                onClick={copyPasskey}
                className="ml-2 w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                title="Copy Passkey"
              >
                {copied ? "✅" : "📋"}
              </button>
            </div>
            <div className="top-bar-divider" />
          </>
        )}

        <div className="top-bar-users">
          <span className="user-count-dot" />
          <span>{userCount} online</span>
        </div>

        <div className="top-bar-actions">
          <button className="top-bar-btn" onClick={onToggleSidebar} title="Users">
            👥
          </button>
          <button className="top-bar-btn" onClick={onToggleMinimap} title="Minimap">
            🗺️
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center w-12 h-6 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-b-xl text-white/60 hover:text-white ${
          isOpen ? "top-[calc(100%+16px)]" : "top-0"
        }`}
        title={isOpen ? "Hide Top Bar" : "Show Top Bar"}
      >
        <svg 
          className={`w-4 h-4 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
