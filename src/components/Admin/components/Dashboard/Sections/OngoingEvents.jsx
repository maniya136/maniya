import React from "react";
import "./OngoingEvents.css";

const OngoingEvents = ({ items = [] }) => {
  return (
    <div className="card">
      <h3>Ongoing Events</h3>
      <ul className="list">
        {items.length === 0 && <li><span>No ongoing events</span></li>}
        {items.map((e) => (
          <li key={e.id}>
            <span>{e.name}</span>
            <span className="badge">{e.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OngoingEvents;
