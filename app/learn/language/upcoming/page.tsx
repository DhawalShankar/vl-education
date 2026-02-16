"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  BookOpen, Video, Award, FileText, Book, Languages, 
  ExternalLink, Clock, Cloud, Newspaper, Star, TrendingUp, 
  Users, Play, ChevronRight, Search, Heart, Sparkles, 
  ArrowRight, Filter, Download, Eye, MessageSquare, 
  Calendar, Globe, Zap, GraduationCap, Target, CheckCircle,
  PlayCircle, Headphones, Mic, Share2, Bookmark, BookMarked,
  Timer, BarChart3, TrendingDown, AlertCircle, Loader2
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useDarkMode } from '@/lib/DarkModeContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Type definitions
interface WeatherData {
  temp: number;
  condition: string;
  city: string;
}

interface Newspaper {
  name: string;
  url: string;
  category: string;
  language: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  language: string;
  level: string;
  thumbnail?: string;
  enrolledStudents: number;
  rating: number;
  totalLessons: number;
  category: string;
  isPaid: boolean;
  price?: number;
  teacherId: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  createdAt: string;
}

interface Note {
  _id: string;
  title: string;
  description: string;
  pages: number;
  downloads: number;
  fileSize: string;
  language: string;
  views: number;
  category: string;
  fileUrl: string;
  teacherId: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
}

interface YouTubeChannel {
  name: string;
  url: string;
  subscribers: string;
  category: string;
  language: string;
  description?: string;
}

interface Creator {
  platform: 'instagram' | 'twitter' | 'linkedin';
  name: string;
  handle: string;
  followers: string;
  focus: string;
  language: string;
  verified?: boolean;
}

interface LiveClass {
  _id: string;
  title: string;
  description: string;
  language: string;
  scheduledDate: string;
  duration: number;
  maxStudents: number;
  enrolledStudents: number;
  platform: 'google-meet' | 'zoom';
  status: 'scheduled' | 'live' | 'completed';
  topic: string;
  teacherId: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
}

interface LanguageStats {
  totalCourses: number;
  totalNotes: number;
  totalTeachers: number;
  totalStudents: number;
  averageRating: number;
}

