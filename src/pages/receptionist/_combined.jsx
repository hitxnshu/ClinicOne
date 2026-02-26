// MedicalRecords.jsx
import { useState } from 'react';

const RECORDS = [
  { id: 'R001', patient: 'David Leal',   date: '24 Jul 2023', doctor: 'Dr. John Carter',   diagnosis: 'Hypertension Stage 1',  prescription: 'Lisinopril 10mg daily, reduce salt intake' },
  { id: 'R002', patient: 'Jenny Wilson', date: '24 Jul 2023', doctor: 'Dr. Emma Green',    diagnosis: 'Acute Rhinitis',         prescription: 'Rest, fluids, antihistamines for 5 days' },
  { id: 'R003', patient: 'Shope Rose',   date: '20 Jul 2023', doctor: 'Dr. Sophia Miller', diagnosis: 'Eczema (mild)',          prescription: 'Hydrocortisone cream 1%, apply twice daily' },
  { id: 'R004', patient: 'Mark Joe',     date: '18 Jul 2023', doctor: 'Dr. Alex Brown',    diagnosis: 'Knee Osteoarthritis',    prescription: 'Ibuprofen 400mg TID, physiotherapy 3×/week' },
];

export function MedicalRecords() {
  const [search, setSearch] = useState('');

  const filtered = RECORDS.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div>
          <h1 className="page-heading">Medical Records</h1>
          <p className="page-sub">Patient history, diagnoses and prescriptions</p>
        </div>
        <div className="btn-bar">
          <div className="search-wrap">
            <span className="search-ico">🔍</span>
            <input placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary">➕ Add Record</button>
        </div>
      </div>

      <div className="records-list">
        {filtered.map(r => (
          <div key={r.id} className="record-card">
            <div className="record-head">
              <div>
                <div className="record-patient">{r.patient}</div>
                <div className="record-id">Record ID: {r.id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="record-date-val">{r.date}</div>
                <div className="record-doctor">{r.doctor}</div>
              </div>
            </div>
            <div className="record-body">
              <div>
                <div className="record-field-label">Diagnosis</div>
                <div className="record-field-val">{r.diagnosis}</div>
              </div>
              <div>
                <div className="record-field-label">Prescription</div>
                <div className="record-field-val">{r.prescription}</div>
              </div>
            </div>
            <div className="record-foot">
              <div className="table-actions">
                <button className="action-btn action-view">
                  <span aria-hidden="true">👁</span>
                  View
                </button>
                <button className="action-btn action-edit">
                  <span aria-hidden="true">✏</span>
                  Edit
                </button>
                <button className="action-btn action-neutral">
                  <span aria-hidden="true">⬇</span>
                  PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Reports.jsx
export function Reports() {
  const types = [
    { icon: '👥', title: 'Patient Reports',       desc: 'Demographics & visit statistics',      color: '#6c7ff2' },
    { icon: '📅', title: 'Appointment Reports',    desc: 'Scheduling trends & load analysis',    color: '#3dd598' },
    { icon: '💰', title: 'Financial Reports',      desc: 'Revenue, billing & expense overview',  color: '#f9a14b' },
    { icon: '👨‍⚕️', title: 'Doctor Performance',    desc: 'Productivity & patient satisfaction',  color: '#ff6b6b' },
  ];

  return (
    <div className="page-wrap">
      <div style={{ marginBottom: 22 }}>
        <h1 className="page-heading">Reports & Analytics</h1>
        <p className="page-sub">Generate and export clinic performance reports</p>
      </div>

      <div className="report-type-grid">
        {types.map((t, i) => (
          <div key={i} className="report-type-card">
            <div className="report-type-icon">{t.icon}</div>
            <div className="report-type-title" style={{ color: t.color }}>{t.title}</div>
            <div className="report-type-desc">{t.desc}</div>
            <div className="table-actions" style={{ marginTop: 12, justifyContent: 'center' }}>
              <button className="action-btn action-neutral report-gen-btn">
                <span aria-hidden="true">⬇</span>
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="section-title" style={{ marginBottom: 14 }}>Recent Reports</h2>
        <div className="table-wrap">
          <table className="generic-table">
            <thead>
              <tr><th>Report Name</th><th>Type</th><th>Generated</th><th>By</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {[
                { name: 'Monthly Patient Summary – January 2026', type: 'Patient',      date: '01 Feb 2026', by: 'Jane Cooper' },
                { name: 'Appointment Statistics – Q4 2025',        type: 'Appointment',  date: '15 Jan 2026', by: 'Jane Cooper' },
                { name: 'Revenue Report – December 2025',          type: 'Financial',    date: '05 Jan 2026', by: 'Jane Cooper' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>
                    <span className={`status-badge ${r.type === 'Patient' ? 'pending' : r.type === 'Appointment' ? 'confirmed' : 'cancelled'}`}>
                      {r.type}
                    </span>
                  </td>
                  <td>{r.date}</td>
                  <td>{r.by}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn action-view">
                        <span aria-hidden="true">👁</span>
                        View
                      </button>
                      <button className="action-btn action-neutral">
                        <span aria-hidden="true">⬇</span>
                        Download
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

// Settings.jsx
export function Settings() {
  const [activeTab, setActiveTab] = useState('clinic');
  const workingHours = [
    { day: 'Monday', start: '09:00', end: '17:00', isOpen: true },
    { day: 'Tuesday', start: '09:00', end: '17:00', isOpen: true },
    { day: 'Wednesday', start: '09:00', end: '17:00', isOpen: true },
    { day: 'Thursday', start: '09:00', end: '17:00', isOpen: true },
    { day: 'Friday', start: '09:00', end: '17:00', isOpen: true },
    { day: 'Saturday', start: '09:00', end: '13:00', isOpen: true },
    { day: 'Sunday', start: '-', end: '-', isOpen: false },
  ];

  const tabs = [
    { id: 'clinic',   icon: '🏥', label: 'Clinic Info' },
    { id: 'hours',    icon: '🕐', label: 'Working Hours' },
    { id: 'notifs',   icon: '🔔', label: 'Notifications' },
    { id: 'security', icon: '🔒', label: 'Security' },
  ];

  return (
    <div className="page-wrap">
      <div style={{ marginBottom: 22 }}>
        <h1 className="page-heading">Settings</h1>
        <p className="page-sub">Manage clinic configuration and preferences</p>
      </div>

      <div className="settings-grid">
        <div className="settings-nav">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`settings-nav-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="settings-form">
          {activeTab === 'clinic' && (
            <>
              <h3 className="settings-section-title">Clinic Information</h3>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Clinic Name</label><input className="form-input" defaultValue="ClinicOne" /></div>
                <div className="form-group"><label className="form-label">Registration No.</label><input className="form-input" defaultValue="CLI-2024-001" /></div>
              </div>
              <div className="form-group"><label className="form-label">Address</label><textarea className="form-textarea" defaultValue="123 Healthcare Ave, Medical District, City 12345" /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+1 (555) 123-4567" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue="info@clinicone.com" /></div>
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </>
          )}

          {activeTab === 'hours' && (
            <>
              <h3 className="settings-section-title">Working Hours</h3>
              <p className="page-sub" style={{ marginBottom: 14 }}>
                Receptionist view is read-only for clinic working hours.
              </p>
              {workingHours.map(({ day, start, end, isOpen }) => (
                <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ minWidth: 110, fontWeight: 600, fontSize: 14 }}>{day}</div>
                  <div style={{ flex: 1, fontSize: 14, color: 'var(--text-dark)' }}>{start}</div>
                  <span style={{ color: 'var(--text-light)', fontSize: 14 }}>to</span>
                  <div style={{ flex: 1, fontSize: 14, color: 'var(--text-dark)' }}>{end}</div>
                  <span
                    className={`status-badge ${isOpen ? 'confirmed' : 'pending'}`}
                    style={{ minWidth: 70, justifyContent: 'center' }}
                  >
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              ))}
            </>
          )}

          {activeTab === 'notifs' && (
            <>
              <h3 className="settings-section-title">Notification Preferences</h3>
              {[
                'Email notifications for new appointments',
                'SMS reminders for patients',
                'Desktop push notifications',
                'Weekly summary reports',
                'Doctor availability alerts',
              ].map((p, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'var(--surface-soft)', borderRadius: 11, marginBottom: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                  <input type="checkbox" defaultChecked={i < 3} style={{ width: 17, height: 17, accentColor: 'var(--primary)' }} />
                  {p}
                </label>
              ))}
              <button className="btn btn-primary" style={{ marginTop: 8 }}>Save Preferences</button>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <h3 className="settings-section-title">Change Password</h3>
              <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
                <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
              </div>
              <button className="btn btn-primary">Update Password</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


