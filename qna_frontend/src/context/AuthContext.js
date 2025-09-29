import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoredUser, login as loginSvc, signup as signupSvc, logout as logoutSvc } from '../services/auth';

const AuthCtx = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access the auth context hook. */
  return useContext(AuthCtx);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and actions. */
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, could verify access token here.
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const u = await loginSvc(username, password);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const u = await signupSvc(payload);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutSvc();
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
