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

/* ── Language metadata (Placeholder dictionary) ──────────────────
 * TODO: Connect to backend API: GET /api/v1/courses/languages
 * Fetch dynamic language list, native scripts, descriptions, and regional tags from the database.
 */
const LANGUAGE_META: Record<
  string,
  { name: string; native: string; icon: string; color: string; description: string; region: string }
> = {
  hindi:   { name: "Hindi",   native: "हिंदी",    icon: "📚", color: "from-orange-500 to-red-500",    description: "India's most widely spoken scheduled language.", region: "North & Central India" },
  tamil:   { name: "Tamil",   native: "தமிழ்",    icon: "🌴", color: "from-red-500 to-pink-500",      description: "Classical Dravidian language with a rich literary tradition.", region: "South India" },
  telugu:  { name: "Telugu",  native: "తెలుగు",   icon: "🎭", color: "from-yellow-500 to-orange-500", description: "Melodious, widely spoken Dravidian language of Andhra and Telangana.", region: "South India" },
  bengali: { name: "Bengali", native: "বাংলা",    icon: "📝", color: "from-green-500 to-teal-500",    description: "Language of rich literature, culture, and poetry.", region: "East India" },
  marathi: { name: "Marathi", native: "मराठी",    icon: "🏛️", color: "from-purple-500 to-pink-500",   description: "Official language of Maharashtra with vibrant spoken dialects.", region: "West India" },
  english: { name: "English", native: "English",  icon: "🌍", color: "from-blue-500 to-cyan-500",     description: "Global language of professional, academic, and business communication.", region: "Global" },
  gujarati:{ name: "Gujarati", native: "ગુજરાતી", icon: "🏛️", color: "from-amber-500 to-yellow-600", description: "Language of commerce, literature, and western heritage.", region: "West India" },
  kannada: { name: "Kannada", native: "ಕನ್ನಡ",    icon: "📜", color: "from-red-500 to-amber-600",     description: "Classical language with an ancient literary heritage.", region: "South India" },
  malayalam:{ name: "Malayalam", native: "മലയാളം",icon: "🌴", color: "from-emerald-500 to-teal-600",  description: "Coastal literary language of Kerala and Lakshadweep.", region: "South India" },
};

/* Helper for fallback language placeholder */
function resolveLanguageMeta(slug: string) {
  if (LANGUAGE_META[slug]) return LANGUAGE_META[slug];
  const cap = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Language";
  return {
    name: cap,
    native: cap,
    icon: "🌐",
    color: "from-amber-500 to-orange-500",
    description: `Structured curriculum and native speech modules for ${cap}.`,
    region: "Indian Scheduled Language",
  };
}

/* ── Resource type helpers ─────────────────────────────────── */
const RESOURCE_ICONS: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  video: { icon: Play,      label: "Video",  color: "text-red-400",    bg: "bg-red-500/20 border-red-500/30" },
  pdf:   { icon: File,      label: "PDF",    color: "text-blue-400",   bg: "bg-blue-500/20 border-blue-500/30" },
  blog:  { icon: FileText,  label: "Article",color: "text-green-400",  bg: "bg-green-500/20 border-green-500/30" },
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

/* ── Course Fallback Placeholders ─────────────────────────────
 * TODO: Connect to backend API: GET /api/v1/courses?language=:language
 * When real courses exist in MongoDB/PostgreSQL, this fallback will not be used.
 * Placeholders are kept here strictly to avoid breaking UI layouts on empty DB.
 */
