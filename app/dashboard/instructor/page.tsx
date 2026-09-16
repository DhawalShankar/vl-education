"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, Plus, Pencil, Trash2, LogOut, X, Check,
  Play, FileText, Headphones, Globe, ChevronDown, ChevronUp, Link2
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { courseAPI } from "@/app/lib/api";

const LANGUAGES = ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Urdu", "Other"];
const LEVELS = ["foundation", "professional", "mastery"];
const CATEGORIES = ["grammar", "vocabulary", "pronunciation", "conversation", "exam-prep", "cultural"];
const RESOURCE_TYPES = ["video", "pdf", "blog", "audio"] as const;
type ResourceType = typeof RESOURCE_TYPES[number];

interface Resource {
  _id?: string;
  type: ResourceType;
  title: string;
  description: string;
  url: string;
  duration: string;
}

interface CourseForm {
  title: string;
  description: string;
  language: string;
  level: string;
  category: string;
  duration: string;
  modules: number;
  tags: string;
  resources: Resource[];
  [key: string]: string | number | Resource[];
}

const emptyResource: Resource = { type: "video", title: "", description: "", url: "", duration: "" };

const emptyForm: CourseForm = {
  title: "", description: "", language: "Hindi", level: "foundation",
  category: "grammar", duration: "", modules: 0, tags: "", resources: []
};

const RESOURCE_ICON: Record<ResourceType, React.ElementType> = {
  video: Play, pdf: FileText, blog: Globe, audio: Headphones
};

const RESOURCE_COLOR: Record<ResourceType, string> = {
  video: "text-red-400 bg-red-500/10 border-red-500/30",
  pdf: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  blog: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  audio: "text-green-400 bg-green-500/10 border-green-500/30",
};

