"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Search,
  Calendar,
  MapPin,
  Clock,
  User,
  Package,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";

const WORKSHOPS_DATA = [
  {
    id: "ws-bengali-script-kolkata",
    title: "Bengali Calligraphy & Script Masterclass (In-Person)",
    instructor: "Anirban Bhattacharya",
    mode: "Offline (In-Person)",
    venue: "Bengal Cultural Society Hall, Kolkata, West Bengal",
    date: "December 12, 2026 · 10:00 AM - 4:00 PM IST",
    language: "Bengali",
    price: 1499,
    seatType: "Per Seat",
    includesMaterial: true,
    materialDetails: "Includes physical calligraphy pen set, premium handmade paper workbook, and printed glyph guide.",
    description: "Hands-on, in-person intensive workshop mastering traditional and modern Bengali letterforms, conjunct strokes, and artistic flourish.",
  },
  {
    id: "ws-hindi-creative-writing",
    title: "Hindi Creative Writing & Poetry Workshop (Virtual)",
    instructor: "Pandit Radhe Shyam",
    mode: "Online (Virtual Cohort)",
    venue: "Live Interactive Virtual Classroom (Google Meet)",
    date: "December 5–6, 2026 · 2:00 PM - 5:30 PM IST",
    language: "Hindi",
    price: 999,
    seatType: "Per Seat",
    includesMaterial: false,
    materialDetails: "Digital workbook and poetry anthologies provided in dashboard.",
    description: "Weekend online intensive exploring meter (Matra), emotive vocabulary (Rasa), and contemporary narrative structure in Hindi prose and poetry.",
  },
  {
    id: "ws-tamil-phonetics-chennai",
    title: "Tamil Phonetics & Classical Literature Bootcamp (In-Person)",
    instructor: "Dr. K. Sundaram",
    mode: "Offline (In-Person)",
    venue: "Dakshina Literary Forum, T. Nagar, Chennai, Tamil Nadu",
    date: "December 19, 2026 · 9:30 AM - 3:30 PM IST",
    language: "Tamil",
    price: 1699,
    seatType: "Per Seat",
    includesMaterial: true,
    materialDetails: "Includes printed Sangam literature reader, phonetic charts, and audio guide flash drive.",
    description: "Immersive in-person session training non-native and heritage speakers in acoustic distinction, Sangam poetic conventions, and dialogue cadence.",
  },
  {
    id: "ws-sanskrit-chanting-online",
    title: "Vedic Chanting & Sanskrit Grammar Bootcamp (Virtual)",
    instructor: "Acharya Vidyadhar",
    mode: "Online (Virtual Cohort)",
    venue: "Live Interactive Virtual Classroom (Zoom)",
    date: "November 28–29, 2026 · 7:00 AM - 9:30 AM IST",
    language: "Sanskrit",
    price: 1199,
    seatType: "Per Seat",
    includesMaterial: false,
    materialDetails: "Digital Sanskrit workbook with audio recitation stems.",
    description: "Live cohort workshop dissecting Paninian Sandhi rules, vocal resonance techniques, and systematic recitation of Bhagavad Gita chapters.",
  },
  {
    id: "ws-marathi-theatre-pune",
    title: "Marathi Dramatic Diction & Monologue Studio (In-Person)",
    instructor: "Prof. S. Deshmukh",
    mode: "Offline (In-Person)",
    venue: "Kalaniketan Cultural Center, FC Road, Pune, Maharashtra",
    date: "January 9, 2027 · 10:00 AM - 5:00 PM IST",
    language: "Marathi",
    price: 1599,
    seatType: "Per Seat",
    includesMaterial: true,
    materialDetails: "Includes printed script booklet, stage diction glossary, and workshop folder.",
    description: "In-person performance workshop exploring dramatic pronunciation, regional dialects of Maharashtra, and character dialogue delivery.",
  },
  {
    id: "ws-telugu-literary-online",
    title: "Telugu Literary Translation & Modern Usage (Virtual)",
    instructor: "Smt. V. Lakshmi",
    mode: "Online (Virtual Cohort)",
    venue: "Live Interactive Virtual Classroom (Google Meet)",
    date: "January 16–17, 2027 · 3:00 PM - 6:00 PM IST",
    language: "Telugu",
    price: 899,
    seatType: "Per Seat",
    includesMaterial: false,
    materialDetails: "Digital reference lexicon and translation exercise suite.",
    description: "Translate classic and modern texts between English and Telugu with real-time feedback on contextual accuracy and cultural equivalence.",
  },
];

