import React, { useMemo, useState } from "react";
import "./Bookings.css";

const seedBookings = [
  { id: 1, event: "Tech Summit 2025", user: "Aarav Mehta", date: "2025-10-20", status: "Confirmed", amount: 5000, details: { tickets: 2, reference: "TS25-001", method: "UPI" } },
  { id: 2, event: "Music Fiesta", user: "Priya Sharma", date: "2025-11-02", status: "Pending", amount: 3000, details: { tickets: 1, reference: "MF25-552", method: "Card" } },
  { id: 3, event: "Corporate Year-End Party", user: "Rahul Verma", date: "2025-12-22", status: "Cancelled", amount: 0, details: { tickets: 5, reference: "CP25-778", method: "UPI" } },
  { id: 4, event: "Meera & Vikram Wedding", user: "Neha Gupta", date: "2025-11-18", status: "Confirmed", amount: 12000, details: { tickets: 3, reference: "WD25-044", method: "NetBanking" } },
  { id: 5, event: "Tech Summit 2025", user: "Zoya Khan", date: "2025-10-21", status: "Confirmed", amount: 2500, details: { tickets: 1, reference: "TS25-019", method: "UPI" } },
];

const STATUS = ["All", "Confirmed", "Pending", "Cancelled"];

const Bookings = () => {
  const [q, setQ] = useState(""); // search query
  const [searchBy, setSearchBy] = useState("Both"); // Event | User | Both
  const [status, setStatus] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [bookings] = useState(seedBookings);
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const haystack = searchBy === 'Event' ? b.event
        : searchBy === 'User' ? b.user
        : `${b.event} ${b.user}`;
      const matchesQ = haystack.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = status === "All" || b.status === status;
      const afterFrom = !from || b.date >= from;
      const beforeTo = !to || b.date <= to;
      return matchesQ && matchesStatus && afterFrom && beforeTo;
    });
  }, [bookings, q, status, from, to, searchBy]);

  const totals = useMemo(() => ({
    total: filtered.length,
    confirmed: filtered.filter((b) => b.status === "Confirmed").length,
    pending: filtered.filter((b) => b.status === "Pending").length,
    cancelled: filtered.filter((b) => b.status === "Cancelled").length,
    amount: filtered.reduce((s, b) => s + (b.amount || 0), 0),
  }), [filtered]);

  const Summary = () => (
    <section className="stat-cards">
      <div className="stat-card"><div className="stat-number">{totals.total}</div><div className="stat-label">Total Bookings</div></div>
      <div className="stat-card"><div className="stat-number">{totals.confirmed}</div><div className="stat-label">Confirmed</div></div>
      <div className="stat-card"><div className="stat-number">{totals.pending}</div><div className="stat-label">Pending</div></div>
      <div className="stat-card"><div className="stat-number">{totals.cancelled}</div><div className="stat-label">Cancelled</div></div>
    </section>
  );

  const DetailsModal = () => (!detail ? null : (
    <div className="modal" onClick={() => setDetail(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Booking Details</h3>
          <button className="btn-ghost" onClick={() => setDetail(null)}>Close</button>
        </div>
        <div className="modal-body">
          <div className="row"><span className="label">Event</span><span>{detail.event}</span></div>
          <div className="row"><span className="label">User</span><span>{detail.user}</span></div>
          <div className="row"><span className="label">Date</span><span>{detail.date}</span></div>
          <div className="row"><span className="label">Status</span><span>{detail.status}</span></div>
          <div className="row"><span className="label">Amount</span><span>₹{detail.amount}</span></div>
          <div className="row"><span className="label">Tickets</span><span>{detail.details?.tickets}</span></div>
          <div className="row"><span className="label">Reference</span><span>{detail.details?.reference}</span></div>
          <div className="row"><span className="label">Payment</span><span>{detail.details?.method}</span></div>
        </div>
      </div>
    </div>
  ));

  return (
    <section className="bookings-root">
      <div className="bookings-header">
        <div className="filters">
          <select className="input" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
            <option value="Event">Event</option>
            <option value="User">User</option>
            <option value="Both">Both</option>
          </select>
          <input className="input" placeholder={`Search by ${searchBy.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <div className="summary">
            <span className="badge">Amount ₹{totals.amount}</span>
            <span className="badge">Users {new Set(filtered.map(b => b.user)).size}</span>
          </div>
        </div>
      </div>

      <Summary />

      <div className="table-wrap">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Event</th>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="empty">No bookings found</td></tr>}
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.event}</td>
                <td>{b.user}</td>
                <td>{b.date}</td>
                <td><span className={`pill ${b.status === 'Confirmed' ? 'pill-green' : b.status === 'Pending' ? 'pill-amber' : 'pill-red'}`}>{b.status}</span></td>
                <td>₹{b.amount}</td>
                <td className="actions"><button className="btn-ghost" onClick={() => setDetail(b)}>More</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailsModal />
    </section>
  );
};

export default Bookings;
