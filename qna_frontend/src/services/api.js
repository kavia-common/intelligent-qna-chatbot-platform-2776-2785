import axios from 'axios';

/**
 * API client configured for the backend.
 * Uses REACT_APP_API_BASE as base URL, defaults to /api.
 */
const BASE_URL = process.env.REACT_APP_API_BASE || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Attach access token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