export default function WorkshopsCatalogPage() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "Online" | "Offline">("All");

  const filtered = WORKSHOPS_DATA.filter((w) => {
    const matchesMode =
      filterMode === "All"
        ? true
        : filterMode === "Online"
        ? w.mode.includes("Online")
        : w.mode.includes("Offline");
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      w.title.toLowerCase().includes(q) ||
      w.instructor.toLowerCase().includes(q) ||
      w.language.toLowerCase().includes(q) ||
      w.venue.toLowerCase().includes(q);
    return matchesMode && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-200 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <div className="fixed inset-0 bg-gradient-to-b from-purple-950/15 via-transparent to-stone-950 pointer-events-none" />

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>Interactive Cohorts &amp; Immersions</span>
          </div>
          <h1 className="font-kalam text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Language Workshops
          </h1>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            Participate in intensive cohort bootcamps and cultural immersions. Available in both virtual online format and in-person offline venues across India.
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
              placeholder="Search by workshop title, instructor, city, or venue..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500/60 outline-none text-sm transition-colors"
            />
          </div>

          <div className="flex gap-2 items-center">
            {(["All", "Online", "Offline"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterMode === m
                    ? "bg-amber-500 text-stone-950 font-bold"
                    : "bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-white"
                }`}
              >
                {m === "All" ? "All Workshops" : m === "Online" ? "Virtual Online" : "Offline In-Person"}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((w) => {
            const checkoutUrl = `/checkout?type=workshop&id=${w.id}&title=${encodeURIComponent(
              w.title
            )}&instructor=${encodeURIComponent(w.instructor)}&price=${w.price}&mode=${encodeURIComponent(
              w.mode
            )}&venue=${encodeURIComponent(w.venue)}&date=${encodeURIComponent(w.date)}`;

            const isOffline = w.mode.includes("Offline");

            return (
              <div
                key={w.id}
                className="bg-stone-900/60 border border-stone-800 hover:border-purple-500/40 rounded-3xl p-6 transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold">
                      {w.language}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                        isOffline
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                          : "bg-blue-500/10 border-blue-500/30 text-blue-300"
                      }`}
                    >
                      {w.mode}
                    </span>
                  </div>

                  <h3 className="font-kalam text-xl font-bold text-white mb-2 leading-snug">
                    {w.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-3">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-semibold">{w.instructor}</span>
                  </div>

                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4">
                    {w.description}
                  </p>

                  {/* Venue & Date */}
                  <div className="space-y-2 mb-4 p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 text-xs text-stone-300">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <span>{w.date}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                      <span className="leading-snug">{w.venue}</span>
                    </div>
                  </div>

                  {/* Material Note if applicable */}
                  {w.includesMaterial && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 mb-4">
                      <Package className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="leading-snug">{w.materialDetails}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs sm:text-sm mb-5 pt-2 border-t border-stone-800">
                    <span className="text-xs text-stone-500">{w.seatType}</span>
                    <div className="text-right">
                      <span className="text-xs text-stone-500 block">Total Payable</span>
                      <span className="text-white font-bold text-lg">₹{w.price}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isAuthenticated ? (
                    <Link
                      href={checkoutUrl}
                      className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white transition-all shadow-md"
                    >
                      <span>Reserve Seat via Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/auth/login?redirect=${encodeURIComponent(checkoutUrl)}`}
                      className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white transition-all border border-stone-700"
                    >
                      <span>Sign in to Reserve Seat</span>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Workshop Policy Notice */}
        <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-stone-300">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
            <span>
              Workshops: Full refund if cancelled at least 48 hours (online) or 72 hours (offline) before start. Physical study material backed by 7-day defect replacement.
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

