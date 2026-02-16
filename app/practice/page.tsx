"use client";
import { useState, useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';

// Famous quotes about language learning
const languageQuotes = [
  {
    quote: "One language sets you in a corridor for life. Two languages open every door along the way.",
    author: "Frank Smith"
  },
  {
    quote: "To have another language is to possess a second soul.",
    author: "Charlemagne"
  },
  {
    quote: "Language is the road map of a culture. It tells you where its people come from and where they are going.",
    author: "Rita Mae Brown"
  },
  {
    quote: "The limits of my language mean the limits of my world.",
    author: "Ludwig Wittgenstein"
  },
  {
    quote: "Learning is a treasure that will follow its owner everywhere.",
    author: "Chinese Proverb"
  },
  {
    quote: "A different language is a different vision of life.",
    author: "Federico Fellini"
  },
  {
    quote: "Knowledge of languages is the doorway to wisdom.",
    author: "Roger Bacon"
  },
  {
    quote: "Language is the blood of the soul into which thoughts run and out of which they grow.",
    author: "Oliver Wendell Holmes"
  },
  {
    quote: "If you talk to a man in a language he understands, that goes to his head. If you talk to him in his own language, that goes to his heart.",
    author: "Nelson Mandela"
  },
  {
    quote: "Learn everything you can, anytime you can, from anyone you can; there will always come a time when you will be grateful you did.",
    author: "Sarah Caldwell"
  }
];

export default function UpcomingPage() {
  const [currentQuote, setCurrentQuote] = useState(0);

  // Select random quote on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * languageQuotes.length);
    setCurrentQuote(randomIndex);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex items-center justify-center px-6 py-40">
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

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Top Badge */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/20 border-2 border-amber-400/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-semibold text-amber-100 tracking-wide">Coming Soon</span>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="font-kalam text-5xl md:text-6xl lg:text-7xl font-bold text-white/30 mb-16 leading-tight drop-shadow-lg">
          Feature Under
          <br />
          Development
        </h1>

        {/* Quote Card */}
        <div className="relative p-10 md:p-16 rounded-3xl bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 hover:border-amber-500/30 transition-all">
          {/* Quote Icon Background */}
          <div className="absolute top-8 left-8 opacity-5">
            <Quote className="w-24 h-24 text-amber-400" />
          </div>

          {/* Quote Content */}
          <div className="relative z-10">
            {/* Opening Quote Mark */}
            <div className="text-6xl text-amber-400/40 font-serif leading-none mb-4">"</div>
            
            <p className="font-kalam text-2xl md:text-3xl text-white mb-8 leading-relaxed italic">
              {languageQuotes[currentQuote].quote}
            </p>
            
            {/* Closing Quote Mark */}
            <div className="text-6xl text-amber-400/40 font-serif leading-none text-right mb-6">"</div>
            
            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-amber-400/30"></div>
              <p className="text-lg font-semibold text-amber-300 font-kalam">
                {languageQuotes[currentQuote].author}
              </p>
              <div className="h-px w-12 bg-amber-400/30"></div>
            </div>
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-0 right-0 w-20 h-20">
            <div className="absolute top-4 right-4 w-12 h-px bg-linear-to-l from-amber-400/30 to-transparent"></div>
            <div className="absolute top-4 right-4 w-px h-12 bg-linear-to-b from-amber-400/30 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-20 h-20">
            <div className="absolute bottom-4 left-4 w-12 h-px bg-linear-to-r from-amber-400/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4 w-px h-12 bg-linear-to-t from-amber-400/30 to-transparent"></div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-12">
          <p className="text-stone-500 text-sm font-kalam italic">
            We're working hard to bring this feature to life. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}