import { useState } from 'react';

const INITIAL_RECEPTIONISTS = [
  {
    id: 'R001',
    name: 'Mia Johnson',
    avatar: 'MJ',
    shift: 'Morning',
    phone: '+1 234 567 7701',
    email: 'mia.johnson@clinic.com',
    status: 'Active',
  },
  {
    id: 'R002',
    name: 'Noah Patel',
    avatar: 'NP',
    shift: 'Evening',
    phone: '+1 234 567 7702',
    email: 'noah.patel@clinic.com',
    status: 'Active',
  },
  {
    id: 'R003',
    name: 'Ava Smith',
    avatar: 'AS',
    shift: 'Morning',
    phone: '+1 234 567 7703',
    email: 'ava.smith@clinic.com',
    status: 'On Leave',
  },
  {
    id: 'R004',
    name: 'Liam Chen',
    avatar: 'LC',
    shift: 'Night',
    phone: '+1 234 567 7704',
    email: 'liam.chen@clinic.com',
    status: 'Active',
  },
];

const NEW_RECEPTIONIST_INITIAL = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  shift: 'Morning',
};

function getNextReceptionistId(receptionists) {
  const maxNum = receptionists.reduce((maxId, item) => {
    const idNum = Number.parseInt(String(item.id || '').replace(/\D/g, ''), 10);
    return Number.isNaN(idNum) ? maxId : Math.max(maxId, idNum);
  }, 0);
  return `R${String(maxNum + 1).padStart(3, '0')}`;
}

function getInitials(firstName, lastName) {
  return `${(firstName[0] || '').toUpperCase()}${(lastName[0] || '').toUpperCase()}`;
}

export default function Receptionists() {
  const [receptionists, setReceptionists] = useState(INITIAL_RECEPTIONISTS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newReceptionist, setNewReceptionist] = useState(NEW_RECEPTIONIST_INITIAL);
  const [formError, setFormError] = useState('');

  const filtered = receptionists.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => {
    setShowModal(false);
    setNewReceptionist(NEW_RECEPTIONIST_INITIAL);
    setFormError('');
  };

  const handleSaveReceptionist = () => {
    setFormError('');

    const firstName = newReceptionist.firstName.trim();
    const lastName = newReceptionist.lastName.trim();
    const phone = newReceptionist.phone.trim();
    const email = newReceptionist.email.trim().toLowerCase();

    if (!firstName || !lastName || !phone || !email) {
      setFormError('Please fill all fields.');
      return;
    }

    if (!email.includes('@')) {
      setFormError('Please enter a valid email.');
      return;
    }

    const nextReceptionist = {
      id: getNextReceptionistId(receptionists),
      name: `${firstName} ${lastName}`,
      avatar: getInitials(firstName, lastName),
      shift: newReceptionist.shift,
      phone,
      email,
      status: 'Active',
    };

    setReceptionists((prev) => [nextReceptionist, ...prev]);
    closeModal();
  };

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div>
          <h1 className="page-heading">Manage Receptionist</h1>
          <p className="page-sub">Manage receptionist profiles and shifts</p>
        </div>
        <div className="btn-bar">
          <div className="search-wrap">
            <span className="search-ico" aria-hidden="true">
              &#128269;
            </span>
            <input
              placeholder="Search receptionists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost">Filter</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Receptionist
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="generic-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Shift</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="patient-cell">
                    <div className="patient-ava">{item.avatar}</div>
                    <span className="patient-name">{item.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{item.id}</td>
                <td>{item.shift}</td>
                <td>{item.phone}</td>
                <td>{item.email}</td>
                <td>
                  <span
                    className={`status-badge ${
                      item.status === 'Active' ? 'confirmed' : 'pending'
                    }`}
                  >
                    {item.status}
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
                    <button className="action-btn action-delete" title="Delete">
                      <span aria-hidden="true">🗑</span>
                      Delete
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
              <span className="modal-title">Add New Receptionist</span>
              <button className="modal-close-btn" onClick={closeModal}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    value={newReceptionist.firstName}
                    onChange={(e) =>
                      setNewReceptionist((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    value={newReceptionist.lastName}
                    onChange={(e) =>
                      setNewReceptionist((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    type="tel"
                    value={newReceptionist.phone}
                    onChange={(e) =>
                      setNewReceptionist((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    value={newReceptionist.email}
                    onChange={(e) =>
                      setNewReceptionist((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Shift</label>
                <select
                  className="form-select"
                  value={newReceptionist.shift}
                  onChange={(e) =>
                    setNewReceptionist((prev) => ({ ...prev, shift: e.target.value }))
                  }
                >
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
              {formError && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)' }}>
                  {formError}
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveReceptionist}>
                Save Receptionist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
