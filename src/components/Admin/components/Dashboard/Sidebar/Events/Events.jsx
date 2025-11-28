import React, { useMemo, useState } from "react";
import "./Events.css";

const seedPersonal = [
  { id: 1, name: "Aarav Birthday Bash", date: "2025-10-25", type: "Birthday", status: "Ongoing", host: "Aarav Mehta", location: "Mumbai", attendees: 120 },
  { id: 2, name: "Meera & Vikram Wedding", date: "2025-11-18", type: "Wedding", status: "Upcoming", host: "Families", location: "Delhi", attendees: 450 },
  { id: 3, name: "Corporate Year-End Party", date: "2025-12-22", type: "Party", status: "Upcoming", host: "Acme Corp", location: "Bengaluru", attendees: 220 },
];

const seedCustom = [
  { id: 101, name: "Tech Community Meetup", date: "2025-11-02", type: "Custom", status: "Pending", requestedBy: "Dev Guild", description: "A local tech meetup with talks and networking.", location: "Pune", expected: 180 },
  { id: 102, name: "Food Truck Festival", date: "2025-11-30", type: "Custom", status: "Pending", requestedBy: "StreetEats", description: "City food truck carnival with live music.", location: "Hyderabad", expected: 800 },
];

const STATUS_FILTERS = ["All", "Ongoing", "Upcoming"]; // simple per request

const Events = () => {
  const [tab, setTab] = useState("Personal"); // Personal | Custom
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [personal, setPersonal] = useState(seedPersonal);
  const [custom, setCustom] = useState(seedCustom);
  const [details, setDetails] = useState(null); // event object for detail view

  const filteredPersonal = useMemo(() => {
    return personal.filter((e) => {
      const matchesQ = `${e.name} ${e.type} ${e.location}`.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = status === "All" || e.status === status;
      return matchesQ && matchesStatus;
    });
  }, [personal, q, status]);

  const filteredCustom = useMemo(() => {
    return custom.filter((e) => {
      const matchesQ = `${e.name} ${e.requestedBy} ${e.location}`.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = status === "All" || e.status === status;
      return matchesQ && matchesStatus;
    });
  }, [custom, q, status]);

  const approve = (ev) => setCustom((prev) => prev.map((e) => e.id === ev.id ? { ...e, status: "Approved" } : e));
  const reject = (ev) => setCustom((prev) => prev.map((e) => e.id === ev.id ? { ...e, status: "Rejected" } : e));

  const TableHead = () => (
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Date</th>
        <th>Type</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
  );

  const renderPersonalRows = () => (
    filteredPersonal.map((e) => (
      <tr key={e.id}>
        <td>{e.id}</td>
        <td>{e.name}</td>
        <td>{e.date}</td>
        <td>{e.type}</td>
        <td><span className={`pill ${e.status === 'Ongoing' ? 'pill-green' : 'pill-amber'}`}>{e.status}</span></td>
        <td className="actions"><button className="btn-ghost" onClick={() => setDetails({ ...e, kind: 'personal' })}>More</button></td>
      </tr>
    ))
  );

  const renderCustomRows = () => (
    filteredCustom.map((e) => (
      <tr key={e.id}>
        <td>{e.id}</td>
        <td>{e.name}</td>
        <td>{e.date}</td>
        <td>{e.type}</td>
        <td>
          <span className={`pill ${e.status === 'Approved' ? 'pill-green' : e.status === 'Rejected' ? 'pill-red' : 'pill-amber'}`}>{e.status}</span>
        </td>
        <td className="actions">
          <button className="btn-ghost" onClick={() => setDetails({ ...e, kind: 'custom' })}>More</button>
          <button className="btn-ghost" onClick={() => approve(e)} disabled={e.status !== 'Pending'}>Approve</button>
          <button className="btn-ghost danger" onClick={() => reject(e)} disabled={e.status !== 'Pending'}>Reject</button>
        </td>
      </tr>
    ))
  );

  const Details = () => (
    !details ? null : (
      <div className="modal" onClick={() => setDetails(null)}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Event Details</h3>
            <button className="btn-ghost" onClick={() => setDetails(null)}>Close</button>
          </div>
          <div className="modal-body">
            <div className="row"><span className="label">Name</span><span>{details.name}</span></div>
            <div className="row"><span className="label">Date</span><span>{details.date}</span></div>
            <div className="row"><span className="label">Type</span><span>{details.type}</span></div>
            {details.kind === 'personal' ? (
              <>
                <div className="row"><span className="label">Host</span><span>{details.host}</span></div>
                <div className="row"><span className="label">Location</span><span>{details.location}</span></div>
                <div className="row"><span className="label">Attendees</span><span>{details.attendees}</span></div>
              </>
            ) : (
              <>
                <div className="row"><span className="label">Requested By</span><span>{details.requestedBy}</span></div>
                <div className="row"><span className="label">Location</span><span>{details.location}</span></div>
                <div className="row"><span className="label">Expected</span><span>{details.expected}</span></div>
                <div className="row"><span className="label">Description</span><span>{details.description}</span></div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );

  return (
    <section className="events-root">
      <div className="events-header">
        <div className="tabs">
          <button className={`tab ${tab === 'Personal' ? 'active' : ''}`} onClick={() => setTab('Personal')}>Personal Events</button>
          <button className={`tab ${tab === 'Custom' ? 'active' : ''}`} onClick={() => setTab('Custom')}>Custom Events</button>
        </div>
        <div className="filters">
          <input className="input" placeholder="Search events by name, location, requester" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="events-table">
          <TableHead />
          <tbody>
            {tab === 'Personal' ? (
              filteredPersonal.length ? renderPersonalRows() : <tr><td colSpan={6} className="empty">No events found</td></tr>
            ) : (
              filteredCustom.length ? renderCustomRows() : <tr><td colSpan={6} className="empty">No events found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Details />
    </section>
  );
};

export default Events;
