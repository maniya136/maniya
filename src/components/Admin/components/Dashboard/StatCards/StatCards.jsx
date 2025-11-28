import React from "react";
import "./StatCards.css";

const StatCards = ({ users = 0, vendors = 0, upcoming = 0 }) => {
  const items = [
    { label: "Total Users", value: users },
    { label: "Total Vendors", value: vendors },
    { label: "Upcoming Events", value: upcoming },
  ];
  return (
    <section className="stat-cards">
      {items.map((it) => (
        <div key={it.label} className="stat-card">
          <div className="stat-number">{it.value}</div>
          <div className="stat-label">{it.label}</div>
        </div>
      ))}
    </section>
  );
};

export default StatCards;
