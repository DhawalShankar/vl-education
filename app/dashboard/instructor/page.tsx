"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, Pencil, Trash2, LogOut, X, Check } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { courseAPI } from "@/app/lib/api";

const LANGUAGES = ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Urdu", "Other"];
const LEVELS = ["foundation", "professional", "mastery"];
const CATEGORIES = ["grammar", "vocabulary", "pronunciation", "conversation", "exam-prep", "cultural"];

interface CourseForm {
  title: string;
  description: string;
  language: string;
  level: string;
  category: string;
  duration: string;
  modules: number;
  tags: string;
  [key: string]: string | number;
}

const emptyForm: CourseForm = { title: "", description: "", language: "Hindi", level: "foundation", category: "grammar", duration: "", modules: 0, tags: "" };

export default function InstructorDashboard() {
  const auth = useAuth();
  const { user, logout, isAuthenticated, loading } = auth || { user: null, logout: async () => {}, isAuthenticated: false, loading: true };
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/auth/login");
    if (!loading && user?.role === "student") router.push("/dashboard");
    if (!loading && user?.role === "admin") router.push("/admin");
  }, [loading, isAuthenticated, user]);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      if (!res) throw new Error("Failed to fetch courses");
      const data = await res.json();
      if (data.success) {
        // Show only this instructor's courses
        const userId = (user as any)?._id || user?.id;
        setCourses(data.data.courses.filter((c: any) => c.instructor?._id === userId || c.instructor === userId));
      }
    } catch (err) { console.error(err); }
    finally { setLoadingData(false); }
  };

  useEffect(() => { if (isAuthenticated && user) fetchCourses(); }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const body = { ...form, modules: Number(form.modules), tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
      const res = editId ? await courseAPI.update(editId, body) : await courseAPI.create(body);
      if (!res) throw new Error("Failed to save course");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage({ type: "success", text: data.message });
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      fetchCourses();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally { setSubmitting(false); }
  };

  const handleEdit = (course: any) => {
    setEditId(course._id);
    setForm({
      title: course.title, description: course.description || "",
      language: course.language, level: course.level, category: course.category,
      duration: course.duration || "", modules: course.modules,
      tags: course.tags?.join(", ") || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try {
      const res = await courseAPI.delete(id);
      if (!res) throw new Error("Failed to delete course");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage({ type: "success", text: "Course deleted." });
      fetchCourses();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleLogout = async () => { await logout(); router.push("/auth/login"); };

  if (loading || loadingData) {
    return <div className="min-h-screen bg-[#0a0908] flex items-center justify-center"><div className="text-amber-400 font-kalam text-2xl animate-pulse">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0908] text-white">
      {/* Header */}
      <div className="border-b border-stone-800/50 bg-stone-900/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-kalam text-xl font-bold">VartaLang</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/20">
            Instructor
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-stone-400 text-sm">Hi, {user?.name}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-stone-500 hover:text-red-400 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${message.type === "error" ? "bg-red-500/10 border border-red-500/20 text-red-300" : "bg-green-500/10 border border-green-500/20 text-green-300"}`}>
            {message.text}
          </div>
        )}

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-kalam text-3xl font-bold text-white">My Courses</h2>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-kalam font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> New Course
          </button>
        </div>

        {/* Course Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="bg-stone-900 border border-stone-700/50 rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-kalam text-2xl font-bold text-white">{editId ? "Edit Course" : "New Course"}</h3>
                <button onClick={() => setShowForm(false)} className="text-stone-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Title", name: "title", type: "text", placeholder: "Hindi for Beginners" },
                  { label: "Description", name: "description", type: "text", placeholder: "Course description..." },
                  { label: "Duration", name: "duration", type: "text", placeholder: "8 weeks" },
                  { label: "Modules", name: "modules", type: "number", placeholder: "12" },
                  { label: "Tags (comma separated)", name: "tags", type: "text", placeholder: "grammar, basics" },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm text-stone-400 mb-1.5">{label}</label>
                    <input
                      type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-white/5 border border-stone-700/50 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>
                ))}
                {[
                  { label: "Language", name: "language", options: LANGUAGES },
                  { label: "Level", name: "level", options: LEVELS },
                  { label: "Category", name: "category", options: CATEGORIES },
                ].map(({ label, name, options }) => (
                  <div key={name}>
                    <label className="block text-sm text-stone-400 mb-1.5">{label}</label>
                    <select
                      value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                      className="w-full bg-stone-800 border border-stone-700/50 rounded-xl px-4 py-3 text-stone-100 text-sm outline-none focus:border-amber-500/50 transition-all"
                    >
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border border-stone-700 rounded-xl text-stone-400 hover:text-white transition-colors font-kalam">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-kalam font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <Check className="w-4 h-4" />{submitting ? "Saving..." : editId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Courses list */}
        {courses.length === 0 ? (
          <div className="bg-stone-900/40 border border-stone-700/50 rounded-2xl p-10 text-center text-stone-500">
            No courses yet. Create your first course!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {courses.map((course: any) => (
              <div key={course._id} className="bg-stone-900/60 border border-stone-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-kalam text-xl font-bold text-white mb-1">{course.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500">{course.language}</span>
                      <span className="text-stone-700">·</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${course.isPublished ? "bg-green-500/20 text-green-300" : "bg-stone-500/20 text-stone-400"}`}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(course)} className="p-2 rounded-lg bg-stone-800 hover:bg-amber-500/20 hover:text-amber-400 transition-all text-stone-400">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(course._id)} className="p-2 rounded-lg bg-stone-800 hover:bg-red-500/20 hover:text-red-400 transition-all text-stone-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-stone-500 text-sm line-clamp-2">{course.description}</p>
                <div className="mt-3 text-xs text-stone-600">{course.modules} modules · {course.enrolledCount} enrolled</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}