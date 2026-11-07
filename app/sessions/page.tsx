"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Search,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";

const SESSIONS_DATA = [
  {
    id: "session-hindi-fluency",
    title: "1:1 Hindi Conversational Practice & Accent Coaching",
    instructor: "Pandit Radhe Shyam",
    credentials: "15+ yrs Hindi Pedagogical Experience",
    language: "Hindi",
    mode: "Live 1:1 Online (Google Meet / Zoom)",
    duration: "45 Minutes",
    price: 499,
    packageType: "Per Session",
    description: "Tailored one-on-one session focused on authentic conversational fluency, colloquial idioms, and natural pronunciation corrections.",
    highlights: ["Personalized Speaking Assessment", "Native Accent Feedback", "Session Audio Summary"],
  },
  {
    id: "session-tamil-starter",
    title: "1:1 Spoken Tamil Starter & Pronunciation Lab",
    instructor: "Dr. K. Sundaram",
    credentials: "Tamil Linguistics Scholar",
    language: "Tamil",
    mode: "Live 1:1 Online (Google Meet / Zoom)",
    duration: "45 Minutes",
    price: 599,
    packageType: "Per Session",
    description: "Learn to distinguish subtle Tamil phonemes, master daily pleasantries, and build confidence speaking with native speakers in Tamil Nadu.",
    highlights: ["Retroflex Sound Practice", "Practical Dialogues", "Vocabulary Cheat Sheet"],
  },
  {
    id: "session-telugu-exam",
    title: "1:1 Telugu Competitive Exam Reading & Writing Coaching",
    instructor: "Smt. V. Lakshmi",
    credentials: "Senior State Curriculum Specialist",
    language: "Telugu",
    mode: "Live 1:1 Online (Google Meet / Zoom)",
    duration: "60 Minutes",
    price: 699,
    packageType: "Per Session",
    description: "Focused preparation for state examinations, formal document comprehension, and Telugu essay composition.",
    highlights: ["Essay Structure Review", "Administrative Vocabulary", "Grammar Error Analysis"],
  },
  {
    id: "session-bengali-dialogue",
    title: "1:1 Bengali Conversational & Pronunciation Masterclass",
    instructor: "Anirban Bhattacharya",
    credentials: "Literature & Language Mentor",
    language: "Bengali",
    mode: "Live 1:1 Online (Google Meet / Zoom)",
    duration: "45 Minutes",
    price: 549,
    packageType: "Per Session",
    description: "Interactive conversation covering daily living, business interactions, and the subtle cultural nuances of Bengal.",
    highlights: ["Live Dialogue Roleplay", "Phonetic Correction", "Follow-up Reading List"],
  },
  {
    id: "session-marathi-daily",
    title: "1:1 Spoken Marathi for Professionals & Relocators",
    instructor: "Prof. S. Deshmukh",
    credentials: "Corporate Language Coach",
    language: "Marathi",
    mode: "Live 1:1 Online (Google Meet / Zoom)",
    duration: "45 Minutes",
    price: 499,
    packageType: "Per Session",
    description: "Equip yourself with practical, professional Marathi for navigating work, client meetings, and social settings across Maharashtra.",
    highlights: ["Professional Vocabulary", "Real-world Scenarios", "Recording Available"],
  },
  {
    id: "session-sanskrit-recitation",
    title: "1:1 Sanskrit Shloka Chanting & Paninian Pronunciation",
    instructor: "Acharya Vidyadhar",
    credentials: "Vedic Chanting & Grammar Faculty",
    language: "Sanskrit",
    mode: "Live 1:1 Online (Google Meet / Zoom)",
    duration: "45 Minutes",
    price: 649,
    packageType: "Per Session",
    description: "Learn proper breathing, metric cadence (Chhandas), and precise acoustic articulation of classical Sanskrit verses.",
    highlights: ["Breath & Meter Guidance", "Word-by-word Breakdown", "Traditional Shloka Notes"],
  },
];

export default function SessionsCatalogPage() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("All");

  const languages = ["All", ...Array.from(new Set(SESSIONS_DATA.map((s) => s.language)))];

  const filtered = SESSIONS_DATA.filter((s) => {
    const matchesLang = selectedLang === "All" || s.language === selectedLang;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      s.title.toLowerCase().includes(q) ||
      s.instructor.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q);
    return matchesLang && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-200 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <div className="fixed inset-0 bg-gradient-to-b from-blue-950/15 via-transparent to-stone-950 pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-10 group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-4">
            <Video className="w-3.5 h-3.5" />
            <span>Interactive Mentoring</span>
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Live 1:1 Language Sessions
          </h1>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            Practice one-on-one with certified native language mentors.
            Each instructor sets the price based on their curriculum, duration, and personal instruction time.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic, instructor, or language..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500/60 outline-none text-sm transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedLang === lang
                    ? "bg-amber-500 text-stone-950 font-bold"
                    : "bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((s) => {
            const checkoutUrl = `/checkout?type=session&id=${s.id}&title=${encodeURIComponent(
              s.title
            )}&instructor=${encodeURIComponent(s.instructor)}&price=${s.price}&mode=${encodeURIComponent(
              s.mode
            )}`;

            return (
              <div
                key={s.id}
                className="bg-stone-900/60 border border-stone-800 hover:border-blue-500/40 rounded-3xl p-6 transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                      {s.language}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-800 text-stone-400">
                      {s.packageType}
                    </span>
                  </div>

                  <h3 className="font-kalam text-xl font-bold text-white mb-2 leading-snug">
                    {s.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-semibold">{s.instructor}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-3">{s.credentials}</p>

                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4">
                    {s.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-5 pb-4 border-b border-stone-800">
                    {s.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm mb-5">
                    <div className="flex items-center gap-1 text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{s.duration}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-500 block">Total Payable</span>
                      <span className="text-white font-bold text-lg">₹{s.price}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isAuthenticated ? (
                    <Link
                      href={checkoutUrl}
                      className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white transition-all shadow-md"
                    >
                      <span>Book Session via Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/auth/login?redirect=${encodeURIComponent(checkoutUrl)}`}
                      className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white transition-all border border-stone-700"
                    >
                      <span>Sign in to Book</span>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reschedule & Cancellation Notice */}
        <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-stone-300">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <span>
              Free reschedule or full refund if cancelled at least 24 hours before your session. Instructor cancellation guarantees full refund or free reschedule.
            </span>
          </div>
          <Link href="/refund-policy" className="text-amber-400 hover:underline shrink-0 font-medium">
            Read Policy Details
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

