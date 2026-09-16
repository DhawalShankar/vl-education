"use client";
import Link from 'next/link';
import { ArrowLeft, Home, BookOpen, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex items-center justify-center px-6">
      {/* Background */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="font-kalam text-[10rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-amber-400/30 to-orange-600/30 mb-4 select-none">
          404
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-kalam text-2xl font-bold text-white">VartaLang</span>
        </div>

        <h1 className="font-kalam text-4xl md:text-5xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-stone-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track!
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl font-kalam text-lg transition-all hover:scale-105 shadow-xl hover:shadow-amber-500/40"
          >
            <Home className="w-5 h-5" /> Go Home
          </Link>
          <Link
            href="/learn"
            className="flex items-center gap-2 px-8 py-4 border-2 border-stone-700 hover:border-amber-500 bg-stone-900/50 text-stone-200 font-bold rounded-xl font-kalam text-lg transition-all hover:scale-105"
          >
            Browse Courses <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
