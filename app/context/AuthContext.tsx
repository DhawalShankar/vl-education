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
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginAs: (role: "student" | "instructor" | "admin", name?: string, email?: string) => Promise<User>;
  login: (email: string, password?: string) => Promise<User>;
  register: (name: string, email: string, password?: string, role?: string) => Promise<User>;
  logout: () => Promise<void>;
  isGuest: boolean;
  isStudent: boolean;
  isInstructor: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const formatUser = (raw: any): User => ({
    id: raw.id,
    email: raw.email,
    full_name: raw.full_name || raw.name || "User",
    name: raw.full_name || raw.name || "User",
    role: raw.role,
    avatar_url: raw.avatar_url,
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
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const loginAs = async (
    role: "student" | "instructor" | "admin",
    name?: string,
    email?: string
  ): Promise<User> => {
    setLoading(true);
    try {
      const defaultName = role === "instructor" ? "Hans Schmidt" : role === "admin" ? "Platform Admin" : "Priya Patel";
      const defaultEmail = role === "instructor" ? "instructor@vartalang.in" : role === "admin" ? "admin@vartalang.in" : "student@vartalang.in";
      
      const res = await authAPI.devLogin(email || defaultEmail, role, name || defaultName);
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", res.access_token);
      }
      const formatted = formatUser(res.user);
      setUser(formatted);
      return formatted;
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
        login,
        register,
        logout,
        isGuest,
        isStudent,
        isInstructor,
        isAdmin,
        isAuthenticated,
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
