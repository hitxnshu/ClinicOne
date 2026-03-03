const STORAGE_KEY = 'clinicone_patients';

const DEFAULT_PATIENTS = [
  { id: 'P001', name: 'Arjun Mehta', avatar: '👨', age: 45, gender: 'Male', phone: '+91 98765 41001', email: 'arjun.mehta@example.com', address: '12 MG Road', lastVisit: '24 Jul 2023', status: 'Active' },
  { id: 'P002', name: 'Priya Sharma', avatar: '👩', age: 32, gender: 'Female', phone: '+91 98765 41002', email: 'priya.sharma@example.com', address: '33 Park Street', lastVisit: '24 Jul 2023', status: 'Active' },
  { id: 'P003', name: 'Neha Verma', avatar: '👩', age: 28, gender: 'Female', phone: '+91 98765 41003', email: 'neha.verma@example.com', address: '9 Residency Road', lastVisit: '20 Jul 2023', status: 'Active' },
  { id: 'P004', name: 'Rohan Singh', avatar: '👦', age: 52, gender: 'Male', phone: '+91 98765 41004', email: 'rohan.singh@example.com', address: '101 Civil Lines', lastVisit: '18 Jul 2023', status: 'Inactive' },
  { id: 'P005', name: 'Kavya Iyer', avatar: '👩', age: 29, gender: 'Female', phone: '+91 98765 41005', email: 'kavya.iyer@example.com', address: '77 Brigade Road', lastVisit: '15 Jul 2023', status: 'Active' },
  { id: 'P006', name: 'Amit Patel', avatar: '👴', age: 61, gender: 'Male', phone: '+91 98765 41006', email: 'amit.patel@example.com', address: '45 Ashram Road', lastVisit: '10 Jul 2023', status: 'Active' },
];

const LEGACY_PATIENT_MIGRATIONS = {
  'David Leal': {
    name: 'Arjun Mehta',
    phone: '+91 98765 41001',
    email: 'arjun.mehta@example.com',
    address: '12 MG Road',
  },
  'Jenny Wilson': {
    name: 'Priya Sharma',
    phone: '+91 98765 41002',
    email: 'priya.sharma@example.com',
    address: '33 Park Street',
  },
  'Shope Rose': {
    name: 'Neha Verma',
    phone: '+91 98765 41003',
    email: 'neha.verma@example.com',
    address: '9 Residency Road',
  },
  'Mark Joe': {
    name: 'Rohan Singh',
    phone: '+91 98765 41004',
    email: 'rohan.singh@example.com',
    address: '101 Civil Lines',
  },
  'Emily Davis': {
    name: 'Kavya Iyer',
    phone: '+91 98765 41005',
    email: 'kavya.iyer@example.com',
    address: '77 Brigade Road',
  },
  'Robert Brown': {
    name: 'Amit Patel',
    phone: '+91 98765 41006',
    email: 'amit.patel@example.com',
    address: '45 Ashram Road',
  },
};

function migrateLegacyPatients(patients) {
  let didMigrate = false;
  const migrated = patients.map((patient) => {
    const updates = LEGACY_PATIENT_MIGRATIONS[patient?.name];
    if (!updates) return patient;
    didMigrate = true;
    return { ...patient, ...updates };
  });
  return { migrated, didMigrate };
}
function savePatients(patients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

export function getPatients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      savePatients(DEFAULT_PATIENTS);
      return DEFAULT_PATIENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      savePatients(DEFAULT_PATIENTS);
      return DEFAULT_PATIENTS;
    }
    const { migrated, didMigrate } = migrateLegacyPatients(parsed);
    if (didMigrate) {
      savePatients(migrated);
    }
    return migrated;
  } catch {
    savePatients(DEFAULT_PATIENTS);
    return DEFAULT_PATIENTS;
  }
}

export function addPatient(patient) {
  const patients = getPatients();
  const idNumbers = patients
    .map((p) => Number.parseInt(String(p.id).replace('P', ''), 10))
    .filter((num) => Number.isFinite(num));
  const nextIdNumber = idNumbers.length ? Math.max(...idNumbers) + 1 : 1;
  const nextId = `P${String(nextIdNumber).padStart(3, '0')}`;
  const nextPatients = [{ ...patient, id: nextId }, ...patients];
  savePatients(nextPatients);
  return nextId;
}

export function removePatient(patientId) {
  const patients = getPatients();
  const nextPatients = patients.filter((p) => p.id !== patientId);
  savePatients(nextPatients);
  return nextPatients;
}

export function updatePatient(patientId, updates) {
  const patients = getPatients();
  const nextPatients = patients.map((patient) =>
    patient.id === patientId ? { ...patient, ...updates, id: patientId } : patient
  );
  savePatients(nextPatients);
  return nextPatients;
}


