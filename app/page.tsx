"use client";
import { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  Target,
  Users,
  ArrowRight,
  Globe,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Zap,
  Star,
  GraduationCap,
  Mic,
  Headphones,
  Video,
  MessageSquare,
  Clock,
  Brain,
  Trophy,
  Shield,
  ChevronRight,
  Rocket,
  Layers,
  Briefcase
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export default function LearnPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const languages = [
    { id: 'hindi', name: 'Hindi', native: 'हिंदी', learners: '150+', icon: '📚' },
    { id: 'english', name: 'English', native: 'English', learners: '200+', icon: '🌍' },
    { id: 'tamil', name: 'Tamil', native: 'தமிழ்', learners: '120+', icon: '📖' },
    { id: 'telugu', name: 'Telugu', native: 'తెలుగు', learners: '95+', icon: '✍️' },
    { id: 'bengali', name: 'Bengali', native: 'বাংলা', learners: '110+', icon: '📝' },
    { id: 'marathi', name: 'Marathi', native: 'मराठी', learners: '85+', icon: '🎓' },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Labs',
      description: 'Interactive practice environments with real-time feedback on pronunciation, grammar, and fluency',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: 'Curated Curriculum',
      description: 'Expert-designed learning paths aligned with international standards and examination boards',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Mentor Support',
      description: 'Dedicated language experts providing personalized guidance throughout your learning journey',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Trophy,
      title: 'Exam Preparation',
      description: 'Comprehensive resources for IELTS, regional teacher certifications, and government examinations',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const learningPaths = [
    {
      title: 'Foundation Path',
      duration: '12 weeks',
      level: 'Beginner',
      modules: 48,
      icon: Rocket,
      features: ['Script Mastery', 'Basic Grammar', 'Everyday Vocabulary', 'Simple Conversations']
    },
    {
      title: 'Professional Path',
      duration: '16 weeks',
      level: 'Intermediate',
      modules: 64,
      icon: Briefcase,
      features: ['Business Communication', 'Formal Writing', 'Interview Skills', 'Workplace Fluency']
    },
    {
      title: 'Mastery Path',
      duration: '20 weeks',
      level: 'Advanced',
      modules: 80,
      icon: GraduationCap,
      features: ['Literary Analysis', 'Cultural Context', 'Teaching Methods', 'Exam Preparation']
    }
  ];

  const examPrep = [
    { name: 'IELTS Preparation', icon: '🌐', modules: 45 },
    { name: 'Hindi Teacher Exam', icon: '📚', modules: 38 },
    { name: 'Bengali Teacher Cert', icon: '✍️', modules: 35 },
    { name: 'ISL Trainer License', icon: '👐', modules: 42 },
    { name: 'Govt Job Prep', icon: '🏛️', modules: 40 },
    { name: 'Regional Cert Exams', icon: '🎓', modules: 36 }
  ];

  const practiceLabs = [
    { icon: Mic, title: 'Pronunciation Lab', count: 150, color: 'text-blue-400' },
    { icon: Headphones, title: 'Listening Studio', count: 200, color: 'text-purple-400' },
    { icon: Video, title: 'Video Immersion', count: 120, color: 'text-orange-400' },
    { icon: MessageSquare, title: 'Conversation Sim', count: 180, color: 'text-green-400' }
  ];

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

      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-linear-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Top Badge */}
          {/* <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/20 border-2 border-amber-400/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold text-amber-100 tracking-wide">VartaLang Education Platform</span>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            </div>
          </div> */}

          {/* Main Headline - White on Blackboard */}
          <div className="text-center mb-16">
            <h1 className="font-kalam text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] drop-shadow-2xl">
              Learn to Communicate
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-200 to-amber-300">
                with VartaLang
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-stone-200 max-w-4xl mx-auto leading-relaxed mb-4">
              World-Class Language Education Platform
            </p>
            
            <p className="text-base text-stone-400 max-w-3xl mx-auto mb-12">
              Master any language through AI-powered labs, curated curriculums, and exceptional mentor support.
              <br className="hidden md:block" />
              From beginner to exam-ready professional.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-5 justify-center mb-16">
              <button className="group px-10 py-5 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-amber-500/50 transition-all hover:scale-105 flex items-center gap-3">
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 border-3 border-stone-600 hover:border-amber-500 bg-stone-900/50 backdrop-blur-sm text-stone-100 rounded-xl font-bold text-lg transition-all hover:scale-105">
                Explore Courses
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-10">
              {[
                { icon: Shield, text: 'ISO Certified Content' },
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
        </div>
      </section>

      {/* Core Features - Premium Cards */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6">
              <span className="text-sm font-bold text-blue-200">WORLD-CLASS INFRASTRUCTURE</span>
            </div>
            <h2 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-6">
              Technical Excellence
            </h2>
            <p className="text-xl text-stone-400 max-w-3xl mx-auto">
              State-of-the-art learning technology designed for optimal results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group relative p-8 bg-stone-900/40 backdrop-blur-sm border-2 border-stone-700/50 hover:border-amber-500/50 rounded-2xl transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-kalam text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-sm text-stone-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Languages Grid */}
      <section className="relative py-20 px-6 border-y-2 border-stone-800/50">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-kalam text-4xl md:text-5xl font-bold text-white mb-3">
                Available Languages
              </h2>
              <p className="text-stone-400">Choose your learning path from 22+ languages</p>
            </div>
            <button className="hidden md:flex items-center gap-2 px-6 py-3 border-2 border-stone-700 hover:border-amber-500 bg-stone-900/50 backdrop-blur-sm text-stone-200 rounded-xl font-semibold transition-all">
              View All
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onMouseEnter={() => setHoveredCard(lang.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group text-left p-6 bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 hover:border-amber-500/50 rounded-xl transition-all hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{lang.icon}</div>
                    <div>
                      <h3 className="font-kalam text-2xl font-bold text-white mb-1">{lang.name}</h3>
                      <p className="text-lg text-stone-400">{lang.native}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-stone-700/50">
                  <Users className="w-4 h-4 text-stone-500" />
                  <span className="text-sm text-stone-400">{lang.learners} learners enrolled</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 mb-6">
              <span className="text-sm font-bold text-purple-200">COMPREHENSIVE PATHWAYS</span>
            </div>
            <h2 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-6">
              Complete Learning Journeys
            </h2>
            <p className="text-xl text-stone-400 max-w-3xl mx-auto">
              Structured pathways designed by linguists and education experts
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => {
              const Icon = path.icon;
              return (
                <div 
                  key={index}
                  className="relative p-8 bg-linear-to-br from-stone-900/80 to-stone-900/40 backdrop-blur-sm border-2 border-stone-700/50 rounded-2xl hover:border-amber-500/50 transition-all group"
                >
                  {/* Corner Badge */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="inline-block px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-xs font-bold text-amber-200 mb-6">
                    {path.level}
                  </div>

                  <h3 className="font-kalam text-3xl font-bold text-white mb-4">{path.title}</h3>

                  <div className="flex items-center gap-6 mb-6 text-sm text-stone-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{path.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      <span>{path.modules} modules</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {path.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                        <span className="text-sm text-stone-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold transition-all group-hover:shadow-xl group-hover:shadow-amber-500/30">
                    Explore Path
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Practice Labs */}
      <section className="relative py-20 px-6 bg-linear-to-b from-transparent to-stone-950/50">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-6">
              <span className="text-sm font-bold text-cyan-200">INTERACTIVE TECHNOLOGY</span>
            </div>
            <h2 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-6">
              AI-Powered Practice Labs
            </h2>
            <p className="text-xl text-stone-400 max-w-3xl mx-auto">
              Real-time feedback • Adaptive learning • Immersive practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceLabs.map((lab, index) => {
              const Icon = lab.icon;
              return (
                <div 
                  key={index}
                  className="group relative p-8 bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 hover:border-cyan-500/50 rounded-2xl transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl bg-stone-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className={`w-7 h-7 ${lab.color}`} />
                  </div>
                  <h3 className="font-kalam text-xl font-bold text-white mb-2">{lab.title}</h3>
                  <p className="text-2xl font-bold text-amber-400 mb-3">{lab.count}+</p>
                  <p className="text-sm text-stone-400">Interactive exercises</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Exam Preparation */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 mb-6">
              <span className="text-sm font-bold text-green-200">EXAM EXCELLENCE</span>
            </div>
            <h2 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-6">
              Comprehensive Exam Prep
            </h2>
            <p className="text-xl text-stone-400 max-w-3xl mx-auto">
              Specialized preparation modules for certifications and competitive exams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examPrep.map((exam, index) => (
              <div 
                key={index}
                className="p-6 bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 hover:border-green-500/50 rounded-xl transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{exam.icon}</div>
                <h3 className="font-kalam text-xl font-bold text-white mb-3">{exam.name}</h3>
                <div className="flex items-center gap-2 text-sm text-stone-400">
                  <Layers className="w-4 h-4" />
                  <span>{exam.modules} modules</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-t border-stone-800/50">
        <div className="max-w-300 mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="font-kalam text-3xl font-normal text-stone-100 mb-2">Platform Overview</h2>
            <p className="text-sm text-stone-500">Current Status & Capabilities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Globe, value: '22', label: 'Languages' },
              { icon: BookOpen, value: '150+', label: 'Resources' },
              { icon: Target, value: 'Beta', label: 'Version' },
              { icon: TrendingUp, value: 'Growing', label: 'Community' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-light text-stone-100 mb-1">{stat.value}</div>
                  <div className="text-xs text-stone-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-stone-800/50">
        <div className="max-w-3xl mx-auto text-center">
          
          <h2 className="font-kalam text-5xl md:text-6xl font-normal text-stone-100 mb-6 leading-tight">
            Begin Your Linguistic Journey
          </h2>
          
          <p className="text-stone-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Join our community of discerning learners committed to linguistic excellence 
            and cultural preservation.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <button className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-md font-medium transition-all">
              Create Account
            </button>
            <button className="px-8 py-4 border border-stone-700 hover:border-stone-600 text-stone-300 rounded-md font-medium transition-all">
              Request Information
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Complimentary access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="border-t border-stone-800/50 py-8 px-6">
        <p className="text-center text-xs text-stone-600">
          Preserving India's Linguistic Heritage Through Modern Education
        </p>
      </div>
            <Footer/>
    </div>
  );
}