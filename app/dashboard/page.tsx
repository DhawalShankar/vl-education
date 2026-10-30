"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
  Headphones,
  Trophy,
  Compass,
  Play,
  CheckCircle,
  Clock,
  Layers,
  ChevronRight,
  Shield,
  Zap
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { enrollmentAPI } from "../lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUserStreak } from "../lib/streak";

interface EnrolledCourse {
  _id?: string;
  id?: string;
  title?: string;
  course_title?: string;
  language?: string;
  level?: string;
  progress_percent?: number;
  total_lessons?: number;
  completed_lessons?: number;
}

const RECOMMENDED_COURSES = [
  {
    id: "rec-hindi",
    title: "Hindi for Beginners: Script & Essentials",
    language: "Hindi",
    langSlug: "hindi",
    flag: "📚",
    level: "Foundation",
    duration: "8 Weeks",
    lessons: 24,
    color: "from-orange-500 to-red-600",
  },
  {
    id: "rec-tamil",
    title: "Conversational Tamil: Daily Life Dialogues",
    language: "Tamil",
    langSlug: "tamil",
    flag: "🌴",
    level: "Intermediate",
    duration: "6 Weeks",
    lessons: 18,
    color: "from-red-500 to-pink-600",
  },
  {
    id: "rec-english",
    title: "IELTS Academic & Band 7+ Writing Masterclass",
    language: "English",
    langSlug: "english",
    flag: "🌍",
    level: "Professional",
    duration: "10 Weeks",
    lessons: 32,
    color: "from-blue-500 to-cyan-600",
  },
];

const POPULAR_LANGUAGES = [
  { name: "Hindi", slug: "hindi", icon: "📚", count: "245+ lessons" },
  { name: "Tamil", slug: "tamil", icon: "🌴", count: "198+ lessons" },
  { name: "Telugu", slug: "telugu", icon: "🎭", count: "176+ lessons" },
  { name: "Bengali", slug: "bengali", icon: "📝", count: "160+ lessons" },
  { name: "Marathi", slug: "marathi", icon: "🏛️", count: "140+ lessons" },
  { name: "English", slug: "english", icon: "🌍", count: "310+ lessons" },
];

