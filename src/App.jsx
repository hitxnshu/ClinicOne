import { useState } from 'react';
import './App.css';

// Auth Pages
import Welcome from './pages/Welcome';
import SignUp from './pages/SignUp';

// Role-specific dashboards
import AdminPage from './pages/AdminPage';
import DoctorPage from './pages/DoctorPage';
import PatientPage from './pages/PatientPage';

// Page components (MAKE SURE THESE FILES EXIST)
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import { saveUser } from './utils/userStorage';

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'patients', icon: 'patients', label: 'Patients' },
  { id: 'appointments', icon: 'appointments', label: 'Appointments' },
  { id: 'search', icon: 'search', label: 'Search' },
  { id: 'records', icon: 'records', label: 'Records' },
  { id: 'reports', icon: 'reports', label: 'Reports' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
];

const PAGE_COMPONENTS = {
  dashboard: Dashboard,
  patients: Patients,
  appointments: Appointments,
  search: Patients,
  records: MedicalRecords,
  reports: Reports,
  settings: Settings,
};

function NavIcon({ name }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.9',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
    focusable: 'false',
  };

  switch (name) {
    case 'dashboard':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="4" rx="1.5" />
          <rect x="14" y="10" width="7" height="11" rx="1.5" />
          <rect x="3" y="13" width="7" height="8" rx="1.5" />
        </svg>
      );
    case 'patients':
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function App() {
  const [authMode, setAuthMode] = useState('welcome');
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard'); // ✅ FIXED

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthMode('authenticated');
  };

  const handleSignUp = (userData) => {
    saveUser(userData);
    setAuthMode('welcome');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthMode('welcome');
  };

  // Welcome page
  if (authMode === 'welcome') {
    return (
      <Welcome
        onLogin={handleLogin}
        onSwitchToSignUp={() => setAuthMode('signup')}
      />
    );
  }

  // Sign up page
  if (authMode === 'signup') {
    return (
      <SignUp
        onSignUp={handleSignUp}
        onSwitchToSignIn={() => setAuthMode('welcome')}
      />
    );
  }

  const role = user?.role || 'admin';

  // If role-specific dashboard exists, show it
  if (role === 'admin') return <AdminPage user={user} onLogout={handleLogout} />;
  if (role === 'doctor') return <DoctorPage user={user} onLogout={handleLogout} />;
  if (role === 'patient') return <PatientPage user={user} onLogout={handleLogout} />;

  // Dynamic page component
  const PageComp = PAGE_COMPONENTS[page];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo-wrap">
          <div className="sidebar-logo">+</div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-title">ClinicOne</span>
            <span className="sidebar-brand-subtitle">Care Hub</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <span className="nav-btn-icon">
                <NavIcon name={item.icon} />
              </span>
              <span className="nav-btn-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <span className="topbar-brand-name">ClinicOne</span>
        </header>

        <main className="page-content">
          {PageComp && <PageComp userRole={role} onNavigate={setPage} />}
        </main>
      </div>
    </div>
  );
}