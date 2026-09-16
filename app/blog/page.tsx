"use client";
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const posts = [
  {
    title: 'Why Learning Hindi Opens Doors Across India',
    excerpt: 'With over 500 million speakers, Hindi is not just a language — it\'s a bridge to opportunities in government, media, and culture across the nation.',
    date: 'Sep 10, 2026',
    readTime: '5 min read',
    tag: 'Hindi',
    color: 'from-orange-500 to-red-500',
    emoji: '📚',
  },
  {
    title: 'Tamil: The Language That Never Stopped Evolving',
    excerpt: 'Tamil is one of the oldest living classical languages in the world. Discover its rich literary history and why learning it is a deeply rewarding journey.',
    date: 'Sep 5, 2026',
    readTime: '6 min read',
    tag: 'Tamil',
    color: 'from-red-500 to-pink-500',
    emoji: '🌴',
  },
  {
    title: '5 Proven Tips to Accelerate Your Language Learning',
    excerpt: 'Expert strategies from polyglots and linguists — from spaced repetition to active immersion — that dramatically speed up how fast you absorb a new language.',
    date: 'Aug 28, 2026',
    readTime: '8 min read',
    tag: 'Learning Tips',
    color: 'from-blue-500 to-cyan-500',
    emoji: '🧠',
  },
  {
    title: 'How to Crack the IELTS Writing Section',
    excerpt: 'A comprehensive breakdown of Task 1 and Task 2, common mistakes candidates make, and a structured approach to scoring Band 7+.',
    date: 'Aug 20, 2026',
    readTime: '10 min read',
    tag: 'Exam Prep',
    color: 'from-green-500 to-emerald-500',
    emoji: '✍️',
  },
  {
    title: 'Bengali Literature: Reading Between the Lines',
    excerpt: 'From Rabindranath Tagore to modern writers, Bengali literature offers a window into the soul of a civilization. Here\'s how to begin.',
    date: 'Aug 12, 2026',
    readTime: '7 min read',
    tag: 'Bengali',
    color: 'from-purple-500 to-pink-500',
    emoji: '📝',
  },
  {
    title: 'The Rise of Regional Language Careers in India',
    excerpt: 'Government services, media, education, and tech are all increasingly valuing regional language proficiency. Here\'s why this is your moment.',
    date: 'Aug 5, 2026',
    readTime: '6 min read',
    tag: 'Career',
    color: 'from-amber-500 to-orange-500',
    emoji: '💼',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden">
      <Navbar />

      {/* Background */}
      <div
        className="fixed inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-200">VartaLang Blog</span>
          </div>
          <h1 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-4">
            Language, Culture & Learning
          </h1>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto">
            Insights, guides, and stories for passionate language learners
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {posts.map((post, i) => (
            <article key={i} className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all hover:-translate-y-1 flex flex-col cursor-pointer">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${post.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                {post.emoji}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold">
                  {post.tag}
                </span>
              </div>
              <h2 className="font-kalam text-xl font-bold text-white mb-3 leading-snug group-hover:text-amber-200 transition-colors">
                {post.title}
              </h2>
              <p className="text-stone-400 text-sm leading-relaxed flex-1 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between pt-4 border-t border-stone-700/50">
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />{post.readTime}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
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

      <Footer />
    </div>
  );
}