export default function StudentDashboard() {
  const auth = useAuth();
  const router = useRouter();
  const user = auth?.user;
  const loading = auth?.loading ?? true;

  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const { streak } = useUserStreak(user?.email || user?.id);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
      return;
    }

    if (user) {
      loadMyCourses();
    }
  }, [loading, user, router]);

  const loadMyCourses = async () => {
    setFetchingCourses(true);
    try {
      const data = await enrollmentAPI.getMyCourses();
      if (Array.isArray(data)) {
        setEnrolledCourses(data);
      } else if (data?.courses && Array.isArray(data.courses)) {
        setEnrolledCourses(data.courses);
      } else {
        setEnrolledCourses([]);
      }
    } catch {
      setEnrolledCourses([]);
    } finally {
      setFetchingCourses(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-300 font-medium font-kalam text-lg">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex flex-col justify-between">
      {/* Floating Main Platform Navbar */}
      <Navbar />

      {/* Background Ambience */}
      <div
        className="fixed inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-orange-950/15 pointer-events-none" />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        {/* Role Notice Banner (if Admin or Instructor) */}
        {(user.role === "admin" || user.email?.toLowerCase() === "cosmoindiaprakashan@gmail.com") && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Administrator Access Enabled</p>
                <p className="text-xs text-stone-400">
                  You are signed in with system admin privileges. Access user management and portal controls.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/admin"
              className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Open Admin Panel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {user.role === "instructor" && (
          <div className="mb-8 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Instructor Studio Enabled</p>
                <p className="text-xs text-stone-400">
                  You have educator tools available. Create, publish, and manage curriculum modules.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/instructor"
              className="shrink-0 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Open Instructor Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Hero Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-200 capitalize">
                {user.role} Dashboard
              </span>
            </div>
            <h1 className="font-kalam text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
              Welcome back, {user.full_name || "Learner"} 👋
            </h1>
            <p className="text-stone-400 text-base max-w-xl">
              Track your daily progress, jump into practice labs, and master Indian languages.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/practice"
              className="px-5 py-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 text-stone-200 hover:text-white text-sm font-medium transition-all flex items-center gap-2"
            >
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>Practice Labs</span>
            </Link>
            <Link
              href="/learn"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-sm font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <span>Browse Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-stone-400">Enrolled Courses</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <p className="font-kalam text-3xl font-bold text-white mb-1">
              {enrolledCourses.length}
            </p>
            <span className="text-xs text-stone-500">Active learning tracks</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-stone-400">Daily Streak</span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <p className="font-kalam text-3xl font-bold text-orange-400 mb-1">
              {streak.currentStreak} Day{streak.currentStreak === 1 ? "" : "s"}
            </p>
            <span className="text-xs text-stone-500">
              {streak.currentStreak === 1
                ? "Practice today to build momentum!"
                : `Best: ${streak.longestStreak} days · ${streak.totalDaysActive} active`}
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-stone-400">Interactive Labs</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="font-kalam text-3xl font-bold text-white mb-1">6 Labs</p>
            <span className="text-xs text-stone-500">Voice & dictation ready</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-stone-400">Certificates</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="font-kalam text-3xl font-bold text-white mb-1">Coming Soon</p>
            <span className="text-xs text-stone-500">Official verified badges</span>
          </div>
        </div>

        {/* Section 1: Enrolled Courses / Active Learning */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="font-kalam text-2xl font-bold text-white">Continue Learning</h2>
            </div>
            <Link
              href="/learn"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {fetchingCourses ? (
            <div className="p-10 rounded-2xl bg-stone-900/40 border border-stone-800/80 text-center">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-stone-400 text-sm">Loading your enrolled courses…</p>
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((c, i) => {
                const title = c.title || c.course_title || `Enrolled Course #${i + 1}`;
                const lang = c.language || "Hindi";
                const level = c.level || "Beginner";
                const progress = c.progress_percent ?? 25;
                const courseId = c._id || c.id || "c1";

                return (
                  <div
                    key={courseId}
                    className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-semibold">
                          {lang}
                        </span>
                        <span className="text-xs text-stone-500 capitalize">{level}</span>
                      </div>
                      <h3 className="font-kalam text-xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                        {title}
                      </h3>
                    </div>

                    <div className="pt-4 border-t border-stone-800/80 mt-4">
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                        <span>Progress</span>
                        <span className="text-amber-400 font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden mb-4">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
                        />
                      </div>
                      <Link
                        href={`/learn/${lang.toLowerCase()}`}
                        className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-semibold font-kalam flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Resume Lesson</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State: Friendly Onboarding Box */
            <div className="p-8 sm:p-10 rounded-3xl bg-stone-900/50 border border-stone-800/80 backdrop-blur-md text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="font-kalam text-2xl font-bold text-white mb-2">
                Begin Your First Language Track
              </h3>
              <p className="text-stone-400 text-sm max-w-md mx-auto mb-6">
                You haven&apos;t enrolled in any courses yet. Choose a language below to start learning
                with expert videos, interactive exercises, and audio lessons.
              </p>

              {/* Popular Language Quick Pick */}
              <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto mb-8">
                {POPULAR_LANGUAGES.map((lang) => (
                  <Link
                    key={lang.slug}
                    href={`/learn/${lang.slug}`}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800 text-stone-300 hover:text-white text-xs transition-all"
                  >
                    <span>{lang.icon}</span>
                    <span className="font-semibold">{lang.name}</span>
                    <span className="text-[10px] text-stone-500 hidden sm:inline">{lang.count}</span>
                  </Link>
                ))}
              </div>

              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
              >
                <span>Explore Full Course Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Interactive Modules Hub */}
        <div className="mb-14">
          <h2 className="font-kalam text-2xl font-bold text-white mb-6">
            Interactive Learning Hub
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/practice"
              className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-indigo-500/50 transition-all hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="font-kalam text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  Practice Labs
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Real-time listening, dictation, sound recognition, and pronunciation recordings.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 mt-6 group-hover:translate-x-1 transition-transform">
                <span>Start Practice</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/challenges"
              className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-orange-500/50 transition-all hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white mb-4 shadow-lg">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="font-kalam text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                  Challenges &amp; Duels
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Daily vocabulary battles, script sprint races, and leaderboard competitions.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-orange-400 mt-6 group-hover:translate-x-1 transition-transform">
                <span>View Challenges</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/certifications"
              className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-purple-500/50 transition-all hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4 shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-kalam text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  Certifications
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Structured assessment tracks for language proficiency, IELTS readiness, and teachers.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-purple-400 mt-6 group-hover:translate-x-1 transition-transform">
                <span>Explore Tracks</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* Section 3: Recommended Tracks */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-kalam text-2xl font-bold text-white">Recommended For You</h2>
            <Link
              href="/learn"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {RECOMMENDED_COURSES.map((course) => (
              <div
                key={course.id}
                className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{course.flag}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-xs font-medium border border-stone-700/60">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="font-kalam text-xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-stone-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {course.lessons} Lessons
                    </span>
                  </div>
                </div>

                <Link
                  href={`/learn/${course.langSlug}`}
                  className="w-full py-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-white text-xs font-semibold font-kalam flex items-center justify-center gap-1.5 transition-all group-hover:bg-amber-500 group-hover:text-stone-950 group-hover:border-amber-500"
                >
                  <span>Start Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Global Minimalist Footer */}
      <Footer />
    </div>
  );
}
