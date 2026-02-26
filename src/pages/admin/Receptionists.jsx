import { useState } from 'react';

const RECEPTIONISTS = [
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

export default function Receptionists() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = RECEPTIONISTS.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Add New Receptionist</span>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
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
                <label className="form-label">Shift</label>
                <select className="form-select">
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary">Save Receptionist</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
