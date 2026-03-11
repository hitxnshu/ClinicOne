import { useEffect, useState } from 'react';
import { getPatients } from '../../utils/patientStorage';

const DOCTORS_KEY = 'clinicone_doctors';
const APPOINTMENTS_KEY = 'clinicone_appointments';

function loadDoctors() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DOCTORS_KEY) || 'null');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadAppointments() {
  try {
    const parsed = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || 'null');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateDisplay(dateValue) {
  if (!dateValue) return '-';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateValue));
  }
  return dateValue;
}

function formatTimeDisplay(timeValue) {
  if (!timeValue) return '-';
  if (/^\d{2}:\d{2}$/.test(timeValue)) {
    const [hRaw, mRaw] = timeValue.split(':');
    const h = Number.parseInt(hRaw, 10);
    const m = Number.parseInt(mRaw, 10);
    const period = h >= 12 ? 'PM' : 'AM';
    return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  }
  return timeValue;
}

function mapAppointmentStatus(status) {
  if (!status) return 'pending';
  const normalized = status.toLowerCase();
  if (normalized === 'completed' || normalized === 'confirmed') return 'confirmed';
  if (normalized === 'cancelled' || normalized === 'archived') return 'cancelled';
  return 'pending';
}

export default function Dashboard({ userRole, onNavigate }) {
  const [activeDot, setActiveDot] = useState(1);
  const [animateWelcome, setAnimateWelcome] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    patients: [],
    doctors: [],
    appointments: [],
  });

  useEffect(() => {
    setAnimateWelcome(true);

    const timer = setTimeout(() => setAnimateWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, [userRole]);

  useEffect(() => {
    const syncDashboardData = () => {
      setDashboardData({
        patients: getPatients(),
        doctors: loadDoctors(),
        appointments: loadAppointments(),
      });
    };

    syncDashboardData();
    window.addEventListener('storage', syncDashboardData);
    window.addEventListener('focus', syncDashboardData);

    return () => {
      window.removeEventListener('storage', syncDashboardData);
      window.removeEventListener('focus', syncDashboardData);
    };
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const patientById = Object.fromEntries(
    dashboardData.patients.map((patient) => [patient.id, patient])
  );
  const doctorById = Object.fromEntries(
    dashboardData.doctors.map((doctor) => [doctor.id, doctor])
  );
  const allAppointments = dashboardData.appointments.map((appointment) => {
    const patient = patientById[appointment.patientId];
    const doctor = doctorById[appointment.doctorId];

    return {
      ...appointment,
      patient: patient?.name || appointment.patient || 'Unknown Patient',
      avatar: patient?.avatar || appointment.avatar || '🧑',
      doctor: doctor?.name || appointment.doctor || 'Unknown Doctor',
      dateLabel: formatDateDisplay(appointment.date),
      timeLabel: formatTimeDisplay(appointment.time),
      uiStatus: mapAppointmentStatus(appointment.status),
      rawStatus: appointment.status || 'Scheduled',
    };
  });

  const todayAppointments = allAppointments.filter((appointment) => appointment.date === todayIso());
  const totalAppointments = todayAppointments.length;
  const confirmedAppointments = allAppointments.filter(
    (appointment) => mapAppointmentStatus(appointment.status) === 'confirmed'
  ).length;
  const pendingAppointments = allAppointments.filter(
    (appointment) => mapAppointmentStatus(appointment.status) === 'pending'
  ).length;
  const completionRate = allAppointments.length
    ? Math.round((confirmedAppointments / allAppointments.length) * 100)
    : 0;
  const totalPatients = dashboardData.patients.length;
  const totalDoctors = dashboardData.doctors.length;
  const availableDoctors = dashboardData.doctors.filter(
    (doctor) => doctor.status === 'Available'
  ).length;
  const todaysQueue = todayAppointments.slice(0, 4);

  if (userRole === 'admin') {
    return (
      <div className="dashboard-layout admin-dashboard-layout">
        <div className="dashboard-main">
          <div className="admin-hero-card">
            <div className="admin-hero-content">
              <p className="admin-hero-eyebrow">Clinic Operations Center</p>
              <h2 className={animateWelcome ? 'admin-welcome-animate' : ''}>
                {greeting()}, <span>Admin</span>
              </h2>
              <p>Monitor patients, doctors, and appointments in one command view.</p>
              <div className="admin-hero-actions">
                <button className="btn btn-primary" onClick={() => onNavigate('patients')}>
                  Register Patient
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
                <div className="stat-value">{totalPatients}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap purple">🩺</div>
              <div>
                <div className="stat-label">Total Doctors</div>
                <div className="stat-value">{totalDoctors}</div>
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
                  {todayAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-mid)' }}>
                        No appointments scheduled for today.
                      </td>
                    </tr>
                  ) : (
                    todayAppointments.map((apt) => (
                      <tr key={apt.id}>
                        <td>
                          <div className="patient-cell">
                            <div className="patient-ava">{apt.avatar}</div>
                            <span className="patient-name">{apt.patient}</span>
                          </div>
                        </td>
                        <td>{apt.doctor}</td>
                        <td>{apt.dateLabel}</td>
                        <td>{apt.timeLabel}</td>
                        <td>
                          <span className={`status-badge ${apt.uiStatus}`}>
                            {apt.rawStatus}
                          </span>
                        </td>
                        <td>
                          <button className="more-btn">···</button>
                        </td>
                      </tr>
                    ))
                  )}
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
              {todaysQueue.length === 0 ? (
                <div className="today-apt-item" style={{ justifyContent: 'center', color: 'var(--text-mid)' }}>
                  No queue for today.
                </div>
              ) : (
                todaysQueue.map((a, i) => (
                  <div key={i} className="today-apt-item">
                    <div className="today-apt-ava">{a.avatar}</div>
                    <div className="today-apt-info">
                      <div className="today-apt-name">{a.patient}</div>
                      <div className="today-apt-doc">{a.doctor}</div>
                    </div>
                    <span className={`status-badge ${a.uiStatus}`}>
                      {a.rawStatus}
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

  const roleName = userRole === 'receptionist' ? 'Receptionist' : 'Doctor';
  const roleEyebrow = userRole === 'receptionist' ? 'Reception Desk Center' : 'Doctor Workspace';
  const roleDescription =
    userRole === 'receptionist'
      ? 'Coordinate patients, appointments, and front-desk tasks from one command view.'
      : 'Manage schedules and patient visits from one dashboard.';

  return (
    <div className="dashboard-layout">
      {/* ── Main Column ── */}
      <div className="dashboard-main">

        {/* Welcome Banner */}
        <div className="admin-hero-card">
          <div className="admin-hero-content">
            <p className="admin-hero-eyebrow">{roleEyebrow}</p>
            <h2 className={animateWelcome ? 'admin-welcome-animate' : ''}>
              {greeting()}, <span>{roleName}</span>
            </h2>
            <p>{roleDescription}</p>
            <div className="admin-hero-actions">
              <button className="btn btn-primary" onClick={() => onNavigate('patients')}>
                Register Patient
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

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon-wrap blue">🩺</div>
            <div>
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">{totalPatients}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap purple">🩻</div>
            <div>
              <div className="stat-label">Total Doctors</div>
              <div className="stat-value">{totalDoctors}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap orange">📅</div>
            <div>
              <div className="stat-label">Today's Appointments</div>
              <div className="stat-value">{todayAppointments.length}</div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div>
          <div className="section-header">
            <span className="section-title">Today's Appointments</span>
            <button className="view-all-btn" onClick={() => onNavigate('appointments')}>View All ›</button>
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
                {todayAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-mid)' }}>
                      No appointments scheduled for today.
                    </td>
                  </tr>
                ) : (
                  todayAppointments.map(apt => (
                    <tr key={apt.id}>
                      <td>
                        <div className="patient-cell">
                          <div className="patient-ava">{apt.avatar}</div>
                          <span className="patient-name">{apt.patient}</span>
                        </div>
                      </td>
                      <td>{apt.doctor}</td>
                      <td>{apt.dateLabel}</td>
                      <td>{apt.timeLabel}</td>
                      <td>
                        <span className={`status-badge ${apt.uiStatus}`}>
                          {apt.rawStatus}
                        </span>
                      </td>
                      <td>
                        <button className="more-btn">···</button>
                      </td>
                    </tr>
                  ))
                )}
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
            Register Patient
          </button>
          <button className="qa-btn secondary" onClick={() => onNavigate('appointments')}>
            <div className="qa-btn-ico">📅</div>
            Book Appointment
          </button>
        </div>

        <div className="admin-kpi-card">
          <div className="section-title">Live Overview</div>
          <div className="admin-kpi-list">
            <div className="admin-kpi-item">
              <span>Available Doctors</span>
              <strong>{availableDoctors}</strong>
            </div>
            <div className="admin-kpi-item">
              <span>Pending Appointments</span>
              <strong>{pendingAppointments}</strong>
            </div>
            <div className="admin-kpi-item">
              <span>Completion Rate</span>
              <strong>{completionRate}%</strong>
            </div>
          </div>
        </div>

        {/* Today's Appointments Mini */}
        <div className="today-apt-card">
          <div className="section-header">
            <span className="section-title">Today's Appointments</span>
            <button className="view-all-btn" onClick={() => onNavigate('appointments')}>View All ›</button>
          </div>
          <div className="today-apt-list">
            {todaysQueue.length === 0 ? (
              <div className="today-apt-item" style={{ justifyContent: 'center', color: 'var(--text-mid)' }}>
                No queue for today.
              </div>
            ) : (
              todaysQueue.map((a, i) => (
                <div key={i} className="today-apt-item">
                  <div className="today-apt-ava">{a.avatar}</div>
                  <div className="today-apt-info">
                    <div className="today-apt-name">{a.patient}</div>
                    <div className="today-apt-doc">{a.doctor}</div>
                  </div>
                  <span className={`status-badge ${a.uiStatus}`}>
                    {a.rawStatus}
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

