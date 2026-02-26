import { useState } from 'react';

import Dashboard from '../shared/Dashboard';
import Patients from '../shared/Patients';
import Appointments from '../shared/Appointments';
import Doctors from '../shared/Doctors';
import MedicalRecords from '../shared/MedicalRecords';
import Reports from '../shared/Reports';
import Settings from '../shared/Settings';

const NAV_ITEMS = [
  { id: 'dashboard',    icon: '🏠', label: 'Dashboard' },
  { id: 'patients',     icon: '🩺', label: 'Patients' },
  { id: 'appointments', icon: '📅', label: 'Appointments' },
  { id: 'records',      icon: '📋', label: 'Records' },
  { id: 'reports',      icon: '📊', label: 'Reports' },
  { id: 'settings',     icon: '⚙️', label: 'Settings' },
];

const PAGE_COMPONENTS = {
  dashboard:    Dashboard,
  patients:     Patients,
  appointments: Appointments,
  records:      MedicalRecords,
  reports:      Reports,
  settings:     Settings,
};

export default function AdminPage({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');

  const PageComp = PAGE_COMPONENTS[page] || Dashboard;

  return (
    <div className="app-shell">
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
        <button className="sidebar-logout" onClick={onLogout}>
          🚪 Logout
        </button>
      </aside>

      <div className="main-area">
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
              <div className="user-avatar">👩‍⚕️</div>
              <div className="user-meta">
                <div className="user-name">{user?.fullName || user?.username || 'Admin'}</div>
                <div className="user-role">Admin</div>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">
          <PageComp userRole="admin" onNavigate={setPage} />
        </main>
      </div>
    </div>
  );
}

