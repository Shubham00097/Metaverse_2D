"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatPanel({ messages, currentUser, onSend }) {
  const [text, setText] = useState("");
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chat-panel glass-panel ${minimized ? "minimized" : ""}`}>
      {/* Header */}
      <div className="chat-header" onClick={() => setMinimized(!minimized)}>
        <div className="chat-tabs">
          <span className="chat-tab active">💬 Chat</span>
        </div>
        <button className="chat-minimize-btn">
          {minimized ? "▲" : "▼"}
        </button>
      </div>

      {/* Messages */}
      {!minimized && (
        <>
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty">No messages yet. Say hello! 👋</div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className="chat-msg">
                <div
                  className="chat-msg-avatar"
                  style={{ background: msg.color || "#6366f1" }}
                >
                  {msg.user?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="chat-msg-body">
                  <div className="chat-msg-header">
                    <span className="chat-msg-name">{msg.user}</span>
                    <span className="chat-msg-time">{msg.time}</span>
                  </div>
                  <div className="chat-msg-text">{msg.text}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-bar">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="chat-send-btn" onClick={handleSend}>
              ➤
            </button>
          </div>
        </>
      )}
    </div>
  );
}
