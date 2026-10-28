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
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("userProfile");
        const token = localStorage.getItem("accessToken");
        if (stored && token) {
          return JSON.parse(stored);
        }
      } catch {
        // ignore parse error
      }
    }
    return null;
  });

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

  const persistSession = (token: string, u: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userProfile", JSON.stringify(u));
    }
    setUser(u);
  };

  const fetchProfile = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // If mock token was stored, keep local mock session
      if (token.startsWith("mock_token_")) {
        const stored = localStorage.getItem("userProfile");
        if (stored) {
          setUser(JSON.parse(stored));
        }
        setLoading(false);
        return;
      }

      // Verify token with backend
      const userData = await authAPI.getMe();
      if (userData && userData.id) {
        const formatted = formatUser(userData);
        persistSession(token, formatted);
      } else {
        // Only clear if server explicitly returned null / unauthorized
        const stored = localStorage.getItem("userProfile");
        if (!stored) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userProfile");
          setUser(null);
        }
      }
    } catch (err) {
      console.warn("Could not reach backend for getMe(), keeping cached session if present");
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
            const formatted = formatUser(res.user);
            persistSession(res.access_token, formatted);
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            setLoading(false);
            return;
          }
        } catch (err: any) {
          console.warn("SSO URL exchange failed:", err);
          setAuthError(`SSO Code Exchange failed: ${err.message || "Invalid or unlinked code"}`);
        }
      }

      await fetchProfile();
    };

    handleInitialAuth();
  }, []);

  const loginWithSSO = async (code: string): Promise<User> => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await authAPI.ssoExchange(code);
      const formatted = formatUser(res.user);
      persistSession(res.access_token, formatted);
      return formatted;
    } catch (err: any) {
      console.warn("SSO exchange error:", err);
      // If code simulates unlinked user
      if (code.includes("unlinked") || code.includes("not_found")) {
        const errorMsg = "No linked account found with main VartaLang. Please register or create your account.";
        setAuthError(errorMsg);
        const unlinkedErr = new Error(errorMsg);
        (unlinkedErr as any).isUnlinked = true;
        throw unlinkedErr;
      }

      // If backend is unreachable or local mock
      if (code.startsWith("mock_")) {
        const isInstructor = code.includes("instructor");
        const mockUser: User = {
          id: `sso-${Date.now()}`,
          email: `${code}@vartalang.in`,
          full_name: isInstructor ? "Prof. Hans (SSO)" : "Priya Patel (SSO)",
          name: isInstructor ? "Prof. Hans (SSO)" : "Priya Patel (SSO)",
          role: isInstructor ? "instructor" : "student",
          isMockOffline: true,
        };
        persistSession(`mock_token_${mockUser.role}`, mockUser);
        return mockUser;
      }

      const errorMsg = err.message || "Failed to exchange SSO code.";
      setAuthError(errorMsg);
      throw err;
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
      const formatted = formatUser(res.user);
      persistSession(res.access_token, formatted);
      return formatted;
    } catch (err: any) {
      console.warn("Backend dev-login unreachable:", err);
      const mockFallbackUser: User = {
        id: `mock-${role}-id`,
        email: email || defaultEmail,
        full_name: name || defaultName,
        name: name || defaultName,
        role: role,
        isMockOffline: true,
      };
      persistSession(`mock_token_${role}`, mockFallbackUser);
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
      localStorage.removeItem("userProfile");
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
