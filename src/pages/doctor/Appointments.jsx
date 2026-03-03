import { useOutletContext } from 'react-router-dom';

export default function Appointments() {
  const { appointments, updateAppointmentStatus } = useOutletContext();

  const filtered = appointments;

  const markAppointment = (id, status) => {
    updateAppointmentStatus(id, status);
  };

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div>
          <h1 className="page-heading">Appointments</h1>
          <p className="page-sub">Schedule and manage patient visits</p>
        </div>
      </div>

      <div className="apt-table-wrap">
        <table className="apt-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Age</th>
              <th>Date</th>
              <th>Time</th>
              <th>Payment Mode</th>
              <th>Fees</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Mark</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>
                  <div className="patient-cell">
                    <div className="patient-ava" style={{ fontSize: 17 }}>{a.avatar}</div>
                    <span className="patient-name">{a.patient}</span>
                  </div>
                </td>
                <td>{a.age}</td>
                <td>{a.date}</td>
                <td style={{ fontWeight: 600 }}>{a.time}</td>
                <td>{a.paymentMode}</td>
                <td>₹{a.fee.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                <td>
                  <span className={`status-badge ${a.status}`}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div className="doctor-status-actions">
                    <button
                      type="button"
                      className="btn-circle success"
                      title="Mark as completed"
                      onClick={() => markAppointment(a.id, 'completed')}
                      disabled={a.status === 'completed'}
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      className="btn-circle danger"
                      title="Cancel / Reject"
                      onClick={() => markAppointment(a.id, 'cancelled')}
                      disabled={a.status === 'cancelled'}
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
