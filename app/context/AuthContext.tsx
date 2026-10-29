// app/context/AuthContext.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const MAIN_API = process.env.NEXT_PUBLIC_MAIN_API_URL || "http://localhost:5000";
const TOKEN_KEY = "accessToken";

export interface LMSUser {
  id: string;
  email: string;
  full_name: string;
  name: string; // alias of full_name, for older pages
  role: string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: LMSUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<LMSUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalize = (u: any): LMSUser => ({ ...u, name: u.full_name });

const errText = (d: any, fallback: string) =>
  typeof d?.error === "string" ? d.error : typeof d?.detail === "string" ? d.detail : fallback;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LMSUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error("Session expired");
        setUser(normalize(await res.json()));
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // 1. Login on main VartaLang backend
    const r1 = await fetch(`${MAIN_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d1 = await r1.json().catch(() => ({}));
    if (!r1.ok || !d1.token) throw new Error(errText(d1, "Login failed"));

    // 2. Ask main backend for a one-time SSO code
    const r2 = await fetch(`${MAIN_API}/sso/code`, {
      method: "POST",
      headers: { Authorization: `Bearer ${d1.token}` },
    });
    const d2 = await r2.json().catch(() => ({}));
    if (!r2.ok || !d2.code) throw new Error(errText(d2, "Could not start SSO"));

    // 3. Exchange the code for an LMS session
    const r3 = await fetch(`${API}/auth/sso/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: d2.code }),
    });
    const d3 = await r3.json().catch(() => ({}));
    if (!r3.ok) throw new Error(errText(d3, "SSO login failed"));

    localStorage.setItem(TOKEN_KEY, d3.access_token);
    const u = normalize(d3.user);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isInstructor: user?.role === "instructor",
        isStudent: user?.role === "student",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);