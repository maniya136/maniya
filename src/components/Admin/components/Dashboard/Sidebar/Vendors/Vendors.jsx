import React, { useMemo, useState } from "react";
import "./Vendors.css";

const seedVendors = [
  { id: 1, name: "Star Caterers", email: "star@cater.com", phone: "+91 98765 12345", services: ["Catering"], city: "Mumbai", rating: 4.6, status: "Approved" },
  { id: 2, name: "Dream Weddings", email: "contact@dreamwed.in", phone: "+91 99876 54321", services: ["Wedding", "Decoration"], city: "Delhi", rating: 4.8, status: "Approved" },
  { id: 3, name: "Party Pros", email: "hello@partypros.com", phone: "+91 90123 45678", services: ["Birthday", "Party"], city: "Pune", rating: 4.2, status: "Approved" },
];

const seedApplications = [
  { id: 101, name: "Elite Events", email: "apply@elitevents.in", phone: "+91 98000 11111", services: ["Wedding", "Party"], city: "Bengaluru", note: "We provide end-to-end wedding planning." , status: "Pending"},
  { id: 102, name: "Cake n' Bake", email: "cakemail@bake.in", phone: "+91 97000 22222", services: ["Birthday", "Catering"], city: "Chennai", note: "Designer cakes and dessert tables.", status: "Pending" },
];

const ALL_SERVICES = ["All", "Birthday", "Wedding", "Party", "Catering", "Decoration"];

const Vendors = () => {
  const [tab, setTab] = useState("Vendors"); // Vendors | Applications
  const [q, setQ] = useState("");
  const [service, setService] = useState("All");
  const [vendors, setVendors] = useState(seedVendors);
  const [applications, setApplications] = useState(seedApplications);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesQ = `${v.name} ${v.email} ${v.city}`.toLowerCase().includes(q.toLowerCase());
      const matchesService = service === "All" || v.services.includes(service);
      return matchesQ && matchesService;
    });
  }, [vendors, q, service]);

  const approve = (app) => {
    // move to vendors
    setVendors((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1,
        name: app.name,
        email: app.email,
        phone: app.phone,
        services: app.services,
        city: app.city,
        rating: 0,
        status: "Approved",
      },
    ]);
    setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: "Approved" } : a));
  };

  const reject = (app) => {
    setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: "Rejected" } : a));
  };

  return (
    <section className="vendors-root">
      <div className="vendors-header">
        <div className="tabs">
          <button className={`tab ${tab === 'Vendors' ? 'active' : ''}`} onClick={() => setTab('Vendors')}>Vendors</button>
            <input className="input" placeholder="Search vendors by name, email or city"  style={{width:'500px'}}value={q} onChange={(e) => setQ(e.target.value)} />            
            <select className="input" value={service} onChange={(e) => setService(e.target.value)}>
              {ALL_SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            
            {/* <button className={`tab ${tab === 'Applications' ? 'active' : ''}`} onClick={() => setTab('Applications')}>Applications</button> */}
        </div>
        {tab === 'Vendors' && (
          <div className="vendors-filters">
          
            <button className={`tab ${tab === 'Applications' ? 'active' : ''}`} onClick={() => setTab('Applications')}>Applications</button>

          </div>
        )}
        
      </div>

      {tab === 'Vendors' ? (
        <div className="table-wrap">

          <table className="vendors-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Services</th>
                <th>City</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 && (
                <tr><td colSpan={8} className="empty">No vendors found</td></tr>
              )}
              {filteredVendors.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.name}</td>
                  <td>{v.email}</td>
                  <td>{v.phone}</td>
                  <td>{v.services.join(', ')}</td>
                  <td>{v.city}</td>
                  <td>{v.rating.toFixed(1)}</td>
                  <td><span className={`pill ${v.status === 'Approved' ? 'pill-green' : 'pill-amber'}`}>{v.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="vendors-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Services</th>
                <th>City</th>
                <th>Note</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 && (
                <tr><td colSpan={9} className="empty">No applications</td></tr>
              )}
              {applications.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{a.phone}</td>
                  <td>{a.services.join(', ')}</td>
                  <td>{a.city}</td>
                  <td className="note-cell">{a.note}</td>
                  <td><span className={`pill ${a.status === 'Approved' ? 'pill-green' : a.status === 'Rejected' ? 'pill-red' : 'pill-amber'}`}>{a.status}</span></td>
                  <td className="actions">
                    <button className="btn-ghost" onClick={() => approve(a)} disabled={a.status !== 'Pending'}>Approve</button>
                    <button className="btn-ghost danger" onClick={() => reject(a)} disabled={a.status !== 'Pending'}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Vendors;
