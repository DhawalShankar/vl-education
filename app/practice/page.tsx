"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quote, Sparkles, ArrowLeft, Mic, Headphones, Video, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const languageQuotes = [
  { quote: "One language sets you in a corridor for life. Two languages open every door along the way.", author: "Frank Smith" },
  { quote: "To have another language is to possess a second soul.", author: "Charlemagne" },
  { quote: "Language is the road map of a culture. It tells you where its people come from and where they are going.", author: "Rita Mae Brown" },
  { quote: "The limits of my language mean the limits of my world.", author: "Ludwig Wittgenstein" },
  { quote: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
  { quote: "A different language is a different vision of life.", author: "Federico Fellini" },
  { quote: "Knowledge of languages is the doorway to wisdom.", author: "Roger Bacon" },
  { quote: "If you talk to a man in a language he understands, that goes to his head. If you talk to him in his own language, that goes to his heart.", author: "Nelson Mandela" },
];

const upcomingFeatures = [
  { icon: Mic, title: 'Pronunciation Lab', desc: 'Real-time AI feedback on your pronunciation with native speaker comparison', color: 'from-blue-500 to-cyan-500', eta: 'Q4 2026' },
  { icon: Headphones, title: 'Listening Studio', desc: 'Curated native audio clips with comprehension exercises and transcripts', color: 'from-purple-500 to-pink-500', eta: 'Q4 2026' },
  { icon: Video, title: 'Video Immersion', desc: 'Bite-sized authentic video lessons with interactive subtitles', color: 'from-orange-500 to-red-500', eta: 'Q1 2027' },
  { icon: MessageSquare, title: 'Conversation Simulator', desc: 'AI-powered conversation practice with scenario-based dialogues', color: 'from-green-500 to-emerald-500', eta: 'Q1 2027' },
];

export default function PracticePage() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    setCurrentQuote(Math.floor(Math.random() * languageQuotes.length));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden">
      <Navbar />

      {/* Background */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* Back nav */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/20 border-2 border-amber-400/30 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-semibold text-amber-100 tracking-wide">Coming Soon</span>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>

          <h1 className="font-kalam text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Practice Labs
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300">
              Coming Soon
            </span>
          </h1>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto">
            We're building immersive, AI-powered practice tools to supercharge your language learning. Here's what's coming:
          </p>
        </div>

        {/* Upcoming Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {upcomingFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group relative p-6 bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 rounded-2xl transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-kalam text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-4">{feature.desc}</p>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ETA: {feature.eta}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quote Card */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative p-10 md:p-14 rounded-3xl bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 hover:border-amber-500/30 transition-all">
            <div className="absolute top-8 left-8 opacity-5">
              <Quote className="w-20 h-20 text-amber-400" />
            </div>
            <div className="relative z-10 text-center">
              <div className="text-5xl text-amber-400/40 font-serif leading-none mb-4">"</div>
              <p className="font-kalam text-2xl md:text-3xl text-white mb-6 leading-relaxed italic">
                {languageQuotes[currentQuote].quote}
              </p>
              <div className="text-5xl text-amber-400/40 font-serif leading-none text-right mb-4">"</div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-amber-400/30" />
                <p className="text-lg font-semibold text-amber-300 font-kalam">
                  {languageQuotes[currentQuote].author}
                </p>
                <div className="h-px w-12 bg-amber-400/30" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-stone-500 text-sm font-kalam italic mb-6">
            In the meantime, explore our curated language courses and start learning today!
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold font-kalam text-lg transition-all hover:scale-105 shadow-2xl hover:shadow-amber-500/50"
          >
            Explore Language Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}