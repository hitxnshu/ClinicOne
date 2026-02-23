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
          <path d="M16 21v-1.5a3.5 3.5 0 0 0-3.5-3.5h-1A3.5 3.5 0 0 0 8 19.5V21" />
          <circle cx="12" cy="9" r="3" />
          <path d="M20 21v-1a2.5 2.5 0 0 0-2-2.45" />
          <path d="M6 17.55A2.5 2.5 0 0 0 4 20v1" />
        </svg>
      );
    case 'appointments':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
          <path d="M8.5 14h3M8.5 17h6" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.3-4.3" />
        </svg>
      );
    case 'records':
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      );
    case 'reports':
      return (
        <svg {...common}>
          <path d="M4 20V10" />
          <path d="M10 20V4" />
          <path d="M16 20v-7" />
          <path d="M22 20v-4" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.6 1.6 0 0 1-2.3 2.3l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1.6 1.6 0 0 1-3.2 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.6 1.6 0 0 1-2.3-2.3l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1.6 1.6 0 0 1 0-3.2h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.6 1.6 0 0 1 2.3-2.3l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1.6 1.6 0 0 1 3.2 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.6 1.6 0 0 1 2.3 2.3l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a1.6 1.6 0 0 1 0 3.2h-.2a1 1 0 0 0-.9.6z" />
        </svg>
      );
    default:
      return null;
  }
}

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
      {/* Sidebar */}
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
              title={item.label}
              onClick={() => setPage(item.id)}
            >
              <span className="nav-btn-icon" aria-hidden="true"><NavIcon name={item.icon} /></span>
              <span className="nav-btn-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <a className="topbar-brand" href="#">
            <div className="topbar-brand-icon">+</div>
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
