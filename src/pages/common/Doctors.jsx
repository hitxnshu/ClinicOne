import { useState } from 'react';

const DOCTORS = [
  {
    id: 'D001',
    name: 'Dr. John Carter',
    avatar: 'DR',
    spec: 'Cardiology',
    phone: '+1 234 567 8900',
    email: 'j.carter@clinic.com',
    exp: '12 years',
    status: 'Available',
  },
  {
    id: 'D002',
    name: 'Dr. Emma Green',
    avatar: 'DR',
    spec: 'Pediatrics',
    phone: '+1 234 567 8901',
    email: 'e.green@clinic.com',
    exp: '8 years',
    status: 'Available',
  },
  {
    id: 'D003',
    name: 'Dr. Sophia Miller',
    avatar: 'DR',
    spec: 'Dermatology',
    phone: '+1 234 567 8902',
    email: 's.miller@clinic.com',
    exp: '15 years',
    status: 'Busy',
  },
  {
    id: 'D004',
    name: 'Dr. Alex Brown',
    avatar: 'DR',
    spec: 'Orthopedics',
    phone: '+1 234 567 8903',
    email: 'a.brown@clinic.com',
    exp: '20 years',
    status: 'Available',
  },
  {
    id: 'D005',
    name: 'Dr. Laura Wilson',
    avatar: 'DR',
    spec: 'Neurology',
    phone: '+1 234 567 8904',
    email: 'l.wilson@clinic.com',
    exp: '10 years',
    status: 'On Leave',
  },
  {
    id: 'D006',
    name: 'Dr. James Lee',
    avatar: 'DR',
    spec: 'General',
    phone: '+1 234 567 8905',
    email: 'j.lee@clinic.com',
    exp: '6 years',
    status: 'Available',
  },
];

const DOCTOR_DETAILS = {
  D001: {
    city: 'New York',
    country: 'USA',
    address: '145 Madison Ave',
    qualification: 'MD, Cardiology',
    license: 'NY-MED-1021',
  },
  D002: {
    city: 'Chicago',
    country: 'USA',
    address: '88 River North Rd',
    qualification: 'MD, Pediatrics',
    license: 'IL-MED-2244',
  },
  D003: {
    city: 'Austin',
    country: 'USA',
    address: '320 South Congress',
    qualification: 'MD, Dermatology',
    license: 'TX-MED-3487',
  },
  D004: {
    city: 'Seattle',
    country: 'USA',
    address: '12 Pine Street',
    qualification: 'MS, Orthopedics',
    license: 'WA-MED-4110',
  },
  D005: {
    city: 'Boston',
    country: 'USA',
    address: '640 Beacon St',
    qualification: 'MD, Neurology',
    license: 'MA-MED-5099',
  },
  D006: {
    city: 'San Diego',
    country: 'USA',
    address: '77 Harbor Dr',
    qualification: 'MBBS, General Medicine',
    license: 'CA-MED-6120',
  },
};

export default function Doctors({ userRole = 'admin' }) {
  const [showModal, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const canManageDoctors = userRole === 'admin';

  const filtered = DOCTORS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.spec.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s) =>
    s === 'Available' ? 'confirmed' : s === 'Busy' ? 'pending' : 'cancelled';

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div>
          <h1 className="page-heading">Doctors</h1>
          <p className="page-sub">
            {canManageDoctors
              ? 'Manage doctor profiles and availability'
              : 'View doctor profiles and availability'}
          </p>
        </div>
        <div className="btn-bar">
          <div className="search-wrap">
            <span className="search-ico" aria-hidden="true">&#128269;</span>
            <input
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost">Filter</button>
          {canManageDoctors && (
            <button className="btn btn-primary" onClick={() => setShow(true)}>
              Add Doctor
            </button>
          )}
        </div>
      </div>

      <div className="doctor-grid">
        {filtered.map((doc) => (
          <div key={doc.id} className="doctor-card">
            <div className="doctor-ava">{doc.avatar}</div>
            <div className="doctor-name">{doc.name}</div>
            <div className="doctor-spec">{doc.spec}</div>
            <span
              className={`status-badge ${statusColor(doc.status)}`}
              style={{ marginBottom: 14 }}
            >
              {doc.status}
            </span>
            <div className="doctor-meta">
              <div>
                <span>{doc.phone}</span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-light)',
                  wordBreak: 'break-all',
                }}
              >
                {doc.email}
              </div>
              <div>
                Experience: <span>{doc.exp}</span>
              </div>
            </div>
            <div className="doctor-btns">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSelectedDoctor(doc)}
              >
                View
              </button>
              {canManageDoctors && <button className="btn btn-primary btn-sm">Edit</button>}
              {canManageDoctors && <button className="btn btn-ghost btn-sm">Delete</button>}
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Doctor Details</span>
              <button className="modal-close-btn" onClick={() => setSelectedDoctor(null)}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={selectedDoctor.name} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input className="form-input" value={selectedDoctor.spec} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    className="form-input"
                    value={DOCTOR_DETAILS[selectedDoctor.id]?.city || '-'}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    className="form-input"
                    value={DOCTOR_DETAILS[selectedDoctor.id]?.country || '-'}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={selectedDoctor.phone} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" value={selectedDoctor.email} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  className="form-input"
                  value={DOCTOR_DETAILS[selectedDoctor.id]?.address || '-'}
                  readOnly
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Qualification</label>
                  <input
                    className="form-input"
                    value={DOCTOR_DETAILS[selectedDoctor.id]?.qualification || '-'}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Medical License</label>
                  <input
                    className="form-input"
                    value={DOCTOR_DETAILS[selectedDoctor.id]?.license || '-'}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-primary" onClick={() => setSelectedDoctor(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {canManageDoctors && showModal && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Add New Doctor</span>
              <button className="modal-close-btn" onClick={() => setShow(false)}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select className="form-select">
                  <option>Cardiology</option>
                  <option>Pediatrics</option>
                  <option>Dermatology</option>
                  <option>Orthopedics</option>
                  <option>Neurology</option>
                  <option>General</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" type="tel" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Experience (years)</label>
                <input className="form-input" type="number" />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShow(false)}>
                Cancel
              </button>
              <button className="btn btn-primary">Save Doctor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
