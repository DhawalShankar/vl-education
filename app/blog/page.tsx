"use client";

import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Blog Posts & Guides (Placeholder Data) ─────────────────────
 * TODO: Connect to backend API: GET /api/v1/articles
 * Replace this static placeholder array with live articles, author metadata,
 * and markdown/HTML body content from the backend database or CMS.
 */
const placeholderPosts = [
  {
    title: "Why Learning Hindi Opens Doors Across India",
    excerpt: "With over 500 million speakers, Hindi connects opportunities in government, media, commerce, and culture across northern and central states.",
    date: "Sep 2026",
    readTime: "5 min read",
    tag: "Hindi",
    color: "from-orange-500 to-red-500",
    emoji: "📚",
  },
  {
    title: "Tamil: Classical Heritage & Contemporary Usage",
    excerpt: "Discover the deep literary history of one of the world's oldest surviving classical languages and why mastering it unlocks deep cultural nuance.",
    date: "Sep 2026",
    readTime: "6 min read",
    tag: "Tamil",
    color: "from-red-500 to-pink-500",
    emoji: "🌴",
  },
  {
    title: "5 Proven Strategies for Rapid Vernacular Acquisition",
    excerpt: "Practical insights from polyglots and educators — from spaced repetition to daily voice practice — to accelerate your language retention.",
    date: "Aug 2026",
    readTime: "7 min read",
    tag: "Learning Tips",
    color: "from-blue-500 to-cyan-500",
    emoji: "🧠",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex flex-col justify-between">
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-16 w-full">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-200">VartaLang Articles & Insights</span>
          </div>
          <h1 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-4">
            Language, Culture & Learning
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">
            Linguistic perspectives, pedagogy guides, and stories for language learners.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {placeholderPosts.map((post, i) => (
            <article
              key={i}
              className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${post.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-transform shadow-lg`}
                >
                  {post.emoji}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                    {post.tag}
                  </span>
                </div>
                <h2 className="font-kalam text-xl font-bold text-white mb-3 leading-snug group-hover:text-amber-200 transition-colors">
                  {post.title}
                </h2>
                <p className="text-stone-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-700/50">
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="text-center p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50 max-w-3xl mx-auto">
          <h2 className="font-kalam text-3xl font-bold text-white mb-2">Stay Updated</h2>
          <p className="text-stone-400 text-sm mb-6">
            Receive linguistic guides and new course announcements directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3 rounded-xl bg-stone-950/80 border border-stone-700/50 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold rounded-xl transition-all font-kalam text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
