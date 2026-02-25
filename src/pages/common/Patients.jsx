import { useMemo, useState } from 'react';
import { addPatient, getPatients, removePatient } from '../../utils/patientStorage';

const NEW_PATIENT_INITIAL = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: 'Male',
  phone: '',
  email: '',
  address: '',
  status: 'Active',
};

function getAgeFromDob(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function formatDateToDisplay(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function Patients() {
  const [patients, setPatients] = useState(() => getPatients());
  const [search, setSearch] = useState('');
  const [showModal, setShow] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newPatient, setNewPatient] = useState(NEW_PATIENT_INITIAL);
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [formError, setFormError] = useState('');

  const filtered = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return patients.filter((p) => {
      const searchMatch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm) ||
        String(p.id).toLowerCase().includes(searchTerm) ||
        String(p.phone || '').toLowerCase().includes(searchTerm) ||
        String(p.email || '').toLowerCase().includes(searchTerm);

      const statusMatch = statusFilter === 'All' || p.status === statusFilter;
      const genderMatch = genderFilter === 'All' || p.gender === genderFilter;

      return searchMatch && statusMatch && genderMatch;
    });
  }, [patients, search, statusFilter, genderFilter]);

  const closeModal = () => {
    setShow(false);
    setNewPatient(NEW_PATIENT_INITIAL);
    setFormError('');
  };

  const handleCreatePatient = () => {
    setFormError('');

    const fullName = `${newPatient.firstName} ${newPatient.lastName}`.trim();
    if (newPatient.firstName.trim().length < 2 || newPatient.lastName.trim().length < 1) {
      setFormError('Please enter a valid first and last name.');
      return;
    }

    if (!newPatient.dob) {
      setFormError('Date of birth is required.');
      return;
    }

    const age = getAgeFromDob(newPatient.dob);
    if (age === null) {
      setFormError('Please enter a valid date of birth.');
      return;
    }

    if (!newPatient.phone.trim()) {
      setFormError('Phone is required.');
      return;
    }

    if (!newPatient.email.includes('@')) {
      setFormError('Please enter a valid email.');
      return;
    }

    const patientRecord = {
      name: fullName,
      avatar: newPatient.gender === 'Female' ? '👩' : newPatient.gender === 'Male' ? '👨' : '🧑',
      age,
      gender: newPatient.gender,
      phone: newPatient.phone.trim(),
      email: newPatient.email.trim().toLowerCase(),
      address: newPatient.address.trim(),
      lastVisit: formatDateToDisplay(new Date()),
      status: newPatient.status,
    };

    const patientId = addPatient(patientRecord);
    setPatients((prev) => [{ ...patientRecord, id: patientId }, ...prev]);
    closeModal();
  };

  const handleDeletePatient = (patientId) => {
    const nextPatients = removePatient(patientId);
    setPatients(nextPatients);
  };

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div>
          <h1 className="page-heading">Patients</h1>
          <p className="page-sub">Manage all patient records</p>
        </div>
        <div className="btn-bar">
          <div className="search-wrap">
            <span className="search-ico">🔍</span>
            <input
              placeholder="Search by name, ID, phone or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost" onClick={() => setShowFilters((prev) => !prev)}>
            🔽 Filter
          </button>
          <button className="btn btn-primary" onClick={() => setShow(true)}>➕ Add Patient</button>
        </div>
      </div>
      {showFilters && (
        <div className="patient-filters-panel">
          <div className="patient-filter-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="patient-filter-group">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              aria-label="Filter by gender"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setStatusFilter('All');
              setGenderFilter('All');
            }}
          >
            Clear
          </button>
        </div>
      )}

      <div className="table-wrap">
        <table className="generic-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>ID</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Last Visit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-mid)', padding: '20px 18px' }}>
                  No patients found for current filters.
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="patient-cell">
                      <div className="patient-ava" style={{ fontSize: 18 }}>{p.avatar}</div>
                      <span className="patient-name">{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{p.id}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.phone}</td>
                  <td>{p.lastVisit}</td>
                  <td>
                    <span className={`status-badge ${p.status === 'Active' ? 'confirmed' : 'pending'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="icon-action-btn" title="View">👁️</button>
                      <button className="icon-action-btn" title="Edit">✏️</button>
                      <button className="icon-action-btn" title="Delete" onClick={() => handleDeletePatient(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Add New Patient</span>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    placeholder="First name"
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    placeholder="Last name"
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    className="form-input"
                    type="date"
                    value={newPatient.dob}
                    onChange={(e) => setNewPatient((prev) => ({ ...prev, dob: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient((prev) => ({ ...prev, gender: e.target.value }))}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    placeholder="+1 234 567 8900"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="email@example.com"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newPatient.status}
                    onChange={(e) => setNewPatient((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="form-textarea"
                  placeholder="Full address..."
                  value={newPatient.address}
                  onChange={(e) => setNewPatient((prev) => ({ ...prev, address: e.target.value }))}
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
              <button className="btn btn-primary" onClick={handleCreatePatient}>Register Patient</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
