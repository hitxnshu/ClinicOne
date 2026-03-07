import { useEffect, useState } from 'react';
import { getStatusTone } from '../../utils/statusSystem';

const STORAGE_KEY = 'clinicone_doctors';

const INITIAL_DOCTORS = [
  {
    id: 'D001',
    name: 'Dr. Ananya Rao',
    avatar: 'DR',
    spec: 'Cardiology',
    phone: '+91 98765 43210',
    email: 'ananya.rao@clinic.com',
    exp: '12 years',
    status: 'Available',
    city: 'Mumbai',
    country: 'India',
    address: '145 Marine Drive',
    qualification: 'MD, Cardiology',
    license: 'MH-MCI-1021',
  },
  {
    id: 'D002',
    name: 'Dr. Vikram Singh',
    avatar: 'DR',
    spec: 'Pediatrics',
    phone: '+91 98765 43211',
    email: 'vikram.singh@clinic.com',
    exp: '8 years',
    status: 'Available',
    city: 'Delhi',
    country: 'India',
    address: '88 Connaught Place',
    qualification: 'MD, Pediatrics',
    license: 'DL-MCI-2244',
  },
  {
    id: 'D003',
    name: 'Dr. Neha Kapoor',
    avatar: 'DR',
    spec: 'Dermatology',
    phone: '+91 98765 43212',
    email: 'neha.kapoor@clinic.com',
    exp: '15 years',
    status: 'Busy',
    city: 'Bengaluru',
    country: 'India',
    address: '320 MG Road',
    qualification: 'MD, Dermatology',
    license: 'KA-MCI-3487',
  },
  {
    id: 'D004',
    name: 'Dr. Arjun Malhotra',
    avatar: 'DR',
    spec: 'Orthopedics',
    phone: '+91 98765 43213',
    email: 'arjun.malhotra@clinic.com',
    exp: '20 years',
    status: 'Available',
    city: 'Pune',
    country: 'India',
    address: '12 FC Road',
    qualification: 'MS, Orthopedics',
    license: 'MH-MCI-4110',
  },
  {
    id: 'D005',
    name: 'Dr. Priyanka Nair',
    avatar: 'DR',
    spec: 'Neurology',
    phone: '+91 98765 43214',
    email: 'priyanka.nair@clinic.com',
    exp: '10 years',
    status: 'On Leave',
    city: 'Kochi',
    country: 'India',
    address: '640 MG Road',
    qualification: 'MD, Neurology',
    license: 'KL-MCI-5099',
  },
  {
    id: 'D006',
    name: 'Dr. Rahul Mehta',
    avatar: 'DR',
    spec: 'General',
    phone: '+91 98765 43215',
    email: 'rahul.mehta@clinic.com',
    exp: '6 years',
    status: 'Available',
    city: 'Ahmedabad',
    country: 'India',
    address: '77 SG Highway',
    qualification: 'MBBS, General Medicine',
    license: 'GJ-MCI-6120',
  },
];

const LEGACY_DOCTOR_MIGRATIONS = {
  'Dr. John Carter': {
    name: 'Dr. Ananya Rao',
    phone: '+91 98765 43210',
    email: 'ananya.rao@clinic.com',
    city: 'Mumbai',
    country: 'India',
    address: '145 Marine Drive',
    license: 'MH-MCI-1021',
  },
  'Dr. Emma Green': {
    name: 'Dr. Vikram Singh',
    phone: '+91 98765 43211',
    email: 'vikram.singh@clinic.com',
    city: 'Delhi',
    country: 'India',
    address: '88 Connaught Place',
    license: 'DL-MCI-2244',
  },
  'Dr. Sophia Miller': {
    name: 'Dr. Neha Kapoor',
    phone: '+91 98765 43212',
    email: 'neha.kapoor@clinic.com',
    city: 'Bengaluru',
    country: 'India',
    address: '320 MG Road',
    license: 'KA-MCI-3487',
  },
  'Dr. Alex Brown': {
    name: 'Dr. Arjun Malhotra',
    phone: '+91 98765 43213',
    email: 'arjun.malhotra@clinic.com',
    city: 'Pune',
    country: 'India',
    address: '12 FC Road',
    license: 'MH-MCI-4110',
  },
  'Dr. Laura Wilson': {
    name: 'Dr. Priyanka Nair',
    phone: '+91 98765 43214',
    email: 'priyanka.nair@clinic.com',
    city: 'Kochi',
    country: 'India',
    address: '640 MG Road',
    license: 'KL-MCI-5099',
  },
  'Dr. James Lee': {
    name: 'Dr. Rahul Mehta',
    phone: '+91 98765 43215',
    email: 'rahul.mehta@clinic.com',
    city: 'Ahmedabad',
    country: 'India',
    address: '77 SG Highway',
    license: 'GJ-MCI-6120',
  },
};

function migrateLegacyDoctors(doctors) {
  let didMigrate = false;
  const migrated = doctors.map((doctor) => {
    const updates = LEGACY_DOCTOR_MIGRATIONS[doctor?.name];
    if (!updates) return doctor;
    didMigrate = true;
    return { ...doctor, ...updates };
  });
  return { migrated, didMigrate };
}

function loadDoctors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(parsed) || !parsed.length) return INITIAL_DOCTORS;
    const { migrated, didMigrate } = migrateLegacyDoctors(parsed);
    if (didMigrate) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }
    return migrated;
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
              className={`status-badge ${getStatusTone('doctor', doc.status)}`}
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
