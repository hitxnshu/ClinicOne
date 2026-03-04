// MedicalRecords.jsx
import { useMemo, useState } from 'react';
import { updateUserPassword } from '../../utils/userStorage';

const RECORDS = [
  { id: 'R001', patient: 'David Leal',   date: '24 Jul 2023', doctor: 'Dr. John Carter',   diagnosis: 'Hypertension Stage 1',  prescription: 'Lisinopril 10mg daily, reduce salt intake', status: 'Verified' },
  { id: 'R002', patient: 'Jenny Wilson', date: '24 Jul 2023', doctor: 'Dr. Emma Green',    diagnosis: 'Acute Rhinitis',         prescription: 'Rest, fluids, antihistamines for 5 days', status: 'Pending Verification' },
  { id: 'R003', patient: 'Shope Rose',   date: '20 Jul 2023', doctor: 'Dr. Sophia Miller', diagnosis: 'Eczema (mild)',          prescription: 'Hydrocortisone cream 1%, apply twice daily', status: 'Verified' },
  { id: 'R004', patient: 'Mark Joe',     date: '18 Jul 2023', doctor: 'Dr. Alex Brown',    diagnosis: 'Knee Osteoarthritis',    prescription: 'Ibuprofen 400mg TID, physiotherapy 3×/week', status: 'Archived' },
];

export function MedicalRecords() {
  const [records, setRecords] = useState(RECORDS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesText =
        !term ||
        record.patient.toLowerCase().includes(term) ||
        record.id.toLowerCase().includes(term) ||
        record.doctor.toLowerCase().includes(term) ||
        record.diagnosis.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const getRecordStatusClass = (status) => {
    if (status === 'Verified') return 'confirmed';
    if (status === 'Archived') return 'cancelled';
    return 'pending';
  };

  const handleDownloadRecord = (record) => {
    const content = [
      `Record ID: ${record.id}`,
      `Patient: ${record.patient}`,
      `Doctor: ${record.doctor}`,
      `Date: ${record.date}`,
      `Record Status: ${record.status}`,
      `Diagnosis: ${record.diagnosis}`,
      `Prescription: ${record.prescription}`,
      '',
      'Note: Receptionist role can view/export records but cannot edit clinical content.',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.id}_record.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setActionMessage(`Downloaded ${record.id} as text file.`);
  };

  const handlePrintRecord = (record) => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      setActionMessage('Pop-up blocked. Please allow pop-ups to print records.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Medical Record ${record.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
            h1 { margin: 0 0 8px 0; font-size: 22px; }
            .meta { margin-bottom: 18px; line-height: 1.7; }
            .label { font-weight: 700; }
            .block { margin-top: 14px; }
          </style>
        </head>
        <body>
          <h1>Medical Record</h1>
          <div class="meta">
            <div><span class="label">Record ID:</span> ${record.id}</div>
            <div><span class="label">Patient:</span> ${record.patient}</div>
            <div><span class="label">Doctor:</span> ${record.doctor}</div>
            <div><span class="label">Date:</span> ${record.date}</div>
            <div><span class="label">Record Status:</span> ${record.status}</div>
          </div>
          <div class="block"><span class="label">Diagnosis:</span> ${record.diagnosis}</div>
          <div class="block"><span class="label">Prescription:</span> ${record.prescription}</div>
          <div class="block" style="margin-top:20px;color:#555;">
            Receptionist role: read-only clinical access.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    setActionMessage(`Print sent for ${record.id}.`);
  };

  const handleUpdateRecordStatus = (recordId, nextStatus) => {
    setRecords((prev) =>
      prev.map((record) => (record.id === recordId ? { ...record, status: nextStatus } : record))
    );
    if (selectedRecord?.id === recordId) {
      setSelectedRecord((prev) => (prev ? { ...prev, status: nextStatus } : prev));
    }
    setActionMessage(`Record ${recordId} marked as ${nextStatus}.`);
  };

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div>
          <h1 className="page-heading">Medical Records</h1>
          <p className="page-sub">
            Receptionist access: view, search, export, and administratively track records
          </p>
        </div>
        <div className="btn-bar">
          <div className="search-wrap">
            <span className="search-ico">🔍</span>
            <input
              placeholder="Search by patient, ID, doctor or diagnosis..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{ minWidth: 180 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Verified">Verified</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>
      {actionMessage && (
        <div style={{ marginBottom: 10, color: 'var(--text-mid)', fontSize: 13 }}>
          {actionMessage}
        </div>
      )}

      <div className="records-list">
        {filtered.map(r => (
          <div key={r.id} className="record-card">
            <div className="record-head">
              <div>
                <div className="record-patient">{r.patient}</div>
                <div className="record-id">Record ID: {r.id}</div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                <div className="record-date-val">{r.date}</div>
                <div className="record-doctor">{r.doctor}</div>
                <span className={`status-badge ${getRecordStatusClass(r.status)}`}>{r.status}</span>
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
                <button className="action-btn action-view" onClick={() => setSelectedRecord(r)}>
                  <span aria-hidden="true">👁</span>
                  View
                </button>
                <button className="action-btn action-neutral" onClick={() => handleDownloadRecord(r)}>
                  <span aria-hidden="true">⬇</span>
                  Download
                </button>
                <button className="action-btn action-neutral" onClick={() => handlePrintRecord(r)}>
                  <span aria-hidden="true">🖨</span>
                  Print
                </button>
                {r.status !== 'Verified' && (
                  <button
                    className="action-btn action-edit"
                    onClick={() => handleUpdateRecordStatus(r.id, 'Verified')}
                  >
                    <span aria-hidden="true">✔</span>
                    Verify
                  </button>
                )}
                {r.status !== 'Archived' && (
                  <button
                    className="action-btn action-delete"
                    onClick={() => handleUpdateRecordStatus(r.id, 'Archived')}
                  >
                    <span aria-hidden="true">📦</span>
                    Archive
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Medical Record Details</span>
              <button className="modal-close-btn" onClick={() => setSelectedRecord(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Record ID</label>
                  <input className="form-input" value={selectedRecord.id} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <input className="form-input" value={selectedRecord.status} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Patient</label>
                  <input className="form-input" value={selectedRecord.patient} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Doctor</label>
                  <input className="form-input" value={selectedRecord.doctor} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" value={selectedRecord.date} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Diagnosis</label>
                <textarea className="form-textarea" value={selectedRecord.diagnosis} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Prescription</label>
                <textarea className="form-textarea" value={selectedRecord.prescription} readOnly />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-light)' }}>
                Clinical content is read-only for receptionist role.
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-primary" onClick={() => setSelectedRecord(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
export function Settings({ user, onPasswordChanged }) {
  const [activeTab, setActiveTab] = useState('clinic');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
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

  const handlePasswordUpdate = () => {
    setPasswordError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password must be the same.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    const result = updateUserPassword(
      user?.email,
      'receptionist',
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (!result.ok) {
      setPasswordError(result.message);
      return;
    }

    onPasswordChanged?.();
  };

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
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
              </div>
              {passwordError && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)', marginBottom: 8 }}>
                  {passwordError}
                </div>
              )}
              <button className="btn btn-primary" onClick={handlePasswordUpdate}>Update Password</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


