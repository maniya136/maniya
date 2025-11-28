import React, { useEffect, useState } from 'react';
import api from '../../../../services/api';
import './ExploreVendorsSection.css';

export const ExploreVendorsSection = () => {
  const [vendors, setVendors] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/Vendors');
        setVendors(res.data || res);
      } catch (err) {
        setError(err?.message || 'Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = vendors.filter((v) => {
    const text = `${v.name} ${v.city} ${v.services?.join(' ')}`.toLowerCase();
    return text.includes(q.toLowerCase());
  });

  return (
    <div className="uds-grid">
      <div className="uds-toolbar">
        <input
          className="uds-input"
          placeholder="Search vendors by name, city or service"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading && <div className="uds-empty">Loading...</div>}
      {error && !loading && <div className="uds-empty">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="uds-empty">No vendors found for your search.</div>
      )}
      <div className="uds-card-grid">
        {filtered.map((v) => (
          <article key={v.id} className="uds-card-item">
            <div className="uds-card-header">
              <h3>{v.name}</h3>
              <span className="uds-pill">{v.city}</span>
            </div>
            <p className="uds-meta-light">{(v.services || []).join(', ')}</p>
            <p className="uds-meta-light">Rating: {v.rating || 'N/A'}</p>
          </article>
        ))}
      </div>
    </div>
  );
};
