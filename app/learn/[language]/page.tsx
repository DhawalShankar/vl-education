"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Users,
  Play,
  FileText,
  File,
  Headphones,
  Lock,
  Filter,
  Search,
  Clock,
  Star,
  ChevronRight,
  Layers,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { courseAPI } from "@/app/lib/api";

/* ── Language metadata ─────────────────────────────────────── */
const LANGUAGE_META: Record<
  string,
  { name: string; native: string; icon: string; color: string; description: string; region: string }
> = {
  hindi:   { name: "Hindi",   native: "हिंदी",    icon: "📚", color: "from-orange-500 to-red-500",    description: "India's most widely spoken language, used by over 500 million people.", region: "North India" },
  tamil:   { name: "Tamil",   native: "தமிழ்",    icon: "🌴", color: "from-red-500 to-pink-500",      description: "One of the world's oldest classical languages with a rich literary tradition.", region: "South India" },
  telugu:  { name: "Telugu",  native: "తెలుగు",   icon: "🎭", color: "from-yellow-500 to-orange-500", description: "The Italian of the East — melodious, poetic, and widely spoken.", region: "South India" },
  bengali: { name: "Bengali", native: "বাংলা",    icon: "📝", color: "from-green-500 to-teal-500",    description: "Language of Rabindranath Tagore — poetry, music, and culture.", region: "East India" },
  marathi: { name: "Marathi", native: "मराठी",    icon: "🏛️", color: "from-purple-500 to-pink-500",   description: "The official language of Maharashtra, spoken by over 80 million people.", region: "West India" },
  english: { name: "English", native: "English",  icon: "🌍", color: "from-blue-500 to-cyan-500",     description: "The global language of opportunity, business, and communication.", region: "Global" },
};

/* ── Resource type helpers ─────────────────────────────────── */
const RESOURCE_ICONS: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  video: { icon: Play,      label: "Video",  color: "text-red-400",    bg: "bg-red-500/20 border-red-500/30" },
  pdf:   { icon: File,      label: "PDF",    color: "text-blue-400",   bg: "bg-blue-500/20 border-blue-500/30" },
  blog:  { icon: FileText,  label: "Blog",   color: "text-green-400",  bg: "bg-green-500/20 border-green-500/30" },
  audio: { icon: Headphones,label: "Audio",  color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/30" },
};

