// components/CourseExplorer.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Play,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { courseAPI, enrollmentAPI } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import CoursePlayerModal from "@/components/CoursePlayerModal";

interface Instructor {
  id: string;
  full_name: string;
  avatar_url?: string | null;
}

interface CourseCard {
  id: string;
  title: string;
  description?: string;
  language: string;
  level: string;
  price: string;
  is_free: boolean;
  thumbnail_url?: string | null;
  instructor_id: string;
  instructor: Instructor;
  modules_count: number;
  lessons_count: number;
}

interface LanguageItem {
  language: string;
  course_count: number;
}

interface InstructorItem {
  instructor_id: string;
  full_name: string;
  avatar_url?: string | null;
  course_count: number;
}

interface EnrolledCourse {
  course_id: string;
  progress_percentage: number;
  status: string;
}

export default function CourseExplorer() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");

  const [instructors, setInstructors] = useState<InstructorItem[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);

  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [enrolledMap, setEnrolledMap] = useState<Record<string, EnrolledCourse>>({});
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  // 1. Fetch available languages (real data only, no fallback pills)
  useEffect(() => {
    courseAPI
      .getLanguages()
      .then((langs) => setLanguages(langs || []))
      .catch(() => setLanguages([]));
  }, []);

  // 2. Fetch instructors when language changes
  useEffect(() => {
    const lang = selectedLanguage === "All" ? undefined : selectedLanguage;
    courseAPI
      .getInstructors(lang)
      .then((insts) => {
        setInstructors(insts || []);
        setSelectedInstructorId(null);
      })
      .catch(() => setInstructors([]));
  }, [selectedLanguage]);

  // 3. Fetch courses
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const filters: { language?: string; instructor_id?: string } = {};
      if (selectedLanguage !== "All") filters.language = selectedLanguage;
      if (selectedInstructorId) filters.instructor_id = selectedInstructorId;

      const data = await courseAPI.getAll(filters);
      setCourses(data || []);
    } catch {
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, selectedInstructorId]);

  // 4. Fetch student enrollments to show "Enrolled" / "Resume" state
  const fetchMyEnrollments = async () => {
    if (!isAuthenticated) {
      setEnrolledMap({});
      return;
    }
    try {
      const myCourses = await enrollmentAPI.getMyCourses();
      const map: Record<string, EnrolledCourse> = {};
      myCourses.forEach((en: any) => {
        map[en.course_id] = {
          course_id: en.course_id,
          progress_percentage: en.progress_percentage,
          status: en.status,
        };
      });
      setEnrolledMap(map);
    } catch {
      setEnrolledMap({});
    }
  };

  useEffect(() => {
    fetchMyEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  // Handle Enrollment
  const handleEnroll = async (course: CourseCard) => {
    // Not logged in -> send to real login (no demo user)
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    try {
      setEnrollingId(course.id);
      await enrollmentAPI.enroll(course.id, false);
      await fetchMyEnrollments();
      setActiveCourseId(course.id);
    } catch (err) {
      console.error("Enrollment failed", err);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <section id="learn" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">

      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[#FF7700] text-xs font-bold tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Curriculum & Community Hub
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-display">
            Explore Courses by Language
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-lg">
            Pick a language to view certified lecturers, interactive video lessons, and cohort communities.
          </p>
        </div>

        {/* Level 1: Language Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedLanguage("All")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedLanguage === "All"
                ? "bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/25"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            All Languages
          </button>

          {languages.map((item) => (
            <button
              key={item.language}
              onClick={() => setSelectedLanguage(item.language)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedLanguage === item.language
                  ? "bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/25"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              <span>{item.language}</span>
              {item.course_count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedLanguage === item.language
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {item.course_count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Level 2: Instructor / Lecturer Spotlight (If Instructors Exist) */}
      {instructors.length > 0 && (
        <div className="p-6 rounded-3xl glass-panel bg-white/[0.02] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#FF7700]" />
              Featured Lecturers in {selectedLanguage === "All" ? "Platform" : selectedLanguage}
            </h3>
            {selectedInstructorId && (
              <button
                onClick={() => setSelectedInstructorId(null)}
                className="text-xs text-[#FF6600] hover:underline"
              >
                Clear Instructor Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {instructors.map((inst) => {
              const isSelected = selectedInstructorId === inst.instructor_id;
              return (
                <div
                  key={inst.instructor_id}
                  onClick={() => setSelectedInstructorId(isSelected ? null : inst.instructor_id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-[#FF5500]/20 border-[#FF5500] text-white"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5500] to-amber-400 flex items-center justify-center font-bold text-xs text-white">
                    {inst.full_name?.[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">{inst.full_name}</p>
                    <p className="text-[10px] text-white/50">{inst.course_count} Courses</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Level 3: Courses Grid */}
      <div>
        {loadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl glass-panel animate-pulse bg-white/5 border border-white/10" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 space-y-3">
            <BookOpen className="w-10 h-10 text-white/30 mx-auto" />
            <h4 className="text-white font-bold text-lg">No courses found</h4>
            <p className="text-xs text-white/60 max-w-sm mx-auto">
              There are currently no published courses matching your filter. Try picking a different language or teacher above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const enrollment = enrolledMap[course.id];
              const isEnrolled = !!enrollment;

              return (
                <div
                  key={course.id}
                  className="rounded-3xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between border border-white/10 bg-[#16130F]/90"
                >
                  {/* Card Header & Badges */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#FF5500]/15 border border-[#FF5500]/30 text-[#FF7700] text-xs font-bold tracking-wide">
                        {course.language}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[11px] font-medium">
                        {course.level}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white leading-snug line-clamp-1 font-display">
                        {course.title}
                      </h3>
                      <p className="text-xs text-white/60 mt-1.5 line-clamp-2 leading-relaxed">
                        {course.description || "Structured language course with interactive videos and supporting notes."}
                      </p>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-2.5 pt-2 border-t border-white/5">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-[#FF5500] flex items-center justify-center text-[10px] font-bold text-white">
                        {course.instructor?.full_name?.[0]}
                      </div>
                      <span className="text-xs text-white/80 font-medium">
                        {course.instructor?.full_name}
                      </span>
                    </div>

                    {/* Progress Bar (If already enrolled) */}
                    {isEnrolled && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-white/60">Progress</span>
                          <span className="text-[#FF7700] font-bold">
                            {enrollment.progress_percentage}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#FF5500] to-amber-400"
                            style={{ width: `${enrollment.progress_percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Metadata & Action CTA */}
                  <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-white/50 uppercase font-semibold">Pricing</p>
                      <p className="text-sm font-extrabold text-white">
                        {course.is_free || parseFloat(course.price) === 0 ? (
                          <span className="text-emerald-400">FREE</span>
                        ) : (
                          `₹${course.price}`
                        )}
                      </p>
                    </div>

                    {isEnrolled ? (
                      <button
                        onClick={() => setActiveCourseId(course.id)}
                        className="btn-primary px-5 py-2.5 rounded-full text-xs flex items-center gap-1.5 font-bold"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Resume Learning</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course)}
                        disabled={enrollingId === course.id}
                        className="btn-secondary px-5 py-2.5 rounded-full text-xs flex items-center gap-1.5 font-bold hover:border-[#FF5500]"
                      >
                        {enrollingId === course.id ? (
                          <span>Enrolling...</span>
                        ) : (
                          <>
                            <span>{course.is_free ? "Enroll Free" : "Enroll & Start"}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#FF6600]" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Player */}
      {activeCourseId && (
        <CoursePlayerModal
          courseId={activeCourseId}
          onClose={() => {
            setActiveCourseId(null);
            fetchMyEnrollments();
          }}
          onProgressUpdated={fetchMyEnrollments}
        />
      )}
    </section>
  );
}