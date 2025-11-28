import React, { useEffect, useState } from 'react';
import api from '../../../../services/api';
import './GuestManagementSection.css';

export const GuestManagementSection = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/Guests');
        setGuests(res.data || res);
      } catch (err) {
        setError(err?.message || 'Failed to load guests');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="uds-grid">
      {loading && <div className="uds-empty">Loading...</div>}
      {error && !loading && <div className="uds-empty">{error}</div>}
      {!loading && !error && guests.length === 0 && (
        <div className="uds-empty">No guests added yet.</div>
      )}
      <div className="uds-card-grid">
        {guests.map((g) => (
          <article key={g.id} className="uds-card-item">
            <div className="uds-card-header">
              <h3>{g.name}</h3>
              <span className="uds-pill">{g.status || 'Invited'}</span>
            </div>
            <p className="uds-meta">{g.email}</p>
            <p className="uds-meta-light">{g.phone}</p>
          </article>
        ))}
      </div>
    </div>
  );
};
