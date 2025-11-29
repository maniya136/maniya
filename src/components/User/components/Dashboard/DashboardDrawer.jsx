import React from 'react';
import './DashboardDrawer.css';

export const DashboardDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const items = [
    'Create Event',
    'Your Events',
    'Explore Vendors',
    'Guest Management',
    'Chatbot',
    'Settings',
    'Queries & Reports',
  ];

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Event Workspace</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <p className="drawer-subtitle">Manage everything for your event in one place.</p>

        <nav className="drawer-nav">
          {items.map((item) => (
            <button key={item} className="drawer-item">
              <span>{item}</span>
              <span className="pill">Soon</span>
            </button>
          ))}
        </nav>

        <div className="drawer-footer">
          <p>Need help? Our smart assistant and support team are here for you.</p>
        </div>
      </aside>
    </div>
  );
};
