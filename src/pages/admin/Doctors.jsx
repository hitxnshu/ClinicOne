import { useEffect, useState } from 'react';

const STORAGE_KEY = 'clinicone_doctors';

const INITIAL_DOCTORS = [
  {
    id: 'D001',
    name: 'Dr. John Carter',
    avatar: 'DR',
    spec: 'Cardiology',
    phone: '+1 234 567 8900',
    email: 'j.carter@clinic.com',
    exp: '12 years',
    status: 'Available',
    city: 'New York',
    country: 'USA',
    address: '145 Madison Ave',
    qualification: 'MD, Cardiology',
    license: 'NY-MED-1021',
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
    city: 'Chicago',
    country: 'USA',
    address: '88 River North Rd',
    qualification: 'MD, Pediatrics',
    license: 'IL-MED-2244',
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
    city: 'Austin',
    country: 'USA',
    address: '320 South Congress',
    qualification: 'MD, Dermatology',
    license: 'TX-MED-3487',
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
    city: 'Seattle',
    country: 'USA',
    address: '12 Pine Street',
    qualification: 'MS, Orthopedics',
    license: 'WA-MED-4110',
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
    city: 'Boston',
    country: 'USA',
    address: '640 Beacon St',
    qualification: 'MD, Neurology',
    license: 'MA-MED-5099',
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
    city: 'San Diego',
    country: 'USA',
    address: '77 Harbor Dr',
    qualification: 'MBBS, General Medicine',
    license: 'CA-MED-6120',
  },
];

function loadDoctors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : INITIAL_DOCTORS;
  } catch {
    return INITIAL_DOCTORS;
  }
}

const EMPTY_NEW_DOCTOR = {
  name: '',
  spec: '',
  phone: '',
  email: '',
  exp: '',
  status: 'Available',
  city: '',
  country: '',
  address: '',
  qualification: '',
  license: '',
};

