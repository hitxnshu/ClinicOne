import { useState } from 'react';
import { validateLogin } from '../../utils/userStorage';

const ROLES = [
  { id: 'admin', label: 'Admin', desc: 'Full clinic management' },
  { id: 'doctor', label: 'Doctor', desc: 'Patient care and appointments' },
  { id: 'receptionist', label: 'Receptionist', desc: 'Front desk and scheduling' },
];

function RoleIcon({ role }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };

  if (role === 'admin') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M6 19c1-2.8 3.3-4.4 6-4.4s5 1.6 6 4.4" />
        <path d="M17 4h3v3M19.5 4.5l-4.1 4.1" />
      </svg>
    );
  }

  if (role === 'doctor') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M6.2 19c1-2.7 3.2-4.2 5.8-4.2s4.8 1.5 5.8 4.2" />
        <path d="M18.5 11.5v5M16 14h5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="6.3" y="4.5" width="11.4" height="15" rx="1.8" />
      <path d="M9 9h6M9 12h6M9 15h4" />
      <path d="M9 3.5h6" />
    </svg>
  );
}

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
          <div className="login-logo-icon">{'\u271A'}</div>
          <span className="login-logo-name">ClinicOne</span>
        </div>
        <div className="login-illus">{'\u{1F468}\u200D\u2695\uFE0F'}</div>
        <h2 className="login-left-title">Welcome to ClinicOne</h2>
        <p className="login-left-sub">
          Your complete healthcare management system. Sign in to access your dashboard.
        </p>
      </div>

      {/* Right panel */}
      <div className="login-panel-right">
        <div className="login-form-box">
          <h1 className="login-form-title">Welcome to ClinicOne</h1>
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
                    aria-pressed={formData.role === r.id}
                  >
                    <span className={`role-option-icon role-option-icon-${r.id}`}>
                      <RoleIcon role={r.id} />
                    </span>
                    <span className="role-option-label">{r.label}</span>
                    <span className="role-option-desc">{r.desc}</span>
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