export default function LanguageLearningPage() {
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get language from URL params or default to Hindi
  const [selectedLanguage, setSelectedLanguage] = useState(
    searchParams.get('language') || 'Hindi'
  );
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [weather, setWeather] = useState<WeatherData>({ 
    temp: 24, 
    condition: 'Sunny', 
    city: 'Greater Noida' 
  });
  const [newspapers, setNewspapers] = useState<Newspaper[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [freeCourses, setFreeCourses] = useState<Course[]>([]);
  const [premiumCourses, setPremiumCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [youtubeChannels, setYoutubeChannels] = useState<YouTubeChannel[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [stats, setStats] = useState<LanguageStats>({
    totalCourses: 0,
    totalNotes: 0,
    totalTeachers: 0,
    totalStudents: 0,
    averageRating: 0
  });

  // Available languages
  const availableLanguages = [
    'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 
    'Marathi', 'Gujarati', 'Malayalam', 'Punjabi', 'Odia'
  ];

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all data when language changes
  useEffect(() => {
    fetchAllData();
  }, [selectedLanguage]);

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchNewspapers(),
        fetchCourses(),
        fetchNotes(),
        fetchYouTubeChannels(),
        fetchCreators(),
        fetchLiveClasses(),
        fetchStats()
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNewspapers = async () => {
    try {
      const res = await fetch(`${API_URL}/languages/newspapers?language=${selectedLanguage}`);
      if (res.ok) {
        const data = await res.json();
        setNewspapers(data.newspapers || []);
      }
    } catch (error) {
      console.error("Error fetching newspapers:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/languages/courses?language=${selectedLanguage}`);
      if (res.ok) {
        const data = await res.json();
        const allCourses = data.courses || [];
        setCourses(allCourses);
        setFreeCourses(allCourses.filter((c: Course) => !c.isPaid).slice(0, 6));
        setPremiumCourses(allCourses.filter((c: Course) => c.isPaid).slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/languages/notes?language=${selectedLanguage}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchYouTubeChannels = async () => {
    try {
      const res = await fetch(`${API_URL}/languages/youtube-channels?language=${selectedLanguage}`);
      if (res.ok) {
        const data = await res.json();
        setYoutubeChannels(data.channels || []);
      }
    } catch (error) {
      console.error("Error fetching YouTube channels:", error);
    }
  };

  const fetchCreators = async () => {
    try {
      const res = await fetch(`${API_URL}/languages/creators?language=${selectedLanguage}`);
      if (res.ok) {
        const data = await res.json();
        setCreators(data.creators || []);
      }
    } catch (error) {
      console.error("Error fetching creators:", error);
    }
  };

  const fetchLiveClasses = async () => {
    try {
      const res = await fetch(`${API_URL}/languages/live-classes?language=${selectedLanguage}&status=scheduled`);
      if (res.ok) {
        const data = await res.json();
        setLiveClasses(data.liveClasses || []);
      }
    } catch (error) {
      console.error("Error fetching live classes:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/languages/stats?language=${selectedLanguage}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    router.push(`/learn?language=${language}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grammar': return Book;
      case 'conversation': return MessageSquare;
      case 'competitive-exam': return GraduationCap;
      case 'job-training': return Target;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string, darkMode: boolean) => {
    const colors = {
      grammar: darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700',
      conversation: darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700',
      'competitive-exam': darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700',
      'job-training': darkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-50 text-pink-700',
      default: darkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  // Filter content based on search and active filter
  const getFilteredCourses = () => {
    let filtered = courses;
    
    if (activeFilter === 'free') {
      filtered = filtered.filter(c => !c.isPaid);
    } else if (activeFilter === 'premium') {
      filtered = filtered.filter(c => c.isPaid);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getFilteredNotes = () => {
    if (!searchQuery) return notes;
    return notes.filter(n => 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#1a1410]' : 'bg-[#FFF9F5]'}`}>
        <div className="text-center">
          <Loader2 className={`w-16 h-16 animate-spin mx-auto mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          <p className={`text-lg font-medium ${darkMode ? 'text-orange-200' : 'text-gray-700'}`}>
            Loading {selectedLanguage} learning resources...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#1a1410]' : 'bg-[#FFF9F5]'}`}>
      <Navbar/>
      {/* Space for Global Floating Header */}
      <div className="h-20"></div>

      {/* Hero Section with Weather & Time */}
      <section className="pt-12 pb-8 px-4 relative overflow-hidden">
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          darkMode ? 'bg-orange-900/20' : 'bg-orange-200/40'
        }`}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Language Selector & Weather Card */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            {/* Current Language Display */}
            <div className={`flex-1 p-6 rounded-2xl border ${
              darkMode 
                ? 'bg-orange-900/10 border-orange-800/30' 
                : 'bg-white border-orange-100 shadow-lg'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-sm mb-1 ${darkMode ? 'text-orange-300/70' : 'text-gray-500'}`}>
                    Learning
                  </p>
                  <h2 className={`text-3xl font-bold ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                    {selectedLanguage}
                  </h2>
                </div>
                <div className={`p-3 rounded-xl ${
                  darkMode ? 'bg-orange-500/20' : 'bg-orange-50'
                }`}>
                  <Languages className={`w-8 h-8 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>
              </div>
              
              {/* Language Dropdown */}
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  darkMode 
                    ? 'bg-orange-900/10 border-orange-800/30 text-orange-50 focus:border-orange-600' 
                    : 'bg-white border-orange-100 text-gray-900 focus:border-orange-400'
                }`}
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Weather & Time Widget */}
            <div className={`flex-1 p-6 rounded-2xl border ${
              darkMode 
                ? 'bg-orange-900/10 border-orange-800/30' 
                : 'bg-white border-orange-100 shadow-lg'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    <span className={`text-2xl font-bold ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                      {formatTime()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className={`w-4 h-4 ${darkMode ? 'text-orange-300/70' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-orange-300/70' : 'text-gray-500'}`}>
                      {weather.temp}°C • {weather.condition} • {weather.city}
                    </span>
                  </div>
                </div>
                <div className="text-4xl">☀️</div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Courses', value: stats.totalCourses, icon: BookOpen },
              { label: 'Study Notes', value: stats.totalNotes, icon: FileText },
              { label: 'Teachers', value: stats.totalTeachers, icon: Users },
              { label: 'Students', value: stats.totalStudents, icon: GraduationCap },
              { label: 'Avg. Rating', value: stats.averageRating.toFixed(1), icon: Star }
            ].map((stat, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-orange-900/10 border-orange-800/30' 
                    : 'bg-white border-orange-100 shadow-sm'
                }`}
              >
                <div className={`p-2 rounded-lg w-fit mb-2 ${
                  darkMode ? 'bg-orange-500/20' : 'bg-orange-50'
                }`}>
                  <stat.icon className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>
                <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                  {stat.value}
                </div>
                <div className={`text-xs ${darkMode ? 'text-orange-300/70' : 'text-gray-500'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border ${
              darkMode 
                ? 'bg-orange-900/20 border-orange-800/40 text-orange-300' 
                : 'bg-orange-50 border-orange-200 text-orange-700'
            }`}>
              <Sparkles className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">Your Learning Hub</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${
              darkMode ? 'text-orange-50' : 'text-gray-900'
            }`}>
              Master {selectedLanguage}
            </h1>
            <p className={`text-lg ${darkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
              Curated resources from verified teachers to accelerate your learning journey
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border ${
              darkMode 
                ? 'bg-orange-900/10 border-orange-800/30' 
                : 'bg-white border-orange-100'
            }`}>
              <Search className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search courses, notes, resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 bg-transparent outline-none ${
                  darkMode ? 'text-orange-50 placeholder-orange-300/50' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'free', 'premium', 'videos', 'notes'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    activeFilter === filter
                      ? 'bg-linear-to-r from-orange-500 to-red-600 text-white'
                      : darkMode
                        ? 'bg-orange-900/10 border border-orange-800/30 text-orange-200 hover:bg-orange-900/20'
                        : 'bg-white border border-orange-100 text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="px-4 mb-8">
          <div className={`max-w-7xl mx-auto p-4 rounded-xl border flex items-center gap-3 ${
            darkMode 
              ? 'bg-red-900/20 border-red-800/30 text-red-300' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Newspapers Section */}
      {newspapers.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
              darkMode ? 'text-orange-50' : 'text-gray-900'
            }`}>
              <Newspaper className="w-6 h-6" />
              Daily Newspapers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {newspapers.slice(0, 3).map((newspaper, i) => (
                <a
                  key={i}
                  href={newspaper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-4 rounded-xl border transition-all hover:scale-105 ${
                    darkMode 
                      ? 'bg-orange-900/10 border-orange-800/30 hover:bg-orange-900/20' 
                      : 'bg-white border-orange-100 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        darkMode ? 'bg-orange-500/20' : 'bg-orange-50'
                      }`}>
                        <Newspaper className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                      </div>
                      <div>
                        <span className={`font-semibold block ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                          {newspaper.name}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-orange-300/70' : 'text-gray-500'}`}>
                          {newspaper.category}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${
                      darkMode ? 'text-orange-400' : 'text-orange-600'
                    }`} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Classes Section */}
      {liveClasses.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold flex items-center gap-2 ${
                darkMode ? 'text-orange-50' : 'text-gray-900'
              }`}>
                <Video className="w-6 h-6" />
                Upcoming Live Classes
              </h2>
              <Link 
                href="/live-classes"
                className={`text-sm font-medium flex items-center gap-1 ${
                  darkMode ? 'text-orange-400' : 'text-orange-600'
                }`}
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveClasses.slice(0, 2).map((liveClass) => (
                <div
                  key={liveClass._id}
                  className={`group p-6 rounded-2xl border transition-all hover:scale-[1.02] ${
                    darkMode 
                      ? 'bg-orange-900/10 border-orange-800/30 hover:bg-orange-900/20' 
                      : 'bg-white border-orange-100 hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      liveClass.status === 'live'
                        ? 'bg-red-500 text-white animate-pulse'
                        : darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
                    }`}>
                      {liveClass.status === 'live' ? '🔴 LIVE NOW' : 'Scheduled'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Users className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                      <span className={`text-sm ${darkMode ? 'text-orange-200' : 'text-gray-700'}`}>
                        {liveClass.enrolledStudents}/{liveClass.maxStudents}
                      </span>
                    </div>
                  </div>

                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                    {liveClass.title}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                    {liveClass.description}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-red-700 flex items-center justify-center text-white font-semibold text-xs">
                      {liveClass.teacherId.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                        {liveClass.teacherId.name}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-orange-300/70' : 'text-gray-500'}`}>
                        Instructor
                      </p>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                        <span className={darkMode ? 'text-orange-200' : 'text-gray-700'}>
                          {new Date(liveClass.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                        <span className={darkMode ? 'text-orange-200' : 'text-gray-700'}>
                          {liveClass.duration} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    {liveClass.status === 'live' ? (
                      <>
                        <PlayCircle className="w-5 h-5" />
                        Join Now
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5" />
                        Reserve Seat
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Free Courses Section */}
      {freeCourses.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold flex items-center gap-2 ${
                darkMode ? 'text-orange-50' : 'text-gray-900'
              }`}>
                <BookOpen className="w-6 h-6" />
                Free Courses
              </h2>
              <Link 
                href="/courses?type=free"
                className={`text-sm font-medium flex items-center gap-1 ${
                  darkMode ? 'text-orange-400' : 'text-orange-600'
                }`}
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {freeCourses.map((course) => {
                const CategoryIcon = getCategoryIcon(course.category);
                return (
                  <Link
                    key={course._id}
                    href={`/courses/${course._id}`}
                    className={`group p-6 rounded-2xl border transition-all hover:scale-[1.02] ${
                      darkMode 
                        ? 'bg-orange-900/10 border-orange-800/30 hover:bg-orange-900/20' 
                        : 'bg-white border-orange-100 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
                      }`}>
                        FREE
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        getCategoryColor(course.category, darkMode)
                      }`}>
                        <CategoryIcon className="w-3 h-3 inline mr-1" />
                        {course.category}
                      </span>
                    </div>

                    <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                      {course.title}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                      {course.description}
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-red-700 flex items-center justify-center text-white font-semibold text-xs">
                        {course.teacherId.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                          {course.teacherId.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {course.level}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-orange-200/70' : 'text-gray-500'}`}>
                        {course.totalLessons} lessons
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                          <span className={`text-xs ${darkMode ? 'text-orange-200/70' : 'text-gray-500'}`}>
                            {course.enrolledStudents}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className={`text-xs ${darkMode ? 'text-orange-200/70' : 'text-gray-500'}`}>
                            {course.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-linear-to-r from-orange-500 to-red-600 text-white text-sm font-semibold hover:shadow-lg transition-all">
                        Enroll
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* YouTube Channels Section */}
      {youtubeChannels.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold flex items-center gap-2 ${
                darkMode ? 'text-orange-50' : 'text-gray-900'
              }`}>
                <Video className="w-6 h-6" />
                YouTube Channels
              </h2>
              <button className={`text-sm font-medium flex items-center gap-1 ${
                darkMode ? 'text-orange-400' : 'text-orange-600'
              }`}>
                Explore More <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {youtubeChannels.slice(0, 3).map((channel, i) => (
                <a
                  key={i}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-6 rounded-2xl border transition-all hover:scale-[1.02] ${
                    darkMode 
                      ? 'bg-orange-900/10 border-orange-800/30 hover:bg-orange-900/20' 
                      : 'bg-white border-orange-100 hover:shadow-xl'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    darkMode ? 'bg-red-900/30' : 'bg-red-50'
                  }`}>
                    <Play className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                    {channel.name}
                  </h3>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                    {channel.category}
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-orange-200' : 'text-gray-700'}`}>
                      {channel.subscribers}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Courses Section */}
      {premiumCourses.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
              darkMode ? 'text-orange-50' : 'text-gray-900'
            }`}>
              <Award className="w-6 h-6" />
              Premium Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {premiumCourses.map((course) => {
                const CategoryIcon = getCategoryIcon(course.category);
                return (
                  <Link
                    key={course._id}
                    href={`/courses/${course._id}`}
                    className={`group p-6 rounded-2xl border transition-all hover:scale-[1.02] ${
                      darkMode 
                        ? 'bg-orange-900/10 border-orange-800/30 hover:bg-orange-900/20' 
                        : 'bg-white border-orange-100 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-50 text-orange-700'
                        }`}>
                          PREMIUM
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          getCategoryColor(course.category, darkMode)
                        }`}>
                          <CategoryIcon className="w-3 h-3 inline mr-1" />
                          {course.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className={`text-sm font-semibold ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                          {course.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                      {course.title}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                      {course.description}
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-red-700 flex items-center justify-center text-white font-semibold">
                        {course.teacherId.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                          {course.teacherId.name}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-orange-300/70' : 'text-gray-500'}`}>
                          {course.level} • {course.totalLessons} lessons
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                          ₹{course.price}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-orange-200/70' : 'text-gray-500'}`}>
                          {course.enrolledStudents} enrolled
                        </div>
                      </div>
                      <button className="px-6 py-3 rounded-lg bg-linear-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all">
                        Buy Now
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Study Notes Section */}
      {notes.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
              darkMode ? 'text-orange-50' : 'text-gray-900'
            }`}>
              <FileText className="w-6 h-6" />
              Quick Reference Notes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {notes.slice(0, 6).map((note) => (
                <div
                  key={note._id}
                  className={`group p-5 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                    darkMode 
                      ? 'bg-orange-900/10 border-orange-800/30 hover:bg-orange-900/20' 
                      : 'bg-white border-orange-100 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-orange-500/20' : 'bg-orange-50'}`}>
                      <FileText className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      darkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'
                    }`}>
                      {note.pages} pages
                    </span>
                  </div>

                  <h3 className={`font-bold mb-1 line-clamp-2 ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                    {note.title}
                  </h3>
                  <p className={`text-xs mb-3 line-clamp-1 ${darkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                    By {note.teacherId.name}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Download className={`w-3 h-3 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                        <span className={darkMode ? 'text-orange-200/70' : 'text-gray-500'}>
                          {note.downloads}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className={`w-3 h-3 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                        <span className={darkMode ? 'text-orange-200/70' : 'text-gray-500'}>
                          {note.views}
                        </span>
                      </div>
                    </div>
                    <button className={`text-sm font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Creators to Follow Section */}
      {creators.length > 0 && (
        <section className="py-8 px-4 mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
              darkMode ? 'text-orange-50' : 'text-gray-900'
            }`}>
              <TrendingUp className="w-6 h-6" />
              Follow Top Creators
            </h2>
            
            {/* Group by platform */}
            {['instagram', 'twitter', 'linkedin'].map((platform) => {
              const platformCreators = creators.filter(c => c.platform === platform);
              if (platformCreators.length === 0) return null;

              const platformIcons = {
                instagram: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0m5.521 17.05c-.881.881-2.303 1.43-3.85 1.43H10.33c-1.547 0-2.969-.549-3.85-1.43-.881-.881-1.43-2.303-1.43-3.85V10.33c0-1.547.549-2.969 1.43-3.85.881-.881 2.303-1.43 3.85-1.43h3.34c1.547 0 2.969.549 3.85 1.43.881.881 1.43 2.303 1.43 3.85v3.34c0 1.547-.549 2.969-1.43 3.85z"/>
                  </svg>
                ),
                twitter: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.807-5.974 6.807H2.882l7.432-8.499L1.077 2.25h6.85l4.73 6.247 5.565-6.247zM17.15 18.75h1.832L5.904 4.07H3.957l13.193 14.68z"/>
                  </svg>
                ),
                linkedin: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.945v5.442h-3.554s.05-8.736 0-9.646h3.554v1.348c.42-.648 1.36-1.573 3.322-1.573 2.432 0 4.261 1.579 4.261 4.975v5.896zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.951.77-1.71 1.915-1.71 1.144 0 1.915.759 1.915 1.71 0 .951-.771 1.71-1.915 1.71zm1.6 11.597H3.738V9.859h3.199v10.593zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                  </svg>
                )
              };

              return (
                <div key={platform} className="mb-8">
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    darkMode ? 'text-orange-200' : 'text-gray-700'
                  }`}>
                    {platformIcons[platform as keyof typeof platformIcons]}
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {platformCreators.slice(0, 2).map((creator, i) => (
                      <div
                        key={i}
                        className={`group p-4 rounded-xl border transition-all hover:scale-105 ${
                          darkMode 
                            ? 'bg-orange-900/10 border-orange-800/30 hover:bg-orange-900/20' 
                            : 'bg-white border-orange-100 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className={`font-bold ${darkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                                {creator.name}
                              </h4>
                              {creator.verified && (
                                <CheckCircle className="w-4 h-4 fill-blue-500 text-white" />
                              )}
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                              {creator.handle}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                              {creator.focus}
                            </p>
                            <span className={`text-xs ${darkMode ? 'text-orange-300/70' : 'text-gray-500'}`}>
                              {creator.followers} followers
                            </span>
                          </div>
                          <button className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            darkMode 
                              ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' 
                              : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                          }`}>
                            Follow
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={`py-16 px-4 relative overflow-hidden ${
        darkMode ? 'bg-[#1a1410]' : 'bg-[#FFF4EC]'
      }`}>
        <div className={`absolute inset-0 ${
          darkMode
            ? 'bg-linear-to-br from-orange-900/30 via-red-900/20 to-transparent'
            : 'bg-linear-to-br from-orange-100 via-red-50 to-transparent'
        }`}></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border backdrop-blur ${
            darkMode
              ? 'bg-orange-900/30 border-orange-700/40 text-orange-200'
              : 'bg-white/70 border-orange-200 text-orange-700'
          }`}>
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">Start Learning Today</span>
          </div>

          <h2 className={`text-3xl md:text-4xl font-bold mb-4 leading-tight ${
            darkMode ? 'text-orange-50' : 'text-gray-900'
          }`}>
            Ready to Master {selectedLanguage}?
          </h2>

          <p className={`text-lg mb-8 max-w-xl mx-auto ${
            darkMode ? 'text-orange-200/80' : 'text-gray-600'
          }`}>
            Connect with verified teachers and join thousands of students learning {selectedLanguage}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-base
              bg-linear-to-r from-orange-500 to-red-600 text-white
              hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/teachers"
              className={`inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-base border transition-all hover:scale-105 ${
                darkMode
                  ? 'border-orange-600 text-orange-300 hover:bg-orange-900/20'
                  : 'border-orange-600 text-orange-700 hover:bg-orange-50'
              }`}
            >
              <Users className="w-5 h-5" />
              Find a Teacher
            </Link>
          </div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-20"></div>
      <Footer/>
    </div>
  );
}