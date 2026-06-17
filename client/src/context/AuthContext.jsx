import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

const API = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("tds_token") || null);
  const [authLoading, setAuthLoading] = useState(true);

  // On mount, verify token is still valid
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token invalid/expired
          logout();
        }
      } catch {
        logout();
      } finally {
        setAuthLoading(false);
      }
    };
    verify();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed.");
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("tds_token", data.token);
    return data;
  };

  const register = async (username, email, password) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed.");
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("tds_token", data.token);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("tds_token");
  };

  const isAuthenticated = !!token && !!user;

  // Utility: make authenticated fetch calls
  const authFetch = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, authLoading, login, register, logout, authFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