export default function Doctors({ userRole = 'admin' }) {
  const [showModal, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState(loadDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState(EMPTY_NEW_DOCTOR);

  const canManageDoctors = userRole === 'admin';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
  }, [doctors]);

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.spec.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s) =>
    s === 'Available' ? 'confirmed' : s === 'Busy' ? 'pending' : 'cancelled';

  const closeAddDoctorModal = () => {
    setShow(false);
    setNewDoctor(EMPTY_NEW_DOCTOR);
  };

  const getNextDoctorId = () => {
    const maxNumber = doctors.reduce((maxId, doctor) => {
      const idNum = Number.parseInt(String(doctor.id || '').replace(/\D/g, ''), 10);
      return Number.isNaN(idNum) ? maxId : Math.max(maxId, idNum);
    }, 0);
    return `D${String(maxNumber + 1).padStart(3, '0')}`;
  };

  const handleDeleteDoctor = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return;
    const shouldDelete = window.confirm(`Delete ${doctor.name}?`);
    if (!shouldDelete) return;

    setDoctors((prev) => prev.filter((d) => d.id !== doctorId));
    if (selectedDoctor?.id === doctorId) setSelectedDoctor(null);
    if (editingDoctor?.id === doctorId) setEditingDoctor(null);
  };

  const handleSaveEditDoctor = () => {
    if (!editingDoctor) return;
    if (
      !editingDoctor.name.trim() ||
      !editingDoctor.spec.trim() ||
      !editingDoctor.phone.trim() ||
      !editingDoctor.email.trim()
    ) {
      window.alert('Name, specialization, phone and email are required.');
      return;
    }

    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor.id === editingDoctor.id ? { ...doctor, ...editingDoctor } : doctor
      )
    );

    if (selectedDoctor?.id === editingDoctor.id) {
      setSelectedDoctor((prev) => (prev ? { ...prev, ...editingDoctor } : prev));
    }
    setEditingDoctor(null);
  };

  const handleSaveNewDoctor = () => {
    const name = newDoctor.name.trim();
    const spec = newDoctor.spec.trim();
    const phone = newDoctor.phone.trim();
    const email = newDoctor.email.trim().toLowerCase();
    const expValue = newDoctor.exp.trim();
    const status = newDoctor.status;
    const city = newDoctor.city.trim();
    const country = newDoctor.country.trim();
    const address = newDoctor.address.trim();
    const qualification = newDoctor.qualification.trim();
    const license = newDoctor.license.trim();

    if (
      !name ||
      !spec ||
      !phone ||
      !email ||
      !expValue ||
      !city ||
      !country ||
      !address ||
      !qualification ||
      !license
    ) {
      window.alert('Please fill all fields before saving.');
      return;
    }

    const fullName = name.toLowerCase().startsWith('dr.') ? name : `Dr. ${name}`;
    const exp = expValue.toLowerCase().includes('year') ? expValue : `${expValue} years`;

    const doctor = {
      id: getNextDoctorId(),
      name: fullName,
      avatar: 'DR',
      spec,
      phone,
      email,
      exp,
      status,
      city,
      country,
      address,
      qualification,
      license,
    };

    setDoctors((prev) => [doctor, ...prev]);
    closeAddDoctorModal();
  };

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
                className="action-btn action-view"
                onClick={() => setSelectedDoctor(doc)}
              >
                <span aria-hidden="true">👁</span>
                View
              </button>
              {canManageDoctors && (
                <button
                  className="action-btn action-edit"
                  onClick={() => setEditingDoctor({ ...doc })}
                >
                  <span aria-hidden="true">✏</span>
                  Edit
                </button>
              )}
              {canManageDoctors && (
                <button
                  className="action-btn action-delete"
                  onClick={() => handleDeleteDoctor(doc.id)}
                >
                  <span aria-hidden="true">🗑</span>
                  Delete
                </button>
              )}
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
                    value={selectedDoctor.city || '-'}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    className="form-input"
                    value={selectedDoctor.country || '-'}
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
                  value={selectedDoctor.address || '-'}
                  readOnly
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Qualification</label>
                  <input
                    className="form-input"
                    value={selectedDoctor.qualification || '-'}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Medical License</label>
                  <input
                    className="form-input"
                    value={selectedDoctor.license || '-'}
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

      {canManageDoctors && editingDoctor && (
        <div className="modal-overlay" onClick={() => setEditingDoctor(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Edit Doctor</span>
              <button className="modal-close-btn" onClick={() => setEditingDoctor(null)}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    value={editingDoctor.name}
                    onChange={(e) =>
                      setEditingDoctor((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input
                    className="form-input"
                    value={editingDoctor.spec}
                    onChange={(e) =>
                      setEditingDoctor((prev) => ({ ...prev, spec: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    value={editingDoctor.phone}
                    onChange={(e) =>
                      setEditingDoctor((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    value={editingDoctor.email}
                    onChange={(e) =>
                      setEditingDoctor((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Experience</label>
                  <input
                    className="form-input"
                    value={editingDoctor.exp}
                    onChange={(e) =>
                      setEditingDoctor((prev) => ({ ...prev, exp: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editingDoctor.status}
                    onChange={(e) =>
                      setEditingDoctor((prev) => ({ ...prev, status: e.target.value }))
                    }
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    className="form-input"
                    value={editingDoctor.city || ''}
                    onChange={(e) =>
                      setEditingDoctor((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    className="form-input"
                    value={editingDoctor.country || ''}
                    onChange={(e) =>
                      setEditingDoctor((prev) => ({ ...prev, country: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  className="form-input"
                  value={editingDoctor.address || ''}
                  onChange={(e) =>
                    setEditingDoctor((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Qualification</label>
                  <input
                    className="form-input"
                    value={editingDoctor.qualification || ''}
                    onChange={(e) =>
                      setEditingDoctor((prev) => ({ ...prev, qualification: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Medical License</label>
                  <input
                    className="form-input"
                    value={editingDoctor.license || ''}
                    onChange={(e) =>
                      setEditingDoctor((prev) => ({ ...prev, license: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setEditingDoctor(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEditDoctor}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {canManageDoctors && showModal && (
        <div className="modal-overlay" onClick={closeAddDoctorModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Add New Doctor</span>
              <button className="modal-close-btn" onClick={closeAddDoctorModal}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={newDoctor.name}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input
                  className="form-input"
                  value={newDoctor.spec}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({ ...prev, spec: e.target.value }))
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    type="tel"
                    value={newDoctor.phone}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Experience</label>
                  <input
                    className="form-input"
                    value={newDoctor.exp}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({ ...prev, exp: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newDoctor.status}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({ ...prev, status: e.target.value }))
                    }
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    className="form-input"
                    value={newDoctor.city}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    className="form-input"
                    value={newDoctor.country}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({ ...prev, country: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  className="form-input"
                  value={newDoctor.address}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Qualification</label>
                  <input
                    className="form-input"
                    value={newDoctor.qualification}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({ ...prev, qualification: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Medical License</label>
                  <input
                    className="form-input"
                    value={newDoctor.license}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({ ...prev, license: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={closeAddDoctorModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveNewDoctor}>
                Save Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
