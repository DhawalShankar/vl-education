"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  LogOut,
  Star,
  Clock,
  ArrowRight,
  Play,
  File,
  FileText,
  Headphones,
  Globe,
  Layers,
  ChevronRight,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { courseAPI } from "../lib/api";

/* ── Helpers ──────────────────────────────── */
const LANGUAGE_ICONS: Record<string, string> = {
  Hindi: "📚", English: "🌍", Tamil: "🌴", Telugu: "🎭",
  Bengali: "📝", Marathi: "🏛️", Other: "🗣️",
};

const LANGUAGE_SLUGS: Record<string, string> = {
  Hindi: "hindi", English: "english", Tamil: "tamil",
  Telugu: "telugu", Bengali: "bengali", Marathi: "marathi",
};

const LEVEL_COLOR: Record<string, string> = {
  foundation:   "bg-green-500/20 text-green-300 border-green-500/30",
  beginner:     "bg-green-500/20 text-green-300 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  professional: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  advanced:     "bg-orange-500/20 text-orange-300 border-orange-500/30",
  mastery:      "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const RESOURCE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  video: { icon: Play,       color: "text-red-400" },
  pdf:   { icon: File,       color: "text-blue-400" },
  blog:  { icon: FileText,   color: "text-green-400" },
  audio: { icon: Headphones, color: "text-purple-400" },
};

const BROWSE_LANGUAGES = [
  { slug: "hindi",   name: "Hindi",   native: "हिंदी",  icon: "📚", color: "from-orange-500 to-red-500" },
  { slug: "english", name: "English", native: "English", icon: "🌍", color: "from-blue-500 to-cyan-500" },
  { slug: "tamil",   name: "Tamil",   native: "தமிழ்",  icon: "🌴", color: "from-red-500 to-pink-500" },
  { slug: "telugu",  name: "Telugu",  native: "తెలుగు", icon: "🎭", color: "from-yellow-500 to-orange-500" },
  { slug: "bengali", name: "Bengali", native: "বাংলা",  icon: "📝", color: "from-green-500 to-teal-500" },
  { slug: "marathi", name: "Marathi", native: "मराठी",  icon: "🏛️", color: "from-purple-500 to-pink-500" },
];

