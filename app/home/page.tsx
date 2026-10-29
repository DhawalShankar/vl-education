// app/page.tsx  (LMS home)
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Layers,
  Gift,
  ShoppingCart,
  PenLine,
  Tag,
  Store,
  Eye,
  IndianRupee,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";

const languages = [
  { id: "hindi", name: "Hindi", native: "हिंदी" },
  { id: "english", name: "English", native: "English" },
  { id: "tamil", name: "Tamil", native: "தமிழ்" },
  { id: "telugu", name: "Telugu", native: "తెలుగు" },
  { id: "bengali", name: "Bengali", native: "বাংলা" },
  { id: "marathi", name: "Marathi", native: "मराठी" },
];

const learnerFeatures = [
  {
    icon: Gift,
    title: "Free courses",
    text: "Start right away. Many courses are free, with no card needed.",
  },
  {
    icon: Layers,
    title: "Structured curriculum",
    text: "Every course is organised into modules and lessons, so you always know what comes next.",
  },
  {
    icon: ShoppingCart,
    title: "Buy premium courses",
    text: "Pay once for a paid course and it stays in your account.",
  },
  {
    icon: BookOpen,
    title: "Learn in your language",
    text: "Pick a language and see the courses available for it.",
  },
];

const educatorLive = [
  {
    icon: PenLine,
    title: "Create courses",
    text: "Build a course from scratch and organise it into modules and lessons.",
  },
  {
    icon: Tag,
    title: "Free or paid",
    text: "Offer a course free, or set a price for it.",
  },
  {
    icon: Store,
    title: "Sell to students",
    text: "Students can find and buy your course on the platform.",
  },
];

const educatorDashboard = [
  { icon: Eye, text: "Which content is public and which is private" },
  { icon: BarChart3, text: "How many courses you have sold" },
  { icon: IndianRupee, text: "How much you have earned" },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isInstructor, loading } = useAuth();

  const goLearn = () => router.push(isAuthenticated ? "/dashboard" : "/auth/login");
  const goTeach = () =>
    router.push(isAuthenticated && isInstructor ? "/instructor-dashboard" : "/auth/login");

  return (
    <div className="min-h-screen bg-[#0B0A08] text-white">
      <Navbar />

      {/* Hero */}
      <section className="px-6 pt-44 pb-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-kalam text-5xl md:text-7xl font-bold leading-[1.08] max-w-4xl">
            Learn a language. Or teach one and get paid for it.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            VartaLang LMS is where educators publish courses and learners study them, free or paid,
            in a clear module-by-module curriculum.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={goLearn}
              disabled={loading}
              className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E64A00] hover:from-[#FF6600] hover:to-[#FF5500] font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isAuthenticated ? "Go to my dashboard" : "Start learning"}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={goTeach}
              disabled={loading}
              className="px-7 py-4 rounded-xl border border-white/20 hover:border-[#FF7700] hover:text-[#FF9944] font-semibold transition-colors disabled:opacity-50"
            >
              {isAuthenticated && isInstructor ? "Open instructor dashboard" : "Teach on VartaLang"}
            </button>
            <Link
              href="/learn"
              className="px-4 py-4 text-white/60 hover:text-white font-medium underline underline-offset-4"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </section>

      {/* For learners */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-kalam text-4xl md:text-5xl font-bold">For learners</h2>
          <p className="mt-3 text-white/55 max-w-xl">
            Find a course, enrol, and follow it from the first lesson to the last.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 gap-x-12 gap-y-10">
            {learnerFeatures.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-[#FF5500]/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#FF8800]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="mt-1 text-sm text-white/55 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="px-6 py-20 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-kalam text-4xl md:text-5xl font-bold">Pick a language</h2>
              <p className="mt-3 text-white/55">See the courses available for each one.</p>
            </div>
            <Link
              href="/learn"
              className="hidden sm:flex items-center gap-1.5 text-[#FF8800] hover:underline text-sm font-medium"
            >
              All courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map((l) => (
              <Link
                key={l.id}
                href={`/learn/${l.id}`}
                className="group p-5 rounded-2xl border border-white/10 hover:border-[#FF5500]/60 bg-[#14120E] transition-colors"
              >
                <p className="text-2xl font-semibold">{l.native}</p>
                <p className="mt-1 text-sm text-white/50 flex items-center justify-between">
                  {l.name}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#FF8800] transition-opacity" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* For educators */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-kalam text-4xl md:text-5xl font-bold">For educators</h2>
          <p className="mt-3 text-white/55 max-w-xl">
            Turn what you know into a course. You build it, you decide the price, and students buy it.
          </p>

          {/* Live now: a real sequence, so numbered */}
          <div className="mt-12">
            <h3 className="text-sm text-white/50 mb-5">What you can do today</h3>
            <ol className="grid md:grid-cols-3 gap-5">
              {educatorLive.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="p-6 rounded-2xl bg-[#14120E] border border-white/10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#FF5500]/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#FF8800]" />
                    </div>
                    <span className="text-sm text-white/30 font-medium">Step {i + 1}</span>
                  </div>
                  <h4 className="font-semibold text-lg">{title}</h4>
                  <p className="mt-1.5 text-sm text-white/55 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Instructor dashboard */}
          <div className="mt-10 p-7 md:p-9 rounded-3xl border border-[#FF5500]/30 bg-gradient-to-br from-[#FF5500]/10 to-transparent">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <LayoutDashboard className="w-6 h-6 text-[#FF8800]" />
              <h3 className="font-kalam text-2xl md:text-3xl font-bold">Your instructor dashboard</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FF5500]/20 text-[#FFB070]">
                Coming soon
              </span>
            </div>
            <p className="text-white/60 max-w-xl">
              One personal space for everything you teach. It will show you:
            </p>

            <ul className="mt-6 grid sm:grid-cols-3 gap-4">
              {educatorDashboard.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-white/75">
                  <Icon className="w-5 h-5 text-[#FF8800] shrink-0 mt-0.5" />
                  {text}
                </li>
              ))}
            </ul>

            <button
              onClick={goTeach}
              disabled={loading}
              className="mt-8 px-6 py-3.5 rounded-xl bg-white text-[#0B0A08] font-semibold hover:bg-white/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isAuthenticated && isInstructor ? "Open instructor dashboard" : "Sign in to start teaching"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {!isAuthenticated && (
        <section className="px-6 py-24 border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-kalam text-4xl md:text-5xl font-bold">Ready to begin?</h2>
            <p className="mt-4 text-white/55">
              Sign in with your VartaLang account. No account yet? You can create one in a minute.
            </p>
            <Link
              href="/auth/login"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E64A00] hover:from-[#FF6600] hover:to-[#FF5500] font-semibold transition-all"
            >
              Sign in <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}