"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Trophy, Sword, Target, Zap, Clock, Medal, Sparkles } from "lucide-react";

const challengeTypes = [
  {
    icon: Sword,
    title: "Daily Duels",
    desc: "Head-to-head vocabulary battles against other learners — one language, one winner.",
    color: "from-red-500 to-orange-600",
    eta: "Q4 2026",
  },
  {
    icon: Target,
    title: "Script Sprint",
    desc: "Race to transliterate a passage correctly before the timer runs out.",
    color: "from-blue-500 to-cyan-500",
    eta: "Q4 2026",
  },
  {
    icon: Zap,
    title: "Flashcard Blitz",
    desc: "Rapid-fire word-to-meaning matching under pressure — as fast as you can.",
    color: "from-amber-500 to-yellow-500",
    eta: "Q1 2027",
  },
  {
    icon: Medal,
    title: "Weekly Leaderboard",
    desc: "Earn XP throughout the week and compete for a spot at the top of your language group.",
    color: "from-purple-500 to-pink-500",
    eta: "Q1 2027",
  },
];

export default function ChallengesPage() {
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
      <div className="fixed inset-0 bg-gradient-to-b from-red-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-red-500/20 border-2 border-red-400/30 backdrop-blur-sm mb-10">
            <Sparkles className="w-4 h-4 text-red-300" />
            <span className="text-sm font-semibold text-red-100 tracking-wide">Coming Soon</span>
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          </div>

          <h1 className="font-kalam text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] drop-shadow-2xl">
            Challenges
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-orange-200 to-amber-300">
              Compete &amp; Conquer
            </span>
          </h1>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            Language mastery meets competitive spirit. Take on daily challenges, race against other
            learners, and climb leaderboards — all launching soon.
          </p>
        </div>

        {/* Challenge Types */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {challengeTypes.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-stone-900/60 border-2 border-stone-700/50 hover:border-red-500/40 transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-kalam text-2xl font-bold text-white">{c.title}</h3>
                  <span className="shrink-0 flex items-center gap-1.5 text-xs text-stone-500 bg-stone-800/60 px-3 py-1.5 rounded-full border border-stone-700/50">
                    <Clock className="w-3 h-3" /> {c.eta}
                  </span>
                </div>
                <p className="text-stone-400 text-sm leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Trophy Banner */}
        <div className="text-center p-14 rounded-3xl bg-gradient-to-br from-red-500/10 via-stone-900/60 to-orange-500/10 border-2 border-red-500/20">
          <Trophy className="w-20 h-20 mx-auto mb-6 text-amber-400 drop-shadow-lg" />
          <h2 className="font-kalam text-4xl font-bold text-white mb-4">
            Be First on the Leaderboard
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Challenges launch in December 2026. Until then, build your skills in Courses so
            you start the competition ahead of everyone else.
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold font-kalam text-lg transition-all hover:scale-105 shadow-2xl hover:shadow-amber-500/50"
          >
            Start Learning Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
