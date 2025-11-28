import React, { useMemo, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import OverviewCards from './cards/OverviewCards';
import OngoingEvents from './events/OngoingEvents';
import UpcomingEvents from './events/UpcomingEvents';
import EventDetails from './events/EventDetails';
import EventProgress from './progress/EventProgress';
import './VendorDashboard.css';

const VendorDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('overview');
  const [selectedEventId, setSelectedEventId] = useState(null);

  const data = useMemo(() => ({
    counts: { bookings: 12, approvedServices: 8 },
    ongoingEvents: [
      { id: 'ev-101', name: 'Wedding Gala', date: '2025-11-10', venue: 'Blue Orchid', progress: 65 },
      { id: 'ev-102', name: 'Corporate Summit', date: '2025-11-18', venue: 'Grand Hall', progress: 40 },
    ],
    upcomingEvents: [
      { id: 'ev-201', name: 'Music Festival', date: '2025-12-05', venue: 'City Park', progress: 10 },
      { id: 'ev-202', name: 'Charity Ball', date: '2025-12-12', venue: 'Regency', progress: 0 },
    ],
    detailsById: {
      'ev-101': { description: 'Full service wedding planning.', reviews: [{ user: 'Anita', rating: 5, comment: 'Amazing coordination!' }] },
      'ev-102': { description: 'Executive summit logistics.', reviews: [{ user: 'Rahul', rating: 4, comment: 'Smooth sessions, good AV.' }] },
      'ev-201': { description: 'Multi-stage outdoor music festival.', reviews: [] },
      'ev-202': { description: 'Fundraiser with dining and dance.', reviews: [] },
    },
  }), []);

  const openEvent = (id) => {
    setSelectedEventId(id);
  };

  return (
    <div className="vd-layout">
      <div className="vd-topbar">
        <button className="vd-topbar__toggle" onClick={() => setCollapsed(s => !s)} aria-label={collapsed ? 'Open sidebar' : 'Collapse sidebar'}>
          <span className="vd-topbar__hamburger" />
        </button>
        <div className="vd-topbar__title">Vendor Dashboard</div>
      </div>
      <div className="vd-content">
        <Sidebar
          collapsed={collapsed}
          active={active}
          onSelect={(k) => { setActive(k); if (k !== 'my-events') setSelectedEventId(null); }}
          onToggle={() => setCollapsed(s => !s)}
        />
        <main className="vd-main" onClick={() => { if (!collapsed) setCollapsed(true); }}>
          {active === 'overview' && (
            <>
              <OverviewCards bookings={data.counts.bookings} approvedServices={data.counts.approvedServices} />
              <div className="vd-grid">
                <section className="vd-panel">
                  <div className="vd-panel__title">Ongoing Events</div>
                  <OngoingEvents events={data.ongoingEvents} onOpen={openEvent} />
                </section>
                <section className="vd-panel">
                  <div className="vd-panel__title">Upcoming Events</div>
                  <UpcomingEvents events={data.upcomingEvents} onOpen={openEvent} />
                </section>
              </div>
              {selectedEventId && (() => {
                const all = data.ongoingEvents.concat(data.upcomingEvents);
                const selected = data.detailsById[selectedEventId] || null;
                const selectedMeta = all.find(e => e.id === selectedEventId) || {};
                const prog = selectedMeta.progress || 0;
                return (
                  <section className="vd-panel" style={{ marginTop: 20 }}>
                    <div className="vd-panel__title">Event Details</div>
                    {selected ? (
                      <>
                        <EventDetails eventId={selectedEventId} name={selectedMeta.name} details={selected} />
                        <EventProgress value={prog} />
                      </>
                    ) : <div className="vd-empty">Select an event to view details</div>}
                  </section>
                );
              })()}
            </>
          )}

          {active === 'my-events' && (
            <div className="vd-grid">
              <section className="vd-panel">
                <div className="vd-panel__title">All Events</div>
                <OngoingEvents events={[...data.ongoingEvents, ...data.upcomingEvents]} onOpen={openEvent} />
              </section>
              <section className="vd-panel">
                <div className="vd-panel__title">Event Details</div>
                {(() => {
                  const all = data.ongoingEvents.concat(data.upcomingEvents);
                  const selected = data.detailsById[selectedEventId] || null;
                  const selectedMeta = all.find(e => e.id === selectedEventId) || {};
                  const prog = selectedMeta.progress || 0;
                  return selected ? (
                    <>
                      <EventDetails eventId={selectedEventId} name={selectedMeta.name} details={selected} />
                      <EventProgress value={prog} />
                    </>
                  ) : <div className="vd-empty">Select an event to view details</div>;
                })()}
              </section>
            </div>
          )}

          {active === 'my-account' && (
            <section className="vd-panel"><div className="vd-panel__title">My Account</div><div className="vd-empty">Profile settings go here.</div></section>
          )}
          {active === 'my-bookings' && (
            <section className="vd-panel"><div className="vd-panel__title">My Bookings</div><div className="vd-empty">Bookings list goes here.</div></section>
          )}
          {active === 'my-services' && (
            <section className="vd-panel"><div className="vd-panel__title">My Services</div><div className="vd-empty">Services management goes here.</div></section>
          )}
          {active === 'earnings' && (
            <section className="vd-panel"><div className="vd-panel__title">Earnings</div><div className="vd-empty">Earnings summary goes here.</div></section>
          )}
          {active === 'calendar' && (
            <section className="vd-panel"><div className="vd-panel__title">Calender View</div><div className="vd-empty">Calendar view goes here.</div></section>
          )}
          {active === 'chatbot' && (
            <section className="vd-panel"><div className="vd-panel__title">Chatbot</div><div className="vd-empty">Chat assistant goes here.</div></section>
          )}
          {active === 'settings' && (
            <section className="vd-panel"><div className="vd-panel__title">Settings</div><div className="vd-empty">Preferences go here.</div></section>
          )}
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
