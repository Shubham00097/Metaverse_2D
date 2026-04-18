"use client";

export default function UserSidebar({ users, currentUserId, visible, activeCalls = [] }) {
  if (!visible) return null;

  return (
    <div className="user-sidebar glass-panel">
      <div className="sidebar-header">
        <span className="sidebar-title">Users ({users.length})</span>
      </div>

      <div className="user-list">
        {users.map((u, index) => {
          const isMe = u.userId === currentUserId;
          const isInCall = activeCalls.includes(u.userId);
          return (
            <div key={`${u.userId}-${index}`} className="user-item">
              <div
                className="user-item-avatar"
                style={{ background: u.color }}
              >
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-item-info">
                <div className="user-item-name">{u.username}</div>
                <div className="user-item-status">
                  {isInCall ? (
                    <span className="user-in-call-badge">🎤 In Call</span>
                  ) : (
                    "In room"
                  )}
                </div>
              </div>
              {isMe && <span className="user-item-you">YOU</span>}
            </div>
          );
        })}

        {users.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
            No other users yet
          </div>
        )}
      </div>
    </div>
  );
}
