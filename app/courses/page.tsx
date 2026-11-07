"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Search,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  User,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { learnAPI, CourseCard } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";
import { slugify } from "@/app/lib/languages";

// Curated language courses fallback with instructor and pricing in INR
const FALLBACK_COURSES = [
  {
    id: "c-hindi-foundations",
    title: "Complete Hindi Foundations: Script, Grammar & Conversation",
    description: "Master Devanagari script reading and writing, essential everyday sentence structures, and fluid conversational Hindi for all levels.",
    language: "Hindi",
    level: "Beginner",
    mode: "Online (Self-Paced)",
    instructor: { full_name: "Pandit Radhe Shyam" },
    duration: "18 Hours",
    modules_count: 6,
    lessons_count: 24,
    price: 999,
    is_free: false,
  },
  {
    id: "c-spoken-tamil",
    title: "Spoken Tamil for Everyday Life & Work",
    description: "Learn practical colloquial Tamil spoken in Chennai and across Tamil Nadu. Focuses on conversational listening, phonetics, and dialogue.",
    language: "Tamil",
    level: "All Levels",
    mode: "Online (Self-Paced)",
    instructor: { full_name: "Dr. K. Sundaram" },
    duration: "14 Hours",
    modules_count: 5,
    lessons_count: 20,
    price: 1299,
    is_free: false,
  },
  {
    id: "c-telugu-script",
    title: "Telugu Script & Fundamentals: Read, Write & Speak",
    description: "Structured introduction to Telugu letters, vowel signs, conjuncts, and vocabulary for competitive exams and personal fluency.",
    language: "Telugu",
    level: "Beginner",
    mode: "Online (Self-Paced)",
    instructor: { full_name: "Smt. V. Lakshmi" },
    duration: "12 Hours",
    modules_count: 4,
    lessons_count: 16,
    price: 899,
    is_free: false,
  },
  {
    id: "c-bengali-lit",
    title: "Conversational Bengali & Rabindra Sahitya Insights",
    description: "Develop natural spoken Bengali fluency while appreciating Bengali literature, daily idioms, and cultural etiquette.",
    language: "Bengali",
    level: "Intermediate",
    mode: "Online (Self-Paced)",
    instructor: { full_name: "Anirban Bhattacharya" },
    duration: "15 Hours",
    modules_count: 5,
    lessons_count: 22,
    price: 1199,
    is_free: false,
  },
  {
    id: "c-marathi-official",
    title: "Professional & Conversational Marathi",
    description: "Designed for professionals, students, and competitive exam aspirants needing fluent spoken and administrative Marathi.",
    language: "Marathi",
    level: "Intermediate",
    mode: "Online (Self-Paced)",
    instructor: { full_name: "Prof. S. Deshmukh" },
    duration: "16 Hours",
    modules_count: 6,
    lessons_count: 25,
    price: 999,
    is_free: false,
  },
  {
    id: "c-sanskrit-shlokas",
    title: "Classical Sanskrit: Grammar, Shlokas & Chanting",
    description: "Explore the structure of classical Sanskrit through Paninian grammar basics, Subhashitas, and chanting phonetics.",
    language: "Sanskrit",
    level: "Beginner",
    mode: "Online (Self-Paced)",
    instructor: { full_name: "Acharya Vidyadhar" },
    duration: "10 Hours",
    modules_count: 4,
    lessons_count: 15,
    price: 0,
    is_free: true,
  },
];

export default function CoursesCatalogPage() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("All");

  const apiCourses = useApi(() => learnAPI.courses({}));
  const rawList = (apiCourses.data && apiCourses.data.length > 0)
    ? apiCourses.data
    : FALLBACK_COURSES;

  const languages = ["All", ...Array.from(new Set(rawList.map((c) => c.language).filter(Boolean)))];

  const filtered = rawList.filter((c) => {
    const matchesLang = selectedLang === "All" || c.language === selectedLang;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      c.title.toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q) ||
      (c.instructor?.full_name || "").toLowerCase().includes(q);
    return matchesLang && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-200 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <div className="fixed inset-0 bg-gradient-to-b from-amber-950/15 via-transparent to-stone-950 pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-10 group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Public Course Catalog</span>
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Online Language Courses
          </h1>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            Browse our complete collection of self-paced courses curated by qualified language educators.
            Prices are set individually by each instructor.
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
              placeholder="Search by course title, keyword, or instructor name..."
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
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-stone-900/40 border border-stone-800 text-stone-400">
            <BookOpen className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="font-kalam text-xl font-bold text-white mb-1">No courses match your criteria</h3>
            <p className="text-xs text-stone-500">Try modifying your search or language filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filtered.map((c) => {
              const langSlug = slugify(c.language || "all");
              const courseUrl = `/learn/${langSlug}/${c.id}`;
              const checkoutUrl = `/checkout?type=course&id=${c.id}&title=${encodeURIComponent(
                c.title
              )}&instructor=${encodeURIComponent(
                c.instructor?.full_name || "Instructor"
              )}&price=${c.price}&mode=Online`;

              return (
                <div
                  key={c.id}
                  className="bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 rounded-3xl p-6 transition-all hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Tags */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                        {c.language} · {c.level || "All Levels"}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-800 text-stone-400">
                        {(c as any).mode || "Online"}
                      </span>
                    </div>

                    <h3 className="font-kalam text-xl font-bold text-white mb-2 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                      {c.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mb-4 pb-4 border-b border-stone-800">
                      {c.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" /> {c.duration}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-stone-400" /> {c.modules_count || 4} modules
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm mb-5">
                      <div className="flex items-center gap-1.5 text-stone-300">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>{c.instructor?.full_name || "VartaLang Educator"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-stone-500 block">Total Payable</span>
                        <span className={c.is_free ? "text-emerald-400 font-bold text-base" : "text-white font-bold text-lg"}>
                          {c.is_free ? "Free" : `₹${c.price}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {isAuthenticated ? (
                      <Link
                        href={c.is_free ? courseUrl : checkoutUrl}
                        className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white transition-all shadow-md"
                      >
                        <span>{c.is_free ? "Access Free Course" : "Enroll & Pay via Razorpay"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href={`/auth/login?redirect=${encodeURIComponent(checkoutUrl)}`}
                        className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white transition-all border border-stone-700"
                      >
                        <span>Sign in to Enroll</span>
                        <ArrowRight className="w-4 h-4 text-stone-400" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Assurance Box */}
        <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-stone-300">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              All course enrollments are backed by our 7-day refund guarantee (if &lt;20% accessed) and processed securely via Razorpay.
            </span>
          </div>
          <Link href="/refund-policy" className="text-amber-400 hover:underline shrink-0 font-medium">
            Read Refund Policy
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
