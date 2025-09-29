import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import ChatPage from './pages/Chat';

// Header component
function Header() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-badge">QnA</div>
        Intelligent Chatbot
      </div>
      <div className="header-actions">
        <button className="btn btn-ghost" onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {user ? (
          <>
            <span className="btn">Hi, {user.username}</span>
            <button className="btn" onClick={() => navigate('/')}>Chat</button>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn" to="/login">Login</Link>
            <Link className="btn btn-primary" to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}

// Guarded route
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

// PUBLIC_INTERFACE
function AppShell() {
  /** Root application shell with routes and header. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppShell;