export default function InstructorDashboard() {
  const auth = useAuth();
  const { user, logout, isAuthenticated, loading } = auth || {
    user: null, logout: async () => {}, isAuthenticated: false, loading: true
  };
  const router = useRouter();

  const [courses, setCourses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/auth/login");
    if (!loading && user?.role === "student") router.push("/dashboard");
    if (!loading && user?.role === "admin") router.push("/dashboard/admin");
  }, [loading, isAuthenticated, user]);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getInstructorCourses();
      if (!res) throw new Error("Failed to fetch courses");
      const data = await res.json();
      if (data.success) setCourses(data.data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) fetchCourses();
  }, [isAuthenticated, user]);

  // ── Resource helpers ────────────────────────────────────────────────────────
  const addResourceField = () => {
    setForm((f) => ({ ...f, resources: [...f.resources, { ...emptyResource }] }));
  };

  const removeResourceField = (idx: number) => {
    setForm((f) => ({ ...f, resources: f.resources.filter((_, i) => i !== idx) }));
  };

  const updateResourceField = (idx: number, field: keyof Resource, value: string) => {
    setForm((f) => ({
      ...f,
      resources: f.resources.map((r, i) => i === idx ? { ...r, [field]: value } : r),
    }));
  };

  // ── Create / Update ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const body = {
        ...form,
        modules: form.resources.length || Number(form.modules),
        tags: typeof form.tags === "string"
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : form.tags,
        resources: form.resources.filter((r) => r.title && r.type),
      };
      const res = editId
        ? await courseAPI.update(editId, body)
        : await courseAPI.create(body);

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
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit ────────────────────────────────────────────────────────────────────
  const handleEdit = (course: any) => {
    setEditId(course._id);
    setForm({
      title: course.title,
      description: course.description || "",
      language: course.language,
      level: course.level,
      category: course.category,
      duration: course.duration || "",
      modules: course.modules,
      tags: course.tags?.join(", ") || "",
      resources: course.resources || [],
    });
    setShowForm(true);
  };

  // ── Delete course ───────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
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

  // ── Publish toggle ──────────────────────────────────────────────────────────
  const handleTogglePublish = async (course: any) => {
    try {
      const res = await courseAPI.update(course._id, { isPublished: !course.isPublished });
      if (!res) throw new Error("Failed to update course");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage({
        type: "success",
        text: `Course ${!course.isPublished ? "published" : "unpublished"} successfully.`,
      });
      fetchCourses();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 animate-pulse" />
          <p className="text-stone-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0908]">
      {/* Header */}
      <div className="border-b border-stone-800/60 bg-stone-950/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-kalam font-bold text-white text-lg leading-none">Instructor Portal</h1>
              <p className="text-xs text-stone-500">{user?.name}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/10"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Message banner */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl text-sm flex items-center justify-between ${
              message.type === "error"
                ? "bg-red-500/10 border border-red-500/20 text-red-300"
                : "bg-green-500/10 border border-green-500/20 text-green-300"
            }`}
          >
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-4 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-kalam text-3xl font-bold text-white">My Courses</h2>
            <p className="text-stone-500 text-sm mt-1">{courses.length} course{courses.length !== 1 ? "s" : ""} total</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-kalam font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> New Course
          </button>
        </div>

        {/* ── Course Form Modal ──────────────────────────────────────────────── */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="bg-stone-900 border border-stone-700/50 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-kalam text-2xl font-bold text-white">
                  {editId ? "Edit Course" : "New Course"}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-stone-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Basic fields */}
                {[
                  { label: "Title *", name: "title", type: "text", placeholder: "Hindi for Beginners" },
                  { label: "Description", name: "description", type: "text", placeholder: "What will students learn?" },
                  { label: "Duration", name: "duration", type: "text", placeholder: "8 weeks" },
                  { label: "Tags (comma separated)", name: "tags", type: "text", placeholder: "grammar, basics, speaking" },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm text-stone-400 mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={form[name] as string}
                      onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-white/5 border border-stone-700/50 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>
                ))}

                {/* Selects */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Language *", name: "language", options: LANGUAGES },
                    { label: "Level", name: "level", options: LEVELS },
                    { label: "Category", name: "category", options: CATEGORIES },
                  ].map(({ label, name, options }) => (
                    <div key={name}>
                      <label className="block text-sm text-stone-400 mb-1.5">{label}</label>
                      <select
                        value={form[name] as string}
                        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                        className="w-full bg-stone-800 border border-stone-700/50 rounded-xl px-3 py-3 text-stone-100 text-sm outline-none focus:border-amber-500/50 transition-all"
                      >
                        {options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Publish toggle */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-800/50 border border-stone-700/30">
                  <label className="text-sm text-stone-300 flex-1">Publish immediately</label>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, isPublished: !f.isPublished }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.isPublished ? "bg-amber-500" : "bg-stone-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        form.isPublished ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* ── Resources section ────────────────────────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-stone-300">
                      Learning Resources ({form.resources.length})
                    </label>
                    <button
                      type="button"
                      onClick={addResourceField}
                      className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20"
                    >
                      <Plus className="w-3 h-3" /> Add Resource
                    </button>
                  </div>

                  {form.resources.length === 0 && (
                    <div className="text-center py-6 rounded-xl border border-dashed border-stone-700/50 text-stone-600 text-sm">
                      No resources yet. Add videos, PDFs, articles, or audio links.
                    </div>
                  )}

                  <div className="space-y-3">
                    {form.resources.map((r, idx) => {
                      const Icon = RESOURCE_ICON[r.type];
                      return (
                        <div key={idx} className="rounded-xl border border-stone-700/50 bg-stone-800/40 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`p-1.5 rounded-lg border ${RESOURCE_COLOR[r.type]}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-semibold text-stone-400 capitalize">{r.type}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeResourceField(idx)}
                              className="text-stone-600 hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-stone-500 mb-1">Type</label>
                              <select
                                value={r.type}
                                onChange={(e) => updateResourceField(idx, "type", e.target.value)}
                                className="w-full bg-stone-900 border border-stone-700/50 rounded-lg px-2 py-1.5 text-stone-200 text-xs outline-none focus:border-amber-500/50"
                              >
                                {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-stone-500 mb-1">Duration (optional)</label>
                              <input
                                value={r.duration}
                                onChange={(e) => updateResourceField(idx, "duration", e.target.value)}
                                placeholder="e.g. 12 min"
                                className="w-full bg-stone-900 border border-stone-700/50 rounded-lg px-2 py-1.5 text-stone-200 text-xs outline-none focus:border-amber-500/50"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-stone-500 mb-1">Title *</label>
                              <input
                                value={r.title}
                                onChange={(e) => updateResourceField(idx, "title", e.target.value)}
                                placeholder="Resource title"
                                required
                                className="w-full bg-stone-900 border border-stone-700/50 rounded-lg px-2 py-1.5 text-stone-200 text-xs outline-none focus:border-amber-500/50"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-stone-500 mb-1">URL</label>
                              <input
                                value={r.url}
                                onChange={(e) => updateResourceField(idx, "url", e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-stone-900 border border-stone-700/50 rounded-lg px-2 py-1.5 text-stone-200 text-xs outline-none focus:border-amber-500/50"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-stone-500 mb-1">Description</label>
                              <input
                                value={r.description}
                                onChange={(e) => updateResourceField(idx, "description", e.target.value)}
                                placeholder="Brief description of this resource"
                                className="w-full bg-stone-900 border border-stone-700/50 rounded-lg px-2 py-1.5 text-stone-200 text-xs outline-none focus:border-amber-500/50"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-stone-700 rounded-xl text-stone-400 hover:text-white transition-colors font-kalam"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-kalam font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    {submitting ? "Saving..." : editId ? "Update Course" : "Create Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Courses Grid ───────────────────────────────────────────────────── */}
        {courses.length === 0 ? (
          <div className="bg-stone-900/40 border border-stone-700/50 rounded-2xl p-16 text-center">
            <BookOpen className="w-12 h-12 text-stone-700 mx-auto mb-4" />
            <p className="text-stone-500 text-lg font-kalam">No courses yet.</p>
            <p className="text-stone-600 text-sm mt-1">Create your first course to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {courses.map((course: any) => (
              <div
                key={course._id}
                className="bg-stone-900/60 border border-stone-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all"
              >
                {/* Course header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-kalam text-xl font-bold text-white mb-1 truncate">{course.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-stone-500">{course.language}</span>
                        <span className="text-stone-700">·</span>
                        <span className="text-xs text-stone-500 capitalize">{course.level}</span>
                        <span className="text-stone-700">·</span>
                        {/* Publish toggle */}
                        <button
                          onClick={() => handleTogglePublish(course)}
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-all ${
                            course.isPublished
                              ? "bg-green-500/20 text-green-300 hover:bg-red-500/20 hover:text-red-300"
                              : "bg-stone-500/20 text-stone-400 hover:bg-green-500/20 hover:text-green-300"
                          }`}
                          title={course.isPublished ? "Click to unpublish" : "Click to publish"}
                        >
                          {course.isPublished ? "● Published" : "○ Draft"}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-2 rounded-lg bg-stone-800 hover:bg-amber-500/20 hover:text-amber-400 transition-all text-stone-400"
                        title="Edit course"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="p-2 rounded-lg bg-stone-800 hover:bg-red-500/20 hover:text-red-400 transition-all text-stone-400"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-stone-500 text-sm line-clamp-2">{course.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-stone-600">
                    <span>{course.resources?.length || course.modules || 0} resources</span>
                    <span>·</span>
                    <span>{course.enrolledCount || 0} enrolled</span>
                    {course.duration && <><span>·</span><span>{course.duration}</span></>}
                  </div>
                </div>

                {/* Resources preview (expandable) */}
                {course.resources?.length > 0 && (
                  <div className="border-t border-stone-800/60">
                    <button
                      onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)}
                      className="w-full flex items-center justify-between px-6 py-3 text-xs text-stone-500 hover:text-stone-300 transition-colors"
                    >
                      <span>{course.resources.length} resource{course.resources.length !== 1 ? "s" : ""}</span>
                      {expandedCourse === course._id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedCourse === course._id && (
                      <div className="px-4 pb-4 space-y-2">
                        {course.resources.map((r: any, idx: number) => {
                          const Icon = RESOURCE_ICON[r.type as ResourceType] || Globe;
                          const colorClass = RESOURCE_COLOR[r.type as ResourceType] || "text-stone-400 bg-stone-500/10 border-stone-500/30";
                          return (
                            <div
                              key={r._id || idx}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-stone-800/40 border border-stone-700/30"
                            >
                              <span className={`p-1.5 rounded-lg border shrink-0 ${colorClass}`}>
                                <Icon className="w-3 h-3" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-stone-200 truncate">{r.title}</p>
                                {r.duration && <p className="text-xs text-stone-600">{r.duration}</p>}
                              </div>
                              {r.url && r.url !== "#" && (
                                <a
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-stone-600 hover:text-amber-400 transition-colors shrink-0"
                                  title="Open link"
                                >
                                  <Link2 className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
