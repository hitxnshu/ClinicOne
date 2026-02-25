import { useState } from 'react';

const APTS = [
  { id: 1, patient: 'David Leal',   avatar: '👨',  doctor: 'Dr. John Carter',   date: '24 Jul 2023', time: '10:00 AM', type: 'General',      status: 'pending' },
  { id: 2, patient: 'Jenny Wilson', avatar: '👩',  doctor: 'Dr. Emma Green',    date: '24 Jul 2023', time: '11:30 AM', type: 'Follow-up',    status: 'pending' },
  { id: 3, patient: 'Shope Rose',   avatar: '👩‍🦰', doctor: 'Dr. Sophia Miller', date: '24 Jul 2023', time: '01:00 PM', type: 'Consultation', status: 'confirmed' },
  { id: 4, patient: 'Mark Joe',     avatar: '👦',  doctor: 'Dr. Alex Brown',    date: '24 Jul 2023', time: '03:00 PM', type: 'Vaccination',  status: 'pending' },
  { id: 5, patient: 'Emily Davis',  avatar: '👩‍🦱', doctor: 'Dr. John Carter',   date: '25 Jul 2023', time: '09:30 AM', type: 'Lab Test',     status: 'confirmed' },
];

export default function Appointments() {
  const [showModal, setShow] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = APTS.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div>
          <h1 className="page-heading">Appointments</h1>
          <p className="page-sub">Schedule and manage patient visits</p>
        </div>
        <div className="btn-bar">
          <div className="search-wrap">
            <span className="search-ico">🔍</span>
            <input placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-ghost">📅 Today</button>
          <button className="btn btn-primary" onClick={() => setShow(true)}>➕ Book Appointment</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="generic-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td>
                  <div className="patient-cell">
                    <div className="patient-ava" style={{ fontSize: 17 }}>{a.avatar}</div>
                    <span className="patient-name">{a.patient}</span>
                  </div>
                </td>
                <td>{a.doctor}</td>
                <td style={{ color: 'var(--text-mid)' }}>{a.type}</td>
                <td>{a.date}</td>
                <td style={{ fontWeight: 600 }}>{a.time}</td>
                <td>
                  <span className={`status-badge ${a.status}`}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="icon-action-btn" title="View">👁️</button>
                    <button className="icon-action-btn" title="Edit">✏️</button>
                    <button className="icon-action-btn" title="Cancel">❌</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Book Appointment</span>
              <button className="modal-close-btn" onClick={() => setShow(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Patient</label>
                <select className="form-select">
                  <option value="">Select Patient</option>
                  <option>David Leal</option><option>Jenny Wilson</option><option>Shope Rose</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Doctor</label>
                <select className="form-select">
                  <option value="">Select Doctor</option>
                  <option>Dr. John Carter</option><option>Dr. Emma Green</option><option>Dr. Sophia Miller</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input className="form-input" type="time" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select">
                  <option>General Checkup</option><option>Follow-up</option>
                  <option>Consultation</option><option>Vaccination</option><option>Lab Test</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" placeholder="Additional notes..."></textarea>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn btn-primary">Book Appointment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
