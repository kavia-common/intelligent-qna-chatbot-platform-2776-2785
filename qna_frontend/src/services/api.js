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

export default api;
