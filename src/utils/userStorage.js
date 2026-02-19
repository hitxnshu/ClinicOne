const STORAGE_KEY = 'clinicone_registered_users';

export function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUser(user) {
  const users = getRegisteredUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === user.email.toLowerCase() && u.role === user.role
  );
  if (exists) return false;
  users.push({
    ...user,
    email: user.email.toLowerCase().trim(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return true;
}

export function validateLogin(email, password, role) {
  const users = getRegisteredUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase().trim() &&
      u.password === password &&
      u.role === role
  );
  return user ? { ...user, password: undefined } : null;
}
