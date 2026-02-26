import { useState } from 'react';

const APPOINTMENTS = [
  { id: 1, patient: 'David Leal',    avatar: '👨',  doctor: 'Dr. John Carter',   date: '24 Jul 2023', time: '10:00 AM', status: 'pending' },
  { id: 2, patient: 'Jenny Wilson',  avatar: '👩',  doctor: 'Dr. Emma Green',    date: '24 Jul 2023', time: '11:30 AM', status: 'pending' },
  { id: 3, patient: 'Shope Rose',    avatar: '👩‍🦰', doctor: 'Dr. Sophia Miller', date: '24 Jul 2023', time: '01:00 PM', status: 'confirmed' },
  { id: 4, patient: 'Mark Joe',      avatar: '👦',  doctor: 'Dr. Alex Brown',    date: '24 Jul 2023', time: '03:00 PM', status: 'pending' },
];

const TODAY_LIST = [
  { name: 'David Leal',   avatar: '👨',  doctor: 'Dr. John Carter',   status: 'pending' },
  { name: 'Jenny Wilson', avatar: '👩',  doctor: 'Dr. Emma Green',    status: 'pending' },
  { name: 'Shope Rose',   avatar: '👩‍🦰', doctor: 'Dr. Sophia Miller', status: 'confirmed' },
  { name: 'Mark Joe',     avatar: '👦',  doctor: 'Dr. Alex Brown',    status: 'pending' },
];

