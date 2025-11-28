import React from "react";
import "./ActivityFeed.css";

const ActivityFeed = ({ items = [] }) => {
  return (
    <div className="card">
      <h3>Recent Activity</h3>
      <ul className="list">
        {items.length === 0 && <li><span>No recent activity</span></li>}
        {items.map((a) => (
          <li key={a.id}>
            <span>
              <strong style={{textTransform:'capitalize'}}>{a.type}</strong>: {a.text}
            </span>
            <span className="badge">{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
