import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const DOCTOR_NAV_ITEMS = [
  { id: 'dashboard', path: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'patients', path: 'patients', icon: '🩺', label: 'Patients' },
  { id: 'appointments', path: 'appointments', icon: '🗓️', label: 'Appointments' },
  { id: 'schedule', path: 'schedule', icon: '📅', label: 'Schedule' },
  { id: 'profile', path: 'profile', icon: '👤', label: 'Profile' },
];

const INITIAL_DOCTOR_APPOINTMENTS = [
  {
    id: 1,
    patient: 'David Leal',
    avatar: '👨',
    age: 34,
    date: '24 Jul 2023',
    time: '10:00 AM',
    paymentMode: 'Cash',
    fee: 750,
    reason: 'Check-up',
    status: 'pending',
  },
  {
    id: 2,
    patient: 'Jenny Wilson',
    avatar: '👩',
    age: 28,
    date: '24 Jul 2023',
    time: '11:30 AM',
    paymentMode: 'UPI',
    fee: 600,
    reason: 'Follow-up',
    status: 'pending',
  },
  {
    id: 3,
    patient: 'Shope Rose',
    avatar: '👩‍🦰',
    age: 42,
    date: '24 Jul 2023',
    time: '01:00 PM',
    paymentMode: 'Card',
    fee: 900,
    reason: 'Consultation',
    status: 'confirmed',
  },
  {
    id: 4,
    patient: 'Mark Joe',
    avatar: '👦',
    age: 19,
    date: '24 Jul 2023',
    time: '03:00 PM',
    paymentMode: 'UPI',
    fee: 500,
    reason: 'Annual exam',
    status: 'pending',
  },
  {
    id: 5,
    patient: 'Emily Davis',
    avatar: '👩‍🦱',
    age: 31,
    date: '25 Jul 2023',
    time: '09:30 AM',
    paymentMode: 'Cash',
    fee: 650,
    reason: 'Lab Test',
    status: 'confirmed',
  },
];

const INITIAL_DOCTOR_PROFILE = {
  field: 'General Physician',
  experienceYears: 5,
  about:
    'Experienced general physician providing comprehensive primary care, focused on preventive medicine and patient education.',
  fee: 750,
  availableToday: true,
};

export default function DoctorLayout({ user, onLogout }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(INITIAL_DOCTOR_APPOINTMENTS);
  const [profile, setProfile] = useState(INITIAL_DOCTOR_PROFILE);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt)),
    );
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
          <Outlet
            context={{
              appointments,
              updateAppointmentStatus,
              profile,
              setProfile,
              user,
            }}
          />
        </main>
      </div>
    </div>
  );
}
