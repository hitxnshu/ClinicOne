import { useState } from 'react';

const PATIENTS = [
  { id: 'P001', name: 'David Leal',    avatar: '👨',  age: 45, gender: 'Male',   phone: '+1 234 567 8900', lastVisit: '24 Jul 2023', status: 'Active' },
  { id: 'P002', name: 'Jenny Wilson',  avatar: '👩',  age: 32, gender: 'Female', phone: '+1 234 567 8901', lastVisit: '24 Jul 2023', status: 'Active' },
  { id: 'P003', name: 'Shope Rose',    avatar: '👩‍🦰', age: 28, gender: 'Female', phone: '+1 234 567 8902', lastVisit: '20 Jul 2023', status: 'Active' },
  { id: 'P004', name: 'Mark Joe',      avatar: '👦',  age: 52, gender: 'Male',   phone: '+1 234 567 8903', lastVisit: '18 Jul 2023', status: 'Inactive' },
  { id: 'P005', name: 'Emily Davis',   avatar: '👩‍🦱', age: 29, gender: 'Female', phone: '+1 234 567 8904', lastVisit: '15 Jul 2023', status: 'Active' },
  { id: 'P006', name: 'Robert Brown',  avatar: '👴',  age: 61, gender: 'Male',   phone: '+1 234 567 8905', lastVisit: '10 Jul 2023', status: 'Active' },
];

export default function Patients() {
  const [search, setSearch]     = useState('');
  const [showModal, setShow]    = useState(false);

  const filtered = PATIENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

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
              placeholder="Search patients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost">🔽 Filter</button>
          <button className="btn btn-primary" onClick={() => setShow(true)}>➕ Add Patient</button>
        </div>
      </div>

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
            {filtered.map(p => (
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
                    <button className="icon-action-btn" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Add New Patient</span>
              <button className="modal-close-btn" onClick={() => setShow(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" placeholder="First name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" placeholder="Last name" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-input" type="date" />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" placeholder="+1 234 567 8900" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className="form-textarea" placeholder="Full address..."></textarea>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn btn-primary">Save Patient</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
