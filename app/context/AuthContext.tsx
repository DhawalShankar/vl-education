"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/app/lib/api";

export interface User {
  id: string;
  email: string;
  full_name: string;
  name: string;
  role: "student" | "instructor" | "admin";
  avatar_url?: string | null;
  isMockOffline?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginAs: (role: "student" | "instructor" | "admin", name?: string, email?: string) => Promise<User>;
  loginWithSSO: (code: string) => Promise<User>;
  login: (email: string, password?: string) => Promise<User>;
  register: (name: string, email: string, password?: string, role?: string) => Promise<User>;
  logout: () => Promise<void>;
  isGuest: boolean;
  isStudent: boolean;
  isInstructor: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  const formatUser = (raw: any): User => ({
    id: raw.id || "dev-id",
    email: raw.email || "user@vartalang.in",
    full_name: raw.full_name || raw.name || "User",
    name: raw.full_name || raw.name || "User",
    role: raw.role || "student",
    avatar_url: raw.avatar_url,
    isMockOffline: raw.isMockOffline || false,
  });

  const fetchProfile = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const userData = await authAPI.getMe();
      if (userData && userData.id) {
        setUser(formatUser(userData));
      } else {
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    } catch {
      // Keep offline/dev state or reset
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 1. Check for SSO authorization code in URL on page load (?code=... or ?sso_code=...)
  useEffect(() => {
    const handleInitialAuth = async () => {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      const ssoCode = params.get("code") || params.get("sso_code");

      if (ssoCode) {
        try {
          setLoading(true);
          const res = await authAPI.ssoExchange(ssoCode);
          if (res?.access_token) {
            localStorage.setItem("accessToken", res.access_token);
            setUser(formatUser(res.user));
            // Clean code from URL without reloading
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            setLoading(false);
            return;
          }
        } catch (err: any) {
          console.warn("SSO URL exchange failed:", err);
          setAuthError(`SSO Code Exchange failed: ${err.message || "Backend offline"}`);
        }
      }

      // If no SSO code in URL, check existing session
      await fetchProfile();
    };

    handleInitialAuth();
  }, []);

  const loginWithSSO = async (code: string): Promise<User> => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await authAPI.ssoExchange(code);
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", res.access_token);
      }
      const formatted = formatUser(res.user);
      setUser(formatted);
      return formatted;
    } catch (err: any) {
      console.warn("SSO exchange error:", err);
      // If backend is offline but user wants to test mock SSO code:
      if (code.startsWith("mock_")) {
        const isInstructor = code.includes("instructor");
        const mockUser: User = {
          id: `sso-${Date.now()}`,
          email: `${code}@vartalang.in`,
          full_name: isInstructor ? "Prof. Hans (SSO Mock)" : "Priya Patel (SSO Mock)",
          name: isInstructor ? "Prof. Hans (SSO Mock)" : "Priya Patel (SSO Mock)",
          role: isInstructor ? "instructor" : "student",
          isMockOffline: true,
        };
        setUser(mockUser);
        setAuthError("FastAPI Backend on :8000 is not running. Logged in with Frontend Mock SSO.");
        return mockUser;
      }
      const errorMsg = err.message || "Failed to exchange SSO code. Make sure FastAPI backend is running on http://localhost:8000";
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const loginAs = async (
    role: "student" | "instructor" | "admin",
    name?: string,
    email?: string
  ): Promise<User> => {
    setLoading(true);
    setAuthError(null);
    const defaultName = role === "instructor" ? "Hans Schmidt" : role === "admin" ? "Platform Admin" : "Priya Patel";
    const defaultEmail = role === "instructor" ? "instructor@vartalang.in" : role === "admin" ? "admin@vartalang.in" : "student@vartalang.in";

    try {
      const res = await authAPI.devLogin(email || defaultEmail, role, name || defaultName);
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", res.access_token);
      }
      const formatted = formatUser(res.user);
      setUser(formatted);
      return formatted;
    } catch (err: any) {
      console.warn("Backend dev-login unreachable:", err);
      // Fallback: Provide local mock session so UI testing never gets blocked
      const mockFallbackUser: User = {
        id: `mock-${role}-id`,
        email: email || defaultEmail,
        full_name: name || defaultName,
        name: name || defaultName,
        role: role,
        isMockOffline: true,
      };
      setUser(mockFallbackUser);
      setAuthError("FastAPI Backend on :8000 is unreachable. Switched role in Frontend Mock Mode.");
      return mockFallbackUser;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password?: string): Promise<User> => {
    return loginAs("student", email.split("@")[0], email);
  };

  const register = async (name: string, email: string, password?: string, role = "student"): Promise<User> => {
    const validRole = role === "instructor" ? "instructor" : role === "admin" ? "admin" : "student";
    return loginAs(validRole, name, email);
  };

  const logout = async (): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    setUser(null);
    setAuthError(null);
  };

  const isGuest = !user;
  const isStudent = user?.role === "student";
  const isInstructor = user?.role === "instructor";
  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAs,
        loginWithSSO,
        login,
        register,
        logout,
        isGuest,
        isStudent,
        isInstructor,
        isAdmin,
        isAuthenticated,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
