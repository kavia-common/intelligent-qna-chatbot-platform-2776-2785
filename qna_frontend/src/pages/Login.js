import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ErrorBanner } from '../components/UI';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login form with Ocean Professional theme. */
  const { user, login, loading } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If we were redirected here after session expiry, show info message.
    const maybeMsg = location?.state?.message;
    if (maybeMsg) {
      setError(maybeMsg);
      // clear the state message so it doesn't persist across navigations
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid credentials');
    }
  };

  return (
    <div className="centered">
      <form className="card" onSubmit={submit} noValidate>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to continue the conversation.</p>
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input-text"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <Link className="btn" to="/signup">Create account</Link>
        </div>
        <p className="help">By continuing, you agree to our terms and privacy policy.</p>
      </form>
    </div>
  );
}
