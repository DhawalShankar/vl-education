"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "instructor" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role?: string) => Promise<User>;
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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return setLoading(false);
    fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setUser(data.data.user);
        else localStorage.clear();
      })
      .catch(() => localStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role = "student"
  ): Promise<User> => {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    const token = localStorage.getItem("accessToken");
    await fetch(`${BASE}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    localStorage.clear();
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

export const useAuth = () => useContext(AuthContext);