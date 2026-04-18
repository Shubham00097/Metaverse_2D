"use client";

export default function ProximityActions({ nearbyUsers, activeCalls = [], peerReady }) {
  if (!nearbyUsers || nearbyUsers.length === 0) return null;

  const target = nearbyUsers[0];
  const isInCall = activeCalls.includes(target.userId);

  return (
    <div className="proximity-popup glass-panel" style={{ left: "50%", top: 100 }}>
      <div className="proximity-name">
        <span style={{ color: target.color }}>●</span>{" "}
        {target.username} is nearby
      </div>

      {isInCall ? (
        <div className="proximity-call-status">
          <div className="proximity-call-wave">
            <span /><span /><span /><span />
          </div>
          <span className="proximity-call-label">Voice Connected</span>
        </div>
      ) : (
        <div className="proximity-call-status connecting">
          <span className="proximity-call-label">
            {peerReady ? "Connecting audio…" : "Initializing…"}
          </span>
        </div>
      )}
    </div>
  );
}
