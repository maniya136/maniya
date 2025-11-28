import React, { useEffect, useState } from 'react';
import api from '../../../../services/api';
import './QueriesReportsSection.css';

export const QueriesReportsSection = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/Reports/user');
        setReports(res.data || res);
      } catch (err) {
        setError(err?.message || 'Failed to load reports');
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
      {!loading && !error && reports.length === 0 && (
        <div className="uds-empty">No reports or queries yet.</div>
      )}
      <div className="uds-card-grid">
        {reports.map((r) => (
          <article key={r.id} className="uds-card-item">
            <div className="uds-card-header">
              <h3>{r.title}</h3>
              <span className="uds-pill">{r.status || 'Open'}</span>
            </div>
            <p className="uds-meta-light">{r.createdAt}</p>
            <p className="uds-meta-light">{r.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
};
