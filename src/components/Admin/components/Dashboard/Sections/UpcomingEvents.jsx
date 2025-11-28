import React from "react";
import "./UpcomingEvents.css";

const UpcomingEvents = ({ items = [] }) => {
  return (
    <div className="card">
      <h3>Upcoming Events</h3>
      <ul className="list">
        {items.length === 0 && <li><span>No upcoming events</span></li>}
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

export default UpcomingEvents;
