import { useState } from 'react';
import './App.css';

// Auth Pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// Main Pages
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import MedicalRecords from './pages/MedicalRecords';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const NAV_ITEMS = [
  { id: 'dashboard',    icon: '🏠', label: 'Dashboard' },
  { id: 'patients',     icon: '🩺', label: 'Patients' },
  { id: 'appointments', icon: '📅', label: 'Appointments' },
  { id: 'search',       icon: '🔍', label: 'Search' },
  { id: 'records',      icon: '📋', label: 'Records' },
  { id: 'reports',      icon: '📊', label: 'Reports' },
  { id: 'settings',     icon: '⚙️',  label: 'Settings' },
];

const PAGE_COMPONENTS = {
  dashboard:    Dashboard,
  patients:     Patients,
  appointments: Appointments,
  search:       Patients,
  records:      MedicalRecords,
  reports:      Reports,
  settings:     Settings,
};

export default function App() {
  const [authMode, setAuthMode] = useState('signin'); // 'signin', 'signup', or 'authenticated'
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  const handleSignIn = (userData) => {
    setUser(userData);
    setAuthMode('authenticated');
  };

  const handleSignUp = (userData) => {
    // In real app, this would create account in backend first
    setUser(userData);
    setAuthMode('authenticated');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthMode('signin');
    setPage('dashboard');
  };

  // Show authentication screens
  if (authMode === 'signin') {
    return <SignIn onSignIn={handleSignIn} onSwitchToSignUp={() => setAuthMode('signup')} />;
  }

  if (authMode === 'signup') {
    return <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => setAuthMode('signin')} />;
  }

  // Show main application
  const PageComp = PAGE_COMPONENTS[page] || Dashboard;
  const role = user?.role || 'admin';

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">➕</div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${page === item.id ? 'active' : ''}`}
              title={item.label}
              onClick={() => setPage(item.id)}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* ── Main ── */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <a className="topbar-brand" href="#">
            <div className="topbar-brand-icon">➕</div>
            <span className="topbar-brand-name">ClinicOne</span>
          </a>

          <div className="topbar-search">
            <span className="search-ico">🔍</span>
            <input type="text" placeholder="Search appointments..." />
          </div>

          <div className="topbar-right">
            <button className="topbar-icon-btn" title="Settings">⚙️</button>
            <button className="topbar-icon-btn" title="Notifications">
              🔔
              <span className="notif-dot"></span>
            </button>

            <div className="topbar-user">
              <div className="user-avatar">
                {role === 'admin' && '👩‍⚕️'}
                {role === 'doctor' && '👨‍⚕️'}
                {role === 'receptionist' && '👤'}
              </div>
              <div className="user-meta">
                <div className="user-name">
                  {user?.fullName || user?.username || 'User'}
                </div>
                <div className="user-role">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="page-content">
          <PageComp userRole={role} onNavigate={setPage} />
        </main>
      </div>
    </div>
  );
}
