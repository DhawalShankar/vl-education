"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Heart, Globe, Shield, Award, Users, Target, BookOpen,
  Clock, ArrowRight, Briefcase, MapPin, ArrowLeft,
} from "lucide-react";

/* ─── DATA ───────────────────────────────────────────────────────── */

const tabs = ["About", "Blog", "Careers"] as const;
type Tab = typeof tabs[number];

const values = [
  { icon: Globe, title: "Cultural Preservation", desc: "Every language carries centuries of wisdom. We preserve and celebrate that heritage.", color: "text-amber-400" },
  { icon: Users, title: "Community First", desc: "Language is inherently social. We build connections between learners and speakers.", color: "text-blue-400" },
  { icon: Shield, title: "Quality Standards", desc: "Every resource is vetted by language experts and native speakers.", color: "text-green-400" },
  { icon: Target, title: "Exam Excellence", desc: "We prepare learners not just to speak, but to excel in certifications and careers.", color: "text-purple-400" },
];

const team = [
  { name: "Dhawal Shukla", role: "Founder", emoji: "👨‍💼", bg: "from-amber-500 to-orange-500" },
  { name: "Dhruv Khanna", role: "CTO & Co-Founder", emoji: "👨‍💻", bg: "from-blue-500 to-cyan-500" },
];

const stats = [
  { value: "22+", label: "Languages", icon: Globe },
  { value: "60+", label: "Learners", icon: Users },
  { value: "150+", label: "Resources", icon: BookOpen },
  { value: "2026", label: "Founded", icon: Award },
];

const posts = [
  { title: "Why Learning Hindi Opens Doors Across India", excerpt: "With over 500 million speakers, Hindi is not just a language — it's a bridge to opportunities in government, media, and culture.", date: "Sep 10, 2026", readTime: "5 min", tag: "Hindi", color: "from-orange-500 to-red-500", emoji: "📚" },
  { title: "Tamil: The Language That Never Stopped Evolving", excerpt: "Tamil is one of the oldest living classical languages. Discover its rich literary history and why learning it is deeply rewarding.", date: "Sep 5, 2026", readTime: "6 min", tag: "Tamil", color: "from-red-500 to-pink-500", emoji: "🌴" },
  { title: "5 Proven Tips to Accelerate Your Language Learning", excerpt: "Expert strategies from polyglots and linguists — from spaced repetition to active immersion.", date: "Aug 28, 2026", readTime: "8 min", tag: "Learning Tips", color: "from-blue-500 to-cyan-500", emoji: "🧠" },
  { title: "How to Crack the IELTS Writing Section", excerpt: "A comprehensive breakdown of Task 1 and Task 2, common mistakes, and a structured approach to scoring Band 7+.", date: "Aug 20, 2026", readTime: "10 min", tag: "Exam Prep", color: "from-green-500 to-emerald-500", emoji: "✍️" },
  { title: "Bengali Literature: Reading Between the Lines", excerpt: "From Rabindranath Tagore to modern writers, Bengali literature offers a window into the soul of a civilization.", date: "Aug 12, 2026", readTime: "7 min", tag: "Bengali", color: "from-purple-500 to-pink-500", emoji: "📝" },
  { title: "The Rise of Regional Language Careers in India", excerpt: "Government services, media, education, and tech are all increasingly valuing regional language proficiency.", date: "Aug 5, 2026", readTime: "6 min", tag: "Career", color: "from-amber-500 to-orange-500", emoji: "💼" },
];

const openings = [
  { title: "Senior Frontend Engineer", team: "Engineering", type: "Full-time", location: "Remote / Mumbai", emoji: "💻" },
  { title: "Curriculum Designer — Hindi", team: "Education", type: "Full-time", location: "Remote", emoji: "📚" },
  { title: "Curriculum Designer — Tamil", team: "Education", type: "Full-time", location: "Remote", emoji: "🌴" },
  { title: "AI/ML Engineer", team: "Engineering", type: "Full-time", location: "Bangalore / Remote", emoji: "🤖" },
  { title: "Community Manager", team: "Growth", type: "Full-time", location: "Remote", emoji: "🤝" },
  { title: "Language Expert (Freelance)", team: "Education", type: "Freelance", location: "Remote", emoji: "✍️" },
];

