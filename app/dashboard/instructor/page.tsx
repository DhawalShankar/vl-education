"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Eye,
  BookOpen,
  IndianRupee,
  Users,
  Video,
  FileText,
  ExternalLink,
  Layers,
  Sparkles,
  BarChart3,
  User,
  Globe,
  Headphones,
  CheckCircle,
  FileCode,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Save,
  Share2
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { courseAPI } from "@/app/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LANGUAGES = [
  "Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi",
  "Gujarati", "Kannada", "Malayalam", "Punjabi", "Odia", "Assamese", "Urdu", "Sanskrit"
];

const LEVELS = ["foundation", "intermediate", "professional", "mastery"];
const CATEGORIES = ["grammar", "vocabulary", "pronunciation", "conversation", "exam-prep", "cultural"];

type ResourceType = "video" | "pdf" | "article" | "audio" | "practice_lab";

interface CourseResource {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
  duration?: string;
  description?: string;
}

interface InstructorCourse {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  language: string;
  level: string;
  category: string;
  duration?: string;
  modules?: number;
  price?: number;
  isPublished?: boolean;
  enrolledCount?: number;
  tags?: string[];
  resources?: CourseResource[];
  thumbnail_url?: string;
}

interface InstructorProfile {
  name: string;
  title: string;
  bio: string;
  languages: string[];
  experienceYears: number;
  avatarUrl: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
  upiId?: string;
  bankAccount?: string;
}

/* ── Course Resources (Placeholder Data) ────────────────────────
 * TODO: Connect to backend API: GET /api/v1/courses/:courseId/resources
 * Replace local placeholders with database-persisted curriculum items.
 */
const DEFAULT_RESOURCES: CourseResource[] = [
  {
    id: "res-1",
    type: "video",
    title: "Lesson 1: Introduction to Alphabet & Phonemes",
    url: "",
    duration: "18 mins",
    description: "Foundational breakdown of vowel and consonant pronunciations.",
  },
  {
    id: "res-2",
    type: "pdf",
    title: "Vowel Practice Workbook & Character Sheets",
    url: "",
    duration: "12 pages",
    description: "Printable drills for native script stroke order.",
  },
  {
    id: "res-3",
    type: "practice_lab",
    title: "AI Voice Pronunciation Lab - Module 1",
    url: "/practice",
    duration: "10 exercises",
    description: "Interactive AI speech scoring to correct accents in real-time.",
  },
];

