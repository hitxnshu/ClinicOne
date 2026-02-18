import { useState } from 'react';

export default function SignUp({ onSignUp, onSwitchToSignIn }) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // In a real app, you'd send this to your backend
    // Show success message
    alert(`🎉 Account created successfully!\n\nWelcome, ${formData.fullName}!\nYou're now being signed in...`);
    
    // Sign the user in
    onSignUp({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      role: formData.role
    });
  };

  return (
    <div className="login-root">
      {/* Left panel */}
      <div className="login-panel-left">
        <div className="login-logo-area">
          <div className="login-logo-icon">➕</div>
          <span className="login-logo-name">ClinicOne</span>
        </div>
        <div className="login-illus">🎉</div>
        <h2 className="login-left-title">Join ClinicOne Today</h2>
        <p className="login-left-sub">
          Start managing your clinic efficiently with our comprehensive healthcare management system.
        </p>
      </div>

      {/* Right panel */}
      <div className="login-panel-right">
        <div className="login-form-box">
          <h1 className="login-form-title">Create Account 🚀</h1>
          <p className="login-form-sub">Sign up to start managing your clinic</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              {errors.fullName && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>
                  {errors.fullName}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Username *</label>
              <input
                className="form-input"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
              />
              {errors.username && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>
                  {errors.username}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address *</label>
              <input
                className="form-input"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {errors.email && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password *</label>
              <input
                className="form-input"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {errors.password && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>
                  {errors.password}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password *</label>
              <input
                className="form-input"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              {errors.confirmPassword && (
                <div style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">I am a... *</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>

            <label 
              className="login-check" 
              style={{ 
                marginTop: 4, 
                cursor: 'pointer',
                color: errors.agreeToTerms ? 'var(--accent-red)' : 'var(--text-mid)'
              }}
            >
              <input 
                type="checkbox" 
                checked={formData.agreeToTerms}
                onChange={e => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              />
              <span style={{ fontSize: 12 }}>
                I agree to the <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Privacy Policy</a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <div style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4, marginLeft: 24 }}>
                {errors.agreeToTerms}
              </div>
            )}

            <button type="submit" className="login-submit">
              Create Account
            </button>
          </form>

          <div className="login-demo">
            Already have an account?{' '}
            <strong 
              style={{ cursor: 'pointer', color: 'var(--primary)' }} 
              onClick={onSwitchToSignIn}
            >
              Sign In
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
