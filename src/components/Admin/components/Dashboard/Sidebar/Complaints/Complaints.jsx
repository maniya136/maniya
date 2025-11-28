import React, { useMemo, useState } from "react";
import "./Complaints.css";

const seedComplaints = [
  { id: 1, user: "Aarav Mehta", email: "aarav@example.com", subject: "Payment not reflecting", date: "2025-10-10", status: "Open", message: "I paid via UPI but booking still pending.", replies: [] },
  { id: 2, user: "Priya Sharma", email: "priya@example.com", subject: "Wrong event timing", date: "2025-10-12", status: "In Progress", message: "Event shows 6 PM but ticket says 7 PM.", replies: [{ at: "2025-10-12", by: "Admin", text: "We are checking with organizer." }] },
  { id: 3, user: "Rahul Verma", email: "rahul@example.com", subject: "Refund request", date: "2025-10-14", status: "Resolved", message: "Canceled by organizer. Need refund.", replies: [{ at: "2025-10-14", by: "Admin", text: "Refund initiated." }] },
];

const STATUS = ["All", "Open", "In Progress", "Resolved"];

const Complaints = () => {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [items, setItems] = useState(seedComplaints);
  const [detail, setDetail] = useState(null); // selected complaint
  const [reply, setReply] = useState("");

  const filtered = useMemo(() => {
    return items.filter((c) => {
      const hay = `${c.user} ${c.email} ${c.subject} ${c.message}`.toLowerCase();
      const matchesQ = hay.includes(q.toLowerCase());
      const matchesStatus = status === "All" || c.status === status;
      return matchesQ && matchesStatus;
    });
  }, [items, q, status]);

  const respond = (c) => {
    if (!reply.trim()) return;
    setItems((prev) => prev.map((it) => it.id === c.id ? { ...it, replies: [...it.replies, { at: new Date().toISOString().slice(0,10), by: "Admin", text: reply.trim() }], status: it.status === 'Open' ? 'In Progress' : it.status } : it));
    setReply("");
  };

  const resolve = (c) => {
    setItems((prev) => prev.map((it) => it.id === c.id ? { ...it, status: "Resolved" } : it));
  };

  const Summary = () => {
    const open = filtered.filter((c) => c.status === 'Open').length;
    const prog = filtered.filter((c) => c.status === 'In Progress').length;
    const res = filtered.filter((c) => c.status === 'Resolved').length;
    return (
      <section className="stat-cards">
        <div className="stat-card"><div className="stat-number">{filtered.length}</div><div className="stat-label">Total</div></div>
        <div className="stat-card"><div className="stat-number">{open}</div><div className="stat-label">Open</div></div>
        <div className="stat-card"><div className="stat-number">{prog}</div><div className="stat-label">In Progress</div></div>
        <div className="stat-card"><div className="stat-number">{res}</div><div className="stat-label">Resolved</div></div>
      </section>
    );
  };

  const DetailsModal = () => (!detail ? null : (
    <div className="modal" onClick={() => setDetail(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Complaint Details</h3>
          <button className="btn-ghost" onClick={() => setDetail(null)}>Close</button>
        </div>
        <div className="modal-body">
          <div className="row"><span className="label">User</span><span>{detail.user}</span></div>
          <div className="row"><span className="label">Email</span><span>{detail.email}</span></div>
          <div className="row"><span className="label">Subject</span><span>{detail.subject}</span></div>
          <div className="row"><span className="label">Date</span><span>{detail.date}</span></div>
          <div className="row"><span className="label">Status</span><span>{detail.status}</span></div>
          <div className="row"><span className="label">Message</span><span>{detail.message}</span></div>
          <div className="replies">
            <div className="label" style={{marginBottom:4}}>Conversation</div>
            {detail.replies.length === 0 ? (
              <div className="empty">No replies yet</div>
            ) : (
              <ul className="replies-list">
                {detail.replies.map((r, i) => (
                  <li key={i}><strong>{r.by}</strong> <span className="muted">({r.at})</span>: {r.text}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="row">
            <input className="input" placeholder="Type your reply" value={reply} onChange={(e) => setReply(e.target.value)} />
            <button className="btn-ghost" onClick={() => respond(detail)} disabled={!reply.trim()}>Send</button>
            <button className="btn-ghost primary" onClick={() => resolve(detail)} disabled={detail.status === 'Resolved'}>Mark Resolved</button>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <section className="complaints-root">
      <div className="complaints-header">
        <div className="filters">
          <input className="input" placeholder="Search by user, email or subject" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <Summary />

      <div className="table-wrap">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="empty">No complaints found</td></tr>}
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.user}</td>
                <td>{c.email}</td>
                <td>{c.subject}</td>
                <td>{c.date}</td>
                <td><span className={`pill ${c.status === 'Resolved' ? 'pill-green' : c.status === 'In Progress' ? 'pill-amber' : 'pill-red'}`}>{c.status}</span></td>
                <td className="actions">
                  <button className="btn-ghost" onClick={() => { setDetail(c); setReply(""); }}>Respond</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailsModal />
    </section>
  );
};

export default Complaints;
