import { useEffect, useState } from 'react';
import { getStatusLabel, getStatusTone } from '../../utils/statusSystem';
import { getPatients } from '../../utils/patientStorage';

const DOCTOR_STORAGE_KEY = 'clinicone_doctors';
const DEFAULT_DOCTOR_COUNT = 6;

const APPOINTMENTS = [
  { id: 1, patient: 'Arjun Mehta', avatar: '👨', doctor: 'Dr. Ananya Rao', date: '24 Jul 2023', time: '10:00 AM', status: 'pending' },
  { id: 2, patient: 'Priya Sharma', avatar: '👩', doctor: 'Dr. Vikram Singh', date: '24 Jul 2023', time: '11:30 AM', status: 'pending' },
  { id: 3, patient: 'Neha Verma', avatar: '👩‍🦰', doctor: 'Dr. Neha Kapoor', date: '24 Jul 2023', time: '01:00 PM', status: 'confirmed' },
  { id: 4, patient: 'Rohan Singh', avatar: '👦', doctor: 'Dr. Arjun Malhotra', date: '24 Jul 2023', time: '03:00 PM', status: 'pending' },
];

const TODAY_LIST = [
  { name: 'Arjun Mehta', avatar: '👨', doctor: 'Dr. Ananya Rao', status: 'pending' },
  { name: 'Priya Sharma', avatar: '👩', doctor: 'Dr. Vikram Singh', status: 'pending' },
  { name: 'Neha Verma', avatar: '👩‍🦰', doctor: 'Dr. Neha Kapoor', status: 'confirmed' },
  { name: 'Rohan Singh', avatar: '👦', doctor: 'Dr. Arjun Malhotra', status: 'pending' },
];

function getStoredDoctorCount() {
  try {
    const raw = localStorage.getItem(DOCTOR_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.length : DEFAULT_DOCTOR_COUNT;
  } catch {
    return DEFAULT_DOCTOR_COUNT;
  }
}

export default function Dashboard({ userRole, onNavigate, user }) {
  const [activeDot, setActiveDot] = useState(1);
  const [animateAdminWelcome, setAnimateAdminWelcome] = useState(false);
  const [patientCount, setPatientCount] = useState(() => getPatients().length);
  const [doctorCount, setDoctorCount] = useState(() => getStoredDoctorCount());

  useEffect(() => {
    setAnimateAdminWelcome(true);

    const timer = setTimeout(() => setAnimateAdminWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, [userRole]);

  useEffect(() => {
    const syncCounts = () => {
      setPatientCount(getPatients().length);
      setDoctorCount(getStoredDoctorCount());
    };

    syncCounts();
    window.addEventListener('focus', syncCounts);
    window.addEventListener('storage', syncCounts);

    return () => {
      window.removeEventListener('focus', syncCounts);
      window.removeEventListener('storage', syncCounts);
    };
  }, []);

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

  const displayName = user?.fullName || user?.username || user?.email || 'User';

  if (userRole === 'admin') {
    return (
      <div className="dashboard-layout admin-dashboard-layout">
        <div className="dashboard-main">
          <div className="admin-hero-card">
            <div className="admin-hero-content">
              <p className="admin-hero-eyebrow">Clinic Operations Center</p>
              <h2 className={animateAdminWelcome ? 'admin-welcome-animate' : ''}>
                {greeting()}, <span>{displayName}</span>
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
                <div className="stat-value">{patientCount}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap purple">🩺</div>
              <div>
                <div className="stat-label">Total Doctors</div>
                <div className="stat-value">{doctorCount}</div>
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

            {APPOINTMENTS.length === 0 ? (
              <div
                className="today-apt-card"
                style={{ marginTop: 10, border: '1px dashed var(--border)' }}
              >
                <div className="section-title" style={{ marginBottom: 6 }}>
                  No appointments today
                </div>
                <p className="page-sub">No patient visits are scheduled right now.</p>
              </div>
            ) : (
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
                          <span className={`status-badge ${getStatusTone('appointment', apt.status)}`}>
                            {getStatusLabel('appointment', apt.status)}
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
            )}
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
              {TODAY_LIST.length === 0 ? (
                <div
                  style={{
                    background: 'var(--surface-soft)',
                    border: '1px dashed var(--border)',
                    borderRadius: 12,
                    padding: '12px 14px',
                  }}
                >
                  <div className="section-title" style={{ marginBottom: 6 }}>
                    Queue is empty
                  </div>
                  <p className="page-sub">No patients are waiting in today&apos;s queue.</p>
                </div>
              ) : (
                TODAY_LIST.map((a, i) => (
                  <div key={i} className="today-apt-item">
                    <div className="today-apt-ava">{a.avatar}</div>
                    <div className="today-apt-info">
                      <div className="today-apt-name">{a.name}</div>
                      <div className="today-apt-doc">{a.doctor}</div>
                    </div>
                    <span className={`status-badge ${getStatusTone('appointment', a.status)}`}>
                      {getStatusLabel('appointment', a.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const doctorName = 'Dr. Rajesh Kumar';

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>{greeting()}, <span>{doctorName}</span></h2>
            <p>Welcome back to your clinic</p>
          </div>
          <div className="welcome-illustration">👩‍⚕️</div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon-wrap blue">🩺</div>
            <div>
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">{patientCount}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap purple">🩻</div>
            <div>
              <div className="stat-label">Total Doctors</div>
              <div className="stat-value">{doctorCount}</div>
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
                      <span className={`status-badge ${getStatusTone('appointment', apt.status)}`}>
                        {getStatusLabel('appointment', apt.status)}
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
                <span className={`status-badge ${getStatusTone('appointment', a.status)}`}>
                  {getStatusLabel('appointment', a.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
