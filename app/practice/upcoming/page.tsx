"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Mic, 
  Headphones,
  PenTool,
  BookOpen,
  Crown,
  Star,
  ChevronRight,
  Award,
  Clock,
  Trophy,
  CheckCircle,
  Sparkles,
  Brain,
  Zap
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Lab {
  id: string;
  title: string;
  description: string;
  icon: any;
  type: 'free' | 'premium';
  duration: string;
  exercises: number;
  gradient: string;
}

interface ProgressStats {
  totalSessions: number;
  completedLabs: number;
  mentorReviews: number;
  streakDays: number;
  todaysPractice: number;
}

export default function PracticePage() {
  const router = useRouter();
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Hindi");
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  // Available languages for practice
  const languages = [
    "Hindi", "English", "Spanish", "French", "German", 
    "Japanese", "Korean", "Mandarin", "Tamil", "Bengali"
  ];

  // Practice Labs
  const labs: Lab[] = [
    {
      id: 'listening-lab',
      title: 'Listening Lab',
      description: 'Hear words/sentences → Write what you heard → Check accuracy',
      icon: Headphones,
      type: 'free',
      duration: '10-15 min',
      exercises: 20,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'pronunciation-recording',
      title: 'Pronunciation Practice',
      description: 'Record yourself saying words → Submit for mentor review',
      icon: Mic,
      type: 'free',
      duration: '5-10 min',
      exercises: 15,
      gradient: 'from-orange-500 to-red-600'
    },
    {
      id: 'meaning-match',
      title: 'Meaning Match',
      description: 'Hear a word → Choose correct meaning from 4 options',
      icon: BookOpen,
      type: 'free',
      duration: '8-12 min',
      exercises: 25,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      id: 'dictation-lab',
      title: 'Dictation Lab',
      description: 'Listen to full sentences → Type them out → Get scored',
      icon: PenTool,
      type: 'free',
      duration: '10-15 min',
      exercises: 10,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'sound-identification',
      title: 'Sound Recognition',
      description: 'Identify similar-sounding letters (ड vs ड़, त vs ट)',
      icon: Sparkles,
      type: 'free',
      duration: '5-8 min',
      exercises: 30,
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'mentor-review',
      title: 'Get Mentor Review',
      description: 'Submit your recordings → Get detailed feedback from experts',
      icon: Crown,
      type: 'premium',
      duration: '24 hrs',
      exercises: 1,
      gradient: 'from-violet-500 to-purple-600'
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    
    setIsAuthenticating(false);
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/practice/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress || {
          totalSessions: 0,
          completedLabs: 0,
          mentorReviews: 0,
          streakDays: 0,
          todaysPractice: 0
        });
      } else {
        setProgress({
          totalSessions: 0,
          completedLabs: 0,
          mentorReviews: 0,
          streakDays: 0,
          todaysPractice: 0
        });
      }
    } catch (error) {
      console.error("Fetch progress error:", error);
      setProgress({
        totalSessions: 0,
        completedLabs: 0,
        mentorReviews: 0,
        streakDays: 0,
        todaysPractice: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLabClick = (labId: string, isPremium: boolean) => {
    router.push(`/practice/session?lab=${labId}&language=${selectedLanguage}`);
  };

  if (loading || isAuthenticating) {
    return (
      <div className="min-h-screen bg-[#0a0908]">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-amber-200">
              {isAuthenticating ? 'Checking authentication...' : 'Loading practice labs...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden">
      <Navbar />
      
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

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-cyan-500/20 border-2 border-cyan-400/30 backdrop-blur-sm">
              <Brain className="w-4 h-4 text-cyan-300" />
              <span className="text-sm font-semibold text-cyan-100 tracking-wide">AI-Powered Practice</span>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            </div>
          </div>

          <h1 className="font-kalam text-6xl md:text-7xl font-bold text-white mb-8 leading-[1.1] drop-shadow-2xl">
            Practice Labs
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-200 to-amber-300">
              Master Your Skills
            </span>
          </h1>

          <p className="text-xl text-stone-300 max-w-3xl mx-auto mb-8">
            Hands-on exercises to improve listening, speaking, and comprehension
          </p>

          {/* Language Selector */}
          <div className="inline-flex flex-col items-center gap-3">
            <label className="text-sm font-bold text-amber-300 font-kalam">
              Practice Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-6 py-3 rounded-xl border-2 border-stone-700/50 bg-stone-900/80 text-white font-medium outline-none focus:border-amber-500/50 transition-all font-kalam text-lg"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Stats */}
        {progress && (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-stone-400 font-kalam">Streak</span>
              </div>
              <p className="font-kalam text-4xl font-bold text-amber-400">
                {progress.streakDays} days
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-stone-400 font-kalam">Labs Done</span>
              </div>
              <p className="font-kalam text-4xl font-bold text-green-400">
                {progress.completedLabs}
              </p>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6">
            <span className="text-sm font-bold text-blue-200">INTERACTIVE EXERCISES</span>
          </div>
          <h2 className="font-kalam text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Practice
          </h2>
          <p className="text-lg text-stone-400">
            Real-time feedback • Adaptive learning • Immersive practice
          </p>
        </div>

        {/* Labs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <button
              key={lab.id}
              onClick={() => handleLabClick(lab.id, lab.type === 'premium')}
              className="group text-left p-8 rounded-2xl bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 hover:border-amber-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-xl bg-linear-to-br ${lab.gradient} group-hover:scale-110 transition-transform`}>
                  <lab.icon className="w-8 h-8 text-white" />
                </div>
                {lab.type === 'premium' && (
                  <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-purple-500/20 border border-purple-400/30">
                    <Crown className="w-3.5 h-3.5 text-purple-300" />
                    <span className="text-xs font-medium text-purple-200 font-kalam">Premium</span>
                  </div>
                )}
              </div>

              <h3 className="font-kalam text-2xl font-bold text-white mb-3">{lab.title}</h3>
              
              <p className="text-sm mb-6 text-stone-400 leading-relaxed">
                {lab.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-stone-400 font-kalam">{lab.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-stone-400 font-kalam">{lab.exercises} ex</span>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-amber-400" />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center p-12 rounded-3xl bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50">
          <Award className="w-16 h-16 mx-auto mb-6 text-amber-400" />
          <h3 className="font-kalam text-3xl font-bold text-white mb-4">
            Track Your Progress
          </h3>
          <p className="text-lg text-stone-400 mb-8 max-w-2xl mx-auto">
            Complete exercises daily to maintain your streak and unlock achievements
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Daily practice</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Real-time feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Track improvement</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}