export default function StudentDashboard() {
  const auth = useAuth();
  const { user, logout, isAuthenticated, loading } = auth || {
    user: null, logout: async () => {}, isAuthenticated: false, loading: true,
  };
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/auth/login");
    if (!loading && user?.role === "admin") router.push("/dashboard/admin");
    if (!loading && user?.role === "instructor") router.push("/dashboard/instructor");
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        const [enrolledRes, allRes] = await Promise.all([
          courseAPI.getMyCourses(),
          courseAPI.getAll(),
        ]);
        if (enrolledRes) {
          const d = await enrolledRes.json();
          if (d.success) setCourses(d.data.courses);
        }
        if (allRes) {
          const d = await allRes.json();
          if (d.success) setAllCourses(d.data.courses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleEnroll = async (courseId: string) => {
    try {
      const res = await courseAPI.enroll(courseId);
      if (!res) throw new Error("Failed to enroll");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage({ type: "success", text: data.message });
      const updated = await courseAPI.getMyCourses();
      if (!updated) return;
      const updatedData = await updated.json();
      if (updatedData.success) setCourses(updatedData.data.courses);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-amber-400 font-kalam text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const enrolledIds = courses.map((c: any) => c._id);
  const availableCourses = allCourses.filter((c: any) => !enrolledIds.includes(c._id));

  // Group enrolled courses by language
  const byLanguage: Record<string, any[]> = {};
  courses.forEach((c: any) => {
    const lang = c.language || "Other";
    if (!byLanguage[lang]) byLanguage[lang] = [];
    byLanguage[lang].push(c);
  });

  const getProgress = (courseId: string) => {
    const key = `vl-done-${courseId}`;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved).length : 0;
    } catch { return 0; }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] text-white">

      {/* ── Header ── */}
      <div className="border-b border-stone-800/50 bg-stone-900/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-kalam text-xl font-bold text-white">VartaLang</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/20">
            Student
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-stone-400 text-sm hidden sm:block">Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-stone-500 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* Message */}
        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm ${
            message.type === "error"
              ? "bg-red-500/10 border border-red-500/20 text-red-300"
              : "bg-green-500/10 border border-green-500/20 text-green-300"
          }`}>
            {message.text}
          </div>
        )}

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: GraduationCap, label: "Enrolled Courses",   value: courses.length, color: "text-amber-400" },
            { icon: Globe,         label: "Languages Learning", value: Object.keys(byLanguage).length, color: "text-blue-400" },
            { icon: TrendingUp,    label: "Available Courses",  value: availableCourses.length, color: "text-green-400" },
            { icon: Star,          label: "Courses Available",  value: allCourses.length, color: "text-purple-400" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-stone-900/60 border border-stone-700/50 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-800/50 flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-stone-500">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── My Enrolled Courses (grouped by language) ── */}
        <div>
          <h2 className="font-kalam text-3xl font-bold text-white mb-6">My Courses</h2>

          {courses.length === 0 ? (
            <div className="bg-stone-900/40 border border-stone-700/50 rounded-2xl p-10 text-center text-stone-500">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-amber-400/30" />
              <p>You haven&apos;t enrolled in any course yet.</p>
              <p className="text-sm mt-1">Browse languages below to get started!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(byLanguage).map(([lang, langCourses]) => {
                const slug = LANGUAGE_SLUGS[lang] || lang.toLowerCase();
                const icon = LANGUAGE_ICONS[lang] || "🗣️";
                return (
                  <div key={lang}>
                    {/* Language header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <h3 className="font-kalam text-xl font-bold text-white">{lang}</h3>
                        <span className="text-xs text-stone-500">{langCourses.length} course{langCourses.length !== 1 ? "s" : ""}</span>
                      </div>
                      <Link
                        href={`/learn/${slug}`}
                        className="hidden md:flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                      >
                        More {lang} courses <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Course cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {langCourses.map((course: any) => {
                        const done = getProgress(course._id);
                        const total = course.resources?.length || 0;
                        const pct = total ? Math.round((done / total) * 100) : 0;
                        const types = [...new Set((course.resources || []).map((r: any) => r.type))].slice(0, 3);

                        return (
                          <div key={course._id} className="bg-stone-900/60 border border-stone-700/50 rounded-2xl p-5 hover:border-amber-500/30 transition-all group flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                              <span className={`text-xs px-2 py-1 rounded-full border font-semibold capitalize ${LEVEL_COLOR[course.level] || "bg-stone-500/20 text-stone-300 border-stone-500/30"}`}>
                                {course.level}
                              </span>
                              {total > 0 && (
                                <span className="text-xs text-stone-500">{pct}% done</span>
                              )}
                            </div>

                            <h4 className="font-kalam text-lg font-bold text-white mb-1 leading-snug">{course.title}</h4>
                            <p className="text-stone-500 text-sm mb-3 line-clamp-2 flex-1">{course.description}</p>

                            {/* Resource types */}
                            {types.length > 0 && (
                              <div className="flex items-center gap-2 mb-3">
                                {types.map((t: any) => {
                                  const ri = RESOURCE_ICONS[t];
                                  if (!ri) return null;
                                  const Icon = ri.icon;
                                  return <Icon key={t} className={`w-4 h-4 ${ri.color}`} />;
                                })}
                                <span className="text-xs text-stone-500">{total} resources</span>
                              </div>
                            )}

                            {/* Progress bar */}
                            {total > 0 && (
                              <div className="w-full h-1.5 rounded-full bg-stone-800 mb-3 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            )}

                            <Link
                              href={`/learn/${slug}/${course._id}`}
                              className="w-full py-2.5 rounded-xl font-kalam font-bold text-sm text-center bg-gradient-to-r from-amber-500/20 to-orange-600/20 hover:from-amber-500 hover:to-orange-600 text-amber-300 hover:text-white border border-amber-500/30 hover:border-transparent transition-all flex items-center justify-center gap-2"
                            >
                              Continue Learning <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Browse Languages ── */}
        <div>
          <h2 className="font-kalam text-3xl font-bold text-white mb-6">Explore Languages</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {BROWSE_LANGUAGES.map((lang) => (
              <Link
                key={lang.slug}
                href={`/learn/${lang.slug}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lang.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {lang.icon}
                </div>
                <div>
                  <p className="font-kalam font-bold text-white text-sm">{lang.name}</p>
                  <p className="text-xs text-stone-500">{lang.native}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Available Courses to Enroll ── */}
        {availableCourses.length > 0 && (
          <div>
            <h2 className="font-kalam text-3xl font-bold text-white mb-6">Discover Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableCourses.map((course: any) => {
                const slug = LANGUAGE_SLUGS[course.language] || (course.language || "").toLowerCase();
                const icon = LANGUAGE_ICONS[course.language] || "🗣️";
                const types = [...new Set((course.resources || []).map((r: any) => r.type))].slice(0, 3);

                return (
                  <div key={course._id} className="bg-stone-900/60 border border-stone-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all group flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{icon}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border font-semibold capitalize ${LEVEL_COLOR[course.level] || "bg-stone-500/20 text-stone-300 border-stone-500/30"}`}>
                        {course.level}
                      </span>
                    </div>
                    <h4 className="font-kalam text-xl font-bold text-white mb-2">{course.title}</h4>
                    <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-1">{course.description}</p>

                    {types.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        {types.map((t: any) => {
                          const ri = RESOURCE_ICONS[t];
                          if (!ri) return null;
                          const Icon = ri.icon;
                          return <Icon key={t} className={`w-4 h-4 ${ri.color}`} />;
                        })}
                        {course.resources?.length && (
                          <span className="text-xs text-stone-500">{course.resources.length} resources</span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-kalam font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        Enroll <ArrowRight className="w-4 h-4" />
                      </button>
                      {slug && (
                        <Link
                          href={`/learn/${slug}`}
                          className="px-3 py-2.5 rounded-xl border border-stone-700/50 bg-stone-800/50 hover:border-amber-500/30 text-stone-400 hover:text-amber-400 transition-all"
                          title="View language"
                        >
                          <Globe className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}