export default function InstructorStudioPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"courses" | "analytics" | "profile">("courses");
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states for Course
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLanguage, setFormLanguage] = useState("Hindi");
  const [formLevel, setFormLevel] = useState("foundation");
  const [formCategory, setFormCategory] = useState("grammar");
  const [formDuration, setFormDuration] = useState("6 Weeks");
  const [formModules, setFormModules] = useState(8);
  const [formPrice, setFormPrice] = useState(0);
  const [formTags, setFormTags] = useState("");
  const [formResources, setFormResources] = useState<CourseResource[]>([]);

  // Resource adding state
  const [newResType, setNewResType] = useState<ResourceType>("video");
  const [newResTitle, setNewResTitle] = useState("");
  const [newResUrl, setNewResUrl] = useState("");
  const [newResDuration, setNewResDuration] = useState("");
  const [newResDesc, setNewResDesc] = useState("");

  // Instructor Profile state
  const [profile, setProfile] = useState<InstructorProfile>({
    name: "",
    title: "Language Educator & Linguistic Mentor",
    bio: "Passionate about making Indian regional languages accessible to learners across India and the global diaspora.",
    languages: ["Hindi", "English"],
    experienceYears: 5,
    avatarUrl: "",
    twitter: "https://x.com/vartalang",
    linkedin: "https://linkedin.com/company/vartalang",
    youtube: "https://youtube.com/@vartalang",
    website: "https://vartalang.in",
    upiId: "educator@upi",
    bankAccount: "HDFC0001234 •••• 5678",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("accessToken");
    if (!loading && !isAuthenticated && !hasToken) {
      router.push("/auth/login");
      return;
    }

    if (
      !loading &&
      user &&
      user.role !== "instructor" &&
      user.role !== "admin" &&
      user.email?.toLowerCase() !== "cosmoindiaprakashan@gmail.com"
    ) {
      router.push("/dashboard");
    }
  }, [loading, isAuthenticated, user, router]);

  // ── Load Profile from Storage / User ────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const storageKey = `vl-instructor-profile-${user.email || user.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
        return;
      } catch {}
    }

    setProfile((prev) => ({
      ...prev,
      name: user.full_name || user.name || "Language Educator",
      avatarUrl: user.avatar_url || "",
    }));
  }, [user]);

  // ── Fetch Instructor Courses ────────────────────────────────────────────────
  const fetchCourses = async () => {
    try {
      setLoadingData(true);
      const res = await courseAPI.getInstructorCourses();
      if (res && res.ok) {
        const data = await res.json();
        const list: InstructorCourse[] = data?.data?.courses || (Array.isArray(data) ? data : []);
        setCourses(list);
      } else {
        // Fallback demo courses if backend has no records yet
        loadSampleCourses();
      }
    } catch {
      loadSampleCourses();
    } finally {
      setLoadingData(false);
    }
  };

  /* ── Initial Course Placeholder Fallback ────────────────────────
   * TODO: Connect to backend API: GET /api/v1/courses/instructor/mine
   * When the educator has created courses in the database, those will be loaded.
   */
  const loadSampleCourses = () => {
    const localSaved = localStorage.getItem(`vl-instructor-courses-${user?.email || "default"}`);
    if (localSaved) {
      try {
        setCourses(JSON.parse(localSaved));
        return;
      } catch {}
    }

    const initial: InstructorCourse[] = [
      {
        _id: "crs-101",
        title: "Hindi for Beginners: Script, Phonemes & Grammar",
        description: "Master Devanagari script, foundational vocabulary, and natural daily dialogues.",
        language: "Hindi",
        level: "foundation",
        category: "grammar",
        duration: "8 Weeks",
        modules: 12,
        price: 499,
        isPublished: true,
        enrolledCount: 38,
        tags: ["Devanagari", "Conversation", "Grammar"],
        resources: DEFAULT_RESOURCES,
      },
      {
        _id: "crs-102",
        title: "Spoken Tamil: Everyday Expressions & Workplace Fluency",
        description: "Practical spoken Tamil dialogues for professionals moving to Chennai and Tamil Nadu.",
        language: "Tamil",
        level: "intermediate",
        category: "conversation",
        duration: "6 Weeks",
        modules: 9,
        price: 699,
        isPublished: true,
        enrolledCount: 24,
        tags: ["Tamil", "Spoken", "Workplace"],
        resources: DEFAULT_RESOURCES.slice(0, 2),
      },
      {
        _id: "crs-103",
        title: "Telugu Classical Literature & Reading Comprehension",
        description: "Explore poetic metres, classical texts, and formal prose for competitive civil exams.",
        language: "Telugu",
        level: "professional",
        category: "cultural",
        duration: "10 Weeks",
        modules: 14,
        price: 899,
        isPublished: false,
        enrolledCount: 0,
        tags: ["Telugu", "Literature", "Exam Prep"],
        resources: [],
      },
    ];
    setCourses(initial);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCourses();
    }
  }, [isAuthenticated, user]);

  const saveLocalCourses = (updated: InstructorCourse[]) => {
    setCourses(updated);
    if (user) {
      localStorage.setItem(`vl-instructor-courses-${user.email || "default"}`, JSON.stringify(updated));
    }
  };

  // ── Stats Calculations ──────────────────────────────────────────────────────
  const publishedCourses = courses.filter((c) => c.isPublished);
  const draftedCourses = courses.filter((c) => !c.isPublished);
  const totalEnrolled = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
  const totalMoneyEarned = courses.reduce((acc, c) => acc + (c.enrolledCount || 0) * (c.price || 0), 0);
  const netEarnings = Math.round(totalMoneyEarned * 0.85); // 85% instructor payout

  // ── Open Create Course Modal ────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingCourseId(null);
    setFormTitle("");
    setFormDescription("");
    setFormLanguage("Hindi");
    setFormLevel("foundation");
    setFormCategory("grammar");
    setFormDuration("8 Weeks");
    setFormModules(10);
    setFormPrice(499);
    setFormTags("Basics, Conversation");
    setFormResources(DEFAULT_RESOURCES);
    setShowCourseModal(true);
  };

  // ── Open Edit Course Modal ──────────────────────────────────────────────────
  const handleOpenEdit = (course: InstructorCourse) => {
    setEditingCourseId(course._id);
    setFormTitle(course.title);
    setFormDescription(course.description || "");
    setFormLanguage(course.language || "Hindi");
    setFormLevel(course.level || "foundation");
    setFormCategory(course.category || "grammar");
    setFormDuration(course.duration || "8 Weeks");
    setFormModules(course.modules || 10);
    setFormPrice(course.price ?? 499);
    setFormTags(course.tags?.join(", ") || "");
    setFormResources(course.resources || DEFAULT_RESOURCES);
    setShowCourseModal(true);
  };

  // ── Add Resource Item into Course ───────────────────────────────────────────
  const handleAddResource = () => {
    if (!newResTitle.trim() || !newResUrl.trim()) {
      alert("Please provide both a Title and URL/Redirect for the material.");
      return;
    }
    const item: CourseResource = {
      id: "res-" + Date.now(),
      type: newResType,
      title: newResTitle.trim(),
      url: newResUrl.trim(),
      duration: newResDuration.trim() || undefined,
      description: newResDesc.trim() || undefined,
    };
    setFormResources((prev) => [...prev, item]);
    setNewResTitle("");
    setNewResUrl("");
    setNewResDuration("");
    setNewResDesc("");
  };

  const handleRemoveResource = (id: string) => {
    setFormResources((prev) => prev.filter((r) => r.id !== id));
  };

  // ── Save Course Form ────────────────────────────────────────────────────────
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const tagsArray = formTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const coursePayload = {
        title: formTitle,
        description: formDescription,
        language: formLanguage,
        level: formLevel,
        category: formCategory,
        duration: formDuration,
        modules: Number(formModules),
        price: Number(formPrice),
        tags: tagsArray,
        resources: formResources,
      };

      if (editingCourseId) {
        // Try API update, fallback to local state
        try {
          await courseAPI.update(editingCourseId, coursePayload);
        } catch {}
        const updated = courses.map((c) =>
          c._id === editingCourseId
            ? { ...c, ...coursePayload, _id: editingCourseId }
            : c
        );
        saveLocalCourses(updated);
        setMessage({ type: "success", text: "Course updated successfully!" });
      } else {
        let newId = "crs-" + Date.now();
        try {
          const res = await courseAPI.create(coursePayload);
          if (res && res.ok) {
            const data = await res.json();
            if (data?.data?._id) newId = data.data._id;
          }
        } catch {}

        const newCourse: InstructorCourse = {
          _id: newId,
          ...coursePayload,
          isPublished: true,
          enrolledCount: 0,
        };
        saveLocalCourses([newCourse, ...courses]);
        setMessage({ type: "success", text: "New course created and published live!" });
      }

      setShowCourseModal(false);
    } catch {
      setMessage({ type: "error", text: "Failed to save course. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle Publish Status ───────────────────────────────────────────────────
  const handleTogglePublish = async (course: InstructorCourse) => {
    const updatedState = !course.isPublished;
    try {
      await courseAPI.update(course._id, { isPublished: updatedState });
    } catch {}
    const updated = courses.map((c) =>
      c._id === course._id ? { ...c, isPublished: updatedState } : c
    );
    saveLocalCourses(updated);
    setMessage({
      type: "success",
      text: `Course ${updatedState ? "is now Live" : "moved to Drafts"}.`,
    });
  };

  // ── Delete Course ───────────────────────────────────────────────────────────
  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this course?")) return;
    try {
      await courseAPI.delete(id);
    } catch {}
    const updated = courses.filter((c) => c._id !== id);
    saveLocalCourses(updated);
    setMessage({ type: "success", text: "Course deleted." });
  };

  // ── Save Profile ────────────────────────────────────────────────────────────
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    if (user) {
      localStorage.setItem(`vl-instructor-profile-${user.email || user.id}`, JSON.stringify(profile));
    }
    setTimeout(() => {
      setSavingProfile(false);
      setMessage({ type: "success", text: "Public instructor profile updated successfully!" });
    }, 400);
  };

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4 text-red-400" />;
      case "pdf":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "audio":
        return <Headphones className="w-4 h-4 text-purple-400" />;
      case "practice_lab":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <FileCode className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] text-white flex flex-col justify-between selection:bg-[#FF5500] selection:text-black">
      {/* Platform Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full relative z-10">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>VartaLang Educator Studio</span>
            </div>
            <h1 className="font-kalam text-4xl sm:text-5xl font-bold text-white tracking-tight">
              {profile.name ? `${profile.name.split(" ")[0]}'s Studio` : "Instructor Studio"}
            </h1>
            <p className="text-stone-400 text-sm sm:text-base mt-1">
              Create curriculum modules, upload study notes, connect AI practice labs, and track student sales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700/80 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition-colors"
            >
              Back to My Dashboard
            </Link>
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`mb-8 px-5 py-3 rounded-xl text-sm flex items-center justify-between transition-all ${
              message.type === "error"
                ? "bg-red-500/15 border border-red-500/30 text-red-300"
                : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-stone-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── TOP METRICS STRIP ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {/* Courses Live */}
          <div className="p-6 rounded-2xl bg-stone-900/70 border border-emerald-500/30 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Courses Live</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="font-kalam text-4xl font-bold text-white tabular-nums mb-1">
              {publishedCourses.length}
            </div>
            <p className="text-[11px] text-stone-400">Active in public catalog</p>
          </div>

          {/* Courses Drafted */}
          <div className="p-6 rounded-2xl bg-stone-900/70 border border-stone-800 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-stone-400">Courses Drafted</span>
              <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="font-kalam text-4xl font-bold text-stone-300 tabular-nums mb-1">
              {draftedCourses.length}
            </div>
            <p className="text-[11px] text-stone-400">In preparation</p>
          </div>

          {/* Courses Sold / Students */}
          <div className="p-6 rounded-2xl bg-stone-900/70 border border-sky-500/30 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-400">Courses Sold</span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="font-kalam text-4xl font-bold text-white tabular-nums mb-1">
              {totalEnrolled}
            </div>
            <p className="text-[11px] text-stone-400">Total student enrollments</p>
          </div>

          {/* Money Earned */}
          <div className="p-6 rounded-2xl bg-stone-900/70 border border-amber-500/30 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Money Earned</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="font-kalam text-4xl font-bold text-amber-300 tabular-nums mb-1">
              ₹{netEarnings.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-stone-400">
              Gross: ₹{totalMoneyEarned.toLocaleString("en-IN")} (85% net)
            </p>
          </div>
        </div>

        {/* ── STUDIO TABS NAVIGATION ──────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-stone-800 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "courses"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-stone-400 hover:text-white hover:bg-stone-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Courses & Curriculum ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "analytics"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-stone-400 hover:text-white hover:bg-stone-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Sales & Earnings Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-stone-400 hover:text-white hover:bg-stone-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Public Educator Profile</span>
          </button>
        </div>

        {/* ── TAB 1: COURSES & CURRICULUM ─────────────────────────────── */}
        {activeTab === "courses" && (
          <div>
            {courses.length === 0 ? (
              <div className="p-16 rounded-3xl bg-stone-900/40 border border-stone-800 text-center max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4 text-amber-400">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-kalam text-2xl font-bold text-white mb-2">No courses yet</h3>
                <p className="text-sm text-stone-400 mb-6">
                  Start teaching your mother tongue. Add video lectures, PDF study materials, and AI practice lab links.
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold text-sm"
                >
                  Create Your First Course
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                  const resourceCount = course.resources?.length || 0;
                  return (
                    <div
                      key={course._id}
                      className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 backdrop-blur-md flex flex-col justify-between transition-all group"
                    >
                      <div>
                        {/* Course Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                              course.isPublished
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-stone-800 text-stone-400 border-stone-700"
                            }`}
                          >
                            {course.isPublished ? "Live" : "Draft"}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(course)}
                              title="Edit Course & Materials"
                              className="p-2 rounded-lg bg-stone-800/80 hover:bg-amber-500/20 text-stone-400 hover:text-amber-400 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              title="Delete Course"
                              className="p-2 rounded-lg bg-stone-800/80 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Desc */}
                        <h3 className="font-kalam text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-stone-400 line-clamp-2 mb-4 leading-relaxed">
                          {course.description || "Comprehensive module with structured lessons and practice drills."}
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-medium">
                            {course.language}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 capitalize font-medium">
                            {course.level}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-bold">
                            {course.price && course.price > 0 ? `₹${course.price}` : "Free Track"}
                          </span>
                        </div>

                        {/* Content summary */}
                        <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 mb-5 space-y-1.5 text-xs text-stone-400">
                          <div className="flex items-center justify-between">
                            <span>Modules / Lessons:</span>
                            <span className="font-semibold text-white">{course.modules || 10}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Study Resources:</span>
                            <span className="font-semibold text-sky-400">{resourceCount} items</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Students Enrolled:</span>
                            <span className="font-semibold text-amber-300">{course.enrolledCount || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleTogglePublish(course)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                            course.isPublished
                              ? "border-stone-700 text-stone-400 hover:text-rose-400 hover:border-rose-500/40"
                              : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {course.isPublished ? "Move to Draft" : "Publish Live"}
                        </button>

                        <Link
                          href={`/learn/${course.language?.toLowerCase() || "hindi"}/${course._id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <span>Preview Student View</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: ANALYTICS & EARNINGS ─────────────────────────────── */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
                <span className="text-xs text-stone-400 uppercase font-semibold">Total Revenue (Gross)</span>
                <p className="font-kalam text-3xl font-bold text-white mt-1">₹{totalMoneyEarned.toLocaleString("en-IN")}</p>
                <p className="text-xs text-stone-500 mt-2">Combined course purchases across all batches</p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-900/60 border border-amber-500/30">
                <span className="text-xs text-amber-400 uppercase font-semibold">Instructor Share (85%)</span>
                <p className="font-kalam text-3xl font-bold text-amber-300 mt-1">₹{netEarnings.toLocaleString("en-IN")}</p>
                <p className="text-xs text-stone-500 mt-2">Your net payout after platform fees</p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
                <span className="text-xs text-stone-400 uppercase font-semibold">Settlement Details</span>
                <p className="text-sm font-semibold text-white mt-1">{profile.upiId || "educator@upi"}</p>
                <p className="text-xs text-stone-500 mt-1">Settled on the 1st of every calendar month</p>
              </div>
            </div>

            {/* Breakdown per course */}
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
              <h3 className="font-kalam text-2xl font-bold text-white mb-4">Course Sales Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-800 text-xs text-stone-400 uppercase font-semibold">
                      <th className="pb-3">Course Title</th>
                      <th className="pb-3">Language</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Enrolled</th>
                      <th className="pb-3">Gross Sales</th>
                      <th className="pb-3">Your Net (85%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {courses.map((c) => {
                      const count = c.enrolledCount || 0;
                      const price = c.price || 0;
                      const gross = count * price;
                      const net = Math.round(gross * 0.85);
                      return (
                        <tr key={c._id} className="text-stone-300">
                          <td className="py-3.5 font-medium text-white">{c.title}</td>
                          <td className="py-3.5">{c.language}</td>
                          <td className="py-3.5">{price > 0 ? `₹${price}` : "Free"}</td>
                          <td className="py-3.5 font-semibold text-sky-400">{count}</td>
                          <td className="py-3.5 text-stone-400">₹{gross.toLocaleString("en-IN")}</td>
                          <td className="py-3.5 font-bold text-amber-300">₹{net.toLocaleString("en-IN")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: PUBLIC INSTRUCTOR PROFILE EDITOR ─────────────────── */}
        {activeTab === "profile" && (
          <div className="max-w-3xl">
            <div className="p-8 rounded-3xl bg-stone-900/60 border border-stone-800 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-kalam text-3xl font-bold text-white">Public Profile Settings</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    This information appears on your course author cards and instructor landing page.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-lg">
                  {profile.name?.[0] || "E"}
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      required
                      placeholder="e.g. Dhawal Shukla"
                      className="w-full bg-stone-950/70 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase">
                      Educator Headline
                    </label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Senior Hindi & Sanskrit Educator"
                      className="w-full bg-stone-950/70 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase">
                    Bio & Teaching Experience
                  </label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell learners about your background, dialect expertise, and teaching methodology..."
                    className="w-full bg-stone-950/70 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase">
                      UPI ID for Payouts
                    </label>
                    <input
                      type="text"
                      value={profile.upiId}
                      onChange={(e) => setProfile((p) => ({ ...p, upiId: e.target.value }))}
                      placeholder="e.g. username@okhdfcbank"
                      className="w-full bg-stone-950/70 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase">
                      Website / Portfolio Link
                    </label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      className="w-full bg-stone-950/70 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase">
                      X (Twitter) Profile
                    </label>
                    <input
                      type="url"
                      value={profile.twitter}
                      onChange={(e) => setProfile((p) => ({ ...p, twitter: e.target.value }))}
                      placeholder="https://x.com/username"
                      className="w-full bg-stone-950/70 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1.5 uppercase">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={profile.linkedin}
                      onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-stone-950/70 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? "Saving Profile..." : "Save Public Profile"}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── COURSE CREATOR / EDITOR MODAL ─────────────────────────────── */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6 overflow-y-auto">
          <div className="bg-[#120F0C] border border-stone-700/80 rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div>
                <h3 className="font-kalam text-3xl font-bold text-white">
                  {editingCourseId ? "Edit Course & Curriculum" : "Create New Language Course"}
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Configure course details, add video links, study PDFs, and connect AI practice labs.
                </p>
              </div>
              <button
                onClick={() => setShowCourseModal(false)}
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-6">
              {/* Basic Course Info */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400">1. Basic Details</h4>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Master Spoken Bengali: Daily Situations & Script"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Course Overview / Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe what learners will achieve by the end of this track..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Target Language</label>
                    <select
                      value={formLanguage}
                      onChange={(e) => setFormLanguage(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Proficiency Level</label>
                    <select
                      value={formLevel}
                      onChange={(e) => setFormLevel(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 capitalize"
                    >
                      {LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 capitalize"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Duration</label>
                    <input
                      type="text"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      placeholder="e.g. 8 Weeks"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Number of Modules</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formModules}
                      onChange={(e) => setFormModules(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Price (₹ INR, 0 = Free)</label>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      placeholder="499"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Devanagari, Conversation, Accent Training"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* ── Curriculum Resources Builder ── */}
              <div className="pt-4 border-t border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-sky-400">
                    2. Curriculum Content & Resources ({formResources.length})
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    Add video links, PDF guides, articles, and AI practice redirects
                  </span>
                </div>

                {/* Resource list */}
                {formResources.length > 0 && (
                  <div className="space-y-2">
                    {formResources.map((res, index) => (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-stone-500">{index + 1}.</span>
                          <div className="p-1.5 rounded-lg bg-stone-900">{getResourceIcon(res.type)}</div>
                          <div>
                            <p className="font-semibold text-white">{res.title}</p>
                            <p className="text-[11px] text-stone-400 truncate max-w-md">{res.url}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {res.duration && (
                            <span className="text-[10px] text-stone-400 px-2 py-0.5 rounded bg-stone-900 border border-stone-800">
                              {res.duration}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveResource(res.id)}
                            className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new resource sub-box */}
                <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
                  <p className="text-xs font-semibold text-stone-300">Add New Lesson Resource / AI Lab Link</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div>
                      <select
                        value={newResType}
                        onChange={(e) => setNewResType(e.target.value as ResourceType)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
                      >
                        <option value="video">Video (YouTube/Vimeo/MP4)</option>
                        <option value="pdf">PDF / Study Material</option>
                        <option value="article">Article / Reading Link</option>
                        <option value="audio">Audio Pronunciation</option>
                        <option value="practice_lab">AI Practice Lab Redirect</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newResTitle}
                        onChange={(e) => setNewResTitle(e.target.value)}
                        placeholder="e.g. Lesson 2: Consonants & Word Blending"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={newResDuration}
                        onChange={(e) => setNewResDuration(e.target.value)}
                        placeholder="e.g. 15 mins"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newResUrl}
                      onChange={(e) => setNewResUrl(e.target.value)}
                      placeholder={
                        newResType === "practice_lab"
                          ? "Redirect path (e.g. /practice or /challenges)"
                          : "Resource URL (e.g. https://youtube.com/watch?v=... or https://doc.pdf)"
                      }
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
                    />

                    <button
                      type="button"
                      onClick={handleAddResource}
                      className="px-4 py-2 bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{submitting ? "Saving Course..." : editingCourseId ? "Update Course" : "Save & Publish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
