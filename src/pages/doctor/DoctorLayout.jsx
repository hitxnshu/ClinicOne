import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const DOCTOR_NAV_ITEMS = [
  { id: 'dashboard', path: 'dashboard', icon: '📅', label: 'Dashboard' },
  { id: 'appointments', path: 'appointments', icon: '🗓️', label: 'Appointments' },
  { id: 'patients', path: 'patients', icon: '🩺', label: 'Patients' },
  { id: 'records', path: 'records', icon: '📋', label: 'Records' },
  { id: 'settings', path: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function DoctorLayout({ user, onLogout }) {
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
            <span className="sidebar-brand-subtitle">Doctor Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {DOCTOR_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={`/doctor/${item.path}`}
              className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            >
              <span className="nav-btn-icon">{item.icon}</span>
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
              <div className="user-avatar">👨‍⚕️</div>
              <div className="user-meta">
                <div className="user-name">{user?.fullName || user?.username || user?.email || 'Doctor'}</div>
                <div className="user-role">Doctor</div>
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
