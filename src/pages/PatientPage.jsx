import { useState } from 'react';

const SPECIALITIES = [
  { id: 'general', label: 'General Physician', icon: '🩺' },
  { id: 'dermatology', label: 'Dermatologist', icon: '🧴' },
  { id: 'cardiology', label: 'Cardiologist', icon: '❤️' },
  { id: 'orthopedics', label: 'Orthopedics', icon: '🦴' },
  { id: 'pediatrics', label: 'Pediatrics', icon: '👶' },
  { id: 'neurology', label: 'Neurology', icon: '🧠' },
  { id: 'gyn', label: 'Gynecology', icon: '👩' },
  { id: 'ent', label: 'ENT', icon: '👂' },
];

const TOP_DOCTORS = [
  { id: 'D001', name: 'Dr. John Carter', spec: 'Cardiology', avatar: '👨‍⚕️', exp: '12 years' },
  { id: 'D002', name: 'Dr. Emma Green', spec: 'Pediatrics', avatar: '👩‍⚕️', exp: '8 years' },
  { id: 'D003', name: 'Dr. Sophia Miller', spec: 'Dermatology', avatar: '👩‍⚕️', exp: '15 years' },
  { id: 'D004', name: 'Dr. Alex Brown', spec: 'Orthopedics', avatar: '👨‍⚕️', exp: '20 years' },
];

const ALL_DOCTORS = [
  ...TOP_DOCTORS,
  { id: 'D005', name: 'Dr. Laura Wilson', spec: 'Neurology', avatar: '👩‍⚕️', exp: '10 years' },
  { id: 'D006', name: 'Dr. James Lee', spec: 'General Physician', avatar: '👨‍⚕️', exp: '6 years' },
  { id: 'D007', name: 'Dr. Maria Garcia', spec: 'Gynecology', avatar: '👩‍⚕️', exp: '14 years' },
  { id: 'D008', name: 'Dr. David Kim', spec: 'ENT', avatar: '👨‍⚕️', exp: '9 years' },
];

export default function PatientPage({ user, onLogout }) {
  const [section, setSection] = useState('home'); // home | doctors | about | contact
  const [showAllDoctors, setShowAllDoctors] = useState(false);

  return (
    <div className="patient-page">
      {/* Header / Navbar */}
      <header className="patient-header">
        <a href="#home" className="patient-logo" onClick={(e) => { e.preventDefault(); setSection('home'); }}>
          <span className="patient-logo-icon">➕</span>
          <span className="patient-logo-text">ClinicOne</span>
        </a>
        <nav className="patient-nav">
          <a
            href="#home"
            className={section === 'home' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setSection('home'); }}
          >
            Home
          </a>
          <a
            href="#doctors"
            className={section === 'doctors' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setSection('doctors'); setShowAllDoctors(true); }}
          >
            All Doctors
          </a>
          <a
            href="#about"
            className={section === 'about' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setSection('about'); }}
          >
            About
          </a>
          <a
            href="#contact"
            className={section === 'contact' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setSection('contact'); }}
          >
            Contact
          </a>
        </nav>
        <div className="patient-header-right">
          <span className="patient-user-name">{user?.fullName || 'Patient'}</span>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {/* Main content */}
      <main className="patient-main">
        {/* Hero banner */}
        <section className="patient-hero">
          <div className="patient-hero-content">
            <h1>Book Appointment with Trusted Doctors</h1>
            <p>Your health is our priority. Connect with experienced healthcare professionals.</p>
            <button className="btn btn-primary patient-hero-cta">Book Now</button>
          </div>
          <div className="patient-hero-overlay" />
        </section>

        {/* Find by Speciality */}
        <section className="patient-section">
          <h2 className="patient-section-title">Find by Speciality</h2>
          <div className="patient-speciality-grid">
            {SPECIALITIES.map((s) => (
              <button key={s.id} className="patient-speciality-card">
                <span className="patient-speciality-icon">{s.icon}</span>
                <span className="patient-speciality-label">{s.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Top Doctors */}
        <section className="patient-section">
          <h2 className="patient-section-title">Top Doctors</h2>
          <div className="patient-doctors-grid">
            {(showAllDoctors ? ALL_DOCTORS : TOP_DOCTORS).map((doc) => (
              <div key={doc.id} className="patient-doctor-card">
                <div className="patient-doctor-avatar">{doc.avatar}</div>
                <div className="patient-doctor-name">{doc.name}</div>
                <div className="patient-doctor-spec">{doc.spec}</div>
                <div className="patient-doctor-exp">{doc.exp} experience</div>
                <button className="btn btn-primary btn-sm">Book</button>
              </div>
            ))}
          </div>
          {!showAllDoctors && (
            <div className="patient-more-wrap">
              <button
                className="btn btn-primary"
                onClick={() => { setShowAllDoctors(true); setSection('doctors'); }}
              >
                More →
              </button>
            </div>
          )}
        </section>

        {/* Second banner */}
        <section className="patient-hero patient-hero-secondary">
          <div className="patient-hero-content">
            <h2>Quality Care, Always</h2>
            <p>Schedule your next visit with ease. We're here for you.</p>
            <button className="btn btn-primary patient-hero-cta">Schedule Visit</button>
          </div>
          <div className="patient-hero-overlay" />
        </section>

        {/* Footer */}
        <footer className="patient-footer">
          <div className="patient-footer-grid">
            <div className="patient-footer-brand">
              <div className="patient-logo" style={{ marginBottom: 12 }}>
                <span className="patient-logo-icon">➕</span>
                <span className="patient-logo-text">ClinicOne</span>
              </div>
              <p className="patient-footer-desc">
                ClinicOne provides comprehensive healthcare services with trusted doctors. Your health and comfort are our top priorities.
              </p>
              <div className="patient-footer-contact">
                <span>📞 +1 (555) 123-4567</span>
                <span>✉️ info@clinicone.com</span>
              </div>
            </div>
            <div className="patient-footer-links">
              <h4>Quick Links</h4>
              <a href="#home">Home</a>
              <a href="#doctors">All Doctors</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#">Book Appointment</a>
            </div>
            <div className="patient-footer-links">
              <h4>Services</h4>
              <a href="#">General Check-up</a>
              <a href="#">Specialist Consultation</a>
              <a href="#">Lab Tests</a>
              <a href="#">Emergency Care</a>
            </div>
          </div>
          <div className="patient-footer-bottom">
            <span>© {new Date().getFullYear()} ClinicOne. All rights reserved.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
