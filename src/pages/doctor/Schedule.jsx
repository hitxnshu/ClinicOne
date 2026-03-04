import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'clinicone_doctor_schedule';

const DEFAULT_SCHEDULE = {
  weeklyAvailability: {
    Monday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
    Tuesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
    Wednesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
    Thursday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
    Friday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
    Saturday: [{ start: '10:00', end: '13:00' }],
    Sunday: [],
  },
  blockedDates: [
    { date: '2026-03-10', reason: 'Conference' },
  ],
  leaves: [
    { start: '2026-03-20', end: '2026-03-22', reason: 'Annual leave' },
  ],
};

function loadSchedule() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SCHEDULE));
      return DEFAULT_SCHEDULE;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SCHEDULE));
      return DEFAULT_SCHEDULE;
    }
    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SCHEDULE));
    return DEFAULT_SCHEDULE;
  }
}

function saveSchedule(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export default function Schedule() {
  const [schedule, setSchedule] = useState(() => loadSchedule());
  const [newSlot, setNewSlot] = useState({ day: 'Monday', start: '09:00', end: '10:00' });
  const [blockDate, setBlockDate] = useState({ date: '', reason: '' });
  const [leave, setLeave] = useState({ start: '', end: '', reason: '' });
  const days = useMemo(
    () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    [],
  );

  useEffect(() => {
    saveSchedule(schedule);
  }, [schedule]);

  const addSlot = () => {
    if (!newSlot.day || !newSlot.start || !newSlot.end) return;
    const next = { ...schedule };
    const list = next.weeklyAvailability[newSlot.day] || [];
    next.weeklyAvailability[newSlot.day] = [...list, { start: newSlot.start, end: newSlot.end }];
    setSchedule(next);
    setNewSlot({ day: newSlot.day, start: '09:00', end: '10:00' });
  };

  const removeSlot = (day, idx) => {
    const next = { ...schedule };
    next.weeklyAvailability[day] = next.weeklyAvailability[day].filter((_, i) => i !== idx);
    setSchedule(next);
  };

  const addBlockedDate = () => {
    if (!blockDate.date) return;
    const next = { ...schedule };
    next.blockedDates = [{ date: blockDate.date, reason: blockDate.reason || 'Blocked' }, ...(next.blockedDates || [])];
    setSchedule(next);
    setBlockDate({ date: '', reason: '' });
  };

  const removeBlockedDate = (idx) => {
    const next = { ...schedule };
    next.blockedDates = (next.blockedDates || []).filter((_, i) => i !== idx);
    setSchedule(next);
  };

  const addLeave = () => {
    if (!leave.start || !leave.end) return;
    const next = { ...schedule };
    next.leaves = [{ start: leave.start, end: leave.end, reason: leave.reason || 'Leave' }, ...(next.leaves || [])];
    setSchedule(next);
    setLeave({ start: '', end: '', reason: '' });
  };

  const removeLeave = (idx) => {
    const next = { ...schedule };
    next.leaves = (next.leaves || []).filter((_, i) => i !== idx);
    setSchedule(next);
  };

  return (
    <div className="page-wrap">
      <div className="top-bar">
        <div>
          <h1 className="page-heading">Schedule Management</h1>
          <p className="page-sub">Set available slots, block dates, and mark leave</p>
        </div>
      </div>

      <div className="settings-grid" style={{ gridTemplateColumns: '300px 1fr' }}>
        <div className="settings-nav">
          <div className="settings-section-title">Quick Actions</div>
          <div className="form-group">
            <label className="form-label">Day</label>
            <select
              className="form-select"
              value={newSlot.day}
              onChange={(e) => setNewSlot((prev) => ({ ...prev, day: e.target.value }))}
            >
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start</label>
              <input
                className="form-input"
                type="time"
                value={newSlot.start}
                onChange={(e) => setNewSlot((prev) => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End</label>
              <input
                className="form-input"
                type="time"
                value={newSlot.end}
                onChange={(e) => setNewSlot((prev) => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
          <button className="btn btn-primary" onClick={addSlot}>Add Slot</button>

          <div className="settings-section-title" style={{ marginTop: 18 }}>Block Date</div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={blockDate.date}
              onChange={(e) => setBlockDate((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <input
              className="form-input"
              placeholder="Optional"
              value={blockDate.reason}
              onChange={(e) => setBlockDate((prev) => ({ ...prev, reason: e.target.value }))}
            />
          </div>
          <button className="btn btn-primary" onClick={addBlockedDate}>Block</button>

          <div className="settings-section-title" style={{ marginTop: 18 }}>Mark Leave</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start</label>
              <input
                className="form-input"
                type="date"
                value={leave.start}
                onChange={(e) => setLeave((prev) => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End</label>
              <input
                className="form-input"
                type="date"
                value={leave.end}
                onChange={(e) => setLeave((prev) => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <input
              className="form-input"
              placeholder="Optional"
              value={leave.reason}
              onChange={(e) => setLeave((prev) => ({ ...prev, reason: e.target.value }))}
            />
          </div>
          <button className="btn btn-primary" onClick={addLeave}>Add Leave</button>
        </div>

        <div className="settings-form">
          <h3 className="settings-section-title">Weekly Availability</h3>
          {days.map((day) => (
            <div key={day} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ minWidth: 120, fontWeight: 700 }}>{day}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(schedule.weeklyAvailability[day] || []).length === 0 ? (
                    <span style={{ color: 'var(--text-light)' }}>No slots</span>
                  ) : (
                    (schedule.weeklyAvailability[day] || []).map((s, idx) => (
                      <span
                        key={idx}
                        className="status-badge confirmed"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                      >
                        {s.start}–{s.end}
                        <button
                          className="action-btn action-delete"
                          title="Remove"
                          onClick={() => removeSlot(day, idx)}
                          style={{ padding: '2px 6px' }}
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}

          <h3 className="settings-section-title" style={{ marginTop: 18 }}>Blocked Dates</h3>
          <div className="table-wrap">
            <table className="generic-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(schedule.blockedDates || []).length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-mid)', padding: '14px 10px' }}>
                      No blocked dates
                    </td>
                  </tr>
                ) : (
                  (schedule.blockedDates || []).map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.date}</td>
                      <td>{b.reason}</td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn action-delete" onClick={() => removeBlockedDate(idx)}>
                            <span aria-hidden="true">🗑</span>
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h3 className="settings-section-title" style={{ marginTop: 18 }}>Leaves</h3>
          <div className="table-wrap">
            <table className="generic-table">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(schedule.leaves || []).length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-mid)', padding: '14px 10px' }}>
                      No leaves marked
                    </td>
                  </tr>
                ) : (
                  (schedule.leaves || []).map((l, idx) => (
                    <tr key={idx}>
                      <td>{l.start}</td>
                      <td>{l.end}</td>
                      <td>{l.reason}</td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn action-delete" onClick={() => removeLeave(idx)}>
                            <span aria-hidden="true">🗑</span>
                            Remove
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
    </div>
  );
}

