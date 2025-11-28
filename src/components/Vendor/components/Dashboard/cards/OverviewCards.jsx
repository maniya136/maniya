import React from 'react';
import './OverviewCards.css';

const Stat = ({ title, value, accent }) => (
  <div className="vd-stat" style={{ '--accent': accent }}>
    <div className="vd-stat__title">{title}</div>
    <div className="vd-stat__value">{value}</div>
  </div>
);

const OverviewCards = ({ bookings = 0, approvedServices = 0 }) => {
  return (
    <div className="vd-stats">
      <Stat title="Booking Requests" value={bookings} accent="#22c55e" />
      <Stat title="Approved Services" value={approvedServices} accent="#06b6d4" />
    </div>
  );
};

export default OverviewCards;
