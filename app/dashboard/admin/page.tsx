"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { adminAPI, courseAPI } from "@/app/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────
interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  enrolledCourses?: string[];
}

interface Course {
  _id: string;
  title: string;
  language: string;
  level: string;
  isPublished: boolean;
  enrolledCount: number;
  instructor: { name: string; email: string };
  createdAt: string;
}

interface Stats {
  totalUsers?: number;
  totalCourses?: number;
  totalStudents?: number;
  totalInstructors?: number;
}

type Tab = "overview" | "users" | "courses";

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const roleColor = (role: string) => {
  if (role === "admin") return "text-amber-400 bg-amber-400/10 border-amber-400/30";
  if (role === "instructor") return "text-sky-400 bg-sky-400/10 border-sky-400/30";
  return "text-stone-400 bg-stone-400/10 border-stone-600/30";
};

const levelColor = (level: string) => {
  if (level === "mastery") return "text-purple-400 bg-purple-400/10 border-purple-400/30";
  if (level === "professional") return "text-sky-400 bg-sky-400/10 border-sky-400/30";
  return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
};

// ── Icons ──────────────────────────────────────────────────────────────────────
const Icon = {
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a3 3 0 10-6 0 3 3 0 006 0z" />
    </svg>
  ),
  courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  students: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  instructors: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  logout: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
  trash: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
};

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent }: {
  label: string; value: number | string; icon: React.ReactNode; accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-stone-900/60 border border-stone-700/50 p-6 backdrop-blur-sm">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 ${accent}`} />
      <div className="relative">
        <div className={`inline-flex p-2.5 rounded-xl mb-4 ${accent} bg-opacity-10 border border-white/5`}>
          {icon}
        </div>
        <p className="text-3xl font-bold text-white tracking-tight">{value ?? "—"}</p>
        <p className="text-sm text-stone-500 mt-1 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────────
function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-md border capitalize ${colorClass}`}>
      {label}
    </span>
  );
}

// ── Loading Screen ─────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 animate-pulse" />
        <p className="text-stone-500 text-sm">Loading dashboard…</p>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const auth = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [dataLoading, setDataLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch data ─────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [usersRes, coursesRes] = await Promise.all([
        adminAPI.getUsers(),
        courseAPI.getAll("limit=100"),
      ]);

      const usersData = await usersRes?.json();
      const coursesData = await coursesRes?.json();

      const userList: User[] = usersData?.data?.users ?? usersData?.data ?? [];
      const courseList: Course[] = coursesData?.data?.courses ?? [];

      setUsers(userList);
      setCourses(courseList);
      setStats({
        totalUsers: userList.length,
        totalCourses: courseList.length,
        totalStudents: userList.filter((u) => u.role === "student").length,
        totalInstructors: userList.filter((u) => u.role === "instructor").length,
      });
    } catch {
      showToast("Failed to load data", false);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // ── Auth guard — pehle auth settle hone do, tab hi aage badho ──────────────
  useEffect(() => {
    if (!auth || auth.loading) return; // auth abhi load ho raha hai — wait karo

    if (!auth.isAuthenticated || !auth.isAdmin) {
      router.replace("/auth/login"); // admin nahi hai toh login pe bhejo
      return;
    }

    // Admin confirm — ab data load karo
    loadData();
  }, [auth?.loading, auth?.isAuthenticated, auth?.isAdmin]); // eslint-disable-line

  // ── Show loading while auth is settling ───────────────────────────────────
  if (!auth || auth.loading) return <LoadingScreen />;

  // ── User actions ───────────────────────────────────────────────────────────
  const handleRoleChange = async (id: string, role: string) => {
    try {
      const res = await adminAPI.updateRole(id, role);
      if (res?.ok) {
        setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: role as User["role"] } : u)));
        showToast("Role updated!", true);
      } else throw new Error();
    } catch { showToast("Failed to update role", false); }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await adminAPI.toggleStatus(id);
      if (res?.ok) {
        setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u)));
        showToast("Status updated!", true);
      } else throw new Error();
    } catch { showToast("Failed to toggle status", false); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      const res = await adminAPI.deleteUser(id);
      if (res?.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        showToast("User deleted", true);
      } else throw new Error();
    } catch { showToast("Failed to delete user", false); }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Delete this course permanently?")) return;
    try {
      const res = await courseAPI.delete(id);
      if (res?.ok) {
        setCourses((prev) => prev.filter((c) => c._id !== id));
        showToast("Course deleted", true);
      } else throw new Error();
    } catch { showToast("Failed to delete course", false); }
  };

  // ── Filtered lists ─────────────────────────────────────────────────────────
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.language.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "users", label: `Users (${users.length})` },
    { id: "courses", label: `Courses (${courses.length})` },
  ];

  return (
    <div className="min-h-screen bg-[#0a0908] text-white">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl border transition-all ${
          toast.ok
            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
            : "bg-red-500/20 border-red-500/30 text-red-300"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-stone-800/60 bg-[#0a0908]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
              V
            </div>
            <span className="font-bold text-white">VartaLang</span>
            <span className="text-stone-600 text-sm mx-2">/</span>
            <span className="text-stone-400 text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-500 hidden sm:block">{auth?.user?.email}</span>
            <button
              onClick={() => auth?.logout().then(() => router.replace("/auth/login"))}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-stone-400 hover:text-white border border-stone-700/50 hover:border-stone-500 rounded-lg transition-all"
            >
              {Icon.logout}
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">Manage users, courses, and platform activity.</p>
        </div>

        {/* Tab nav */}
        <div className="flex items-center gap-1 mb-8 bg-stone-900/60 border border-stone-700/50 rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSearch(""); }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? "bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/20"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Data loading spinner inside main */}
        {dataLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 animate-pulse" />
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Users"   value={stats.totalUsers ?? 0}       icon={Icon.users}       accent="text-amber-400 bg-amber-500" />
                  <StatCard label="Total Courses"  value={stats.totalCourses ?? 0}     icon={Icon.courses}     accent="text-sky-400 bg-sky-500" />
                  <StatCard label="Students"       value={stats.totalStudents ?? 0}    icon={Icon.students}    accent="text-emerald-400 bg-emerald-500" />
                  <StatCard label="Instructors"    value={stats.totalInstructors ?? 0} icon={Icon.instructors} accent="text-purple-400 bg-purple-500" />
                </div>

                {/* Recent users */}
                <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-hidden">
                  <div className="px-6 py-4 border-b border-stone-800/60 flex items-center justify-between">
                    <h2 className="font-semibold text-white">Recent Users</h2>
                    <button onClick={() => setTab("users")} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                      View all →
                    </button>
                  </div>
                  <div className="divide-y divide-stone-800/40">
                    {users.slice(0, 5).map((u) => (
                      <div key={u._id} className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-linear-to-br from-amber-500/30 to-orange-600/30 border border-amber-500/20 flex items-center justify-center text-amber-300 font-bold text-sm">
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{u.name}</p>
                            <p className="text-xs text-stone-500">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge label={u.role} colorClass={roleColor(u.role)} />
                          <span className="text-xs text-stone-600 hidden sm:block">{fmt(u.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && (
                      <p className="text-center py-8 text-stone-600 text-sm">No users yet</p>
                    )}
                  </div>
                </div>

                {/* Recent courses */}
                <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-hidden">
                  <div className="px-6 py-4 border-b border-stone-800/60 flex items-center justify-between">
                    <h2 className="font-semibold text-white">Recent Courses</h2>
                    <button onClick={() => setTab("courses")} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                      View all →
                    </button>
                  </div>
                  <div className="divide-y divide-stone-800/40">
                    {courses.slice(0, 5).map((c) => (
                      <div key={c._id} className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-white">{c.title}</p>
                          <p className="text-xs text-stone-500 mt-0.5">{c.instructor?.name} · {c.language}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge label={c.level} colorClass={levelColor(c.level)} />
                          <Badge
                            label={c.isPublished ? "Published" : "Draft"}
                            colorClass={c.isPublished
                              ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
                              : "text-stone-500 bg-stone-700/30 border-stone-600/30"}
                          />
                          <span className="text-xs text-stone-600 hidden sm:block">{c.enrolledCount} enrolled</span>
                        </div>
                      </div>
                    ))}
                    {courses.length === 0 && (
                      <p className="text-center py-8 text-stone-600 text-sm">No courses yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── USERS ── */}
            {tab === "users" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search users by name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full max-w-sm bg-stone-900/60 border border-stone-700/50 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all"
                />

                <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-hidden">
                  <div className="hidden sm:grid grid-cols-12 px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-800/60 bg-stone-950/30">
                    <span className="col-span-4">User</span>
                    <span className="col-span-2">Role</span>
                    <span className="col-span-2">Status</span>
                    <span className="col-span-2">Joined</span>
                    <span className="col-span-2 text-right">Actions</span>
                  </div>
                  <div className="divide-y divide-stone-800/40">
                    {filteredUsers.length === 0 ? (
                      <p className="text-center py-12 text-stone-600 text-sm">No users found</p>
                    ) : (
                      filteredUsers.map((u) => (
                        <div key={u._id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-white/2 transition-colors gap-y-2">
                          <div className="col-span-12 sm:col-span-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/15 flex items-center justify-center text-amber-300 font-bold text-sm shrink-0">
                              {u.name[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">{u.name}</p>
                              <p className="text-xs text-stone-500 truncate">{u.email}</p>
                            </div>
                          </div>
                          <div className="col-span-4 sm:col-span-2">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="bg-stone-800/60 border border-stone-700/50 text-xs text-stone-300 rounded-lg px-2 py-1.5 outline-none hover:border-amber-500/40 transition-colors cursor-pointer"
                            >
                              <option value="student">Student</option>
                              <option value="instructor">Instructor</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                          <div className="col-span-4 sm:col-span-2">
                            <button
                              onClick={() => handleToggle(u._id)}
                              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                                u.isActive
                                  ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30 hover:bg-emerald-400/20"
                                  : "text-red-400 bg-red-400/10 border-red-400/30 hover:bg-red-400/20"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-400" : "bg-red-400"}`} />
                              {u.isActive ? "Active" : "Inactive"}
                            </button>
                          </div>
                          <div className="col-span-4 sm:col-span-2 hidden sm:block">
                            <span className="text-xs text-stone-500">{fmt(u.createdAt)}</span>
                          </div>
                          <div className="col-span-4 sm:col-span-2 flex justify-end">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-2 text-stone-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                              title="Delete user"
                            >
                              {Icon.trash}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── COURSES ── */}
            {tab === "courses" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search courses by title or language…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full max-w-sm bg-stone-900/60 border border-stone-700/50 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all"
                />
                <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 overflow-hidden">
                  <div className="hidden sm:grid grid-cols-12 px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-800/60 bg-stone-950/30">
                    <span className="col-span-4">Course</span>
                    <span className="col-span-2">Language</span>
                    <span className="col-span-2">Level</span>
                    <span className="col-span-2">Status</span>
                    <span className="col-span-1 text-center">Enrolled</span>
                    <span className="col-span-1 text-right">Del</span>
                  </div>
                  <div className="divide-y divide-stone-800/40">
                    {filteredCourses.length === 0 ? (
                      <p className="text-center py-12 text-stone-600 text-sm">No courses found</p>
                    ) : (
                      filteredCourses.map((c) => (
                        <div key={c._id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-white/2 transition-colors gap-y-2">
                          <div className="col-span-12 sm:col-span-4">
                            <p className="text-sm font-medium text-white truncate">{c.title}</p>
                            <p className="text-xs text-stone-500 mt-0.5 truncate">{c.instructor?.name}</p>
                          </div>
                          <div className="col-span-3 sm:col-span-2">
                            <span className="text-xs text-stone-400">{c.language}</span>
                          </div>
                          <div className="col-span-3 sm:col-span-2">
                            <Badge label={c.level} colorClass={levelColor(c.level)} />
                          </div>
                          <div className="col-span-3 sm:col-span-2">
                            <Badge
                              label={c.isPublished ? "Published" : "Draft"}
                              colorClass={c.isPublished
                                ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
                                : "text-stone-500 bg-stone-700/30 border-stone-600/30"}
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-1 text-center">
                            <span className="text-xs font-semibold text-amber-400">{c.enrolledCount}</span>
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <button
                              onClick={() => handleDeleteCourse(c._id)}
                              className="p-2 text-stone-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                              title="Delete course"
                            >
                              {Icon.trash}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}