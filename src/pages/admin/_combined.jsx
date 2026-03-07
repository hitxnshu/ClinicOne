import { useState } from 'react';
import { getStatusTone } from '../../utils/statusSystem';

const INITIAL_RECORDS = [
  {
    id: 'R001',
    patient: 'Arjun Mehta',
    date: '24 Jul 2023',
    doctor: 'Dr. Ananya Rao',
    diagnosis: 'Hypertension Stage 1',
    prescription: 'Lisinopril 10mg daily, reduce salt intake',
  },
  {
    id: 'R002',
    patient: 'Priya Sharma',
    date: '24 Jul 2023',
    doctor: 'Dr. Vikram Singh',
    diagnosis: 'Acute Rhinitis',
    prescription: 'Rest, fluids, antihistamines for 5 days',
  },
  {
    id: 'R003',
    patient: 'Neha Verma',
    date: '20 Jul 2023',
    doctor: 'Dr. Neha Kapoor',
    diagnosis: 'Eczema (mild)',
    prescription: 'Hydrocortisone cream 1%, apply twice daily',
  },
  {
    id: 'R004',
    patient: 'Rohan Singh',
    date: '18 Jul 2023',
    doctor: 'Dr. Arjun Malhotra',
    diagnosis: 'Knee Osteoarthritis',
    prescription: 'Ibuprofen 400mg TID, physiotherapy 3x/week',
  },
];

const INITIAL_RECENT_REPORTS = [
  {
    name: 'Monthly Patient Summary - January 2026',
    type: 'Patient',
    date: '01 Feb 2026',
    by: 'Neha Gupta',
  },
  {
    name: 'Appointment Statistics - Q4 2025',
    type: 'Appointment',
    date: '15 Jan 2026',
    by: 'Neha Gupta',
  },
  {
    name: 'Revenue Report - December 2025',
    type: 'Financial',
    date: '05 Jan 2026',
    by: 'Neha Gupta',
  },
];

const REPORT_TYPES = [
  {
    title: 'Patient Reports',
    desc: 'Demographics and visit statistics',
    color: '#6c7ff2',
  },
  {
    title: 'Appointment Reports',
    desc: 'Scheduling trends and load analysis',
    color: '#3dd598',
  },
  {
    title: 'Financial Reports',
    desc: 'Revenue, billing and expense overview',
    color: '#f9a14b',
  },
  {
    title: 'Doctor Performance',
    desc: 'Productivity and patient satisfaction',
    color: '#ff6b6b',
  },
];

