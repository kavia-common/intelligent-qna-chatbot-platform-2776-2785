import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup as signupSvc, login as loginSvc } from '../services/auth';
import { ErrorBanner } from '../components/UI';

// PUBLIC_INTERFACE
export default function SignupPage() {
  /** Signup form to create a new user account. */
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signupSvc(form);
      // Auto-login for convenience
      await loginSvc(form.username, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered">
      <form className="card" onSubmit={submit} noValidate>
        <h2>Create your account</h2>
        <p className="muted">Join and start chatting with your AI assistant.</p>
        <ErrorBanner message={error} />
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="input-text"
            placeholder="e.g. alex"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email (optional)</label>
          <input
            id="email"
            className="input-text"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input-text"
            type="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Sign up'}
          </button>
          <Link className="btn" to="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
