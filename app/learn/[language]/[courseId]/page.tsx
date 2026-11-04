"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  FileText,
  File,
  Headphones,
  ExternalLink,
  CheckCircle,
  Circle,
  BookOpen,
  Lock,
  ChevronRight,
  Clock,
  Layers,
  Globe,
  X,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { courseAPI } from "@/app/lib/api";

/* ── Types ─────────────────────────────────────── */
type ResourceType = "video" | "pdf" | "blog" | "audio" | string;

interface Resource {
  type: ResourceType;
  title: string;
  url: string;
  description?: string;
  duration?: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  language: string;
  level: string;
  duration?: string;
  modules?: number;
  resources: Resource[];
}

/* ── Helpers ────────────────────────────────────── */
const LANGUAGE_NAMES: Record<string, string> = {
  hindi: "Hindi", tamil: "Tamil", telugu: "Telugu",
  bengali: "Bengali", marathi: "Marathi", english: "English",
  gujarati: "Gujarati", kannada: "Kannada", malayalam: "Malayalam"
};

const RESOURCE_META: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  video: { label: "Video",  color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/30",    icon: Play },
  pdf:   { label: "PDF",    color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30",   icon: File },
  blog:  { label: "Blog",   color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/30",  icon: FileText },
  audio: { label: "Audio",  color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", icon: Headphones },
};

const LEVEL_COLOR: Record<string, string> = {
  foundation: "bg-green-500/20 text-green-300", beginner: "bg-green-500/20 text-green-300",
  intermediate: "bg-yellow-500/20 text-yellow-300", professional: "bg-blue-500/20 text-blue-300",
  advanced: "bg-orange-500/20 text-orange-300", mastery: "bg-purple-500/20 text-purple-300",
};

function toEmbedUrl(url: string): string | null {
  try {
    if (!url) return null;
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
      return url;
    }
  } catch {}
  return null;
}

/* ── Course placeholder fallback ───────────────────
 * TODO: Connect to backend API: GET /api/v1/courses/:courseId
 * Real course curriculum, video links, and study resources must be fetched from the database.
 * This placeholder preserves the layout while the backend endpoint is being connected.
 */
function mockCourse(courseId: string, language: string): Course {
  const lang = LANGUAGE_NAMES[language] || (language ? language.charAt(0).toUpperCase() + language.slice(1) : "Language");
  return {
    _id: courseId,
    title: `${lang} Curriculum Track`,
    description: `Structured curriculum and resources for ${lang}. Modules include script fundamentals, phonetics, and dialogue practice.`,
    language: lang,
    level: "foundation",
    duration: "8 weeks",
    modules: 12,
    resources: [
      {
        type: "video",
        title: "Module 1: Introduction to Script & Sounds",
        url: "",
        description: "Core phonetic breakdown and letter stroke guidance.",
        duration: "15 min",
      },
      {
        type: "pdf",
        title: "Module 1 Study Guide & Practice Notes",
        url: "",
        description: "Downloadable PDF reference with character drills and exercises.",
      },
      {
        type: "audio",
        title: "Native Pronunciation & Listening Drill",
        url: "",
        description: "Audio clips demonstrating correct syllable stress and intonation.",
        duration: "10 min",
      },
      {
        type: "blog",
        title: "Grammar Summary & Key Sentence Patterns",
        url: "",
        description: "Essential rules for word order, verb forms, and everyday greetings.",
      },
    ],
  };
}

/* ── Component ──────────────────────────────────── */
export default function CourseViewer() {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();
  const { user, isAuthenticated, loading: authLoading } = auth || { user: null, isAuthenticated: false, loading: true };

  const language = (params?.language as string) || "";
  const courseId = (params?.courseId as string) || "";

  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=/learn/${language}/${courseId}`);
    }
  }, [authLoading, isAuthenticated, language, courseId, router]);

  /* ── Load completion from localStorage (TODO: sync to backend user_progress API) ── */
  useEffect(() => {
    const key = `vl-done-${courseId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { setCompletedSet(new Set(JSON.parse(saved))); } catch {}
    }
  }, [courseId]);

  /* ── Fetch course data from Backend API ── */
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoadingCourse(true);
        // TODO: Connect to backend API: GET /api/v1/courses/:courseId
        const data = await courseAPI.getOne(courseId);
        if (data && isMounted) {
          const resCourse: Course = data.data?.course || data;
          setCourse(resCourse);
        }
      } catch {
        if (isMounted) {
          setCourse(mockCourse(courseId, language));
        }
      } finally {
        if (isMounted) setLoadingCourse(false);
      }
    };
    if (courseId) load();
    return () => {
      isMounted = false;
    };
  }, [courseId, language]);

  const toggleDone = (index: number) => {
    setCompletedSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      localStorage.setItem(`vl-done-${courseId}`, JSON.stringify([...next]));
      return next;
    });
  };

  if (authLoading || loadingCourse) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-amber-400 font-kalam text-2xl animate-pulse">Loading course resources…</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0908] text-white flex flex-col items-center justify-center gap-4">
        <BookOpen className="w-12 h-12 text-stone-600" />
        <h2 className="font-kalam text-2xl font-bold">Course Not Found</h2>
        <Link href={`/learn/${language}`} className="text-amber-400 hover:underline text-sm">
          Return to {LANGUAGE_NAMES[language] || language} courses
        </Link>
      </div>
    );
  }

  const resources = course.resources || [];
  const filtered = activeTab === "all" ? resources : resources.filter((r) => r.type === activeTab);
  const progress = resources.length ? Math.round((completedSet.size / resources.length) * 100) : 0;
  const tabs = ["all", ...new Set(resources.map((r) => r.type))];

  return (
    <div className="min-h-screen bg-[#0a0908] text-white">
      {/* ── Top Bar ── */}
      <div className="border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href={`/learn/${language}`}
              className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors text-xs font-semibold shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Courses</span>
            </Link>
            <span className="text-stone-700 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2 min-w-0 text-xs">
              <span className="text-stone-400 capitalize">{LANGUAGE_NAMES[language] || language}</span>
              <ChevronRight className="w-3 h-3 text-stone-600 shrink-0" />
              <span className="text-stone-300 truncate max-w-[200px]">{course.title}</span>
            </div>
          </div>

          {/* Progress pill */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 h-2 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-stone-400 font-semibold">{progress}%</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-stone-800 text-stone-400">
              Hi, {user?.name?.split(" ")[0] || "Learner"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* ── Main content ─────────────────────── */}
          <div>
            {/* Course header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${LEVEL_COLOR[course.level] || "bg-stone-500/20 text-stone-300"}`}>
                  {course.level}
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-500">
                  <Globe className="w-3 h-3" /> {course.language}
                </span>
                {course.duration && (
                  <span className="flex items-center gap-1 text-xs text-stone-500">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </span>
                )}
                {course.modules && (
                  <span className="flex items-center gap-1 text-xs text-stone-500">
                    <Layers className="w-3 h-3" /> {course.modules} modules
                  </span>
                )}
              </div>
              <h1 className="font-kalam text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                {course.title}
              </h1>
              <p className="text-stone-400 text-base leading-relaxed max-w-2xl">{course.description}</p>
            </div>

            {/* ── Embedded Video Modal ── */}
            {activeVideo && (
              <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
                <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end mb-3">
                    <button onClick={() => setActiveVideo(null)} className="text-stone-400 hover:text-white transition-colors p-2 rounded-xl bg-stone-800">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                    <iframe
                      src={activeVideo}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Resource Tabs ── */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {tabs.map((tab) => {
                const meta = RESOURCE_META[tab];
                const Icon = meta?.icon;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                      activeTab === tab
                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                        : "bg-stone-900/60 text-stone-400 hover:text-white border border-stone-700/50 hover:border-stone-600"
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {tab === "all" ? `All (${resources.length})` : `${meta?.label || tab}s`}
                  </button>
                );
              })}
            </div>

            {/* ── Resource Cards ── */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-stone-900/40 border border-stone-700/50">
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-amber-400/30" />
                <p className="text-stone-400 text-sm">No resources available for this category yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((resource, idx) => {
                  const globalIdx = resources.indexOf(resource);
                  const meta = RESOURCE_META[resource.type] || RESOURCE_META.blog;
                  const Icon = meta.icon;
                  const done = completedSet.has(globalIdx);
                  const embedUrl = resource.type === "video" ? toEmbedUrl(resource.url) : null;

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border transition-all ${
                        done
                          ? "bg-stone-900/30 border-stone-800/50 opacity-75"
                          : "bg-stone-900/60 border-stone-700/50 hover:border-amber-500/30"
                      }`}
                    >
                      <div className="p-5 flex items-start gap-4">
                        {/* Type icon */}
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${meta.bg} ${meta.border}`}>
                          <Icon className={`w-5 h-5 ${meta.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
                                {resource.duration && (
                                  <span className="text-xs text-stone-600">• {resource.duration}</span>
                                )}
                              </div>
                              <h3 className={`font-kalam text-lg font-bold leading-snug ${done ? "line-through text-stone-500" : "text-white"}`}>
                                {resource.title}
                              </h3>
                              {resource.description && (
                                <p className="text-stone-400 text-sm mt-1 leading-relaxed">{resource.description}</p>
                              )}
                            </div>
                            {/* Done toggle */}
                            <button
                              onClick={() => toggleDone(globalIdx)}
                              className="shrink-0 mt-0.5 transition-transform hover:scale-110"
                              title={done ? "Mark as incomplete" : "Mark as done"}
                            >
                              {done ? (
                                <CheckCircle className="w-6 h-6 text-amber-400" />
                              ) : (
                                <Circle className="w-6 h-6 text-stone-600 hover:text-amber-400 transition-colors" />
                              )}
                            </button>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap items-center gap-2 mt-4">
                            {resource.type === "video" && embedUrl && (
                              <button
                                onClick={() => setActiveVideo(embedUrl)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-semibold border border-red-500/30 transition-all hover:scale-105"
                              >
                                <Play className="w-3.5 h-3.5" /> Watch Video
                              </button>
                            )}

                            {resource.url && resource.url !== "#" && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-semibold border border-stone-700/50 transition-all hover:scale-105"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                {resource.type === "pdf" ? "Open PDF" : resource.type === "blog" ? "Read Article" : "Open Link"}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────── */}
          <div className="space-y-5">
            {/* Progress card */}
            <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 p-6">
              <h3 className="font-kalam text-lg font-bold text-white mb-4">Your Progress</h3>
              <div className="flex items-end justify-between mb-2">
                <span className="text-4xl font-bold text-amber-400">{progress}%</span>
                <span className="text-sm text-stone-400">{completedSet.size}/{resources.length} done</span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progress === 100 && (
                <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" /> Course Complete! 🎉
                </div>
              )}
              {progress < 100 && (
                <p className="text-stone-500 text-xs">Check off resources as you complete them</p>
              )}
            </div>

            {/* Resource breakdown */}
            <div className="rounded-2xl bg-stone-900/60 border border-stone-700/50 p-6">
              <h3 className="font-kalam text-lg font-bold text-white mb-4">Resources Breakdown</h3>
              <div className="space-y-3">
                {(["video", "pdf", "blog", "audio"] as const).map((type) => {
                  const count = resources.filter((r) => r.type === type).length;
                  if (!count) return null;
                  const meta = RESOURCE_META[type];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        activeTab === type ? `${meta.bg} border ${meta.border}` : "hover:bg-stone-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                        <span className="text-sm font-medium text-stone-200 capitalize">{meta.label}s</span>
                      </div>
                      <span className={`text-sm font-bold ${meta.color}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Back to language */}
            <Link
              href={`/learn/${language}`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-stone-700/50 bg-stone-900/40 hover:border-amber-500/30 text-stone-400 hover:text-amber-400 text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {LANGUAGE_NAMES[language] || language} Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
