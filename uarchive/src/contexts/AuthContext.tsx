import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { postLogin, postRegister, setAuthToken, getAuthToken } from "../lib/api";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  user: any | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  async function login(username: string, password: string) {
    const data = await postLogin({ username, password });
    if (data && data.access_token) {
      setToken(data.access_token);
    }
  }

  // Fetch current user when token changes
  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const envBase = (import.meta as any).env?.VITE_API_URL || "";
        const base = envBase ? (envBase as string).replace(/\/+$/, "") : "";
        const url = base ? `${base}/api/users/me` : "/api/users/me";
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) {
          // invalid token
          setToken(null);
          setUser(null);
          return;
        }
        if (!res.ok) {
          // transient error - don't clear token, just don't set user
          setUser(null);
          return;
        }
        const data = await res.json();
        if (mounted) setUser(data);
      } catch (err) {
        // Network or other error - keep token but clear user
        setUser(null);
      }
    }
    fetchUser();
    return () => {
      mounted = false;
    };
  }, [token]);

  async function register(username: string, email: string, password: string) {
    console.log("AuthContext.register called", { username, email, passwordLen: password.length });
    await postRegister({ username, email, password });
    // After successful registration, auto-login
    await login(username, password);
  }

  function logout() {
    setToken(null);
    navigate("/");
  }

  const value: AuthContextType = {
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
