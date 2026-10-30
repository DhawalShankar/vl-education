"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Globe,
  Shield,
  Star,
  Award,
  Mic,
  BookOpen,
  Users,
  ArrowRight,
  Clock,
  Sparkles
} from "lucide-react";

// Launch target: adjust this single constant if the date shifts.
const LAUNCH_DATE = new Date("2026-12-01T00:00:00+05:30"); // IST

function getTimeLeft() {
  const now = new Date().getTime();
  const distance = LAUNCH_DATE.getTime() - now;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
    done: false,
  };
}

export default function ComingSoonPage() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    done: false,
  });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdownUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  const previewFeatures = [
    {
      icon: Mic,
      title: "22 Indian Languages",
      description:
        "Voice-first practice across every official Indian scheduled language, plus English and regional dialects.",
      badge: "Voice & Speech AI",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: BookOpen,
      title: "Guided Learning Paths",
      description:
        "Structured curriculum from your first native script to high-stakes exam and workplace fluency.",
      badge: "Curated Tracks",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: Users,
      title: "Certified Native Mentors",
      description:
        "Language educators and linguistic experts reviewing your speech recordings with personalized audio notes.",
      badge: "Human Feedback",
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070605] text-white relative overflow-hidden flex flex-col justify-between">
      {/* Floating Main Navbar */}
      <Navbar />

      {/* ── SECTION 1: HERO WITH HERITAGE ARCHITECTURE BACKDROP ──────── */}
      <section className="relative pt-36 pb-24 px-6 min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Carefully positioned Unsplash Indian Heritage Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=85')`,
            backgroundSize: "cover",
            backgroundPosition: "center 32%",
            filter: "contrast(115%) brightness(85%)",
          }}
        />

        {/* Ambient Warm Vignette & Gradient Overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 90% 65% at 50% 28%, rgba(217, 119, 6, 0.18), transparent 75%),
              linear-gradient(180deg, rgba(7, 6, 5, 0.6) 0%, rgba(7, 6, 5, 0.85) 60%, #070605 100%)
            `,
          }}
        />

        {/* Delicate Noise Overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10 text-center w-full">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-amber-500/15 border border-amber-400/30 backdrop-blur-md mb-8 shadow-lg shadow-amber-500/10">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-amber-200 tracking-wide uppercase">
              Platform Launching December 2026
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-kalam text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.08] drop-shadow-2xl tracking-tight">
            Something New Is
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400">
              Being Written
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-stone-200 max-w-3xl mx-auto leading-relaxed mb-4 font-normal">
            Preserving India&apos;s rich linguistic heritage through modern, AI-powered education.
          </p>
          <p className="text-base text-stone-400 max-w-2xl mx-auto mb-12">
            Practice labs, structured learning paths, and expert mentor support — arriving this winter.
          </p>

          {/* Countdown Display */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-12">
            {countdownUnits.map((unit) => (
              <div
                key={unit.label}
                className="w-20 sm:w-28 py-5 sm:py-6 bg-stone-900/80 backdrop-blur-xl border border-stone-700/60 rounded-2xl shadow-2xl hover:border-amber-500/40 transition-colors"
              >
                <div
                  suppressHydrationWarning
                  className="font-kalam text-3xl sm:text-5xl font-bold text-amber-300 mb-1 tabular-nums"
                >
                  {mounted ? String(unit.value).padStart(2, "0") : "00"}
                </div>
                <div className="text-[11px] sm:text-xs text-stone-400 font-medium uppercase tracking-wider">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {timeLeft.done && (
            <p className="text-amber-300 font-semibold mb-8 text-lg">
              Launch day is here — thank you for being part of the journey.
            </p>
          )}

          {/* Early Sign-up CTA & Direct Navigation */}
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/learn"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold font-kalam text-lg shadow-xl shadow-amber-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900/80 hover:bg-stone-800/90 border border-stone-700/70 text-stone-200 hover:text-white font-bold font-kalam text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>My Learning Portal</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-4 border-t border-stone-800/60 max-w-3xl mx-auto">
            {[
              { icon: Shield, text: "Certified Content" },
              { icon: Star, text: "Expert-Curated" },
              { icon: Globe, text: "22 Indian Languages" },
              { icon: Award, text: "Official Credentials" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-stone-400 text-xs sm:text-sm">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="font-medium text-stone-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: WHAT'S COMING WITH CLASSICAL LIBRARY BACKDROP ─── */}
      <section className="relative py-24 px-6 border-t border-stone-800/80 overflow-hidden">
        {/* Library / Knowledge Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507842229451-79b1be8838d6?w=1920&q=85')`,
            backgroundSize: "cover",
            backgroundPosition: "center 45%",
          }}
        />

        {/* Dark Vignette Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #070605 0%, rgba(7, 6, 5, 0.88) 40%, #070605 100%)",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wide">
                Under Active Development
              </span>
            </div>
            <h2 className="font-kalam text-4xl sm:text-5xl font-bold text-white mb-4">
              What&apos;s Coming in December
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              A comprehensive language learning ecosystem crafted specifically for India.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {previewFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 bg-stone-900/70 backdrop-blur-xl border border-stone-800/90 hover:border-amber-500/50 rounded-2xl transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-800/80 border border-stone-700/60 text-stone-300">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="font-kalam text-2xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-stone-400 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-800/80 flex items-center gap-2 text-xs text-amber-400 font-semibold font-kalam">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Launching December 2026</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: VOICE CHALLENGE CTA WITH STUDIO VOCAL BACKDROP ─── */}
      <section className="relative py-24 px-6 border-t border-stone-800/80 overflow-hidden">
        {/* Acoustic / Vocal Studio Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1920&q=85')`,
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
          }}
        />

        {/* Gradient Transition */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #070605 0%, rgba(180, 83, 9, 0.12) 50%, #070605 100%)",
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10 p-10 sm:p-14 rounded-3xl bg-stone-900/60 backdrop-blur-xl border border-amber-500/25 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-6 text-amber-400">
            <Mic className="w-7 h-7" />
          </div>

          <h2 className="font-kalam text-3xl sm:text-4xl font-bold text-white mb-4">
            Already participating in the Great Indian Voice Challenge?
          </h2>
          <p className="text-stone-300 mb-8 leading-relaxed max-w-xl mx-auto text-base">
            That part of VartaLang is live right now! Help train AI voice models for Indian languages
            and earn cash rewards for verified recordings.
          </p>

          <a
            href="https://vartalang.in/challenge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-amber-500/20 font-kalam text-lg"
          >
            <span>Go to the Voice Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Global Minimalist Footer */}
      <Footer />
    </div>
  );
}
