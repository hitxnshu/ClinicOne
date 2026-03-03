import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function DoctorProfile() {
  const { user, profile, setProfile } = useOutletContext();
  const displayName = user?.fullName || user?.username || user?.email || 'Doctor';

  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState(profile);

  useEffect(() => {
    setFormValues(profile);
  }, [profile]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setProfile(formValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormValues(profile);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar-lg">👨‍⚕️</div>
        <div className="profile-hero-text">
          <div className="profile-name">{displayName}</div>
          <div className="profile-meta-row">
            <span className="profile-field-tag">
              {isEditing ? (
                <input
                  className="form-input"
                  style={{ padding: '6px 10px', fontSize: 12 }}
                  value={formValues.field}
                  onChange={(e) => handleChange('field', e.target.value)}
                />
              ) : (
                formValues.field
              )}
            </span>
            <span className="profile-exp">
              {isEditing ? (
                <>
                  <input
                    className="form-input"
                    style={{ width: 80, padding: '6px 10px', fontSize: 12 }}
                    type="number"
                    min="0"
                    value={formValues.experienceYears}
                    onChange={(e) => handleChange('experienceYears', Number(e.target.value) || 0)}
                  />{' '}
                  yrs experience
                </>
              ) : (
                `${formValues.experienceYears}+ yrs experience`
              )}
            </span>
          </div>
          {user?.email && <div className="profile-email">{user.email}</div>}
        </div>
      </div>

      <div className="profile-body">
        <div className="profile-section profile-about">
          <h3 className="profile-section-title">About</h3>
          {isEditing ? (
            <textarea
              className="form-textarea"
              value={formValues.about}
              onChange={(e) => handleChange('about', e.target.value)}
            />
          ) : (
            <p className="profile-about-text">{formValues.about}</p>
          )}
        </div>
        <div className="profile-section profile-side">
          <h3 className="profile-section-title">Appointment Details</h3>
          <div className="profile-fee-row">
            <span className="profile-fee-label">Appointment fee</span>
            {isEditing ? (
              <div className="profile-fee-input">
                <span>₹</span>
                <input
                  className="form-input"
                  style={{ width: 100, padding: '6px 10px', fontSize: 13 }}
                  type="number"
                  min="0"
                  value={formValues.fee}
                  onChange={(e) => handleChange('fee', Number(e.target.value) || 0)}
                />
              </div>
            ) : (
              <span className="profile-fee-value">₹{formValues.fee}</span>
            )}
          </div>

          <label className="profile-availability">
            <input
              type="checkbox"
              checked={formValues.availableToday}
              onChange={(e) => handleChange('availableToday', e.target.checked)}
              disabled={!isEditing}
            />
            <span>Available for appointments today</span>
          </label>
        </div>
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button type="button" className="btn btn-ghost" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save changes
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit profile
          </button>
        )}
      </div>
    </div>
  );
}

