const STORAGE_KEY = 'clinicone_patients';

const DEFAULT_PATIENTS = [
  { id: 'P001', name: 'David Leal', avatar: '👨', age: 45, gender: 'Male', phone: '+1 234 567 8900', email: 'david@example.com', address: '12 Main St', lastVisit: '24 Jul 2023', status: 'Active' },
  { id: 'P002', name: 'Jenny Wilson', avatar: '👩', age: 32, gender: 'Female', phone: '+1 234 567 8901', email: 'jenny@example.com', address: '33 North Ave', lastVisit: '24 Jul 2023', status: 'Active' },
  { id: 'P003', name: 'Shope Rose', avatar: '👩', age: 28, gender: 'Female', phone: '+1 234 567 8902', email: 'shope@example.com', address: '9 Sunset Blvd', lastVisit: '20 Jul 2023', status: 'Active' },
  { id: 'P004', name: 'Mark Joe', avatar: '👦', age: 52, gender: 'Male', phone: '+1 234 567 8903', email: 'mark@example.com', address: '101 River Rd', lastVisit: '18 Jul 2023', status: 'Inactive' },
  { id: 'P005', name: 'Emily Davis', avatar: '👩', age: 29, gender: 'Female', phone: '+1 234 567 8904', email: 'emily@example.com', address: '77 Pine Dr', lastVisit: '15 Jul 2023', status: 'Active' },
  { id: 'P006', name: 'Robert Brown', avatar: '👴', age: 61, gender: 'Male', phone: '+1 234 567 8905', email: 'robert@example.com', address: '45 Oak Ct', lastVisit: '10 Jul 2023', status: 'Active' },
];

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
    return parsed;
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
