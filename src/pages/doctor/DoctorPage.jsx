import { useState } from 'react';

const TODAY_APTS = [
  { id: 1, patient: 'David Leal', time: '10:00 AM', reason: 'Check-up', status: 'pending' },
  { id: 2, patient: 'Jenny Wilson', time: '11:30 AM', reason: 'Follow-up', status: 'confirmed' },
  { id: 3, patient: 'Shope Rose', time: '01:00 PM', reason: 'Consultation', status: 'pending' },
  { id: 4, patient: 'Mark Joe', time: '03:00 PM', reason: 'Annual exam', status: 'pending' },
];

export default function DoctorPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('today');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="app-shell doctor-shell">
      <aside className="sidebar sidebar-doctor">
        <div className="sidebar-logo">➕</div>
        <nav className="sidebar-nav">
          <button className={`nav-btn ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')} title="Today">📅</button>
          <button className={`nav-btn ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')} title="My Patients">🩺</button>
          <button className={`nav-btn ${activeTab === 'records' ? 'active' : ''}`} onClick={() => setActiveTab('records')} title="Records">📋</button>
        </nav>
        <button className="sidebar-logout" onClick={onLogout}>🚪 Logout</button>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <a className="topbar-brand" href="#">
            <div className="topbar-brand-icon">➕</div>
            <span className="topbar-brand-name">ClinicOne – Doctor</span>
          </a>
          <div className="topbar-right">
            <button className="topbar-icon-btn" title="Settings">⚙️</button>
            <button className="topbar-icon-btn" title="Notifications">🔔</button>
            <div className="topbar-user">
              <div className="user-avatar">👨‍⚕️</div>
              <div className="user-meta">
                <div className="user-name">{user?.fullName || 'Dr. Smith'}</div>
                <div className="user-role">Doctor</div>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">
          <div className="dashboard-layout">
            <div className="dashboard-main">
              <div className="welcome-banner">
                <div className="welcome-text">
                  <h2>{greeting()}, <span>{user?.fullName || 'Doctor'}</span></h2>
                  <p>Manage your appointments and patient care</p>
                </div>
                <div className="welcome-illustration">👨‍⚕️</div>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-icon-wrap blue">📅</div>
                  <div>
                    <div className="stat-label">Today's Appointments</div>
                    <div className="stat-value">{TODAY_APTS.length}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrap purple">🩺</div>
                  <div>
                    <div className="stat-label">Patients This Week</div>
                    <div className="stat-value">24</div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="section-title" style={{ marginBottom: 14 }}>Today's Schedule</h2>
                <div className="apt-table-wrap">
                  <table className="apt-table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TODAY_APTS.map(apt => (
                        <tr key={apt.id}>
                          <td><span className="patient-name">{apt.patient}</span></td>
                          <td>{apt.time}</td>
                          <td>{apt.reason}</td>
                          <td><span className={`status-badge ${apt.status}`}>{apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</span></td>
                          <td><button className="btn btn-primary btn-sm">Start</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="dashboard-side">
              <div className="quick-actions">
                <button className="qa-btn primary">
                  <div className="qa-btn-ico">➕</div>
                  Add Note
                </button>
                <button className="qa-btn secondary">
                  <div className="qa-btn-ico">📋</div>
                  View Records
                </button>
              </div>
              <div className="today-apt-card">
                <div className="section-header">
                  <span className="section-title">Next Up</span>
                </div>
                <div className="today-apt-list">
                  {TODAY_APTS.slice(0, 3).map(a => (
                    <div key={a.id} className="today-apt-item">
                      <div className="today-apt-ava">👤</div>
                      <div className="today-apt-info">
                        <div className="today-apt-name">{a.patient}</div>
                        <div className="today-apt-doc">{a.time} – {a.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
