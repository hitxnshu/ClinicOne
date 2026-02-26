const TODAY_APTS = [
  { id: 1, patient: 'David Leal', time: '10:00 AM', reason: 'Check-up', status: 'pending' },
  { id: 2, patient: 'Jenny Wilson', time: '11:30 AM', reason: 'Follow-up', status: 'confirmed' },
  { id: 3, patient: 'Shope Rose', time: '01:00 PM', reason: 'Consultation', status: 'pending' },
  { id: 4, patient: 'Mark Joe', time: '03:00 PM', reason: 'Annual exam', status: 'pending' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DoctorDashboard({ user, onNavigate }) {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        <div className="admin-hero-card">
          <div className="admin-hero-content">
            <p className="admin-hero-eyebrow">Doctor Workspace</p>
            <h2>
              {greeting()}, <span>{user?.fullName || 'Doctor'}</span>
            </h2>
            <p>Manage your appointments, patient records, and daily schedule in one place.</p>
            <div className="admin-hero-actions">
              <button className="btn btn-primary" onClick={() => onNavigate?.('records')}>
                View Records
              </button>
              <button className="btn btn-ghost" onClick={() => onNavigate?.('appointments')}>
                Open Schedule
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
            <div className="stat-icon-wrap blue">AP</div>
            <div>
              <div className="stat-label">Today's Appointments</div>
              <div className="stat-value">{TODAY_APTS.length}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap purple">PT</div>
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
                {TODAY_APTS.map((apt) => (
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
          <button className="qa-btn primary" onClick={() => onNavigate?.('records')}>
            <div className="qa-btn-ico">VR</div>
            View Records
          </button>
          <button className="qa-btn secondary" onClick={() => onNavigate?.('patients')}>
            <div className="qa-btn-ico">MP</div>
            My Patients
          </button>
        </div>
      </div>
    </div>
  );
}
