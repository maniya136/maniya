import React, { useState } from 'react';
import './UserDashboard.css';
import { UpcomingEventsSection } from '../UpcomingEvents/UpcomingEventsSection';
import { PastEvents } from '../PastEvents/PastEvents';
import { CategoriesSection } from '../Categories/CategoriesSection';
import { CreateEventSection } from '../Events/CreateEventSection';
import { YourEventsSection } from '../Events/YourEventsSection';
import { ExploreVendorsSection } from '../Vendors/ExploreVendorsSection';
import { GuestManagementSection } from '../Guests/GuestManagementSection';
import { SettingsSection } from '../Settings/SettingsSection';
import { QueriesReportsSection } from '../Reports/QueriesReportsSection';

const MENU_ITEMS = [
  'Dashboard',
  'Upcoming Events',
  'Past Events',
  'Categories',
  'Create Event',
  'Your Events',
  'Explore Vendors',
  'Guest Management',
  'Settings',
  'Queries & Reports',
];

export const UserDashboard = () => {
  const [active, setActive] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (active) {
      case 'Dashboard':
        return (
          <>
            <h2>User Dashboard</h2>
            <p className="ud-card-subtitle">
              Quick overview of your events, vendors and categories. Use the left menu to open each
              section.
            </p>
            <div className="ud-overview-grid">
              <section className="ud-overview-card">
                <div className="ud-overview-label">Upcoming events</div>
                <div className="ud-overview-main">3</div>
                <p className="ud-overview-sub">Events scheduled in the next 30 days.</p>
              </section>
              <section className="ud-overview-card">
                <div className="ud-overview-label">Your events</div>
                <div className="ud-overview-main">5</div>
                <p className="ud-overview-sub">Created or hosted by you.</p>
              </section>
              <section className="ud-overview-card">
                <div className="ud-overview-label">Saved vendors</div>
                <div className="ud-overview-main">8</div>
                <p className="ud-overview-sub">Catering, decor, photography and more.</p>
              </section>
              <section className="ud-overview-card">
                <div className="ud-overview-label">Guest updates</div>
                <div className="ud-overview-main">2</div>
                <p className="ud-overview-sub">New RSVPs and check-in changes.</p>
              </section>
            </div>
          </>
        );
      case 'Upcoming Events':
        return (
          <>
            <h2>Upcoming Events</h2>
            <p className="ud-card-subtitle">All your upcoming and live events.</p>
            <div className="ud-section-wrapper">
              <UpcomingEventsSection />
            </div>
          </>
        );
      case 'Past Events':
        return (
          <>
            <h2>Past Events</h2>
            <p className="ud-card-subtitle">Events that have already been completed.</p>
            <div className="ud-section-wrapper">
              <PastEvents />
            </div>
          </>
        );
      case 'Categories':
        return (
          <>
            <h2>Categories</h2>
            <p className="ud-card-subtitle">Event categories and experiences you can explore.</p>
            <div className="ud-section-wrapper">
              <CategoriesSection />
            </div>
          </>
        );
      case 'Create Event':
        return (
          <>
            <h2>Create Event</h2>
            <p className="ud-card-subtitle">Start creating a new event with date, venue and services.</p>
            <div className="ud-section-wrapper">
              <CreateEventSection />
            </div>
          </>
        );
      case 'Your Events':
        return (
          <>
            <h2>Your Events</h2>
            <p className="ud-card-subtitle">See and manage all events you have created.</p>
            <div className="ud-section-wrapper">
              <YourEventsSection />
            </div>
          </>
        );
      case 'Explore Vendors':
        return (
          <>
            <h2>Explore Vendors</h2>
            <p className="ud-card-subtitle">Browse catering, decor, photography and more.</p>
            <div className="ud-section-wrapper">
              <ExploreVendorsSection />
            </div>
          </>
        );
      case 'Guest Management':
        return (
          <>
            <h2>Guest Management</h2>
            <p className="ud-card-subtitle">Manage guest lists, invites, RSVPs and check-ins.</p>
            <div className="ud-section-wrapper">
              <GuestManagementSection />
            </div>
          </>
        );
      case 'Settings':
        return (
          <>
            <h2>Settings</h2>
            <p className="ud-card-subtitle">Update profile details, preferences and notifications.</p>
            <div className="ud-section-wrapper">
              <SettingsSection />
            </div>
          </>
        );
      case 'Queries & Reports':
        return (
          <>
            <h2>Queries & Reports</h2>
            <p className="ud-card-subtitle">View reports and raise queries about your events.</p>
            <div className="ud-section-wrapper">
              <QueriesReportsSection />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`ud-shell ${sidebarOpen ? '' : 'collapsed'}`}>
      <aside className="ud-sidebar">
        <div className="ud-sidebar-header">
          <button
            className="ud-hamburger"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        <nav className="ud-menu">
          {MENU_ITEMS.map((item) => (
            <button
              key={item}
              className={`ud-menu-item ${active === item ? 'active' : ''}`}
              onClick={() => setActive(item)}
            >
              <span>{item}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="ud-main">
        <div className="ud-card">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
