import React from "react";

const BookingChart = ({ data = [] }) => {
  const max = Math.max(1, ...data);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <div className="card">
      <h3>Bookings per Month</h3>
      <div className="bar-chart">
        {data.map((v, i) => (
          <div key={i} className="bar" style={{ height: `${(v / max) * 100}%` }} title={`${months[i]}: ${v}`} />
        ))}
      </div>
      <div className="legend">
        {months.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  );
};

export default BookingChart;
