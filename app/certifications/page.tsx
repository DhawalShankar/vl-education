"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Award, ScrollText, BadgeCheck, Star, Clock, Sparkles, GraduationCap } from "lucide-react";

const certs = [
  {
    icon: ScrollText,
    title: "Language Proficiency Certificate",
    desc: "Demonstrate your reading, writing, and listening skills in any of our supported languages. Shareable on LinkedIn.",
    color: "from-amber-500 to-orange-600",
    eta: "Q1 2027",
    levels: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    icon: GraduationCap,
    title: "IELTS Readiness Certificate",
    desc: "Complete our IELTS prep track and receive a certificate verifying your exam-readiness score.",
    color: "from-blue-500 to-cyan-600",
    eta: "Q1 2027",
    levels: ["Band 5–6", "Band 7+"],
  },
  {
    icon: BadgeCheck,
    title: "Teacher Training Certificate",
    desc: "Complete the Teacher's Methodology track approved by language education experts.",
    color: "from-green-500 to-emerald-600",
    eta: "Q2 2027",
    levels: ["Foundation", "Certified Educator"],
  },
  {
    icon: Star,
    title: "Exam Excellence Badge",
    desc: "Score 90%+ in a proctored language exam on our platform to earn an official badge.",
    color: "from-purple-500 to-pink-600",
    eta: "Q2 2027",
    levels: ["Language specific"],
  },
];

export default function CertificationsPage() {
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
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-purple-500/20 border-2 border-purple-400/30 backdrop-blur-sm mb-10">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-semibold text-purple-100 tracking-wide">Coming Soon</span>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          </div>

          <h1 className="font-kalam text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] drop-shadow-2xl">
            Certifications
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-200 to-cyan-300">
              Prove Your Mastery
            </span>
          </h1>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            Official certificates recognized by educators and employers alike — earned by completing
            structured learning tracks and passing proctored assessments.
          </p>
        </div>

        {/* Cert Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {certs.map((cert, i) => {
            const Icon = cert.icon;
            return (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-stone-900/60 border-2 border-stone-700/50 hover:border-purple-500/40 transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-kalam text-xl font-bold text-white leading-snug">{cert.title}</h3>
                  <span className="shrink-0 flex items-center gap-1.5 text-xs text-stone-500 bg-stone-800/60 px-3 py-1.5 rounded-full border border-stone-700/50">
                    <Clock className="w-3 h-3" /> {cert.eta}
                  </span>
                </div>
                <p className="text-stone-400 text-sm leading-relaxed mb-4">{cert.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {cert.levels.map((l) => (
                    <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-400">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Award Banner */}
        <div className="text-center p-14 rounded-3xl bg-gradient-to-br from-purple-500/10 via-stone-900/60 to-blue-500/10 border-2 border-purple-500/20">
          <Award className="w-20 h-20 mx-auto mb-6 text-purple-400 drop-shadow-lg" />
          <h2 className="font-kalam text-4xl font-bold text-white mb-4">
            Your Achievement, Verified
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Certifications launch in 2027. Begin your language journey now through our Courses so
            you're ready to certify the moment they go live.
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white rounded-xl font-bold font-kalam text-lg transition-all hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
          >
            Explore Courses <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
