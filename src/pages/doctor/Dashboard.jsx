import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DoctorDashboard({ user, onNavigate }) {
  const [animateWelcome, setAnimateWelcome] = useState(false);
  const { appointments, updateAppointmentStatus } = useOutletContext();

  useEffect(() => {
    const shouldAnimate = sessionStorage.getItem('justLoggedInRole') === 'doctor';
    if (!shouldAnimate) return;

    setAnimateWelcome(true);
    sessionStorage.removeItem('justLoggedInRole');

    const timer = setTimeout(() => setAnimateWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const totalAppointments = appointments.length;
    const patientsLeft = appointments.filter(
      (apt) => apt.status !== 'completed' && apt.status !== 'cancelled',
    ).length;
    const totalEarnings = appointments
      .filter((apt) => apt.status === 'completed')
      .reduce((sum, apt) => sum + (apt.fee || 0), 0);

    return { totalAppointments, patientsLeft, totalEarnings };
  }, [appointments]);

  const markAppointment = (id, status) => {
    updateAppointmentStatus(id, status);
  };

  return (
    <div className="doctor-dashboard">
      <div className="doctor-dashboard-header">
        <div>
          <p className="admin-hero-eyebrow">Doctor Dashboard</p>
          <h2 className={animateWelcome ? 'admin-welcome-animate' : ''}>
            {greeting()}, <span>{user?.fullName || 'Doctor'}</span>
          </h2>
          <p>Overview of your day: earnings, appointments and patients left.</p>
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
          <div className="stat-icon-wrap green">₹</div>
          <div>
            <div className="stat-label">Today's Earnings</div>
            <div className="stat-value">
              ₹{stats.totalEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap blue">AP</div>
          <div>
            <div className="stat-label">Today's Appointments</div>
            <div className="stat-value">{stats.totalAppointments}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap purple">PL</div>
          <div>
            <div className="stat-label">Patients Left</div>
            <div className="stat-value">{stats.patientsLeft}</div>
          </div>
        </div>
      </div>

      <div className="doctor-dashboard-list">
        <h2 className="section-title" style={{ marginBottom: 14 }}>Today's Patients</h2>
        <div className="apt-table-wrap">
          <table className="apt-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Mark</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td>
                    <span className="patient-name">{apt.patient}</span>
                  </td>
                  <td>{apt.time}</td>
                  <td>{apt.reason}</td>
                  <td>
                    <span className={`status-badge ${apt.status}`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="doctor-status-actions">
                      <button
                        type="button"
                        className="btn-circle success"
                        title="Mark as completed"
                        onClick={() => markAppointment(apt.id, 'completed')}
                        disabled={apt.status === 'completed'}
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="btn-circle danger"
                        title="Mark as cancelled"
                        onClick={() => markAppointment(apt.id, 'cancelled')}
                        disabled={apt.status === 'cancelled'}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
