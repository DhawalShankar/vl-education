"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  Search,
  Users,
  Award,
  Play,
  Book,
  MessageCircle,
  Heart,
  Shield,
  Star,
  Target,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LearnPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  

 
  const languages = [
    {
      name: 'Hindi',
      nativeName: 'हिंदी',
      slug: 'language',
      icon: '📚',
      learners: '150+',
      difficulty: 'Beginner',
      category: 'north',
      color: 'from-orange-500 to-red-500',
      description: 'India\'s most widely spoken language',
      resources: 245
    },
    {
      name: 'Tamil',
      nativeName: 'தமிழ்',
      slug: 'language',
      icon: '🌴',
      learners: '120+',
      difficulty: 'Intermediate',
      category: 'south',
      color: 'from-red-500 to-pink-500',
      description: 'Classical Dravidian language',
      resources: 198
    },
    {
      name: 'Telugu',
      nativeName: 'తెలుగు',
      slug: 'language',
      icon: '🎭',
      learners: '95+',
      difficulty: 'Intermediate',
      category: 'south',
      color: 'from-yellow-500 to-orange-500',
      description: 'Sweet language of the South',
      resources: 176
    },
    {
      name: 'Bengali',
      nativeName: 'বাংলা',
      slug: 'language',
      icon: '📝',
      learners: '110+',
      difficulty: 'Beginner',
      category: 'east',
      color: 'from-green-500 to-teal-500',
      description: 'Language of poetry and literature',
      resources: 167
    },
    {
      name: 'Marathi',
      nativeName: 'मराठी',
      slug: 'language',
      icon: '🏛️',
      learners: '85+',
      difficulty: 'Beginner',
      category: 'west',
      color: 'from-purple-500 to-pink-500',
      description: 'Official language of Maharashtra',
      resources: 154
    },
    {
      name: 'English',
      nativeName: 'English',
      slug: 'language',
      icon: '🌍',
      learners: '200+',
      difficulty: 'Beginner',
      category: 'global',
      color: 'from-gray-600 to-gray-800',
      description: 'Global language of opportunity',
      resources: 312
    }
  ];

  const categories = [
    { value: 'all', label: 'All Regions', icon: Globe },
    { value: 'north', label: 'North India', icon: '🏔️' },
    { value: 'south', label: 'South India', icon: '🌴' },
    { value: 'east', label: 'East India', icon: '🎋' },
    { value: 'west', label: 'West India', icon: '🏖️' },
    { value: 'global', label: 'Global', icon: '🌍' }
  ];

  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  const filteredLanguages = languages.filter(lang => {
    const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         lang.nativeName.includes(searchQuery);
    const matchesLevel = selectedLevel === 'all' || lang.difficulty === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || lang.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });


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

      {/* Hero Section */}
      <section className="relative pt-7 pb-16 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/20 border-2 border-amber-400/30 backdrop-blur-sm">
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold text-amber-100 tracking-wide">Language Learning Hub</span>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-16">
            <h1 className="font-kalam text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] drop-shadow-2xl">
              Choose Your
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-200 to-amber-300">
                Linguistic Journey
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-stone-200 max-w-4xl mx-auto leading-relaxed mb-12">
              Explore curated resources, connect with native speakers, and master any Indian language
              with our comprehensive learning paths.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-10 mb-12">
              {[
                { icon: Globe, text: '22 Languages' },
                { icon: Users, text: 'Active Learners' },
                { icon: Book, text: 'Curated Resources' },
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

      {/* Filters Section */}
      <section className="relative px-6 pb-12">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="p-8 rounded-3xl bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50">
            
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                <input
                  type="text"
                  placeholder="Search languages... (e.g., Hindi, தமிழ்)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-stone-700/50 bg-stone-900/80 text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500/50 transition-all text-base"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold text-amber-300 mb-3 font-kalam">
                  Region
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all font-kalam ${
                        selectedCategory === cat.value
                          ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                          : 'bg-stone-800/50 text-stone-300 hover:bg-stone-700/50 border-2 border-stone-700/50'
                      }`}
                    >
                      {typeof cat.icon === 'string' ? cat.icon : <cat.icon className="w-4 h-4 inline" />} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <label className="block text-sm font-bold text-amber-300 mb-3 font-kalam">
                  Difficulty Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setSelectedLevel(level.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all font-kalam ${
                        selectedLevel === level.value
                          ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                          : 'bg-stone-800/50 text-stone-300 hover:bg-stone-700/50 border-2 border-stone-700/50'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 pt-6 border-t border-stone-700/50">
              <p className="text-sm text-stone-400">
                Showing <span className="font-bold text-amber-400">{filteredLanguages.length}</span> language{filteredLanguages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Languages Grid */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-20 px-4 rounded-3xl bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50">
              <Search className="w-16 h-16 mx-auto mb-4 text-amber-400/40" />
              <h3 className="font-kalam text-3xl font-bold text-white mb-2">
                No languages found
              </h3>
              <p className="text-base text-stone-400">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLanguages.map((lang, i) => (
                <Link
                  key={i}
                  href={`/learn/${lang.slug}`}
                  className="group relative p-6 rounded-2xl bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 hover:border-amber-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-linear-to-br ${lang.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl w-14 h-14 flex items-center justify-center rounded-xl bg-stone-800/50">
                        {lang.icon}
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-kalam ${
                        lang.difficulty === 'Beginner' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : lang.difficulty === 'Intermediate'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {lang.difficulty}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-kalam text-2xl font-bold text-white mb-1">
                      {lang.name}
                    </h3>
                    <p className="text-xl text-amber-300 mb-3">
                      {lang.nativeName}
                    </p>

                    {/* Description */}
                    <p className="text-sm mb-4 leading-relaxed text-stone-400">
                      {lang.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-stone-300">
                          {lang.learners}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Book className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-stone-300">
                          {lang.resources} resources
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-stone-700/50">
                      <span className="text-sm font-semibold text-amber-300 font-kalam">
                        Start Learning
                      </span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-amber-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Learning Features */}
      <section className="relative py-20 px-6 border-y-2 border-stone-800/50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-6">
              <span className="text-sm font-bold text-cyan-200">COMPREHENSIVE RESOURCES</span>
            </div>
            <h2 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-6">
              What You'll Get
            </h2>
            <p className="text-xl text-stone-400 max-w-3xl mx-auto">
              Everything you need for successful language learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Play,
                title: 'Video Lessons',
                desc: 'Curated YouTube channels and playlists',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: MessageCircle,
                title: 'Native Speakers',
                desc: 'Connect with language partners',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: BookOpen,
                title: 'Study Materials',
                desc: 'PDFs, guides, and structured courses',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: Award,
                title: 'Progress Tracking',
                desc: 'Monitor your learning journey',
                gradient: 'from-green-500 to-emerald-500'
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="group relative p-8 bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 hover:border-cyan-500/50 rounded-2xl transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-kalam text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-stone-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-linear-to-br from-amber-500/30 to-orange-600/30">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          
          <h2 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Start?
          </h2>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto text-stone-300 leading-relaxed">
            Join thousands of learners mastering Indian languages through real conversations 
            and curated resources.
          </p>

          <div className="flex flex-wrap gap-5 justify-center mb-8">
            <Link
              href="/matches"
              className="group px-10 py-5 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-amber-500/50 transition-all hover:scale-105 flex items-center gap-3 font-kalam"
            >
                Explore Our Certifications
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Start conversations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Practice daily</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Track progress</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}