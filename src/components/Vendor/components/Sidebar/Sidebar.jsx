import React from 'react';
import './Sidebar.css';

// Minimal inline icons (no external deps)
const Icon = {
  overview: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M4 4h7v7H4V4zm9 0h7v4h-7V4zM4 13h7v7H4v-7zm9 4h7v3h-7v-3z" fill="currentColor"/></svg>
  ),
  account: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" fill="currentColor"/></svg>
  ),
  bookings: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zM5 8h14v11H5z" fill="currentColor"/></svg>
  ),
  services: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M21 10h-6.31l.95-4.57A2 2 0 0 0 13.69 3H8a2 2 0 0 0-2 2v7H3v2h3v5h2v-5h8v5h2v-5h3z" fill="currentColor"/></svg>
  ),
  events: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M19 4h-1V2h-2v2H8V2H6v2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10h16zm-3-8H7v2h10z" fill="currentColor"/></svg>
  ),
  earnings: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M11 17h2v-2h3a3 3 0 0 0 0-6h-3V7h-2v2H8a3 3 0 0 0 0 6h3zm5-5a1 1 0 0 1 0 2h-8a1 1 0 0 1 0-2z" fill="currentColor"/></svg>
  ),
  calendar: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M19 4h-1V2h-2v2H8V2H6v2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9h16z" fill="currentColor"/></svg>
  ),
  chatbot: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M12 3a9 9 0 0 0-9 9 8.86 8.86 0 0 0 2.28 6L4 21l3-1.28A9 9 0 1 0 12 3zm-4 9h5v2H8zm7 0h3v2h-3z" fill="currentColor"/></svg>
  ),
  settings: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M19.14 12.94a7.07 7.07 0 0 0 .05-1l1.72-1.34-1.6-2.77-2 .5a7 7 0 0 0-.86-.5l-.3-2.06h-3.2l-.3 2.06a7 7 0 0 0-.86.5l-2-.5-1.6 2.77 1.72 1.34a7.07 7.07 0 0 0 0 1l-1.72 1.34 1.6 2.77 2-.5c.28.2.56.37.86.5l.3 2.06h3.2l.3-2.06c.3-.13.58-.3.86-.5l2 .5 1.6-2.77zM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5z" fill="currentColor"/></svg>
  ),
};

const items = [
  { key: 'overview', label: 'Overview' },
  { key: 'my-account', label: 'My Account' },
  { key: 'my-bookings', label: 'My Bookings' },
  { key: 'my-services', label: 'My Services' },
  { key: 'my-events', label: 'My Events' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'calendar', label: 'Calender View' },
  { key: 'chatbot', label: 'Chatbot' },
  { key: 'settings', label: 'Settings' },
];

const Sidebar = ({ active = 'overview', onSelect = () => {}, collapsed = false, onToggle = () => {} }) => {
  return (
    <aside
      className={`vd-sb ${collapsed ? 'vd-sb--collapsed' : ''}`}
      onClickCapture={(e) => {
        if (collapsed) {
          onToggle();
          e.stopPropagation();
        }
      }}
      role="navigation"
      aria-label="Vendor sidebar"
    >
      <div className="vd-sb__brand">
        {collapsed ? (
          <span className="vd-logo" aria-label="Vendor" />
        ) : (
          <>
            <span className="vd-logo vd-logo--inline" aria-hidden="true" />
            <span className="vd-sb__brandtext">Vendor</span>
          </>
        )}
      </div>
      <nav className="vd-sb__nav">
        {items.map(i => (
          <button
            key={i.key}
            className={`vd-sb__item ${active === i.key ? 'is-active' : ''}`}
            onClick={(e) => {
              if (collapsed) { onToggle(); return; }
              onSelect(i.key);
            }}
            title={collapsed ? i.label : undefined}
          >
            {i.key === 'overview' && <Icon.overview className="vd-icn" />}
            {i.key === 'my-account' && <Icon.account className="vd-icn" />}
            {i.key === 'my-bookings' && <Icon.bookings className="vd-icn" />}
            {i.key === 'my-services' && <Icon.services className="vd-icn" />}
            {i.key === 'my-events' && <Icon.events className="vd-icn" />}
            {i.key === 'earnings' && <Icon.earnings className="vd-icn" />}
            {i.key === 'calendar' && <Icon.calendar className="vd-icn" />}
            {i.key === 'chatbot' && <Icon.chatbot className="vd-icn" />}
            {i.key === 'settings' && <Icon.settings className="vd-icn" />}
            {!collapsed && <span className="vd-sb__label">{i.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
