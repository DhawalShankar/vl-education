"use client";
import { useState, useEffect } from 'react';
import {
  Globe,
  Shield,
  Star,
  Award,
  Mic,
  BookOpen,
  Users,
  ArrowRight
} from 'lucide-react';

// Launch target: adjust this single constant if the date shifts.
const LAUNCH_DATE = new Date('2026-12-01T00:00:00+05:30'); // IST

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
    done: false
  };
}

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdownUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  const previewFeatures = [
    { icon: Mic, title: '22 Languages', description: 'Voice-first practice across every scheduled Indian language, plus English' },
    { icon: BookOpen, title: 'Guided Paths', description: 'Structured curriculum from first script to exam-ready fluency' },
    { icon: Users, title: 'Real Mentors', description: 'Language experts reviewing your progress, not just an algorithm' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden">
      {/* Blackboard Texture Background */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      ></div>

      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-linear-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none"></div>

      {/* Hero / Coming Soon */}
      <section className="relative pt-16 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto relative z-10 text-center w-full">

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-400/30 mb-10">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-sm font-semibold text-amber-200">Under Development</span>
          </div>

          <h1 className="font-kalam text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] drop-shadow-2xl">
            Something New Is
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-200 to-amber-300">
              Being Written
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-stone-200 max-w-3xl mx-auto leading-relaxed mb-4">
            VartaLang is putting the finishing touches on its full learning experience.
          </p>
          <p className="text-base text-stone-400 max-w-2xl mx-auto mb-14">
            Labs, learning paths, and mentor support — arriving this December.
          </p>

          {/* Countdown */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-14">
            {countdownUnits.map((unit) => (
              <div
                key={unit.label}
                className="w-24 md:w-32 py-6 bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 rounded-2xl"
              >
                <div className="font-kalam text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-xs text-stone-400">{unit.label}</div>
              </div>
            ))}
          </div>

          {timeLeft.done && (
            <p className="text-amber-300 font-semibold mb-10">
              Launch day is here — thanks for waiting with us.
            </p>
          )}

          {/* Meanwhile message */}
          <div className="max-w-md mx-auto">
            <p className="text-stone-300 mb-5">
              Until then, sign up at <span className="text-amber-300 font-semibold">vartalang.in</span> to get in early.
            </p>
            <a
              href="https://vartalang.in/auth/signup"
              className="px-8 py-4 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold shadow-xl hover:shadow-amber-500/40 transition-all inline-flex items-center justify-center gap-2"
            >
              Sign Up at vartalang.in
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
            {[
              { icon: Shield, text: 'Certified Content' },
              { icon: Star, text: 'Expert-Curated' },
              { icon: Globe, text: '22 Languages' },
              { icon: Award, text: 'Exam-Ready' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-stone-300">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-sm font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Coming */}
      <section className="relative py-20 px-6 border-t-2 border-stone-800/50">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-kalam text-4xl md:text-5xl font-bold text-white mb-4">
              What&apos;s Coming
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              A preview of what launches in December
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {previewFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 bg-stone-900/40 backdrop-blur-sm border-2 border-stone-700/50 rounded-2xl"
                >
                  <div className="w-14 h-14 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-kalam text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meanwhile CTA */}
      <section className="py-20 px-6 border-t border-stone-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-kalam text-3xl md:text-4xl font-normal text-stone-100 mb-4">
            Already recording for the Great Indian Voice Challenge?
          </h2>
          <p className="text-stone-400 mb-8 leading-relaxed">
            That part of VartaLang is live right now — no need to wait for December.
          </p>
          <a
            href="https://vartalang.in/challenge"
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-md font-medium transition-all hover:scale-105"
          >
            Go to the Voice Challenge
          </a>
        </div>
      </section>

      {/* Footer Note */}
      <div className="border-t border-stone-800/50 py-8 px-6">
        <p className="text-center text-xs text-stone-600">
          Preserving India&apos;s Linguistic Heritage Through Modern Education
        </p>
      </div>
    </div>
  );
}