import { useState } from 'react';
import './App.css';

// Auth Pages
import Welcome from './pages/Welcome';
import SignUp from './pages/SignUp';

// Role-specific dashboards
import AdminPage from './pages/AdminPage';
import DoctorPage from './pages/DoctorPage';
import PatientPage from './pages/PatientPage';

import { saveUser } from './utils/userStorage';

export default function App() {
  const [authMode, setAuthMode] = useState('welcome'); // 'welcome' | 'signup' | 'authenticated'
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthMode('authenticated');
  };

  const handleSignUp = (userData) => {
    saveUser(userData);
    setAuthMode('welcome');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthMode('welcome');
  };

  // Welcome page (login)
  if (authMode === 'welcome') {
    return (
      <Welcome
        onLogin={handleLogin}
        onSwitchToSignUp={() => setAuthMode('signup')}
      />
    );
  }

  // Sign up page
  if (authMode === 'signup') {
    return (
      <SignUp
        onSignUp={handleSignUp}
        onSwitchToSignIn={() => setAuthMode('welcome')}
      />
    );
  }

  // Authenticated: show role-specific page
  const role = user?.role || 'admin';
  if (role === 'admin') return <AdminPage user={user} onLogout={handleLogout} />;
  if (role === 'doctor') return <DoctorPage user={user} onLogout={handleLogout} />;
  if (role === 'patient') return <PatientPage user={user} onLogout={handleLogout} />;

  // Fallback
  return <AdminPage user={user} onLogout={handleLogout} />;
}
