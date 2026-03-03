import { useState } from 'react';

const INITIAL_APPOINTMENTS = [
  { id: 1, patient: 'Arjun Mehta', avatar: '👨', doctor: 'Dr. Ananya Rao', date: '24 Jul 2023', time: '10:00 AM', type: 'General', status: 'pending' },
  { id: 2, patient: 'Priya Sharma', avatar: '👩', doctor: 'Dr. Vikram Singh', date: '24 Jul 2023', time: '11:30 AM', type: 'Follow-up', status: 'pending' },
  { id: 3, patient: 'Neha Verma', avatar: '🧑', doctor: 'Dr. Neha Kapoor', date: '24 Jul 2023', time: '01:00 PM', type: 'Consultation', status: 'confirmed' },
  { id: 4, patient: 'Rohan Singh', avatar: '👦', doctor: 'Dr. Arjun Malhotra', date: '24 Jul 2023', time: '03:00 PM', type: 'Vaccination', status: 'pending' },
  { id: 5, patient: 'Kavya Iyer', avatar: '👩', doctor: 'Dr. Ananya Rao', date: '25 Jul 2023', time: '09:30 AM', type: 'Lab Test', status: 'confirmed' },
];

const NEW_APPOINTMENT_INITIAL = {
  patient: '',
  doctor: '',
  date: '',
  time: '',
  type: 'General Checkup',
  notes: '',
};

function formatDateToDisplay(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatTimeToDisplay(timeStr) {
  if (!timeStr) return '';
  const [hoursRaw, minutesRaw] = timeStr.split(':');
  const hours = Number.parseInt(hoursRaw, 10);
  const minutes = Number.parseInt(minutesRaw, 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeStr;

  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [showModal, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [newAppointment, setNewAppointment] = useState(NEW_APPOINTMENT_INITIAL);
  const [formError, setFormError] = useState('');

  const filtered = appointments.filter(
    (a) =>
      a.patient.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  const patientOptions = Array.from(new Set(appointments.map((a) => a.patient)));
  const doctorOptions = Array.from(new Set(appointments.map((a) => a.doctor)));

  const closeModal = () => {
    setShow(false);
    setNewAppointment(NEW_APPOINTMENT_INITIAL);
    setFormError('');
  };

  const handleCreateAppointment = () => {
    setFormError('');

    if (!newAppointment.patient || !newAppointment.doctor || !newAppointment.date || !newAppointment.time) {
      setFormError('Please fill patient, doctor, date and time.');
      return;
    }

    const nextId = appointments.reduce((maxId, apt) => Math.max(maxId, apt.id), 0) + 1;
    const appointment = {
      id: nextId,
      patient: newAppointment.patient,
      avatar: '🧑',
      doctor: newAppointment.doctor,
      date: formatDateToDisplay(newAppointment.date),
      time: formatTimeToDisplay(newAppointment.time),
      type: newAppointment.type,
      status: 'pending',
    };

    setAppointments((prev) => [appointment, ...prev]);
    closeModal();
  };

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
            <input
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost">📅 Today</button>
          <button className="btn btn-primary" onClick={() => setShow(true)}>
            ➕ Book Appointment
          </button>
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
            {filtered.map((a) => (
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
                  <div className="table-actions">
                    <button className="action-btn action-view" title="View">
                      <span aria-hidden="true">👁</span>
                      View
                    </button>
                    <button className="action-btn action-edit" title="Edit">
                      <span aria-hidden="true">✏</span>
                      Edit
                    </button>
                    <button className="action-btn action-delete" title="Cancel">
                      <span aria-hidden="true">✖</span>
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Book Appointment</span>
              <button className="modal-close-btn" onClick={closeModal}>X</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Patient</label>
                <select
                  className="form-select"
                  value={newAppointment.patient}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, patient: e.target.value }))
                  }
                >
                  <option value="">Select Patient</option>
                  {patientOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Doctor</label>
                <select
                  className="form-select"
                  value={newAppointment.doctor}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, doctor: e.target.value }))
                  }
                >
                  <option value="">Select Doctor</option>
                  {doctorOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    className="form-input"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({ ...prev, time: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={newAppointment.type}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option>General Checkup</option>
                  <option>Follow-up</option>
                  <option>Consultation</option>
                  <option>Vaccination</option>
                  <option>Lab Test</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  placeholder="Additional notes..."
                  value={newAppointment.notes}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </div>
              {formError && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)' }}>
                  {formError}
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateAppointment}>
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
