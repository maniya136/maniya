import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export const Header = ({ onNavigate, currentPage }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setShowMenu(false);
    onNavigate('home');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo">Evenza</div>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${currentPage === 'past' ? 'active' : ''}`}
            onClick={() => onNavigate('past')}
          >
            Past Events
          </button>
          <button 
            className={`nav-link ${currentPage === 'upcoming' ? 'active' : ''}`}
            onClick={() => onNavigate('upcoming')}
          >
            Upcoming Events
          </button>
          <button 
            className={`nav-link ${currentPage === 'categories' ? 'active' : ''}`}
            onClick={() => onNavigate('categories')}
          >
            Categories
          </button>
          <button 
            className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
            onClick={() => onNavigate('contact')}
          >
            Contact
          </button>
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">Hi, {user?.name || 'User'}</span>
              <div className="dropdown">
                <button 
                  className="dropdown-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  ▼
                </button>
                {showDropdown && (
                  <div className="dropdown-content">
                    <button onClick={() => { onNavigate('dashboard'); setShowDropdown(false); }}>
                      Dashboard
                    </button>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button 
              className="login-btn"
              onClick={() => onNavigate('login')}
            >
              Login
            </button>
          )}
        </div>

        <button className="hamburger" onClick={() => setShowMenu(!showMenu)}>
          ☰
        </button>
      </div>

      {showMenu && (
        <div className="mobile-menu">
          <button onClick={() => { onNavigate('home'); setShowMenu(false); }}>Home</button>
          <button onClick={() => { onNavigate('past'); setShowMenu(false); }}>Past Events</button>
          <button onClick={() => { onNavigate('upcoming'); setShowMenu(false); }}>Upcoming Events</button>
          <button onClick={() => { onNavigate('categories'); setShowMenu(false); }}>Categories</button>
          <button onClick={() => { onNavigate('contact'); setShowMenu(false); }}>Contact</button>
          {isAuthenticated ? (
            <>
              <button onClick={() => { onNavigate('dashboard'); setShowMenu(false); }}>Dashboard</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={() => { onNavigate('login'); setShowMenu(false); }}>Login</button>
          )}
        </div>
      )}
    </header>
  );
};
