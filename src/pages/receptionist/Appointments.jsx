import { useMemo, useState } from 'react';
import { addPatient, getPatients } from '../../utils/patientStorage';

const APPOINTMENTS_KEY = 'clinicone_appointments';
const DOCTORS_KEY = 'clinicone_doctors';
const TYPES = ['General Checkup', 'Follow-up', 'Consultation', 'Vaccination', 'Lab Test'];
const STATUSES = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];
const SLOTS = Array.from({ length: 16 }, (_, i) => {
  const h = 9 + Math.floor(i / 2);
  const m = i % 2 ? '30' : '00';
  return `${String(h).padStart(2, '0')}:${m}`;
});

const FALLBACK_DOCTORS = [
  { id: 'D001', name: 'Dr. John Carter', status: 'Available' },
  { id: 'D002', name: 'Dr. Emma Green', status: 'Available' },
  { id: 'D003', name: 'Dr. Sophia Miller', status: 'Busy' },
  { id: 'D004', name: 'Dr. Alex Brown', status: 'Available' },
];

const EMPTY_BOOK = { patientId: '', doctorId: '', date: '', time: '', type: TYPES[0], notes: '' };
const EMPTY_NEW_PATIENT = {
  firstName: '', lastName: '', dob: '', gender: 'Male', phone: '', email: '', address: '',
};

const isoToday = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
const fmtTime = (t) => {
  const [hRaw, mRaw] = t.split(':');
  const h = Number(hRaw); const m = Number(mRaw); const period = h >= 12 ? 'PM' : 'AM';
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
};
const ageFromDob = (dob) => {
  const b = new Date(dob); if (Number.isNaN(b.getTime())) return null;
  const n = new Date(); let a = n.getFullYear() - b.getFullYear();
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a -= 1;
  return a >= 0 ? a : null;
};
const badgeClass = (s) => (s === 'Completed' ? 'confirmed' : s === 'Cancelled' ? 'cancelled' : 'pending');
const blocking = (s) => s !== 'Cancelled';

function loadDoctors() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DOCTORS_KEY) || 'null');
    if (!Array.isArray(parsed) || !parsed.length) return FALLBACK_DOCTORS;
    return parsed.map((d) => ({ id: d.id, name: d.name, status: d.status || 'Available' }));
  } catch { return FALLBACK_DOCTORS; }
}

function seedAppointments(patients, doctors) {
  const p = patients.map((x) => x.id); const d = doctors.map((x) => x.id);
  const today = isoToday(); const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  return [
    { id: 'A001', patientId: p[0] || 'P001', doctorId: d[0] || 'D001', date: today, time: '10:00', type: TYPES[0], notes: '', status: 'Scheduled' },
    { id: 'A002', patientId: p[1] || 'P002', doctorId: d[1] || 'D002', date: today, time: '11:30', type: TYPES[1], notes: '', status: 'Scheduled' },
    { id: 'A003', patientId: p[2] || 'P003', doctorId: d[2] || 'D003', date: tomorrow.toISOString().slice(0, 10), time: '13:00', type: TYPES[2], notes: '', status: 'Scheduled' },
  ];
}

function loadAppointments(patients, doctors) {
  try {
    const parsed = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || 'null');
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {}
  const seed = seedAppointments(patients, doctors);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(seed));
  return seed;
}

const nextId = (items) => `A${String(items.reduce((m, x) => Math.max(m, Number(String(x.id).replace(/\D/g, '')) || 0), 0) + 1).padStart(3, '0')}`;

function hasConflict(appointments, draft, ignoreId = null) {
  return appointments.some((a) => {
    if (ignoreId && a.id === ignoreId) return false;
    if (!blocking(a.status)) return false;
    const sameDoctor = a.doctorId === draft.doctorId && a.date === draft.date && a.time === draft.time;
    const samePatient = a.patientId === draft.patientId && a.date === draft.date && a.time === draft.time;
    return sameDoctor || samePatient;
  });
}