const LEVEL_COLORS: Record<string, string> = {
  foundation:   "bg-green-500/20 text-green-300 border-green-500/30",
  beginner:     "bg-green-500/20 text-green-300 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  professional: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  advanced:     "bg-orange-500/20 text-orange-300 border-orange-500/30",
  mastery:      "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

/* ── Mock courses (fallback when backend has no data yet) ─── */
function getMockCourses(language: string) {
  const lang = LANGUAGE_META[language]?.name || language;
  return [
    {
      _id: "mock-1",
      title: `${lang} for Beginners`,
      description: `Start your ${lang} journey from scratch. Learn the script, basic grammar, and everyday phrases.`,
      language: lang,
      level: "foundation",
      duration: "8 weeks",
      modules: 24,
      resources: [
        { type: "video", title: "Introduction to the Script", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "Learn the alphabet step by step" },
        { type: "video", title: "Basic Greetings & Phrases", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "Essential phrases for day-to-day use" },
        { type: "pdf",   title: "Grammar Reference Sheet", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", description: "Handy PDF to keep by your side" },
        { type: "blog",  title: "Top 10 Tips for Beginners", url: "https://medium.com", description: "Expert advice to get you started fast" },
      ],
    },
    {
      _id: "mock-2",
      title: `${lang} Conversation Practice`,
      description: `Improve your speaking and listening skills through structured conversation exercises.`,
      language: lang,
      level: "intermediate",
      duration: "6 weeks",
      modules: 18,
      resources: [
        { type: "video", title: "Conversational Dialogues Vol. 1", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "Real-world conversations" },
        { type: "audio", title: "Listening Comprehension Pack", url: "#", description: "Native speaker audio clips" },
        { type: "pdf",   title: "Dialogue Scripts PDF", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", description: "Read along while you listen" },
      ],
    },
    {
      _id: "mock-3",
      title: `${lang} Writing Mastery`,
      description: `Master formal and informal writing — from letters and essays to professional documents.`,
      language: lang,
      level: "professional",
      duration: "10 weeks",
      modules: 32,
      resources: [
        { type: "blog",  title: "Writing Styles Explained", url: "https://medium.com", description: "Formal vs informal writing" },
        { type: "pdf",   title: "Essay Templates Pack", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", description: "Ready-to-use templates" },
        { type: "video", title: "Expert Writing Masterclass", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "Advanced writing techniques" },
      ],
    },
    {
      _id: "mock-4",
      title: `${lang} Exam Preparation`,
      description: `Ace government exams, teacher certification, and competitive tests requiring ${lang} proficiency.`,
      language: lang,
      level: "mastery",
      duration: "12 weeks",
      modules: 40,
      resources: [
        { type: "video", title: "Exam Pattern Deep Dive", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "Understand what examiners expect" },
        { type: "pdf",   title: "Previous Year Papers Pack", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", description: "10 years of solved papers" },
        { type: "pdf",   title: "Quick Revision Notes", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", description: "Last-minute prep guide" },
        { type: "blog",  title: "Toppers' Strategy Guide", url: "https://medium.com", description: "How rank holders prepared" },
      ],
    },
  ];
}

/* ── Component ─────────────────────────────────────────────── */
export default function LanguagePage() {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();
  const { isAuthenticated, loading: authLoading } = auth || { isAuthenticated: false, loading: false };

  const language = (params?.language as string) || "";
  const meta = LANGUAGE_META[language];

  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);

  /* ── Redirect unknown languages ── */
  useEffect(() => {
    if (!meta) router.push("/learn");
  }, [meta]);

  /* ── Fetch courses ── */
  useEffect(() => {
    if (!meta) return;
    const load = async () => {
      try {
        const res = await courseAPI.getByLanguage(meta.name);
        if (res) {
          const data = await res.json();
          if (data.success && data.data.courses?.length) {
            setCourses(data.data.courses);
          } else {
            setCourses(getMockCourses(language));
          }
        } else {
          setCourses(getMockCourses(language));
        }
      } catch {
        setCourses(getMockCourses(language));
      } finally {
        setLoadingCourses(false);
      }
    };
    load();
  }, [language, meta]);

  /* ── Fetch enrolled courses (if logged in) ── */
  useEffect(() => {
    if (!isAuthenticated) return;
    courseAPI.getMyCourses().then(async (res) => {
      if (!res) return;
      const data = await res.json();
      if (data.success) setEnrolledIds(data.data.courses.map((c: any) => c._id));
    }).catch(() => {});
  }, [isAuthenticated]);

  if (!meta) return null;

  const levels = ["all", "foundation", "beginner", "intermediate", "professional", "advanced", "mastery"];

  const filtered = courses.filter((c) => {
    const matchLevel = selectedLevel === "all" || c.level === selectedLevel;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchSearch;
  });

  const isEnrolled = (id: string) => enrolledIds.includes(id);

  const resourceTypeSummary = (resources: any[]) => {
    if (!resources?.length) return [];
    const types = [...new Set(resources.map((r) => r.type))];
    return types.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden">
      <Navbar />

      {/* Background */}
      <div
        className="fixed inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto relative z-10">

          {/* Back */}
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">All Languages</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Language info */}
            <div>
              <div className="flex items-center gap-5 mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-4xl shadow-2xl`}>
                  {meta.icon}
                </div>
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 mb-2">
                    {meta.region}
                  </div>
                  <h1 className="font-kalam text-5xl md:text-6xl font-bold text-white leading-tight">
                    {meta.name}
                  </h1>
                  <p className="text-2xl text-amber-300 font-medium">{meta.native}</p>
                </div>
              </div>
              <p className="text-lg text-stone-300 leading-relaxed mb-8 max-w-xl">
                {meta.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: BookOpen, label: `${courses.length || 4} Courses` },
                  { icon: Users, label: "Active Community" },
                  { icon: Star, label: "Expert Curated" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-stone-300">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                      <s.icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-sm font-semibold">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Resource type legend */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(RESOURCE_ICONS).map(([type, info]) => {
                const Icon = info.icon;
                return (
                  <div
                    key={type}
                    className={`p-5 rounded-2xl border ${info.bg} backdrop-blur-sm flex items-center gap-4`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${info.bg} flex items-center justify-center border ${info.bg}`}>
                      <Icon className={`w-5 h-5 ${info.color}`} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{info.label} Resources</p>
                      <p className="text-stone-500 text-xs">Curated links</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ─────────────────────────────────── */}
      <section className="relative px-6 pb-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-sm border border-stone-700/50 flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/80 text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
              />
            </div>

            {/* Level filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-stone-500 shrink-0" />
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedLevel === lvl
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                      : "bg-stone-800/50 text-stone-400 hover:bg-stone-700/50 border border-stone-700/50"
                  }`}
                >
                  {lvl === "all" ? "All Levels" : lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses Grid ─────────────────────────────── */}
      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto relative z-10">

          {loadingCourses ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-stone-900/40 border border-stone-700/50 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-stone-900/40 border border-stone-700/50">
              <Search className="w-12 h-12 mx-auto mb-4 text-amber-400/30" />
              <h3 className="font-kalam text-2xl font-bold text-white mb-2">No courses found</h3>
              <p className="text-stone-400 text-sm">Try adjusting your search or level filter</p>
            </div>
          ) : (
            <>
              <p className="text-stone-500 text-sm mb-6">
                Showing <span className="text-amber-400 font-bold">{filtered.length}</span> course{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((course) => {
                  const types = resourceTypeSummary(course.resources);
                  const enrolled = isEnrolled(course._id);
                  const levelClass = LEVEL_COLORS[course.level] || "bg-stone-500/20 text-stone-300 border-stone-500/30";

                  return (
                    <div
                      key={course._id}
                      className="group relative bg-stone-900/60 backdrop-blur-sm border border-stone-700/50 hover:border-amber-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${levelClass}`}>
                          {course.level}
                        </span>
                        {enrolled && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold">
                            Enrolled
                          </span>
                        )}
                      </div>

                      {/* Title + desc */}
                      <h3 className="font-kalam text-xl font-bold text-white mb-2 leading-snug">{course.title}</h3>
                      <p className="text-stone-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">{course.description}</p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
                        {course.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {course.duration}
                          </span>
                        )}
                        {course.modules && (
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3" /> {course.modules} modules
                          </span>
                        )}
                        {course.resources?.length && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {course.resources.length} resources
                          </span>
                        )}
                      </div>

                      {/* Resource type badges */}
                      {types.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          {types.map((t) => {
                            const info = RESOURCE_ICONS[t];
                            if (!info) return null;
                            const Icon = info.icon;
                            return (
                              <span key={t} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs border ${info.bg} ${info.color}`}>
                                <Icon className="w-3 h-3" /> {info.label}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* CTA */}
                      {isAuthenticated ? (
                        <Link
                          href={`/learn/${language}/${course._id}`}
                          className="w-full py-3 rounded-xl font-kalam font-bold text-sm text-center transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg hover:shadow-amber-500/30"
                        >
                          {enrolled ? "Continue Learning" : "Open Course"}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      ) : (
                        <Link
                          href="/auth/login"
                          className="w-full py-3 rounded-xl font-kalam font-bold text-sm text-center transition-all flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700/50"
                        >
                          <Lock className="w-4 h-4" /> Login to Access
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
