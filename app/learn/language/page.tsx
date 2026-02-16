"use client";
import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { useDarkMode } from '@/lib/DarkModeContext';

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
  const { darkMode } = useDarkMode();
  const [currentQuote, setCurrentQuote] = useState(0);

  // Select random quote on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * languageQuotes.length);
    setCurrentQuote(randomIndex);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${
      darkMode ? 'bg-[#1a1410]' : 'bg-[#FFF9F5]'
    }`}>
      {/* Subtle Background Gradients */}
      <div className={`absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-30 ${
        darkMode ? 'bg-orange-900/20' : 'bg-orange-200/30'
      }`}></div>
      <div className={`absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-30 ${
        darkMode ? 'bg-red-900/20' : 'bg-red-200/30'
      }`}></div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Coming Soon Heading */}
        <h1 className={`text-4xl md:text-5xl font-bold mb-16 ${
          darkMode ? 'text-orange-50/40' : 'text-gray-900/40'
        }`}>
          Coming Soon
        </h1>

        {/* Quote Card */}
        <div className={`p-8 md:p-12 rounded-3xl border relative ${
          darkMode 
            ? 'bg-orange-900/5 border-orange-800/20' 
            : 'bg-white/50 border-orange-100'
        }`}>
          {/* Quote Icon */}
          <div className={`absolute top-6 left-6 opacity-5 ${
            darkMode ? 'text-orange-400' : 'text-orange-600'
          }`}>
            <Quote className="w-16 h-16" />
          </div>

          {/* Quote Content */}
          <div className="relative z-10">
            <p className={`text-lg md:text-xl font-serif italic mb-6 leading-relaxed ${
              darkMode ? 'text-orange-50' : 'text-gray-900'
            }`}>
              "{languageQuotes[currentQuote].quote}"
            </p>
            
            <p className={`text-base font-medium ${
              darkMode ? 'text-orange-300' : 'text-orange-700'
            }`}>
              — {languageQuotes[currentQuote].author}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}