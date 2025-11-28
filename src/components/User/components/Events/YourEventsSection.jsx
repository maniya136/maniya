import React, { useEffect, useState } from 'react';
import api from '../../../../services/api';
import './YourEventsSection.css';

export const YourEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/Events/user');
        setEvents(res.data || res);
      } catch (err) {
        setError(err?.message || 'Failed to load your events');
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
      {!loading && !error && events.length === 0 && (
        <div className="uds-empty">You have not created any events yet.</div>
      )}
      <div className="uds-card-grid">
        {events.map((ev) => (
          <article key={ev.id} className="uds-card-item">
            <div className="uds-card-header">
              <h3>{ev.title}</h3>
              <span className="uds-pill">{ev.status || 'Draft'}</span>
            </div>
            <p className="uds-meta">
              {ev.location} · {ev.date}
            </p>
            <p className="uds-meta-light">Category: {ev.category || 'N/A'}</p>
          </article>
        ))}
      </div>
    </div>
  );
};
