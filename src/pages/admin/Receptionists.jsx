import { useEffect, useState } from 'react';

const STORAGE_KEY = 'clinicone_receptionists';

const INITIAL_RECEPTIONISTS = [
  {
    id: 'R001',
    name: 'Sanya Gupta',
    avatar: 'SG',
    shift: 'Morning',
    phone: '+91 98760 22001',
    email: 'sanya.gupta@clinic.com',
    status: 'Active',
  },
  {
    id: 'R002',
    name: 'Rohit Patel',
    avatar: 'RP',
    shift: 'Evening',
    phone: '+91 98760 22002',
    email: 'noah.patel@clinic.com',
    status: 'Active',
  },
  {
    id: 'R003',
    name: 'Aisha Khan',
    avatar: 'AK',
    shift: 'Morning',
    phone: '+91 98760 22003',
    email: 'aisha.khan@clinic.com',
    status: 'On Leave',
  },
  {
    id: 'R004',
    name: 'Karan Mehra',
    avatar: 'KM',
    shift: 'Night',
    phone: '+91 98760 22004',
    email: 'karan.mehra@clinic.com',
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

function getInitialsFromName(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0] || '';
  const last = parts[1] || '';
  return getInitials(first, last || first);
}
function loadReceptionists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_RECEPTIONISTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : INITIAL_RECEPTIONISTS;
  } catch {
    return INITIAL_RECEPTIONISTS;
  }
}

export default function Receptionists() {
  const [receptionists, setReceptionists] = useState(loadReceptionists);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newReceptionist, setNewReceptionist] = useState(NEW_RECEPTIONIST_INITIAL);
  const [formError, setFormError] = useState('');
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [editingReceptionist, setEditingReceptionist] = useState(null);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receptionists));
  }, [receptionists]);

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

  const handleDeleteReceptionist = (receptionistId) => {
    const selected = receptionists.find((item) => item.id === receptionistId);
    if (!selected) return;

    const shouldDelete = window.confirm(`Delete receptionist ${selected.name}?`);
    if (!shouldDelete) return;

    setReceptionists((prev) => prev.filter((item) => item.id !== receptionistId));
    if (selectedReceptionist?.id === receptionistId) setSelectedReceptionist(null);
    if (editingReceptionist?.id === receptionistId) setEditingReceptionist(null);
  };

  const handleSaveEditReceptionist = () => {
    if (!editingReceptionist) return;
    setEditError('');

    const name = editingReceptionist.name?.trim() || '';
    const phone = editingReceptionist.phone?.trim() || '';
    const email = editingReceptionist.email?.trim().toLowerCase() || '';

    if (name.length < 2 || !phone || !email) {
      setEditError('Please fill all required fields.');
      return;
    }

    if (!email.includes('@')) {
      setEditError('Please enter a valid email.');
      return;
    }

    const updates = {
      name,
      phone,
      email,
      shift: editingReceptionist.shift,
      status: editingReceptionist.status,
      avatar: getInitialsFromName(name),
    };

    setReceptionists((prev) =>
      prev.map((item) => (item.id === editingReceptionist.id ? { ...item, ...updates } : item))
    );
    if (selectedReceptionist?.id === editingReceptionist.id) {
      setSelectedReceptionist((prev) => (prev ? { ...prev, ...updates } : prev));
    }
    setEditingReceptionist(null);
  };

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div>
          <h1 className="page-heading">Receptionist</h1>
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
                    <button
                      className="action-btn action-view"
                      title="View"
                      onClick={() => setSelectedReceptionist(item)}
                    >
                      <span aria-hidden="true">&#128065;</span>
                      View
                    </button>
                    <button
                      className="action-btn action-edit"
                      title="Edit"
                      onClick={() => {
                        setEditError('');
                        setEditingReceptionist({ ...item });
                      }}
                    >
                      <span aria-hidden="true">&#9999;</span>
                      Edit
                    </button>
                    <button
                      className="action-btn action-delete"
                      title="Delete"
                      onClick={() => handleDeleteReceptionist(item.id)}
                    >
                      <span aria-hidden="true">&#128465;</span>
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

      {selectedReceptionist && (
        <div className="modal-overlay" onClick={() => setSelectedReceptionist(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Receptionist Details</span>
              <button className="modal-close-btn" onClick={() => setSelectedReceptionist(null)}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={selectedReceptionist.name} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Receptionist ID</label>
                  <input className="form-input" value={selectedReceptionist.id} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Shift</label>
                  <input className="form-input" value={selectedReceptionist.shift} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <input className="form-input" value={selectedReceptionist.status} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={selectedReceptionist.phone} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" value={selectedReceptionist.email} readOnly />
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-primary" onClick={() => setSelectedReceptionist(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingReceptionist && (
        <div className="modal-overlay" onClick={() => setEditingReceptionist(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Edit Receptionist</span>
              <button className="modal-close-btn" onClick={() => setEditingReceptionist(null)}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={editingReceptionist.name}
                  onChange={(e) =>
                    setEditingReceptionist((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Shift</label>
                  <select
                    className="form-select"
                    value={editingReceptionist.shift}
                    onChange={(e) =>
                      setEditingReceptionist((prev) => ({ ...prev, shift: e.target.value }))
                    }
                  >
                    <option>Morning</option>
                    <option>Evening</option>
                    <option>Night</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editingReceptionist.status}
                    onChange={(e) =>
                      setEditingReceptionist((prev) => ({ ...prev, status: e.target.value }))
                    }
                  >
                    <option>Active</option>
                    <option>On Leave</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    value={editingReceptionist.phone}
                    onChange={(e) =>
                      setEditingReceptionist((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    value={editingReceptionist.email}
                    onChange={(e) =>
                      setEditingReceptionist((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              </div>
              {editError && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)' }}>
                  {editError}
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setEditingReceptionist(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEditReceptionist}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





