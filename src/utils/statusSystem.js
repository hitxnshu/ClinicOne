function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

export function getStatusMeta(domain, value) {
  const normalizedDomain = normalize(domain);
  const normalizedValue = normalize(value);

  if (normalizedDomain === 'appointment') {
    if (normalizedValue === 'confirmed') return { tone: 'confirmed', label: 'Confirmed' };
    if (normalizedValue === 'cancelled') return { tone: 'cancelled', label: 'Cancelled' };
    return { tone: 'pending', label: 'Pending' };
  }

  if (normalizedDomain === 'doctor') {
    if (normalizedValue === 'available') return { tone: 'confirmed', label: 'Available' };
    if (normalizedValue === 'on leave') return { tone: 'cancelled', label: 'On Leave' };
    return { tone: 'pending', label: 'Busy' };
  }

  if (normalizedDomain === 'report') {
    if (normalizedValue === 'appointment') return { tone: 'confirmed', label: 'Appointment' };
    if (normalizedValue === 'financial') return { tone: 'cancelled', label: 'Financial' };
    return { tone: 'pending', label: 'Patient' };
  }

  return { tone: 'pending', label: String(value || '') };
}

export function getStatusTone(domain, value) {
  return getStatusMeta(domain, value).tone;
}

export function getStatusLabel(domain, value) {
  return getStatusMeta(domain, value).label;
}
