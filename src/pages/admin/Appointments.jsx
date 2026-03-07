import { useEffect, useState } from 'react';
import { getStatusLabel, getStatusTone } from '../../utils/statusSystem';

const STORAGE_KEY = 'clinicone_admin_appointments';

const INITIAL_APPOINTMENTS = [
  { id: 1, patient: 'Arjun Mehta', avatar: '\u{1F9D1}', doctor: 'Dr. Ananya Rao', date: '24 Jul 2023', time: '10:00 AM', type: 'General', status: 'pending' },
  { id: 2, patient: 'Priya Sharma', avatar: '\u{1F9D1}', doctor: 'Dr. Vikram Singh', date: '24 Jul 2023', time: '11:30 AM', type: 'Follow-up', status: 'pending' },
  { id: 3, patient: 'Neha Verma', avatar: '\u{1F9D1}', doctor: 'Dr. Neha Kapoor', date: '24 Jul 2023', time: '01:00 PM', type: 'Consultation', status: 'confirmed' },
  { id: 4, patient: 'Rohan Singh', avatar: '\u{1F9D1}', doctor: 'Dr. Arjun Malhotra', date: '24 Jul 2023', time: '03:00 PM', type: 'Vaccination', status: 'pending' },
  { id: 5, patient: 'Kavya Iyer', avatar: '\u{1F9D1}', doctor: 'Dr. Ananya Rao', date: '25 Jul 2023', time: '09:30 AM', type: 'Lab Test', status: 'confirmed' },
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

function toDateInputValue(displayDate) {
  if (!displayDate) return '';
  const parsed = new Date(displayDate);
  if (Number.isNaN(parsed.getTime())) return '';
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toTimeInputValue(displayTime) {
  if (!displayTime) return '';
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(displayTime.trim());
  if (!match) return '';
  let hours = Number.parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === 'AM' && hours === 12) hours = 0;
  if (period === 'PM' && hours !== 12) hours += 12;

  return `${String(hours).padStart(2, '0')}:${minutes}`;
}
function loadAppointments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_APPOINTMENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : INITIAL_APPOINTMENTS;
  } catch {
    return INITIAL_APPOINTMENTS;
  }
}

export default function Appointments() {
  const [appointments, setAppointments] = useState(loadAppointments);
  const [showModal, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [newAppointment, setNewAppointment] = useState(NEW_APPOINTMENT_INITIAL);
  const [formError, setFormError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

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
      avatar: '\u{1F9D1}',
      doctor: newAppointment.doctor,
      date: formatDateToDisplay(newAppointment.date),
      time: formatTimeToDisplay(newAppointment.time),
      type: newAppointment.type,
      status: 'pending',
    };

    setAppointments((prev) => [appointment, ...prev]);
    closeModal();
  };

  const handleCancelAppointment = (appointmentId) => {
    const selected = appointments.find((a) => a.id === appointmentId);
    if (!selected) return;

    const shouldCancel = window.confirm(
      `Cancel appointment for ${selected.patient} with ${selected.doctor}?`
    );
    if (!shouldCancel) return;

    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'cancelled' } : a))
    );
  };

  const handleSaveEditAppointment = () => {
    if (!editingAppointment) return;
    setEditError('');

    if (
      !editingAppointment.patient.trim() ||
      !editingAppointment.doctor.trim() ||
      !editingAppointment.dateInput ||
      !editingAppointment.timeInput
    ) {
      setEditError('Please fill patient, doctor, date and time.');
      return;
    }

    const updates = {
      patient: editingAppointment.patient.trim(),
      doctor: editingAppointment.doctor.trim(),
      type: editingAppointment.type,
      status: editingAppointment.status,
      date: formatDateToDisplay(editingAppointment.dateInput),
      time: formatTimeToDisplay(editingAppointment.timeInput),
    };

    setAppointments((prev) =>
      prev.map((a) => (a.id === editingAppointment.id ? { ...a, ...updates } : a))
    );
    if (selectedAppointment?.id === editingAppointment.id) {
      setSelectedAppointment((prev) => (prev ? { ...prev, ...updates } : prev));
    }
    setEditingAppointment(null);
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
            <span className="search-ico">&#128269;</span>
            <input
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost">&#128197; Today</button>
          <button className="btn btn-primary" onClick={() => setShow(true)}>
            &#10133; Book Appointment
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
                  <span className={`status-badge ${getStatusTone('appointment', a.status)}`}>
                    {getStatusLabel('appointment', a.status)}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="action-btn action-view"
                      title="View"
                      onClick={() => setSelectedAppointment(a)}
                    >
                      <span aria-hidden="true">&#128065;</span>
                      View
                    </button>
                    <button
                      className="action-btn action-edit"
                      title="Edit"
                      onClick={() => {
                        setEditError('');
                        setEditingAppointment({
                          ...a,
                          dateInput: toDateInputValue(a.date),
                          timeInput: toTimeInputValue(a.time),
                        });
                      }}
                    >
                      <span aria-hidden="true">&#9999;</span>
                      Edit
                    </button>
                    <button
                      className="action-btn action-delete"
                      title="Cancel"
                      onClick={() => handleCancelAppointment(a.id)}
                      disabled={a.status === 'cancelled'}
                    >
                      <span aria-hidden="true">&#10006;</span>
                      {a.status === 'cancelled' ? 'Cancelled' : 'Cancel'}
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

      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Appointment Details</span>
              <button className="modal-close-btn" onClick={() => setSelectedAppointment(null)}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Patient</label>
                  <input className="form-input" value={selectedAppointment.patient} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Doctor</label>
                  <input className="form-input" value={selectedAppointment.doctor} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <input className="form-input" value={selectedAppointment.type} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <input className="form-input" value={selectedAppointment.status} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" value={selectedAppointment.date} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input className="form-input" value={selectedAppointment.time} readOnly />
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-primary" onClick={() => setSelectedAppointment(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingAppointment && (
        <div className="modal-overlay" onClick={() => setEditingAppointment(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Edit Appointment</span>
              <button className="modal-close-btn" onClick={() => setEditingAppointment(null)}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Patient</label>
                <input
                  className="form-input"
                  value={editingAppointment.patient}
                  onChange={(e) =>
                    setEditingAppointment((prev) => ({ ...prev, patient: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Doctor</label>
                <input
                  className="form-input"
                  value={editingAppointment.doctor}
                  onChange={(e) =>
                    setEditingAppointment((prev) => ({ ...prev, doctor: e.target.value }))
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={editingAppointment.dateInput}
                    onChange={(e) =>
                      setEditingAppointment((prev) => ({ ...prev, dateInput: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    className="form-input"
                    type="time"
                    value={editingAppointment.timeInput}
                    onChange={(e) =>
                      setEditingAppointment((prev) => ({ ...prev, timeInput: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={editingAppointment.type}
                    onChange={(e) =>
                      setEditingAppointment((prev) => ({ ...prev, type: e.target.value }))
                    }
                  >
                    <option>General</option>
                    <option>General Checkup</option>
                    <option>Follow-up</option>
                    <option>Consultation</option>
                    <option>Vaccination</option>
                    <option>Lab Test</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editingAppointment.status}
                    onChange={(e) =>
                      setEditingAppointment((prev) => ({ ...prev, status: e.target.value }))
                    }
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </div>
              {editError && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)' }}>
                  {editError}
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setEditingAppointment(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEditAppointment}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





