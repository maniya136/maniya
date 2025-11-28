import React, { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";
import Sidebar from "../Sidebar/Sidebar/Sidebar";
import StatCards from "../StatCards/StatCards";
import BookingChart from "../Charts/BookingChart";
import UpcomingEvents from "../Sections/UpcomingEvents";
import OngoingEvents from "../Sections/OngoingEvents";
import TotalBookings from "../Sections/TotalBookings";
import Activity from "../ActivityFeed/ActivityFeed";
import { FiLogOut } from "react-icons/fi";
import Users from "../Sidebar/Users/Users";
import Vendors from "../Sidebar/Vendors/Vendors";
import Events from "../Sidebar/Events/Events";
import Services from "../Sidebar/Services/Services";
import Bookings from "../Sidebar/Bookings/Bookings";
import Complaints from "../Sidebar/Complaints/Complaints";

const AdminDashboard = () => {
  // Demo data (replace with real API later)
  const [selected, setSelected] = useState("Dashboard");

  // Auth guard: if not logged in, redirect to /admin (login)
  useEffect(() => {
    const authed = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true';
    if (!authed) {
      if (typeof window !== 'undefined') {
        window.location.assign('/admin');
      }
    }
  }, []);

  const stats = useMemo(
    () => ({
      users: 1287,
      vendors: 142,
      upcomingEvents: 9,
      totalBookings: 4312,
      bookingsPerMonth: [320, 280, 450, 390, 520, 610, 580, 640, 700, 760, 810, 880],
      ongoingEvents: [
        { id: 1, name: "Tech Summit 2025", date: "Oct 20, 2025" },
        { id: 2, name: "Music Fiesta", date: "Nov 02, 2025" },
      ],
      upcomingList: [
        { id: 11, name: "Design Conf", date: "Nov 15, 2025" },
        { id: 12, name: "Startup Expo", date: "Dec 01, 2025" },
        { id: 13, name: "Food Carnival", date: "Dec 12, 2025" },
      ],
      recentActivity: [
        { id: 21, type: "vendor", text: "Vendor 'Eventify Co.' approved", time: "2m ago" },
        { id: 22, type: "event", text: "Event 'Tech Summit 2025' approved", time: "10m ago" },
        { id: 23, type: "vendor", text: "Vendor 'Star Caterers' approved", time: "1h ago" },
        { id: 24, type: "event", text: "Event 'Music Fiesta' approved", time: "3h ago" },
      ],
    }),
    []
  );

  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div className="admin-root">
      {/* Header first, full width */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <button className="ghost-btn" onClick={() => setDrawerOpen((v) => !v)} aria-label="Toggle Sidebar">☰</button>
          <h1>Admin Dashboard</h1>
          <div style={{marginLeft:'auto'}}>
            <button className="ghost-btn" onClick={() => { localStorage.removeItem('adminAuth'); window.location.assign('/admin'); }}>
              <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
                <FiLogOut size={16} color="#e5e7eb" />    
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Body with sidebar + content */}
      <div className="admin-body">
        <aside className={`admin-sidebar ${drawerOpen ? "open" : "collapsed"}`}>
          <Sidebar selected={selected} onSelect={setSelected} onToggle={() => setDrawerOpen((v) => !v)} open={drawerOpen} />
        </aside>

        <div className="admin-content" onClick={() => { if (drawerOpen) setDrawerOpen(false); }}>
          <main className="admin-main">
            {selected === 'Users' ? (
              <Users />
            ) : selected === 'Vendors' ? (
              <Vendors />
            ) : selected === 'Events' ? (
              <Events />
            ) : selected === 'Services' ? (
              <Services />
            ) : selected === 'Bookings' ? (
              <Bookings />
            ) : selected === 'Complaints' ? (
              <Complaints />
            ) : (
              <>
                <StatCards users={stats.users} vendors={stats.vendors} upcoming={stats.upcomingEvents} />

                <section className="grid-two">
                  <TotalBookings total={stats.totalBookings} />
                  <BookingChart data={stats.bookingsPerMonth} />
                </section>

                <section className="grid-two">
                  <OngoingEvents items={stats.ongoingEvents} />
                  <UpcomingEvents items={stats.upcomingList} />
                </section>

                <section>
                  <Activity items={stats.recentActivity} />
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