/* ─── COMPONENT ──────────────────────────────────────────────────── */

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("About");

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
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20">

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-amber-200">Our Community</span>
          </div>
          <h1 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            VartaLang Community
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Meet the people behind VartaLang, read our stories, and join our growing team.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex justify-center mb-14">
          <div className="flex gap-1 p-1.5 rounded-2xl bg-stone-900/60 border border-stone-700/50 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                id={`community-tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`px-7 py-2.5 rounded-xl text-sm font-semibold font-kalam transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── ABOUT ────────────────────────────────────────────────── */}
        {activeTab === "About" && (
          <div className="space-y-16">
            {/* Story */}
            <div id="story" className="p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50">
              <h2 className="font-kalam text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-stone-300 leading-relaxed">
                <p>
                  VartaLang was born in 2026 from a simple frustration: despite India having 22
                  scheduled languages and hundreds of dialects, quality language learning resources
                  were fragmented, expensive, or simply unavailable for most learners.
                </p>
                <p>
                  Our founders — passionate linguists, educators, and technologists — set out to
                  build a platform that combines the structure of formal education with the
                  flexibility of modern technology.
                </p>
                <p>
                  Today, VartaLang serves learners across 6 languages with plans to expand to all
                  22 official Indian languages, along with specialized exam preparation programs
                  for IELTS, teacher certifications, and government competitive examinations.
                </p>
              </div>
            </div>

            {/* Values */}
            <div>
              <h2 className="font-kalam text-4xl font-bold text-white mb-10 text-center">What We Stand For</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((val, i) => {
                  const Icon = val.icon;
                  return (
                    <div key={i} className="p-7 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/30 transition-all">
                      <Icon className={`w-8 h-8 ${val.color} mb-4`} />
                      <h3 className="font-kalam text-xl font-bold text-white mb-2">{val.title}</h3>
                      <p className="text-stone-400 text-sm leading-relaxed">{val.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team */}
            <div>
              <h2 className="font-kalam text-4xl font-bold text-white mb-10 text-center">The Team</h2>
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {team.map((member, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 text-center hover:border-amber-500/30 transition-all">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.bg} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}>
                      {member.emoji}
                    </div>
                    <h3 className="font-kalam text-lg font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-stone-500 text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50">
                    <Icon className="w-6 h-6 text-amber-400 mx-auto mb-3" />
                    <div className="font-kalam text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/learn"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold font-kalam text-lg transition-all hover:scale-105 shadow-2xl hover:shadow-amber-500/50"
              >
                Start Learning Today
              </Link>
            </div>
          </div>
        )}

        {/* ── BLOG ─────────────────────────────────────────────────── */}
        {activeTab === "Blog" && (
          <div>
            <div className="text-center mb-12">
              <h2 className="font-kalam text-5xl font-bold text-white mb-4">Language, Culture &amp; Learning</h2>
              <p className="text-xl text-stone-400 max-w-2xl mx-auto">
                Insights, guides, and stories for passionate language learners
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {posts.map((post, i) => (
                <article
                  key={i}
                  className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all hover:-translate-y-1 flex flex-col cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${post.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    {post.emoji}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold">
                      {post.tag}
                    </span>
                  </div>
                  <h3 className="font-kalam text-xl font-bold text-white mb-3 leading-snug group-hover:text-amber-200 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed flex-1 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-700/50">
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{post.readTime} read
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </article>
              ))}
            </div>

            {/* Newsletter */}
            <div className="text-center p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50">
              <h2 className="font-kalam text-3xl font-bold text-white mb-3">Stay Updated</h2>
              <p className="text-stone-400 mb-6">Get new articles delivered to your inbox every week</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-5 py-3 rounded-full bg-stone-900/60 border border-stone-700/50 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-full transition-all font-kalam">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CAREERS ──────────────────────────────────────────────── */}
        {activeTab === "Careers" && (
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-200">We&apos;re Hiring</span>
              </div>
              <h2 className="font-kalam text-5xl font-bold text-white mb-4">Join Our Team</h2>
              <p className="text-xl text-stone-400 max-w-2xl mx-auto">
                Help us preserve India's linguistic heritage. We're a remote-first team passionate
                about education, technology, and languages.
              </p>
            </div>

            <div className="space-y-4 mb-14">
              {openings.map((job, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl w-12 h-12 flex items-center justify-center">{job.emoji}</div>
                    <div>
                      <h3 className="font-kalam text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />{job.team}
                        </span>
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{job.location}
                        </span>
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{job.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="mailto:support@cosmoindiaprakashan.in"
                    className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-sm font-semibold font-kalam transition-all"
                  >
                    Apply <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>

            <div className="text-center p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50">
              <h2 className="font-kalam text-3xl font-bold text-white mb-3">Don&apos;t See Your Role?</h2>
              <p className="text-stone-400 mb-6">
                We're always looking for talented people. Send us your CV and tell us how you'd contribute.
              </p>
              <a
                href="mailto:support@cosmoindiaprakashan.in"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl font-kalam transition-all hover:scale-105"
              >
                Send Open Application <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
