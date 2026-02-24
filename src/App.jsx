import { useState } from 'react';
import {
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import './App.css';

import Welcome from './pages/Welcome';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminPage from './pages/AdminPage';
import DoctorPage from './pages/DoctorPage';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import MedicalRecords from './pages/MedicalRecords';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { saveUser } from './utils/userStorage';

const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', path: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'patients', path: 'patients', icon: 'patients', label: 'Patients' },
  { id: 'appointments', path: 'appointments', icon: 'appointments', label: 'Appointments' },
  { id: 'doctors', path: 'doctors', icon: 'doctors', label: 'Doctors' },
  { id: 'search', path: 'search', icon: 'search', label: 'Search' },
  { id: 'records', path: 'records', icon: 'records', label: 'Records' },
  { id: 'reports', path: 'reports', icon: 'reports', label: 'Reports' },
  { id: 'settings', path: 'settings', icon: 'settings', label: 'Settings' },
];

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
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M4.5 19c1.4-3.2 4.2-5 7.5-5s6.1 1.8 7.5 5" />
        </svg>
      );
    case 'appointments':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      );
    case 'doctors':
      return (
        <svg {...common}>
          <path d="M12 4v16M4 12h16" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
    case 'records':
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );
    case 'reports':
      return (
        <svg {...common}>
          <path d="M4 20h16" />
          <rect x="6" y="10" width="3" height="6" rx="1" />
          <rect x="11" y="7" width="3" height="9" rx="1" />
          <rect x="16" y="5" width="3" height="11" rx="1" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1.4 1.4a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0l-1.4-1.4a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4l1.4-1.4a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2h0a1 1 0 0 0 .6-.9V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v.2a1 1 0 0 0 .6.9h0a1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0l1.4 1.4a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1v0a1 1 0 0 0 .9.6H20a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.2a1 1 0 0 0-.9.6z" />
        </svg>
      );
    default:
      return null;
  }
}

function getHomePathForRole(role) {
  if (role === 'admin') return '/admin';
  if (role === 'doctor') return '/doctor';
  if (role === 'receptionist') return '/receptionist';
  return '/';
}

function AdminLayout({ onLogout, basePath = 'admin' }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

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
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={`/${basePath}/${item.path}`}
              className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            >
              <span className="nav-btn-icon">
                <NavIcon name={item.icon} />
              </span>
              <span className="nav-btn-label">{item.label}</span>
            </NavLink>
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function RequireAuth({ user, children }) {
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function RequireRole({ user, role, children }) {
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
    if (user.role === 'receptionist') return <Navigate to="/receptionist" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const goToRoleHome = (role) => {
    navigate(getHomePathForRole(role));
  };

  const handleLogin = (userData) => {
    setUser(userData);
    goToRoleHome(userData?.role);
  };

  const handleSignIn = (userData) => {
    setUser(userData);
    goToRoleHome(userData?.role);
  };

  const handleSignUp = (userData) => {
    saveUser(userData);
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={getHomePathForRole(user.role)} replace />
          ) : (
            <Welcome onLogin={handleLogin} onSwitchToSignUp={() => navigate('/signup')} />
          )
        }
      />
      <Route
        path="/signin"
        element={
          user ? (
            <Navigate to={getHomePathForRole(user.role)} replace />
          ) : (
            <SignIn onSignIn={handleSignIn} onSwitchToSignUp={() => navigate('/signup')} />
          )
        }
      />
      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to={getHomePathForRole(user.role)} replace />
          ) : (
            <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => navigate('/')} />
          )
        }
      />

      <Route
        path="/admin"
        element={
          <RequireRole user={user} role="admin">
            <AdminLayout onLogout={handleLogout} basePath="admin" />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard userRole="admin" onNavigate={(page) => navigate(`/admin/${page}`)} />} />
        <Route path="patients" element={<Patients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="search" element={<Patients />} />
        <Route path="records" element={<MedicalRecords />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route
        path="/receptionist"
        element={
          <RequireRole user={user} role="receptionist">
            <AdminLayout onLogout={handleLogout} basePath="receptionist" />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard userRole="receptionist" onNavigate={(page) => navigate(`/receptionist/${page}`)} />} />
        <Route path="patients" element={<Patients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="search" element={<Patients />} />
        <Route path="records" element={<MedicalRecords />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route
        path="/admin-legacy"
        element={
          <RequireRole user={user} role="admin">
            <AdminPage user={user} onLogout={() => { handleLogout(); navigate('/'); }} />
          </RequireRole>
        }
      />

      <Route
        path="/doctor"
        element={
          <RequireRole user={user} role="doctor">
            <DoctorPage user={user} onLogout={() => { handleLogout(); navigate('/'); }} />
          </RequireRole>
        }
      />

      <Route
        path="*"
        element={
          <RequireAuth user={user}>
            <Navigate to={getHomePathForRole(user?.role)} replace />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
