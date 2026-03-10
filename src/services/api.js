// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://depoly-backend-qyda.onrender.com//api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Attach JWT token to every request ────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Normalize error messages ──────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ─────────────────────────────────────────────────────────────
// Auth API calls
// ─────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) =>
    api.post('/auth/register', data),

  login: (data) =>
    api.post('/auth/login', data),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }),
};

export default api;
