import React, { useMemo, useState } from "react";
import "./Services.css";

// Demo data
const seedServices = [
  { id: 1, name: "Catering", category: "Food" },
  { id: 2, name: "Decoration", category: "Decor" },
  { id: 3, name: "Music System", category: "Entertainment" },
  { id: 4, name: "Photography", category: "Media" },
  { id: 5, name: "Venue", category: "Logistics" },
];

const seedPackages = [
  { id: 201, name: "Wedding Essentials", price: 200000, services: [1, 2, 3, 4] },
  { id: 202, name: "Birthday Basic", price: 20000, services: [1, 2, 3] },
];

const seedPurchases = [
  { id: 1, user: "Aarav Mehta", packageId: 202 },
  { id: 2, user: "Priya Sharma", packageId: 201 },
  { id: 3, user: "Rahul Verma", packageId: 202 },
  { id: 4, user: "Neha Gupta", packageId: 202 },
  { id: 5, user: "Zoya Khan", packageId: 201 },
];

const currency = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const Services = () => {
  const [tab, setTab] = useState("Services"); // Services | Packages

  // Services state
  const [services, setServices] = useState(seedServices);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [draftService, setDraftService] = useState({ name: "", category: "" });

  // Packages state
  const [packages, setPackages] = useState(seedPackages);
  const [purchases, setPurchases] = useState(seedPurchases);
  const [draftPkg, setDraftPkg] = useState({ id: null, name: "", price: "", services: [] });
  const [showPkgForm, setShowPkgForm] = useState(false);
  const [buyersPkg, setBuyersPkg] = useState(null); // package object to inspect buyers

  const categories = useMemo(() => ["All", ...Array.from(new Set(services.map((s) => s.category)))], [services]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesQ = `${s.name} ${s.category}`.toLowerCase().includes(q.toLowerCase());
      const matchesCat = cat === "All" || s.category === cat;
      return matchesQ && matchesCat;
    });
  }, [services, q, cat]);

  const serviceById = (id) => services.find((s) => s.id === id);

  const pkgWithDerived = (pkg) => ({
    ...pkg,
    serviceNames: pkg.services.map(serviceById).filter(Boolean).map((s) => s.name),
    buyers: purchases.filter((p) => p.packageId === pkg.id).map((p) => p.user),
    count: purchases.filter((p) => p.packageId === pkg.id).length,
  });

  const packagesDerived = useMemo(() => packages.map(pkgWithDerived), [packages, purchases, services]);

  // Service handlers
  const addService = () => {
    if (!draftService.name.trim()) return;
    const next = { id: services.length ? Math.max(...services.map((x) => x.id)) + 1 : 1, name: draftService.name.trim(), category: draftService.category.trim() || "General" };
    setServices((prev) => [...prev, next]);
    setDraftService({ name: "", category: "" });
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    // Also remove from packages using this service
    setPackages((prev) => prev.map((p) => ({ ...p, services: p.services.filter((sid) => sid !== id) })));
  };

  // Package handlers
  const openNewPackage = () => {
    setDraftPkg({ id: null, name: "", price: "", services: [] });
    setShowPkgForm(true);
  };

  const openEditPackage = (pkg) => {
    setDraftPkg({ id: pkg.id, name: pkg.name, price: String(pkg.price), services: [...pkg.services] });
    setShowPkgForm(true);
  };

  const savePackage = () => {
    if (!draftPkg.name.trim() || !String(draftPkg.price).trim()) return;
    const priceNum = Number(draftPkg.price);
    if (Number.isNaN(priceNum) || priceNum <= 0) return;
    if (draftPkg.id == null) {
      const newPkg = { id: packages.length ? Math.max(...packages.map((p) => p.id)) + 1 : 1, name: draftPkg.name.trim(), price: priceNum, services: draftPkg.services };
      setPackages((prev) => [...prev, newPkg]);
    } else {
      setPackages((prev) => prev.map((p) => (p.id === draftPkg.id ? { ...p, name: draftPkg.name.trim(), price: priceNum, services: draftPkg.services } : p)));
    }
    setShowPkgForm(false);
  };

  const deletePackage = (pkg) => setPackages((prev) => prev.filter((p) => p.id !== pkg.id));

  // UI fragments
  const ServiceToolbar = () => (
    <div className="services-toolbar">
      <input className="input" placeholder="Search services by name or category" value={q} onChange={(e) => setQ(e.target.value)} />
      <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );

  const ServiceAdd = () => (
    <div className="card add-card">
      <h3>Add Service</h3>
      <div className="row">
        <input className="input" placeholder="Service name" value={draftService.name} onChange={(e) => setDraftService((d) => ({ ...d, name: e.target.value }))} />
        <input className="input" placeholder="Category (e.g. Catering, Decor)" value={draftService.category} onChange={(e) => setDraftService((d) => ({ ...d, category: e.target.value }))} />
        <button className="btn-ghost primary" onClick={addService}>Add</button>
      </div>
    </div>
  );

  const ServicesTable = () => (
    <div className="table-wrap">
      <table className="services-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.length === 0 && <tr><td colSpan={4} className="empty">No services</td></tr>}
          {filteredServices.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.category}</td>
              <td className="actions">
                <button className="btn-ghost danger" onClick={() => deleteService(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const PackagesToolbar = () => (
    <div className="services-toolbar">
      <button className="btn-ghost primary" onClick={openNewPackage}>Add Package</button>
    </div>
  );

  const PackagesTable = () => (
    <div className="table-wrap">
      <table className="services-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Package</th>
            <th>Price</th>
            <th>Included Services</th>
            <th>Purchased</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {packagesDerived.length === 0 && <tr><td colSpan={6} className="empty">No packages</td></tr>}
          {packagesDerived.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{currency(p.price)}</td>
              <td>{p.serviceNames.join(", ") || "-"}</td>
              <td>{p.count}</td>
              <td className="actions">
                <button className="btn-ghost" onClick={() => setBuyersPkg(p)}>Buyers</button>
                <button className="btn-ghost" onClick={() => openEditPackage(p)}>Edit</button>
                <button className="btn-ghost danger" onClick={() => deletePackage(p)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const PackageForm = () => (!showPkgForm ? null : (
    <div className="modal" onClick={() => setShowPkgForm(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{draftPkg.id == null ? "Add Package" : "Edit Package"}</h3>
          <button className="btn-ghost" onClick={() => setShowPkgForm(false)}>Close</button>
        </div>
        <div className="modal-body">
          <div className="row">
            <input className="input" placeholder="Package name" value={draftPkg.name} onChange={(e) => setDraftPkg((d) => ({ ...d, name: e.target.value }))} />
            <input className="input" placeholder="Price (INR)" value={draftPkg.price} onChange={(e) => setDraftPkg((d) => ({ ...d, price: e.target.value }))} />
          </div>
          <div className="row">
            <div className="services-select">
              <div className="label">Included services</div>
              <div className="chips">
                {services.map((s) => {
                  const checked = draftPkg.services.includes(s.id);
                  return (
                    <label key={s.id} className={`chip ${checked ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setDraftPkg((d) => ({
                            ...d,
                            services: e.target.checked ? [...d.services, s.id] : d.services.filter((id) => id !== s.id),
                          }));
                        }}
                      />
                      {s.name}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="row right">
            <button className="btn-ghost primary" onClick={savePackage}>{draftPkg.id == null ? "Create" : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  ));

  const BuyersModal = () => (!buyersPkg ? null : (
    <div className="modal" onClick={() => setBuyersPkg(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Buyers - {buyersPkg.name}</h3>
          <button className="btn-ghost" onClick={() => setBuyersPkg(null)}>Close</button>
        </div>
        <div className="modal-body">
          {buyersPkg.buyers.length === 0 ? (
            <div className="empty">No purchases yet</div>
          ) : (
            <ul className="buyers-list">
              {buyersPkg.buyers.map((u, idx) => (
                <li key={idx}>{u}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  ));

  return (
    <section className="services-root">
      <div className="services-header">
        <div className="tabs">
          <button className={`tab ${tab === 'Services' ? 'active' : ''}`} onClick={() => setTab('Services')}>Services</button>
          <button className={`tab ${tab === 'Packages' ? 'active' : ''}`} onClick={() => setTab('Packages')}>Service Packages</button>
        </div>
        {tab === 'Services' ? (
          <ServiceToolbar />
        ) : (
          <PackagesToolbar />
        )}
      </div>

      {tab === 'Services' ? (
        <>
          <ServiceAdd />
          <ServicesTable />
        </>
      ) : (
        <PackagesTable />
      )}

      <PackageForm />
      <BuyersModal />
    </section>
  );
};

export default Services;
