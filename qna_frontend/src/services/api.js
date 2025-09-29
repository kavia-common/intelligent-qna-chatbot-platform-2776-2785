import axios from 'axios';

/**
 * API client configured for the backend.
 *
 * It uses the following resolution order for base URL:
 * 1. process.env.REACT_APP_API_BASE (preferred for CRA)
 * 2. process.env.VITE_API_BASE (if using Vite in future)
 * 3. process.env.PUBLIC_API_BASE (fallback env name)
 * 4. '/api' (relative) as a last resort
 *
 * NOTE: When running frontend on a different origin/port than backend,
 * you MUST set REACT_APP_API_BASE to the full backend URL including the /api prefix,
 * e.g. https://<host>:3001/api
 */
const envBase =
  process.env.REACT_APP_API_BASE ||
  process.env.VITE_API_BASE ||
  process.env.PUBLIC_API_BASE ||
  '';

const BASE_URL = envBase || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Redirect helper for session-expired flows.
 * - Clears tokens from localStorage
 * - Navigates to /login with a message state
 */
function redirectToLogin(sessionMessage = 'Session expired. Please login again.') {
  try {
    // Clear stored auth data
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    // Prefer SPA navigation if possible
    const nav = window.__APP_NAVIGATE__;
    if (typeof nav === 'function') {
      nav('/login', { replace: true, state: { message: sessionMessage } });
    } else {
      // Fallback to hard redirect
      const url = new URL(window.location.href);
      url.hash = ''; // ensure clean hash
      // We keep the origin and simply point to /login
      window.location.assign('/login');
    }
  } catch {
    // If anything fails, at least try to send the user to login
    try { window.location.assign('/login'); } catch { /* noop */ }
  }
}

// Attach access token if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('access');
    // Only attach if non-empty string
    if (token && typeof token === 'string' && token.trim().length > 0) {
      // Ensure headers object exists
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    // Dev diagnostics: help confirm Authorization header inclusion and base URL
    if (process.env.NODE_ENV !== 'production') {
      // Avoid logging sensitive token, only log presence flag and target URL
      const hasAuth = !!(config.headers && config.headers.Authorization);
      // eslint-disable-next-line no-console
      console.debug(
        '[api] request:',
        config.method?.toUpperCase(),
        (config.baseURL || '') + (config.url || ''),
        `auth=${hasAuth ? 'yes' : 'no'}`
      );
    }
  } catch {
    // no-op
  }
  return config;
});

// Global response interceptor to catch 401s and force logout + redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Ensure storage is cleared and user is navigated to login
      redirectToLogin('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

export default api;
