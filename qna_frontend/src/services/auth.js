/**
 * Authentication service wrapping API endpoints.
 */
import api from './api';

// PUBLIC_INTERFACE
export async function login(username, password) {
  /** Perform login and persist tokens. Returns user object. */
  const { data } = await api.post('/auth/login/', { username, password });
  if (data?.access) localStorage.setItem('access', data.access);
  if (data?.refresh) localStorage.setItem('refresh', data.refresh);
  if (data?.user) localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

// PUBLIC_INTERFACE
export async function signup({ username, email, password }) {
  /** Perform signup. Returns created user. */
  const { data } = await api.post('/auth/signup/', { username, email, password });
  return data;
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clear auth tokens and user. */
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
}

// PUBLIC_INTERFACE
export function getStoredUser() {
  /** Return stored user from localStorage. */
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