export default function Appointments() {
  const startPatients = getPatients();
  const startDoctors = loadDoctors();
  const [patients, setPatients] = useState(startPatients);
  const [doctors] = useState(startDoctors);
  const [appointments, setAppointments] = useState(() => loadAppointments(startPatients, startDoctors));
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [showBook, setShowBook] = useState(false);
  const [bookMode, setBookMode] = useState('existing');
  const [book, setBook] = useState(EMPTY_BOOK);
  const [newPatient, setNewPatient] = useState(EMPTY_NEW_PATIENT);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [bookError, setBookError] = useState('');
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState('');

  const patientById = useMemo(() => Object.fromEntries(patients.map((p) => [p.id, p])), [patients]);
  const doctorById = useMemo(() => Object.fromEntries(doctors.map((d) => [d.id, d])), [doctors]);
  const saveAppointments = (next) => { setAppointments(next); localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(next)); };

  const rows = useMemo(() => appointments.map((a) => ({
    ...a,
    patient: patientById[a.patientId]?.name || 'Unknown',
    avatar: patientById[a.patientId]?.avatar || '🧑',
    phone: patientById[a.patientId]?.phone || '-',
    doctor: doctorById[a.doctorId]?.name || 'Unknown',
    doctorStatus: doctorById[a.doctorId]?.status || 'Unavailable',
  })), [appointments, patientById, doctorById]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim(); const today = isoToday();
    return rows.filter((r) => {
      const textOk = !term || r.patient.toLowerCase().includes(term) || r.doctor.toLowerCase().includes(term) || r.id.toLowerCase().includes(term) || String(r.phone).toLowerCase().includes(term);
      if (!textOk) return false;
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (doctorFilter !== 'All' && r.doctorId !== doctorFilter) return false;
      if (dateFilter === 'today') return r.date === today;
      if (dateFilter === 'upcoming') return r.date > today;
      if (dateFilter === 'past') return r.date < today;
      return true;
    });
  }, [rows, search, statusFilter, doctorFilter, dateFilter]);

  const doctorOptions = useMemo(() => showUnavailable ? doctors : doctors.filter((d) => d.status === 'Available'), [doctors, showUnavailable]);
  const blockedSlots = useMemo(() => new Set(appointments.filter((a) => a.doctorId === book.doctorId && a.date === book.date && blocking(a.status)).map((a) => a.time)), [appointments, book.doctorId, book.date]);

  const addInlinePatient = () => {
    setBookError('');
    const name = `${newPatient.firstName} ${newPatient.lastName}`.trim();
    const age = ageFromDob(newPatient.dob);
    if (newPatient.firstName.trim().length < 2 || newPatient.lastName.trim().length < 1) return setBookError('Enter valid patient first/last name.');
    if (age === null) return setBookError('Enter valid DOB for new patient.');
    if (!newPatient.phone.trim()) return setBookError('Phone is required for new patient.');
    if (!newPatient.email.includes('@')) return setBookError('Enter valid email for new patient.');
    const record = { name, avatar: newPatient.gender === 'Female' ? '👩' : newPatient.gender === 'Male' ? '👨' : '🧑', age, gender: newPatient.gender, phone: newPatient.phone.trim(), email: newPatient.email.trim().toLowerCase(), address: newPatient.address.trim(), lastVisit: fmtDate(isoToday()), status: 'Active' };
    const id = addPatient(record); setPatients((prev) => [{ ...record, id }, ...prev]); setBook((prev) => ({ ...prev, patientId: id })); setBookMode('existing'); setNewPatient(EMPTY_NEW_PATIENT);
  };

  const bookAppointment = () => {
    setBookError('');
    if (!book.patientId || !book.doctorId || !book.date || !book.time) return setBookError('Patient, doctor, date and slot are required.');
    const doctor = doctorById[book.doctorId];
    if (!doctor) return setBookError('Selected doctor is not valid.');
    if (doctor.status !== 'Available') return setBookError(`Cannot book with ${doctor.name} (${doctor.status}).`);
    const draft = { ...book, notes: book.notes.trim(), status: 'Scheduled' };
    if (hasConflict(appointments, draft)) return setBookError('Slot conflict detected for patient/doctor.');
    saveAppointments([{ id: nextId(appointments), ...draft }, ...appointments]);
    setShowBook(false); setBook(EMPTY_BOOK); setBookMode('existing'); setBookError('');
  };

  const quickStatus = (id, status) => saveAppointments(appointments.map((a) => a.id === id ? { ...a, status } : a));
  const openEdit = (a) => { setEditItem(a); setEditForm({ patientId: a.patientId, doctorId: a.doctorId, date: a.date, time: a.time, type: a.type, notes: a.notes || '', status: a.status }); setEditError(''); };
  const saveEdit = () => {
    if (!editItem || !editForm) return;
    if (!editForm.patientId || !editForm.doctorId || !editForm.date || !editForm.time) return setEditError('Patient, doctor, date and slot are required.');
    const doctor = doctorById[editForm.doctorId];
    if (!doctor) return setEditError('Selected doctor is not valid.');
    if (doctor.status !== 'Available' && editForm.status === 'Scheduled') return setEditError(`Doctor ${doctor.name} is ${doctor.status}.`);
    if (hasConflict(appointments, editForm, editItem.id)) return setEditError('Slot conflict detected for patient/doctor.');
    saveAppointments(appointments.map((a) => a.id === editItem.id ? { ...a, ...editForm, notes: editForm.notes.trim() } : a));
    setEditItem(null); setEditForm(null); setEditError('');
  };

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div><h1 className="page-heading">Appointments</h1><p className="page-sub">Book, reschedule and manage visits</p></div>
        <div className="btn-bar">
          <div className="search-wrap"><span className="search-ico">🔍</span><input placeholder="Search by patient, doctor, ID or phone..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={() => setShowBook(true)}>➕ Book Appointment</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {['all', 'today', 'upcoming', 'past'].map((k) => <button key={k} className={`btn ${dateFilter === k ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setDateFilter(k)}>{k[0].toUpperCase() + k.slice(1)}</button>)}
        <select className="form-select" style={{ maxWidth: 170 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="All">All Statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="form-select" style={{ maxWidth: 220 }} value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}><option value="All">All Doctors</option>{doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
      </div>

      <div className="table-wrap">
        <table className="generic-table">
          <thead><tr><th>Patient</th><th>Doctor</th><th>Type</th><th>Date</th><th>Time</th><th>Status</th><th>Contact</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-mid)' }}>No appointments found.</td></tr> : filtered.map((a) => (
              <tr key={a.id}>
                <td><div className="patient-cell"><div className="patient-ava" style={{ fontSize: 17 }}>{a.avatar}</div><span className="patient-name">{a.patient}</span></div></td>
                <td>{a.doctor}</td><td>{a.type}</td><td>{fmtDate(a.date)}</td><td style={{ fontWeight: 600 }}>{fmtTime(a.time)}</td>
                <td><span className={`status-badge ${badgeClass(a.status)}`}>{a.status}</span></td><td>{a.phone}</td>
                <td><div className="table-actions">
                  <button className="action-btn action-view" onClick={() => setViewItem(a)}><span aria-hidden="true">👁</span>View</button>
                  <button className="action-btn action-edit" onClick={() => openEdit(a)}><span aria-hidden="true">✏</span>Reschedule</button>
                  <button className="action-btn action-delete" onClick={() => quickStatus(a.id, 'Cancelled')} disabled={a.status === 'Cancelled'}><span aria-hidden="true">✖</span>Cancel</button>
                  {a.status === 'Scheduled' && <button className="action-btn action-neutral" onClick={() => quickStatus(a.id, 'Completed')}><span aria-hidden="true">✓</span>Complete</button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showBook && (
        <div className="modal-overlay" onClick={() => setShowBook(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head"><span className="modal-title">Book Appointment</span><button className="modal-close-btn" onClick={() => setShowBook(false)}>×</button></div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><button className={`btn ${bookMode === 'existing' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setBookMode('existing')}>Existing Patient</button><button className={`btn ${bookMode === 'new' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setBookMode('new')}>+ New Patient</button></div>
              {bookMode === 'existing' ? <div className="form-group"><label className="form-label">Patient</label><select className="form-select" value={book.patientId} onChange={(e) => setBook((p) => ({ ...p, patientId: e.target.value }))}><option value="">Select patient</option>{patients.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}</select></div> : <>
                <div className="form-row"><div className="form-group"><label className="form-label">First Name</label><input className="form-input" value={newPatient.firstName} onChange={(e) => setNewPatient((p) => ({ ...p, firstName: e.target.value }))} /></div><div className="form-group"><label className="form-label">Last Name</label><input className="form-input" value={newPatient.lastName} onChange={(e) => setNewPatient((p) => ({ ...p, lastName: e.target.value }))} /></div></div>
                <div className="form-row"><div className="form-group"><label className="form-label">DOB</label><input className="form-input" type="date" value={newPatient.dob} onChange={(e) => setNewPatient((p) => ({ ...p, dob: e.target.value }))} /></div><div className="form-group"><label className="form-label">Gender</label><select className="form-select" value={newPatient.gender} onChange={(e) => setNewPatient((p) => ({ ...p, gender: e.target.value }))}><option>Male</option><option>Female</option><option>Other</option></select></div></div>
                <div className="form-row"><div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={newPatient.phone} onChange={(e) => setNewPatient((p) => ({ ...p, phone: e.target.value }))} /></div><div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={newPatient.email} onChange={(e) => setNewPatient((p) => ({ ...p, email: e.target.value }))} /></div></div>
                <div className="form-group"><label className="form-label">Address</label><textarea className="form-textarea" value={newPatient.address} onChange={(e) => setNewPatient((p) => ({ ...p, address: e.target.value }))} /></div>
                <button className="btn btn-ghost" onClick={addInlinePatient}>Save New Patient and Use in Booking</button>
              </>}
              <div className="form-group"><label className="form-label">Doctor</label><label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6 }}><input type="checkbox" checked={showUnavailable} onChange={(e) => setShowUnavailable(e.target.checked)} />Show unavailable doctors</label><select className="form-select" value={book.doctorId} onChange={(e) => setBook((p) => ({ ...p, doctorId: e.target.value }))}><option value="">Select doctor</option>{doctorOptions.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.status})</option>)}</select></div>
              <div className="form-row"><div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" min={isoToday()} value={book.date} onChange={(e) => setBook((p) => ({ ...p, date: e.target.value }))} /></div><div className="form-group"><label className="form-label">Slot</label><select className="form-select" value={book.time} onChange={(e) => setBook((p) => ({ ...p, time: e.target.value }))}><option value="">Select slot</option>{SLOTS.map((s) => <option key={s} value={s} disabled={blockedSlots.has(s)}>{fmtTime(s)}{blockedSlots.has(s) ? ' (Booked)' : ''}</option>)}</select></div></div>
              <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={book.type} onChange={(e) => setBook((p) => ({ ...p, type: e.target.value }))}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={book.notes} onChange={(e) => setBook((p) => ({ ...p, notes: e.target.value }))} /></div>
              {bookError && <div style={{ fontSize: 12, color: 'var(--accent-red)' }}>{bookError}</div>}
            </div>
            <div className="modal-foot"><button className="btn btn-ghost" onClick={() => setShowBook(false)}>Cancel</button><button className="btn btn-primary" onClick={bookAppointment}>Book Appointment</button></div>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="modal-overlay" onClick={() => setViewItem(null)}><div className="modal" onClick={(e) => e.stopPropagation()}><div className="modal-head"><span className="modal-title">Appointment Details</span><button className="modal-close-btn" onClick={() => setViewItem(null)}>×</button></div><div className="modal-body">
          <div className="form-row"><div className="form-group"><label className="form-label">ID</label><input className="form-input" value={viewItem.id} readOnly /></div><div className="form-group"><label className="form-label">Status</label><input className="form-input" value={viewItem.status} readOnly /></div></div>
          <div className="form-row"><div className="form-group"><label className="form-label">Patient</label><input className="form-input" value={patientById[viewItem.patientId]?.name || '-'} readOnly /></div><div className="form-group"><label className="form-label">Doctor</label><input className="form-input" value={doctorById[viewItem.doctorId]?.name || '-'} readOnly /></div></div>
          <div className="form-row"><div className="form-group"><label className="form-label">Date</label><input className="form-input" value={fmtDate(viewItem.date)} readOnly /></div><div className="form-group"><label className="form-label">Time</label><input className="form-input" value={fmtTime(viewItem.time)} readOnly /></div></div>
          <div className="form-group"><label className="form-label">Type</label><input className="form-input" value={viewItem.type} readOnly /></div><div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={viewItem.notes || '-'} readOnly /></div>
        </div><div className="modal-foot"><button className="btn btn-primary" onClick={() => setViewItem(null)}>Close</button></div></div></div>
      )}

      {editItem && editForm && (
        <div className="modal-overlay" onClick={() => setEditItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head"><span className="modal-title">Reschedule / Edit</span><button className="modal-close-btn" onClick={() => setEditItem(null)}>×</button></div>
            <div className="modal-body">
              <div className="form-row"><div className="form-group"><label className="form-label">Patient</label><select className="form-select" value={editForm.patientId} onChange={(e) => setEditForm((p) => ({ ...p, patientId: e.target.value }))}>{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div className="form-group"><label className="form-label">Doctor</label><select className="form-select" value={editForm.doctorId} onChange={(e) => setEditForm((p) => ({ ...p, doctorId: e.target.value }))}>{doctors.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.status})</option>)}</select></div></div>
              <div className="form-row"><div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={editForm.date} onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))} /></div><div className="form-group"><label className="form-label">Slot</label><select className="form-select" value={editForm.time} onChange={(e) => setEditForm((p) => ({ ...p, time: e.target.value }))}>{SLOTS.map((s) => <option key={s} value={s}>{fmtTime(s)}</option>)}</select></div></div>
              <div className="form-row"><div className="form-group"><label className="form-label">Type</label><select className="form-select" value={editForm.type} onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div><div className="form-group"><label className="form-label">Status</label><select className="form-select" value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div></div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={editForm.notes} onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))} /></div>
              {editError && <div style={{ fontSize: 12, color: 'var(--accent-red)' }}>{editError}</div>}
            </div>
            <div className="modal-foot"><button className="btn btn-ghost" onClick={() => setEditItem(null)}>Cancel</button><button className="btn btn-primary" onClick={saveEdit}>Save Changes</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
