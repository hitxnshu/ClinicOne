import { useState } from 'react';
import { validateLogin } from '../utils/userStorage';

const ROLES = [
  { id: 'admin',   label: 'Admin',   icon: '👩‍💼', desc: 'Full clinic management' },
  { id: 'doctor',  label: 'Doctor',  icon: '👨‍⚕️', desc: 'Patient care & appointments' },
  { id: 'patient', label: 'Patient', icon: '🧑‍⚕️', desc: 'Book appointments & view records' },
];

export default function Welcome({ onLogin, onSwitchToSignUp }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
    rememberMe: false,
  });
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const validatedUser = validateLogin(formData.email, formData.password, formData.role);

    if (!validatedUser) {
      setLoginError('No account found with these credentials. Please sign up first.');
      return;
    }

    onLogin({
      email: validatedUser.email,
      role: validatedUser.role,
      fullName: validatedUser.fullName,
      username: validatedUser.username || validatedUser.email,
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
        <div className="login-illus">👩‍⚕️</div>
        <h2 className="login-left-title">Welcome to ClinicOne</h2>
        <p className="login-left-sub">
          Your complete healthcare management system. Sign in to access your dashboard.
        </p>
      </div>

      {/* Right panel */}
      <div className="login-panel-right">
        <div className="login-form-box">
          <h1 className="login-form-title">Welcome to ClinicOne 👋</h1>
          <p className="login-form-sub">Select your role and sign in to continue</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Role selection */}
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Select your role *</label>
              <div className="role-selector">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`role-option ${formData.role === r.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, role: r.id })}
                  >
                    <span className="role-option-icon">{r.icon}</span>
                    <span className="role-option-label">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email *</label>
              <input
                className="form-input"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password *</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="login-row">
              <label className="login-check">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={e => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                Remember me
              </label>
              <a href="#" className="login-forgot">Forgot Password?</a>
            </div>

            {loginError && (
              <div className="login-error" style={{ fontSize: 13, color: 'var(--accent-red)', marginTop: 8, marginBottom: -4 }}>
                {loginError}
              </div>
            )}

            <button type="submit" className="login-submit">Sign In</button>
          </form>

          <div className="login-demo">
            Don't have an account?{' '}
            <strong
              style={{ cursor: 'pointer', color: 'var(--primary)' }}
              onClick={onSwitchToSignUp}
            >
              Sign Up
            </strong>
            <br />
            <span style={{ fontSize: 11, marginTop: 8, display: 'block', color: 'var(--text-light)' }}>
              Sign up first to create an account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
