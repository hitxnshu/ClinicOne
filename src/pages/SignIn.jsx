import { useState } from 'react';

export default function SignIn({ onSignIn, onSwitchToSignUp }) {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    role: 'admin',
    rememberMe: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you'd validate credentials with backend
    // For demo, we'll just accept any credentials
    onSignIn({
      username: formData.username,
      role: formData.role,
      fullName: formData.role === 'admin' ? 'Jane Cooper' : 
                formData.role === 'doctor' ? 'Dr. Smith' : 'Front Desk'
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
        <h2 className="login-left-title">Manage Your Clinic Smarter</h2>
        <p className="login-left-sub">
          A complete system for patients, appointments, doctors and records — all in one place.
        </p>
      </div>

      {/* Right panel */}
      <div className="login-panel-right">
        <div className="login-form-box">
          <h1 className="login-form-title">Welcome Back 👋</h1>
          <p className="login-form-sub">Sign in to access your clinic dashboard</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Role</label>
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
              Demo: use any username & password
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
