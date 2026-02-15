import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { postLogin, postRegister, setAuthToken, getAuthToken } from "../lib/api";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getAuthToken());
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
