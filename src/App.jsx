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

import Welcome from './pages/common/Welcome';
import SignIn from './pages/common/SignIn';
import SignUp from './pages/common/SignUp';
import AdminPage from './pages/admin/AdminPage';
import DoctorLayout from './pages/doctor/DoctorLayout';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatients from './pages/doctor/Patients';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorMedicalRecords from './pages/doctor/MedicalRecords';
import DoctorSettings from './pages/doctor/Settings';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPatients from './pages/admin/Patients';
import AdminAppointments from './pages/admin/Appointments';
import AdminDoctors from './pages/admin/Doctors';
import AdminReceptionists from './pages/admin/Receptionists';
import AdminMedicalRecords from './pages/admin/MedicalRecords';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import ReceptionistDashboard from './pages/receptionist/Dashboard';
import ReceptionistPatients from './pages/receptionist/Patients';
import ReceptionistAppointments from './pages/receptionist/Appointments';
import ReceptionistDoctors from './pages/receptionist/Doctors';
import ReceptionistMedicalRecords from './pages/receptionist/MedicalRecords';
import ReceptionistReports from './pages/receptionist/Reports';
import ReceptionistSettings from './pages/receptionist/Settings';
import { saveUser } from './utils/userStorage';

const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', path: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'patients', path: 'patients', icon: 'patients', label: 'Patients' },
  { id: 'appointments', path: 'appointments', icon: 'appointments', label: 'Appointments' },
  { id: 'doctors', path: 'doctors', icon: 'doctors', label: 'Doctors' },
  { id: 'receptionists', path: 'receptionists', icon: 'receptionists', label: 'Manage Receptionist' },
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
    case 'receptionists':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="2.5" />
          <circle cx="16.5" cy="9.5" r="2" />
          <path d="M4.5 18c.8-2.4 2.8-4 5.5-4s4.7 1.6 5.5 4" />
          <path d="M14 18c.5-1.4 1.7-2.4 3.2-2.4 1.3 0 2.4.7 3 1.8" />
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

function getRoleLabel(role) {
  if (role === 'admin') return 'Admin';
  if (role === 'doctor') return 'Doctor';
  if (role === 'receptionist') return 'Receptionist';
  return 'User';
}

function getRoleAvatar(role) {
  if (role === 'admin') return '👩‍💼';
  if (role === 'doctor') return '👨‍⚕️';
  if (role === 'receptionist') return '🧾';
  return '👤';
}

function AdminLayout({ onLogout, basePath = 'admin', user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const navItems =
    basePath === 'admin'
      ? ADMIN_NAV_ITEMS
      : ADMIN_NAV_ITEMS.filter((item) => item.id !== 'receptionists');

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
          {navItems.map((item) => (
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
          <div className="topbar-right">
            <div className="topbar-user">
              <div className="user-avatar">{getRoleAvatar(user?.role)}</div>
              <div className="user-meta">
                <div className="user-name">{user?.fullName || user?.username || user?.email || 'User'}</div>
                <div className="user-role">{getRoleLabel(user?.role)}</div>
              </div>
            </div>
          </div>
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
    if (userData?.role) {
      sessionStorage.setItem('justLoggedInRole', userData.role);
    }
    setUser(userData);
    goToRoleHome(userData?.role);
  };

  const handleSignIn = (userData) => {
    if (userData?.role) {
      sessionStorage.setItem('justLoggedInRole', userData.role);
    }
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
            <AdminLayout onLogout={handleLogout} basePath="admin" user={user} />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard userRole="admin" onNavigate={(page) => navigate(`/admin/${page}`)} />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="doctors" element={<AdminDoctors userRole="admin" />} />
        <Route path="receptionists" element={<AdminReceptionists />} />
        <Route path="search" element={<AdminPatients />} />
        <Route path="records" element={<AdminMedicalRecords />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route
        path="/receptionist"
        element={
          <RequireRole user={user} role="receptionist">
            <AdminLayout onLogout={handleLogout} basePath="receptionist" user={user} />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ReceptionistDashboard userRole="receptionist" onNavigate={(page) => navigate(`/receptionist/${page}`)} />} />
        <Route path="patients" element={<ReceptionistPatients />} />
        <Route path="appointments" element={<ReceptionistAppointments />} />
        <Route path="doctors" element={<ReceptionistDoctors userRole="receptionist" />} />
        <Route path="search" element={<ReceptionistPatients />} />
        <Route path="records" element={<ReceptionistMedicalRecords />} />
        <Route path="reports" element={<ReceptionistReports />} />
        <Route
          path="settings"
          element={
            <ReceptionistSettings
              user={user}
              onPasswordChanged={() => {
                handleLogout();
                navigate('/');
              }}
            />
          }
        />
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
            <DoctorLayout user={user} onLogout={handleLogout} />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard user={user} onNavigate={(page) => navigate(`/doctor/${page}`)} />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="records" element={<DoctorMedicalRecords />} />
        <Route path="settings" element={<DoctorSettings />} />
      </Route>

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
