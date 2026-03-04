import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatients } from '../../utils/patientStorage';

const SAMPLE_HISTORY = {
  P001: {
    appointments: [
      { id: 'A-101', date: '2025-12-12', time: '10:00', doctor: 'Dr. John Carter', reason: 'Check-up', status: 'completed' },
      { id: 'A-119', date: '2026-02-01', time: '11:30', doctor: 'Dr. Emma Green', reason: 'Follow-up', status: 'completed' },
    ],
    prescriptions: [
      { id: 'PR-77', date: '2025-12-12', doctor: 'Dr. John Carter', meds: 'Lisinopril 10mg daily', notes: 'Maintain low-salt diet' },
      { id: 'PR-92', date: '2026-02-01', doctor: 'Dr. Emma Green', meds: 'Vitamin D 2000 IU daily', notes: 'Exercise 30 min/day' },
    ],
    diagnoses: [
      { id: 'DX-31', date: '2025-12-12', doctor: 'Dr. John Carter', name: 'Hypertension Stage 1' },
      { id: 'DX-48', date: '2026-02-01', doctor: 'Dr. Emma Green', name: 'Vitamin D Deficiency' },
    ],
    tests: [
      { id: 'TS-10', date: '2025-12-10', name: 'Blood Panel', result: 'Borderline LDL; others normal' },
      { id: 'TS-22', date: '2026-01-28', name: 'Vitamin D', result: '25 ng/mL (low)' },
    ],
  },
  P002: {
    appointments: [
      { id: 'A-201', date: '2025-10-05', time: '09:30', doctor: 'Dr. Sophia Miller', reason: 'Skin rash', status: 'completed' },
    ],
    prescriptions: [
      { id: 'PR-120', date: '2025-10-05', doctor: 'Dr. Sophia Miller', meds: 'Cetirizine 10mg nightly', notes: 'Use moisturizer' },
    ],
    diagnoses: [
      { id: 'DX-80', date: '2025-10-05', doctor: 'Dr. Sophia Miller', name: 'Allergic dermatitis' },
    ],
    tests: [
      { id: 'TS-51', date: '2025-10-04', name: 'CBC', result: 'Normal' },
    ],
  },
  P003: {
    appointments: [
      { id: 'A-301', date: '2025-09-21', time: '11:00', doctor: 'Dr. Alex Brown', reason: 'Consultation', status: 'completed' },
    ],
    prescriptions: [
      { id: 'PR-210', date: '2025-09-21', doctor: 'Dr. Alex Brown', meds: 'Ibuprofen 400mg TID x5d', notes: 'Physio recommended' },
    ],
    diagnoses: [
      { id: 'DX-120', date: '2025-09-21', doctor: 'Dr. Alex Brown', name: 'Muscle strain' },
    ],
    tests: [
      { id: 'TS-79', date: '2025-09-20', name: 'X-ray', result: 'No fracture' },
    ],
  },
  P004: {
    appointments: [
      { id: 'A-401', date: '2025-08-18', time: '15:00', doctor: 'Dr. John Carter', reason: 'Annual exam', status: 'completed' },
    ],
    prescriptions: [
      { id: 'PR-310', date: '2025-08-18', doctor: 'Dr. John Carter', meds: 'Atorvastatin 20mg daily', notes: 'Diet control' },
    ],
    diagnoses: [
      { id: 'DX-170', date: '2025-08-18', doctor: 'Dr. John Carter', name: 'Hyperlipidemia' },
    ],
    tests: [
      { id: 'TS-101', date: '2025-08-17', name: 'Lipid profile', result: 'LDL high' },
    ],
  },
  P005: {
    appointments: [
      { id: 'A-501', date: '2025-07-15', time: '10:45', doctor: 'Dr. Emma Green', reason: 'Lab test review', status: 'completed' },
    ],
    prescriptions: [
      { id: 'PR-410', date: '2025-07-15', doctor: 'Dr. Emma Green', meds: 'Iron supplement daily', notes: 'Recheck in 3 months' },
    ],
    diagnoses: [
      { id: 'DX-220', date: '2025-07-15', doctor: 'Dr. Emma Green', name: 'Iron deficiency anemia' },
    ],
    tests: [
      { id: 'TS-130', date: '2025-07-10', name: 'Ferritin', result: 'Low' },
    ],
  },
  P006: {
    appointments: [
      { id: 'A-601', date: '2025-06-10', time: '09:00', doctor: 'Dr. Alex Brown', reason: 'BP check', status: 'completed' },
    ],
    prescriptions: [
      { id: 'PR-510', date: '2025-06-10', doctor: 'Dr. Alex Brown', meds: 'Amlodipine 5mg daily', notes: 'Monitor BP' },
    ],
    diagnoses: [
      { id: 'DX-260', date: '2025-06-10', doctor: 'Dr. Alex Brown', name: 'Hypertension' },
    ],
    tests: [
      { id: 'TS-150', date: '2025-06-09', name: 'ECG', result: 'Normal' },
    ],
  },
};

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patients = useMemo(() => getPatients(), []);

  const patient = patients.find((p) => String(p.id) === String(id));
  const STORAGE_KEY = 'clinicone_patient_history';
  const [historyMap, setHistoryMap] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const merged = { ...SAMPLE_HISTORY, ...(parsed || {}) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch {
      return SAMPLE_HISTORY;
    }
  });

  const data = historyMap[id] || { appointments: [], prescriptions: [], diagnoses: [], tests: [] };

  const [showEdit, setShowEdit] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addSection, setAddSection] = useState(null);
  const [addItem, setAddItem] = useState(null);

  const openEdit = (section, item) => {
    setEditSection(section);
    setEditItem({ ...item });
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditSection(null);
    setEditItem(null);
  };

  const saveEdit = () => {
    if (!editSection || !editItem) return;
    const list = data[editSection] || [];
    const nextList = list.map((it) => (it.id === editItem.id ? editItem : it));
    const nextData = { ...data, [editSection]: nextList };
    const nextMap = { ...historyMap, [id]: nextData };
    setHistoryMap(nextMap);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap));
    closeEdit();
  };
  
  const genId = (prefix, list) => {
    const nums = (list || []).map((it) => {
      const n = String(it.id).replace(/\D/g, '');
      return Number.parseInt(n || '0', 10);
    }).filter((n) => Number.isFinite(n));
    const next = nums.length ? Math.max(...nums) + 1 : 1;
    return `${prefix}-${next}`;
  };

  const openAdd = (section) => {
    setAddSection(section);
    if (section === 'appointments') {
      setAddItem({ date: '', time: '', doctor: patient?.name ? 'Dr. John Carter' : '', reason: '', status: 'pending' });
    } else if (section === 'prescriptions') {
      setAddItem({ date: '', doctor: patient?.name ? 'Dr. John Carter' : '', meds: '', notes: '' });
    } else if (section === 'diagnoses') {
      setAddItem({ date: '', doctor: patient?.name ? 'Dr. John Carter' : '', name: '' });
    } else if (section === 'tests') {
      setAddItem({ date: '', name: '', result: '' });
    }
    setShowAdd(true);
  };

  const closeAdd = () => {
    setShowAdd(false);
    setAddSection(null);
    setAddItem(null);
  };

  const saveAdd = () => {
    if (!addSection || !addItem) return;
    const list = data[addSection] || [];
    const idPrefix = addSection === 'appointments' ? 'A' : addSection === 'prescriptions' ? 'PR' : addSection === 'diagnoses' ? 'DX' : 'TS';
    const newId = genId(idPrefix, list);
    const nextList = [{ id: newId, ...addItem }, ...list];

    const nextData = { ...data, [addSection]: nextList };
    const nextMap = { ...historyMap, [id]: nextData };
    setHistoryMap(nextMap);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap));
    closeAdd();
  };

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div>
          <h1 className="page-heading">Patient Medical History</h1>
          <p className="page-sub">Comprehensive record of visits, prescriptions, diagnoses and tests</p>
        </div>
        <div className="btn-bar">
          <button className="btn btn-ghost" onClick={() => navigate('/doctor/patients')}>← Back to Patients</button>
        </div>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar-lg">{patient?.avatar || '👤'}</div>
        <div className="profile-hero-text">
          <div className="profile-name">{patient?.name || `Patient ${id}`}</div>
          <div className="profile-meta-row">
            <span className="profile-exp">ID: {id}</span>
            {patient?.age ? <span className="profile-exp">Age: {patient.age}</span> : null}
            {patient?.gender ? <span className="profile-exp">Gender: {patient.gender}</span> : null}
            {patient?.phone ? <span className="profile-exp">Phone: {patient.phone}</span> : null}
          </div>
          <div className="profile-email">{patient?.email}</div>
        </div>
      </div>

      <div className="settings-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="settings-form">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="settings-section-title">Previous Appointments</h3>
            <button className="btn btn-primary btn-sm" onClick={() => openAdd('appointments')}>➕ Add Appointment</button>
          </div>
          <div className="table-wrap">
            <table className="generic-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Doctor</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-mid)', padding: '12px 10px' }}>
                      No previous appointments
                    </td>
                  </tr>
                ) : (
                  data.appointments.map((a) => (
                    <tr key={a.id}>
                      <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{a.id}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>{a.doctor}</td>
                      <td>{a.reason}</td>
                      <td>
                        <span className={`status-badge ${a.status === 'completed' ? 'confirmed' : 'pending'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn action-edit" onClick={() => openEdit('appointments', a)}>
                            <span aria-hidden="true">✏</span>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
            <h3 className="settings-section-title">Previous Prescriptions</h3>
            <button className="btn btn-primary btn-sm" onClick={() => openAdd('prescriptions')}>➕ Add Prescription</button>
          </div>
          <div className="table-wrap">
            <table className="generic-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Medicines</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.prescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-mid)', padding: '12px 10px' }}>
                      No prescriptions
                    </td>
                  </tr>
                ) : (
                  data.prescriptions.map((r) => (
                    <tr key={r.id}>
                      <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{r.id}</td>
                      <td>{r.date}</td>
                      <td>{r.doctor}</td>
                      <td>{r.meds}</td>
                      <td>{r.notes}</td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn action-edit" onClick={() => openEdit('prescriptions', r)}>
                            <span aria-hidden="true">✏</span>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
            <h3 className="settings-section-title">Diagnosis History</h3>
            <button className="btn btn-primary btn-sm" onClick={() => openAdd('diagnoses')}>➕ Add Diagnosis</button>
          </div>
          <div className="table-wrap">
            <table className="generic-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Diagnosis</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.diagnoses.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-mid)', padding: '12px 10px' }}>
                      No diagnosis records
                    </td>
                  </tr>
                ) : (
                  data.diagnoses.map((d) => (
                    <tr key={d.id}>
                      <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{d.id}</td>
                      <td>{d.date}</td>
                      <td>{d.doctor}</td>
                      <td>{d.name}</td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn action-edit" onClick={() => openEdit('diagnoses', d)}>
                            <span aria-hidden="true">✏</span>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
            <h3 className="settings-section-title">Previous Test Reports</h3>
            <button className="btn btn-primary btn-sm" onClick={() => openAdd('tests')}>➕ Add Test</button>
          </div>
          <div className="table-wrap">
            <table className="generic-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Test</th>
                  <th>Result</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.tests.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-mid)', padding: '12px 10px' }}>
                      No test reports
                    </td>
                  </tr>
                ) : (
                  data.tests.map((t) => (
                    <tr key={t.id}>
                      <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{t.id}</td>
                      <td>{t.date}</td>
                      <td>{t.name}</td>
                      <td>{t.result}</td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn action-edit" onClick={() => openEdit('tests', t)}>
                            <span aria-hidden="true">✏</span>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEdit && editItem && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Edit</span>
              <button className="modal-close-btn" onClick={closeEdit}>×</button>
            </div>
            <div className="modal-body">
              {editSection === 'appointments' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input className="form-input" type="date" value={editItem.date} onChange={(e) => setEditItem((prev) => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time</label>
                      <input className="form-input" type="time" value={editItem.time} onChange={(e) => setEditItem((prev) => ({ ...prev, time: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Doctor</label>
                      <input className="form-input" value={editItem.doctor} onChange={(e) => setEditItem((prev) => ({ ...prev, doctor: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reason</label>
                      <input className="form-input" value={editItem.reason} onChange={(e) => setEditItem((prev) => ({ ...prev, reason: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={editItem.status} onChange={(e) => setEditItem((prev) => ({ ...prev, status: e.target.value }))}>
                      <option>completed</option>
                      <option>pending</option>
                      <option>cancelled</option>
                    </select>
                  </div>
                </>
              )}

              {editSection === 'prescriptions' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input className="form-input" type="date" value={editItem.date} onChange={(e) => setEditItem((prev) => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Doctor</label>
                      <input className="form-input" value={editItem.doctor} onChange={(e) => setEditItem((prev) => ({ ...prev, doctor: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Medicines</label>
                    <textarea className="form-textarea" value={editItem.meds} onChange={(e) => setEditItem((prev) => ({ ...prev, meds: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea className="form-textarea" value={editItem.notes} onChange={(e) => setEditItem((prev) => ({ ...prev, notes: e.target.value }))} />
                  </div>
                </>
              )}

              {editSection === 'diagnoses' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input className="form-input" type="date" value={editItem.date} onChange={(e) => setEditItem((prev) => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Doctor</label>
                      <input className="form-input" value={editItem.doctor} onChange={(e) => setEditItem((prev) => ({ ...prev, doctor: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Diagnosis</label>
                    <input className="form-input" value={editItem.name} onChange={(e) => setEditItem((prev) => ({ ...prev, name: e.target.value }))} />
                  </div>
                </>
              )}

              {editSection === 'tests' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input className="form-input" type="date" value={editItem.date} onChange={(e) => setEditItem((prev) => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Test</label>
                      <input className="form-input" value={editItem.name} onChange={(e) => setEditItem((prev) => ({ ...prev, name: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Result</label>
                    <textarea className="form-textarea" value={editItem.result} onChange={(e) => setEditItem((prev) => ({ ...prev, result: e.target.value }))} />
                  </div>
                </>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={closeEdit}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && addItem && (
        <div className="modal-overlay" onClick={closeAdd}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">
                {addSection === 'appointments' ? 'Add Appointment' :
                 addSection === 'prescriptions' ? 'Add Prescription' :
                 addSection === 'diagnoses' ? 'Add Diagnosis' : 'Add Test'}
              </span>
              <button className="modal-close-btn" onClick={closeAdd}>×</button>
            </div>
            <div className="modal-body">
              {addSection === 'appointments' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input className="form-input" type="date" value={addItem.date} onChange={(e) => setAddItem((prev) => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time</label>
                      <input className="form-input" type="time" value={addItem.time} onChange={(e) => setAddItem((prev) => ({ ...prev, time: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Doctor</label>
                      <input className="form-input" value={addItem.doctor} onChange={(e) => setAddItem((prev) => ({ ...prev, doctor: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reason</label>
                      <input className="form-input" value={addItem.reason} onChange={(e) => setAddItem((prev) => ({ ...prev, reason: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={addItem.status} onChange={(e) => setAddItem((prev) => ({ ...prev, status: e.target.value }))}>
                      <option>pending</option>
                      <option>completed</option>
                      <option>cancelled</option>
                    </select>
                  </div>
                </>
              )}

              {addSection === 'prescriptions' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input className="form-input" type="date" value={addItem.date} onChange={(e) => setAddItem((prev) => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Doctor</label>
                      <input className="form-input" value={addItem.doctor} onChange={(e) => setAddItem((prev) => ({ ...prev, doctor: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Medicines</label>
                    <textarea className="form-textarea" value={addItem.meds} onChange={(e) => setAddItem((prev) => ({ ...prev, meds: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea className="form-textarea" value={addItem.notes} onChange={(e) => setAddItem((prev) => ({ ...prev, notes: e.target.value }))} />
                  </div>
                </>
              )}

              {addSection === 'diagnoses' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input className="form-input" type="date" value={addItem.date} onChange={(e) => setAddItem((prev) => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Doctor</label>
                      <input className="form-input" value={addItem.doctor} onChange={(e) => setAddItem((prev) => ({ ...prev, doctor: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Diagnosis</label>
                    <input className="form-input" value={addItem.name} onChange={(e) => setAddItem((prev) => ({ ...prev, name: e.target.value }))} />
                  </div>
                </>
              )}

              {addSection === 'tests' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input className="form-input" type="date" value={addItem.date} onChange={(e) => setAddItem((prev) => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Test</label>
                      <input className="form-input" value={addItem.name} onChange={(e) => setAddItem((prev) => ({ ...prev, name: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Result</label>
                    <textarea className="form-textarea" value={addItem.result} onChange={(e) => setAddItem((prev) => ({ ...prev, result: e.target.value }))} />
                  </div>
                </>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={closeAdd}>Cancel</button>
              <button className="btn btn-primary" onClick={saveAdd}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