const INITIAL_CLINIC_FORM = {
  name: 'ClinicOne',
  registrationNumber: 'CLI-2024-001',
  address: '123 Healthcare Ave, Medical District, City 12345',
  phone: '+1 (555) 123-4567',
  email: 'info@clinicone.com',
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const INITIAL_HOURS = DAYS.map((day) => ({
  day,
  start: '09:00',
  end: '17:00',
  open: day !== 'Sunday',
}));

const INITIAL_NOTIFICATION_FORM = {
  emailAppointments: true,
  smsReminders: true,
  desktopPush: true,
  weeklySummary: false,
  doctorAlerts: false,
};

const INITIAL_SECURITY_FORM = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function MedicalRecords() {
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    patient: '',
    doctor: '',
    diagnosis: '',
    prescription: '',
  });

  const filtered = records.filter(
    (record) =>
      record.patient.toLowerCase().includes(search.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      record.id.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setEditingRecordId(null);
    setForm({
      patient: '',
      doctor: '',
      diagnosis: '',
      prescription: '',
    });
  };

  const handleEdit = (record) => {
    setEditingRecordId(record.id);
    setForm({
      patient: record.patient,
      doctor: record.doctor,
      diagnosis: record.diagnosis,
      prescription: record.prescription,
    });
    setMessage('');
  };

  const handleSubmit = () => {
    if (!form.patient.trim() || !form.doctor.trim() || !form.diagnosis.trim() || !form.prescription.trim()) {
      setMessage('Fill all fields before saving.');
      return;
    }

    if (editingRecordId) {
      setRecords((current) =>
        current.map((record) =>
          record.id === editingRecordId
            ? {
                ...record,
                patient: form.patient.trim(),
                doctor: form.doctor.trim(),
                diagnosis: form.diagnosis.trim(),
                prescription: form.prescription.trim(),
              }
            : record
        )
      );
      setMessage(`Record ${editingRecordId} updated.`);
    } else {
      const maxId = records.reduce((maxValue, record) => {
        const numeric = Number(record.id.replace('R', ''));
        return Math.max(maxValue, Number.isNaN(numeric) ? 0 : numeric);
      }, 0);
      const nextId = `R${String(maxId + 1).padStart(3, '0')}`;
      setRecords((current) => [
        {
          id: nextId,
          patient: form.patient.trim(),
          doctor: form.doctor.trim(),
          diagnosis: form.diagnosis.trim(),
          prescription: form.prescription.trim(),
          date: formatDate(),
        },
        ...current,
      ]);
      setMessage(`Record ${nextId} created.`);
    }

    resetForm();
  };

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
            <input
              placeholder="Search by patient, diagnosis or ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setMessage('Add mode enabled.');
            }}
          >
            Add Record
          </button>
        </div>
      </div>

      <div className="settings-form" style={{ marginBottom: 16 }}>
        <h3 className="settings-section-title">
          {editingRecordId ? `Edit Record ${editingRecordId}` : 'New Record'}
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Patient Name</label>
            <input
              className="form-input"
              value={form.patient}
              onChange={(event) => setForm((current) => ({ ...current, patient: event.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Doctor</label>
            <input
              className="form-input"
              value={form.doctor}
              onChange={(event) => setForm((current) => ({ ...current, doctor: event.target.value }))}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Diagnosis</label>
          <input
            className="form-input"
            value={form.diagnosis}
            onChange={(event) => setForm((current) => ({ ...current, diagnosis: event.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Prescription</label>
          <textarea
            className="form-textarea"
            value={form.prescription}
            onChange={(event) => setForm((current) => ({ ...current, prescription: event.target.value }))}
          />
        </div>
        <div className="table-actions" style={{ justifyContent: 'flex-start' }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editingRecordId ? 'Update Record' : 'Save Record'}
          </button>
          {editingRecordId && (
            <button className="btn btn-ghost" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
        {message && <p className="page-sub" style={{ marginTop: 10 }}>{message}</p>}
      </div>

      <div className="records-list">
        {filtered.map((record) => (
          <div key={record.id} className="record-card">
            <div className="record-head">
              <div>
                <div className="record-patient">{record.patient}</div>
                <div className="record-id">Record ID: {record.id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="record-date-val">{record.date}</div>
                <div className="record-doctor">{record.doctor}</div>
              </div>
            </div>
            <div className="record-body">
              <div>
                <div className="record-field-label">Diagnosis</div>
                <div className="record-field-val">{record.diagnosis}</div>
              </div>
              <div>
                <div className="record-field-label">Prescription</div>
                <div className="record-field-val">{record.prescription}</div>
              </div>
            </div>
            <div className="record-foot">
              <div className="table-actions">
                <button className="action-btn action-view" onClick={() => setSelectedRecord(record)}>
                  View
                </button>
                <button className="action-btn action-edit" onClick={() => handleEdit(record)}>
                  Edit
                </button>
                <button
                  className="action-btn action-neutral"
                  onClick={() => setMessage('Record download is intentionally disabled.')}
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRecord && (
        <div
          onClick={() => setSelectedRecord(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14, 22, 40, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 16,
          }}
        >
          <div
            className="settings-form"
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 700,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 56px rgba(0, 0, 0, 0.22)',
            }}
          >
            <div className="section-header">
              <h3 className="section-title">Record Detail</h3>
              <button className="action-btn action-neutral" onClick={() => setSelectedRecord(null)}>
                Close
              </button>
            </div>
            <p className="page-sub" style={{ marginBottom: 10 }}>
              {selectedRecord.id} - {selectedRecord.patient}
            </p>
            <div className="form-group">
              <label className="form-label">Doctor</label>
              <div className="record-field-val">{selectedRecord.doctor}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Diagnosis</label>
              <div className="record-field-val">{selectedRecord.diagnosis}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Prescription</label>
              <div className="record-field-val">{selectedRecord.prescription}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Reports() {
  const [recentReports, setRecentReports] = useState(INITIAL_RECENT_REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);
  const [message, setMessage] = useState('');

  const handleGenerate = () => {
    setMessage('Report generation is intentionally disabled.');
  };

  return (
    <div className="page-wrap">
      <div style={{ marginBottom: 22 }}>
        <h1 className="page-heading">Reports and Analytics</h1>
        <p className="page-sub">Generate and review clinic performance reports</p>
      </div>

      <div className="report-type-grid">
        {REPORT_TYPES.map((type) => (
          <div key={type.title} className="report-type-card">
            <div className="report-type-title" style={{ color: type.color }}>
              {type.title}
            </div>
            <div className="report-type-desc">{type.desc}</div>
            <div className="table-actions" style={{ marginTop: 12, justifyContent: 'center' }}>
              <button className="action-btn action-neutral report-gen-btn" onClick={handleGenerate} disabled title="Disabled">
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="page-sub" style={{ marginTop: 12 }}>{message}</p>}

      <div>
        <h2 className="section-title" style={{ marginBottom: 14 }}>Recent Reports</h2>
        <div className="table-wrap">
          <table className="generic-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated</th>
                <th>By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report, index) => (
                <tr key={`${report.name}-${index}`}>
                  <td style={{ fontWeight: 600 }}>{report.name}</td>
                  <td>
                    <span className={`status-badge ${getStatusTone('report', report.type)}`}>
                      {report.type}
                    </span>
                  </td>
                  <td>{report.date}</td>
                  <td>{report.by}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn action-view" onClick={() => setSelectedReport(report)}>
                        View
                      </button>
                      <button
                        className="action-btn action-neutral"
                        onClick={() => setMessage('Report download is intentionally disabled.')}
                      >
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

      {selectedReport && (
        <div className="settings-form" style={{ marginTop: 16 }}>
          <div className="section-header">
            <h3 className="section-title">Report Preview</h3>
            <button className="action-btn action-neutral" onClick={() => setSelectedReport(null)}>
              Close
            </button>
          </div>
          <div className="form-group">
            <label className="form-label">Report Name</label>
            <div className="record-field-val">{selectedReport.name}</div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="record-field-val">{selectedReport.type}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Generated</label>
              <div className="record-field-val">{selectedReport.date}</div>
            </div>
            <div className="form-group">
              <label className="form-label">By</label>
              <div className="record-field-val">{selectedReport.by}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Settings() {
  const [activeTab, setActiveTab] = useState('clinic');
  const [clinicForm, setClinicForm] = useState(INITIAL_CLINIC_FORM);
  const [hoursForm, setHoursForm] = useState(INITIAL_HOURS);
  const [notificationForm, setNotificationForm] = useState(INITIAL_NOTIFICATION_FORM);
  const [securityForm, setSecurityForm] = useState(INITIAL_SECURITY_FORM);
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'clinic', label: 'Clinic Info' },
    { id: 'hours', label: 'Working Hours' },
    { id: 'notifs', label: 'Notifications' },
    { id: 'security', label: 'Security' },
  ];

  const saveMessage = (text) => {
    setMessage(`${text} Saved at ${new Date().toLocaleTimeString()}.`);
  };

  return (
    <div className="page-wrap">
      <div style={{ marginBottom: 22 }}>
        <h1 className="page-heading">Settings</h1>
        <p className="page-sub">Manage clinic configuration and preferences</p>
      </div>

      <div className="settings-grid">
        <div className="settings-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-form">
          {activeTab === 'clinic' && (
            <>
              <h3 className="settings-section-title">Clinic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Clinic Name</label>
                  <input
                    className="form-input"
                    value={clinicForm.name}
                    onChange={(event) => setClinicForm((current) => ({ ...current, name: event.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Registration No.</label>
                  <input
                    className="form-input"
                    value={clinicForm.registrationNumber}
                    onChange={(event) =>
                      setClinicForm((current) => ({ ...current, registrationNumber: event.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="form-textarea"
                  value={clinicForm.address}
                  onChange={(event) => setClinicForm((current) => ({ ...current, address: event.target.value }))}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    value={clinicForm.phone}
                    onChange={(event) => setClinicForm((current) => ({ ...current, phone: event.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    value={clinicForm.email}
                    onChange={(event) => setClinicForm((current) => ({ ...current, email: event.target.value }))}
                  />
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => saveMessage('Clinic information updated.')}>
                Save Changes
              </button>
            </>
          )}

          {activeTab === 'hours' && (
            <>
              <h3 className="settings-section-title">Working Hours</h3>
              {hoursForm.map((entry) => (
                <div
                  key={entry.day}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ minWidth: 110, fontWeight: 600, fontSize: 14 }}>{entry.day}</div>
                  <input
                    type="time"
                    className="form-input"
                    value={entry.start}
                    onChange={(event) =>
                      setHoursForm((current) =>
                        current.map((item) =>
                          item.day === entry.day ? { ...item, start: event.target.value } : item
                        )
                      )
                    }
                    style={{ flex: 1 }}
                  />
                  <span style={{ color: 'var(--text-light)', fontSize: 14 }}>to</span>
                  <input
                    type="time"
                    className="form-input"
                    value={entry.end}
                    onChange={(event) =>
                      setHoursForm((current) =>
                        current.map((item) =>
                          item.day === entry.day ? { ...item, end: event.target.value } : item
                        )
                      )
                    }
                    style={{ flex: 1 }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={entry.open}
                      onChange={(event) =>
                        setHoursForm((current) =>
                          current.map((item) =>
                            item.day === entry.day ? { ...item, open: event.target.checked } : item
                          )
                        )
                      }
                    />
                    Open
                  </label>
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => saveMessage('Working hours updated.')}>
                Save Hours
              </button>
            </>
          )}

          {activeTab === 'notifs' && (
            <>
              <h3 className="settings-section-title">Notification Preferences</h3>
              {[
                { key: 'emailAppointments', label: 'Email notifications for new appointments' },
                { key: 'smsReminders', label: 'SMS reminders for patients' },
                { key: 'desktopPush', label: 'Desktop push notifications' },
                { key: 'weeklySummary', label: 'Weekly summary reports' },
                { key: 'doctorAlerts', label: 'Doctor availability alerts' },
              ].map((option) => (
                <label
                  key={option.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '13px 16px',
                    background: 'var(--surface-soft)',
                    borderRadius: 11,
                    marginBottom: 10,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={notificationForm[option.key]}
                    onChange={(event) =>
                      setNotificationForm((current) => ({
                        ...current,
                        [option.key]: event.target.checked,
                      }))
                    }
                    style={{ width: 17, height: 17, accentColor: 'var(--primary)' }}
                  />
                  {option.label}
                </label>
              ))}
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => saveMessage('Notification preferences updated.')}>
                Save Preferences
              </button>
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
                  placeholder="********"
                  value={securityForm.currentPassword}
                  onChange={(event) =>
                    setSecurityForm((current) => ({ ...current, currentPassword: event.target.value }))
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="********"
                    value={securityForm.newPassword}
                    onChange={(event) =>
                      setSecurityForm((current) => ({ ...current, newPassword: event.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="********"
                    value={securityForm.confirmPassword}
                    onChange={(event) =>
                      setSecurityForm((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                  />
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (
                    !securityForm.currentPassword.trim() ||
                    !securityForm.newPassword.trim() ||
                    !securityForm.confirmPassword.trim()
                  ) {
                    setMessage('Fill all password fields before updating.');
                    return;
                  }
                  if (securityForm.newPassword !== securityForm.confirmPassword) {
                    setMessage('New password and confirm password must match.');
                    return;
                  }
                  setSecurityForm(INITIAL_SECURITY_FORM);
                  saveMessage('Password updated.');
                }}
              >
                Update Password
              </button>
            </>
          )}
          {message && <p className="page-sub" style={{ marginTop: 12 }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