function getMockCourses(language: string) {
  const meta = resolveLanguageMeta(language);
  const lang = meta.name;
  return [
    {
      _id: "placeholder-foundations",
      title: `${lang} Foundations: Script & Phonetics`,
      description: `Structured introduction covering native alphabet strokes, vowels, consonant clusters, and everyday greetings.`,
      language: lang,
      level: "foundation",
      duration: "8 weeks",
      modules: 12,
      resources: [
        { type: "video", title: "Phonetic Stroke Order & Sounds", url: "", description: "Guided pronunciation walkthrough with educator notes" },
        { type: "pdf",   title: "Native Script Practice Sheet", url: "", description: "Printable tracing drills for letters and conjuncts" },
        { type: "audio", title: "Native Speaker Audio Drills", url: "", description: "Repetition practice for vowel and consonant stress" },
      ],
    },
    {
      _id: "placeholder-conversation",
      title: `${lang} Daily Conversations & Fluency`,
      description: `Practical vocabulary, marketplace interactions, and spoken patterns for daily communication.`,
      language: lang,
      level: "intermediate",
      duration: "6 weeks",
      modules: 10,
      resources: [
        { type: "video", title: "Conversational Dialogues in Context", url: "", description: "Real-world conversational scenarios" },
        { type: "audio", title: "Listening Comprehension Track", url: "", description: "Audio dialogues with multiple native speakers" },
        { type: "pdf",   title: "Vocabulary Drill Reference", url: "", description: "Core 500 word phrases and grammar rules" },
      ],
    },
    {
      _id: "placeholder-professional",
      title: `${lang} for Workplace & Civil Examinations`,
      description: `Formal essay writing, reading comprehension, and state government competitive exam preparation.`,
      language: lang,
      level: "professional",
      duration: "10 weeks",
      modules: 16,
      resources: [
        { type: "pdf",   title: "Exam Syllabus & Solved Papers", url: "", description: "Curated model question papers and evaluation keys" },
        { type: "video", title: "Formal Grammar & Prose Analysis", url: "", description: "Comprehensive breakdown of high-scoring techniques" },
      ],
    },
  ];
}

/* ── Component ─────────────────────────────────────────────── */
export default function LanguagePage() {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();
  const { isAuthenticated } = auth || { isAuthenticated: false };

  const language = (params?.language as string) || "";
  const meta = resolveLanguageMeta(language);

  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);

  /* ── Fetch courses from Backend API ── */
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoadingCourses(true);
        // TODO: Connect to backend API: GET /api/v1/courses?language=${encodeURIComponent(meta.name)}
        const res = await courseAPI.getByLanguage(meta.name);
        if (res && res.ok) {
          const data = await res.json();
          const list = data?.data?.courses || (Array.isArray(data) ? data : []);
          if (isMounted) {
            setCourses(list.length > 0 ? list : getMockCourses(language));
          }
        } else {
          if (isMounted) setCourses(getMockCourses(language));
        }
      } catch {
        if (isMounted) setCourses(getMockCourses(language));
      } finally {
        if (isMounted) setLoadingCourses(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [language, meta.name]);

  /* ── Fetch enrolled courses (if authenticated) ── */
  useEffect(() => {
    if (!isAuthenticated) return;
    courseAPI
      .getMyCourses()
      .then(async (res) => {
        if (!res) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.data?.courses)) {
          setEnrolledIds(data.data.courses.map((c: any) => c._id));
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const levels = ["all", "foundation", "beginner", "intermediate", "professional", "advanced", "mastery"];

  const filtered = courses.filter((c) => {
    const matchLevel = selectedLevel === "all" || c.level === selectedLevel;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex flex-col justify-between">
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
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6">
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
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-4xl shadow-2xl`}
                >
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
                  { icon: BookOpen, label: `${courses.length} Modules Available` },
                  { icon: Users, label: "Community Verified" },
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
                      <p className="text-stone-500 text-xs">Curated materials</p>
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
                      className="group relative bg-stone-900/60 backdrop-blur-sm border border-stone-700/50 hover:border-amber-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
                    >
                      <div>
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
                        <p className="text-stone-400 text-sm leading-relaxed mb-4 line-clamp-2">{course.description}</p>

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
                            {types.map((t: string) => {
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
                      </div>

                      {/* CTA */}
                      <div className="pt-2">
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
