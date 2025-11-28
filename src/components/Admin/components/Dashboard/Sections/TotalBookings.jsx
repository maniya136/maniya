import React from "react";
import "./TotalBookings.css";

const TotalBookings = ({ total = 0 }) => {
  return (
    <div className="card">
      <h3>Total Bookings</h3>
      <div className="stat-number" style={{marginTop:8}}>{total}</div>
      <div className="small-muted">All-time bookings across events</div>
    </div>
  );
};

export default TotalBookings;
