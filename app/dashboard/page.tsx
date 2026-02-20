"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, Star, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { courseAPI } from "../lib/api";

export default function StudentDashboard() {
  const auth = useAuth();
  const { user, logout, isAuthenticated, loading } = auth || { user: null, logout: async () => {}, isAuthenticated: false, loading: true };
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/auth/login");
    if (!loading && user?.role === "admin") router.push("/admin");
    if (!loading && user?.role === "instructor") router.push("/dashboard/instructor");
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        const [enrolledRes, allRes] = await Promise.all([
          courseAPI.getMyCourses(),
          courseAPI.getAll()
        ]);
        if (enrolledRes) {
          const enrolledData = await enrolledRes.json();
          if (enrolledData.success) setCourses(enrolledData.data.courses);
        }
        if (allRes) {
          const allData = await allRes.json();
          if (allData.success) setAllCourses(allData.data.courses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleEnroll = async (courseId: string) => {
    try {
      const res = await courseAPI.enroll(courseId);
      if (!res) throw new Error("Failed to enroll in course");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage({ type: "success", text: data.message });
      // Refresh enrolled courses
      const updated = await courseAPI.getMyCourses();
      if (!updated) throw new Error("Failed to fetch updated courses");
      const updatedData = await updated.json();
      if (updatedData.success) setCourses(updatedData.data.courses);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-amber-400 font-kalam text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const enrolledIds = courses.map((c: any) => c._id);
  const availableCourses = allCourses.filter((c: any) => !enrolledIds.includes(c._id));

  return (
    <div className="min-h-screen bg-[#0a0908] text-white">
      {/* Header */}
      <div className="border-b border-stone-800/50 bg-stone-900/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-kalam text-xl font-bold text-white">VartaLang</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/20">
            Student
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-stone-400 text-sm">Hi, {user?.name}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-stone-500 hover:text-red-400 transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Message */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
            message.type === "error"
              ? "bg-red-500/10 border border-red-500/20 text-red-300"
              : "bg-green-500/10 border border-green-500/20 text-green-300"
          }`}>
            {message.text}
          </div>
        )}

        {/* My Enrolled Courses */}
        <div className="mb-12">
          <h2 className="font-kalam text-3xl font-bold text-white mb-6">My Courses</h2>
          {courses.length === 0 ? (
            <div className="bg-stone-900/40 border border-stone-700/50 rounded-2xl p-10 text-center text-stone-500">
              You haven't enrolled in any course yet. Browse below!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course: any) => (
                <div key={course._id} className="bg-stone-900/60 border border-stone-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{languageIcon(course.language)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${levelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  <h3 className="font-kalam text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-stone-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-xs text-stone-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration || "Self-paced"}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {course.modules} modules</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browse All Courses */}
        <div>
          <h2 className="font-kalam text-3xl font-bold text-white mb-6">Browse Courses</h2>
          {availableCourses.length === 0 ? (
            <div className="bg-stone-900/40 border border-stone-700/50 rounded-2xl p-10 text-center text-stone-500">
              No new courses available right now.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableCourses.map((course: any) => (
                <div key={course._id} className="bg-stone-900/60 border border-stone-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{languageIcon(course.language)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${levelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  <h3 className="font-kalam text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-stone-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full py-2.5 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-kalam font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    Enroll Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const languageIcon = (lang: string) => {
  const map: Record<string, string> = {
    Hindi: "📚", English: "🌍", Tamil: "📖", Telugu: "✍️",
    Bengali: "📝", Marathi: "🎓", Other: "🗣️"
  };
  return map[lang] || "🗣️";
};

const levelColor = (level: string) => {
  const map: Record<string, string> = {
    foundation: "bg-green-500/20 text-green-300",
    professional: "bg-blue-500/20 text-blue-300",
    mastery: "bg-purple-500/20 text-purple-300"
  };
  return map[level] || "bg-stone-500/20 text-stone-300";
};