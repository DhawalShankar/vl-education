"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Career Openings (Placeholder Data) ─────────────────────────
 * TODO: Connect to backend API: GET /api/v1/careers/jobs
 * Replace static placeholders with dynamic job openings loaded from the database.
 */
const placeholderOpenings = [
  {
    title: "Curriculum Designer (Vernacular Languages)",
    team: "Education & Linguistics",
    type: "Full-time / Remote",
    location: "Remote (India)",
    emoji: "📚",
  },
  {
    title: "AI/ML Speech Engineer (Indian Languages)",
    team: "Voice AI Engineering",
    type: "Full-time",
    location: "Remote / Bengaluru",
    emoji: "🤖",
  },
  {
    title: "Language Mentor & Quality Evaluator",
    team: "Content Verification",
    type: "Contract / Flexible",
    location: "Pan-India Remote",
    emoji: "✍️",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <div
        className="fixed inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-16 w-full">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-200">We&apos;re Hiring</span>
          </div>
          <h1 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-4">
            Join the VartaLang Mission
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">
            Help preserve India&apos;s linguistic heritage through modern educational technology. We are a remote-first team passionate about vernacular languages.
          </p>
        </div>

        {/* Job Openings List */}
        <div className="space-y-4 mb-16">
          {placeholderOpenings.map((job, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-stone-800/80 shrink-0">
                  {job.emoji}
                </div>
                <div>
                  <h3 className="font-kalam text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-stone-400" />
                      {job.team}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>
              <a
                href="mailto:support@cosmoindiaprakashan.in?subject=Application%20for%20"
                className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold font-kalam transition-all"
              >
                <span>Apply via Email</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* General Application */}
        <div className="text-center p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50 max-w-3xl mx-auto">
          <h2 className="font-kalam text-3xl font-bold text-white mb-2">Don&apos;t See Your Role?</h2>
          <p className="text-stone-400 text-sm mb-6 max-w-xl mx-auto">
            We are always seeking passionate linguists, voice AI engineers, and educators. Send your profile directly to our talent team.
          </p>
          <a
            href="mailto:support@cosmoindiaprakashan.in?subject=General%20Application%20-%20VartaLang"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold rounded-xl font-kalam transition-all hover:scale-105 text-sm"
          >
            <span>Send Open Application</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
