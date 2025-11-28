import React from "react";
import { FiHome, FiUsers, FiBriefcase, FiCalendar, FiGrid, FiBookOpen, FiCreditCard, FiMessageSquare, FiAlertCircle } from "react-icons/fi";
import "./Sidebar.css";

const items = [
  { key: "Dashboard", label: "Dashboard", icon: FiHome },
  { key: "Users", label: "Users", icon: FiUsers },
  { key: "Vendors", label: "Vendors", icon: FiBriefcase },
  { key: "Events", label: "Events", icon: FiCalendar },
  { key: "Services", label: "Services", icon: FiGrid },
  { key: "Bookings", label: "Bookings", icon: FiBookOpen },
  { key: "Payment", label: "Payment", icon: FiCreditCard },
  { key: "Chat", label: "Chat", icon: FiMessageSquare },
  { key: "Complaints", label: "Complaints", icon: FiAlertCircle },
];

const Sidebar = ({ selected, onSelect, onToggle, open }) => {
  return (
    <div className="sidebar-wrap">
      <div className="sidebar-header">
        {/* <button className="ghost-btn" onClick={onToggle} aria-label="Toggle Sidebar">☰</button> */}
        <span className="sidebar-title" style={{opacity: open ? 1 : 0}}>{open ? 'Admin' : ''}</span>
      </div>
      <nav className="sidebar-nav">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.key}
              className={`nav-item ${selected === it.key ? "active" : ""}`}
              onClick={() => { onSelect(it.key); if (!open) onToggle && onToggle(); }}
              role="button"
            >
              {open ? (
                <>
                  <span className="nav-icon"><Icon size={18} /></span>
                  <span className="nav-label">{it.label}</span>
                </>
              ) : (
                <span className="nav-icon" title={it.label}><Icon size={18} /></span>
              )}
            </div>
          );
        })}
      </nav>
      <div className="sidebar-footer">Evenza Admin • {new Date().getFullYear()}</div>
    </div>
  );
};

export default Sidebar;