export default function Dashboard({ userRole, onNavigate }) {
  const [activeDot, setActiveDot] = useState(1);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const totalAppointments = APPOINTMENTS.length;
  const confirmedAppointments = APPOINTMENTS.filter((a) => a.status === 'confirmed').length;
  const pendingAppointments = APPOINTMENTS.filter((a) => a.status === 'pending').length;
  const completionRate = Math.round((confirmedAppointments / totalAppointments) * 100);

  if (userRole === 'admin') {
    return (
      <div className="dashboard-layout admin-dashboard-layout">
        <div className="dashboard-main">
          <div className="admin-hero-card">
            <div className="admin-hero-content">
              <p className="admin-hero-eyebrow">Clinic Operations Center</p>
              <h2>
                {greeting()}, <span>Admin</span>
              </h2>
              <p>Monitor patients, doctors, and appointments in one command view.</p>
              <div className="admin-hero-actions">
                <button className="btn btn-primary" onClick={() => onNavigate('patients')}>
                  Add Patient
                </button>
                <button className="btn btn-ghost" onClick={() => onNavigate('appointments')}>
                  Book Appointment
                </button>
              </div>
            </div>
            <div className="admin-hero-badge-wrap">
              <div className="admin-hero-badge">
                <div className="admin-hero-badge-label">Today</div>
                <div className="admin-hero-badge-value">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon-wrap blue">👥</div>
              <div>
                <div className="stat-label">Total Patients</div>
                <div className="stat-value">580</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap purple">🩺</div>
              <div>
                <div className="stat-label">Total Doctors</div>
                <div className="stat-value">42</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap orange">📅</div>
              <div>
                <div className="stat-label">Today's Appointments</div>
                <div className="stat-value">{totalAppointments}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="section-header">
              <span className="section-title">Today's Appointments</span>
              <button className="view-all-btn" onClick={() => onNavigate('appointments')}>
                View All ›
              </button>
            </div>

            <div className="apt-table-wrap">
              <table className="apt-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Date <span className="sort-ico">⇄</span></th>
                    <th>Time <span className="sort-ico">⇄</span></th>
                    <th>Status <span className="sort-ico">⇄</span></th>
                    <th>···</th>
                  </tr>
                </thead>
                <tbody>
                  {APPOINTMENTS.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div className="patient-cell">
                          <div className="patient-ava">{apt.avatar}</div>
                          <span className="patient-name">{apt.patient}</span>
                        </div>
                      </td>
                      <td>{apt.doctor}</td>
                      <td>{apt.date}</td>
                      <td>{apt.time}</td>
                      <td>
                        <span className={`status-badge ${apt.status}`}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <button className="more-btn">···</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-pagination">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    className={`dot-page ${activeDot === i ? 'active' : ''}`}
                    onClick={() => setActiveDot(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-side">
          <div className="admin-kpi-card">
            <div className="section-title">Performance</div>
            <div className="admin-kpi-list">
              <div className="admin-kpi-item">
                <span>Confirmed</span>
                <strong>{confirmedAppointments}</strong>
              </div>
              <div className="admin-kpi-item">
                <span>Pending</span>
                <strong>{pendingAppointments}</strong>
              </div>
              <div className="admin-kpi-item">
                <span>Completion Rate</span>
                <strong>{completionRate}%</strong>
              </div>
            </div>
          </div>

          <div className="today-apt-card">
            <div className="section-header">
              <span className="section-title">Admin Actions</span>
            </div>
            <div className="quick-actions">
              <button className="qa-btn primary" onClick={() => onNavigate('doctors')}>
                <div className="qa-btn-ico">🩺</div>
                Manage Doctors
              </button>
              <button className="qa-btn secondary" onClick={() => onNavigate('reports')}>
                <div className="qa-btn-ico">📊</div>
                View Reports
              </button>
            </div>
          </div>

          <div className="today-apt-card">
            <div className="section-header">
              <span className="section-title">Today's Queue</span>
            </div>
            <div className="today-apt-list">
              {TODAY_LIST.map((a, i) => (
                <div key={i} className="today-apt-item">
                  <div className="today-apt-ava">{a.avatar}</div>
                  <div className="today-apt-info">
                    <div className="today-apt-name">{a.name}</div>
                    <div className="today-apt-doc">{a.doctor}</div>
                  </div>
                  <span className={`status-badge ${a.status}`}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const doctorName = 'Dr. Smith';

  return (
    <div className="dashboard-layout">
      {/* ── Main Column ── */}
      <div className="dashboard-main">

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>{greeting()}, <span>{doctorName}</span></h2>
            <p>Welcome back to your clinic</p>
          </div>
          <div className="welcome-illustration">👩‍⚕️</div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon-wrap blue">🩺</div>
            <div>
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">580</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap purple">🩻</div>
            <div>
              <div className="stat-label">Total Doctors</div>
              <div className="stat-value">42</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap orange">📅</div>
            <div>
              <div className="stat-label">Today's Appointments</div>
              <div className="stat-value">22</div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div>
          <div className="section-header">
            <span className="section-title">Today's Appointments</span>
            <button className="view-all-btn">View All ›</button>
          </div>

          <div className="apt-table-wrap">
            <table className="apt-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Date <span className="sort-ico">⇅</span></th>
                  <th>Time <span className="sort-ico">⇅</span></th>
                  <th>Status <span className="sort-ico">⇅</span></th>
                  <th>···</th>
                </tr>
              </thead>
              <tbody>
                {APPOINTMENTS.map(apt => (
                  <tr key={apt.id}>
                    <td>
                      <div className="patient-cell">
                        <div className="patient-ava">{apt.avatar}</div>
                        <span className="patient-name">{apt.patient}</span>
                      </div>
                    </td>
                    <td>{apt.doctor}</td>
                    <td>{apt.date}</td>
                    <td>{apt.time}</td>
                    <td>
                      <span className={`status-badge ${apt.status}`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="more-btn">···</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-pagination">
              {[0, 1, 2].map(i => (
                <button
                  key={i}
                  className={`dot-page ${activeDot === i ? 'active' : ''}`}
                  onClick={() => setActiveDot(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Side Column ── */}
      <div className="dashboard-side">
        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="qa-btn primary" onClick={() => onNavigate('patients')}>
            <div className="qa-btn-ico">➕</div>
            Add Patient
          </button>
          <button className="qa-btn secondary" onClick={() => onNavigate('appointments')}>
            <div className="qa-btn-ico">📅</div>
            Book Appointment
          </button>
        </div>

        {/* Today's Appointments Mini */}
        <div className="today-apt-card">
          <div className="section-header">
            <span className="section-title">Today's Appointments</span>
            <button className="view-all-btn">View All ›</button>
          </div>
          <div className="today-apt-list">
            {TODAY_LIST.map((a, i) => (
              <div key={i} className="today-apt-item">
                <div className="today-apt-ava">{a.avatar}</div>
                <div className="today-apt-info">
                  <div className="today-apt-name">{a.name}</div>
                  <div className="today-apt-doc">{a.doctor}</div>
                </div>
                <span className={`status-badge ${a.status}`}>
                  {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

