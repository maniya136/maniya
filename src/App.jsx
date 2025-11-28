import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/User/components/Header/Header';
import { Login } from './components/User/components/Auth/Login';
import { Register } from './components/User/components/Auth/Register';
import { Footer } from './components/User/components/Layout/Footer';
import { DashboardDrawer } from './components/User/components/Dashboard/DashboardDrawer';
import { HomeSection } from './components/User/components/Home/HomeSection';
import { UserDashboard } from './components/User/components/Dashboard/UserDashboard';
import { UpcomingEventsSection } from './components/User/components/UpcomingEvents/UpcomingEventsSection';
import { PastEventsSection } from './components/User/components/PastEvents/PastEventsSection';
import { CategoriesSection } from './components/User/components/Categories/CategoriesSection';
import { ContactSection } from './components/User/components/Contact/ContactSection';
import { useAuth } from './components/User/components/context/AuthContext';
import AdminDashboard from './components/Admin/components/Dashboard/AdminDashboard/AdminDashboard';
import AdminLogin from './components/Admin/components/Login/AdminLogin';
import VendorDashboard from './components/Vendor/components/Dashboard/VendorDashboard';
import ServicesPage from './components/User/components/Events/ServicesPage';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const handleNavigate = (next) => {
    // When navigating from login to user dashboard, mark that the user has logged in
    if (next === 'user' && page === 'login') {
      setHasLoggedIn(true);
    }
    setPage(next);
  };

  const handleBookNow = (event) => {
    if (!isAuthenticated) {
      setPendingBooking(event || null);
      setPage('login');
      return;
    }
    setPendingBooking(event || null);
    setDrawerOpen(true);
  };

  // When on dedicated user dashboard page, render only the dashboard component
  if (page === 'user' && hasLoggedIn) {
    return <UserDashboard />;
  }

  // Check for admin or vendor routes
  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  if (isAdmin) {
    const authed = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true';
    return authed ? <AdminDashboard /> : <AdminLogin />;
  }

  const isVendor = typeof window !== 'undefined' && window.location.pathname.startsWith('/vendor');
  if (isVendor) {
    return <VendorDashboard />;
  }

  // Main app routing
  let content;
  if (page === 'login') content = <Login onNavigate={handleNavigate} />;
  else if (page === 'register') content = <Register onNavigate={handleNavigate} />;
  else if (page === 'upcoming') content = <UpcomingEventsSection onBookNow={handleBookNow} />;
  else if (page === 'past') content = <PastEventsSection />;
  else if (page === 'categories') content = <CategoriesSection />;
  else if (page === 'contact') content = <ContactSection />;
  else content = (
    <HomeSection
      onBookNow={() => handleNavigate('upcoming')}
      onExplorePast={() => handleNavigate('past')}
    />
  );

  return (
    <div className="app-shell">
      <Header onNavigate={handleNavigate} currentPage={page} />
      <Routes>
        <Route path="/" element={content} />
        {/* <Route path="/services" element={<ServicesPage />} /> */}
        <Route path="/user/*" element={<UserDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
      <Footer />
      <DashboardDrawer
        isOpen={drawerOpen && page === 'user'}
        onClose={() => {
          setDrawerOpen(false);
          setPendingBooking(null);
        }}
      />
    </div>
  );
}

export default App;

