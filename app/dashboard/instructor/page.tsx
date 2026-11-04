// app/dashboard/instructor/page.tsx
"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Check,
  CheckCircle,
  ExternalLink,
  Layers,
  ListOrdered,
  Pencil,
  Plus,
  Save,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { CourseCard, CourseInput, InstructorProfile, instructorAPI } from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";
import { LANGUAGE_CATALOG, slugify } from "@/app/lib/languages";

const LEVELS = ["foundation", "intermediate", "professional", "mastery"];
const CATEGORIES = ["grammar", "vocabulary", "pronunciation", "conversation", "exam-prep", "cultural"];
const RESOURCE_TYPES = ["video", "pdf", "article", "audio"];

const inputCls =
  "w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors";

/* ── helpers ── */
const errMsg = (e: unknown, fallback = "Something went wrong") => (e instanceof Error ? e.message : fallback);
const isHttpUrl = (v: string) => /^https?:\/\//i.test(v.trim());
const byOrder = (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index;
const nextOrder = (items: { order_index: number }[]) => items.reduce((m, i) => Math.max(m, i.order_index), 0) + 1;

// Accepts an 11-char YouTube id or a youtube.com / youtu.be link
function extractYouTubeId(input: string): string | null {
  const v = input.trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  try {
    const u = new URL(v);
    let id: string | null = null;
    if (u.hostname === "youtu.be") id = u.pathname.slice(1);
    else if (u.hostname.endsWith("youtube.com")) {
      id = u.searchParams.get("v") ?? (u.pathname.startsWith("/embed/") ? u.pathname.split("/")[2] : null);
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/* ═══════════════════════════ PAGE ═══════════════════════════ */
export default function InstructorStudioPage() {
  const { user, loading, isInstructor, isAdmin } = useAuth();
  const router = useRouter();
  const allowed = !!user && (isInstructor || isAdmin); // UX only; the server enforces roles

  const [tab, setTab] = useState<"courses" | "profile">("courses");
  const [reloadKey, setReloadKey] = useState(0);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [courseForm, setCourseForm] = useState<{ mode: "create" } | { mode: "edit"; course: CourseCard } | null>(null);
  const [curriculumId, setCurriculumId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth/login");
    else if (!allowed) router.replace("/dashboard");
  }, [loading, user, allowed, router]);

  const courses = useApi(() => instructorAPI.myCourses(), [reloadKey, user?.id], allowed);
  const list = courses.data ?? [];
  const live = list.filter((c) => c.status === "published").length;
  const drafts = list.filter((c) => c.status === "draft").length;
  const totalEnrolled = list.reduce((a, c) => a + (c.enrolled_count || 0), 0);

  const reload = () => setReloadKey((k) => k + 1);

  const togglePublish = async (c: CourseCard) => {
    setBusyId(c.id);
    setMessage(null);
    try {
      const publishing = c.status !== "published";
      await instructorAPI.setStatus(c.id, publishing ? "published" : "draft");
      setMessage({ type: "success", text: publishing ? "Course is now live." : "Course moved to drafts." });
      reload();
    } catch (e) {
      setMessage({ type: "error", text: errMsg(e) });
    } finally {
      setBusyId(null);
    }
  };

  const deleteCourse = async (c: CourseCard) => {
    if (!confirm(`Delete "${c.title}" and all its modules and lessons? This cannot be undone.`)) return;
    setBusyId(c.id);
    setMessage(null);
    try {
      await instructorAPI.deleteCourse(c.id);
      setMessage({ type: "success", text: "Course deleted." });
      reload();
    } catch (e) {
      setMessage({ type: "error", text: errMsg(e) });
    } finally {
      setBusyId(null);
    }
  };

  if (loading || !allowed) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-amber-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const metrics = [
    { label: "Courses live", value: live, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Drafts", value: drafts, icon: Layers, color: "text-stone-400" },
    { label: "Total enrollments", value: totalEnrolled, icon: Users, color: "text-sky-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0908] text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="font-kalam text-4xl sm:text-5xl font-bold tracking-tight">
              {user?.full_name ? `${user.full_name.split(" ")[0]}'s Studio` : "Instructor Studio"}
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              Create courses, build the curriculum (modules and lessons), and publish when you are ready.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700/80 hover:bg-stone-800 text-stone-300 text-xs font-semibold"
            >
              My Learning
            </Link>
            <button
              onClick={() => setCourseForm({ mode: "create" })}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New course
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mb-8 px-5 py-3 rounded-xl text-sm flex items-center justify-between ${
              message.type === "error"
                ? "bg-red-500/15 border border-red-500/30 text-red-300"
                : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-stone-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-800/70 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div>
                  <p className="font-kalam text-3xl font-bold tabular-nums">{courses.loading ? "–" : m.value}</p>
                  <p className="text-xs text-stone-500">{m.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 border-b border-stone-800 pb-4 mb-8">
          {(
            [
              ["courses", "My courses", BookOpen],
              ["profile", "Public profile", User],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                tab === key
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-stone-400 hover:text-white hover:bg-stone-900"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {tab === "courses" && (
          <>
            {courses.error && (
              <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
                Could not load your courses: {courses.error}
              </div>
            )}

            {courses.loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                ))}
              </div>
            ) : list.length === 0 && !courses.error ? (
              <div className="p-16 rounded-3xl bg-stone-900/40 border border-stone-800 text-center max-w-xl mx-auto">
                <BookOpen className="w-10 h-10 mx-auto mb-4 text-amber-400/50" />
                <h3 className="font-kalam text-2xl font-bold mb-2">No courses yet</h3>
                <p className="text-sm text-stone-400 mb-6">
                  Create a course, then add modules and lessons with YouTube videos and notes.
                </p>
                <button
                  onClick={() => setCourseForm({ mode: "create" })}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold text-sm"
                >
                  Create your first course
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((c) => {
                  const published = c.status === "published";
                  const canPublish = published || c.lessons_count > 0;
                  return (
                    <div
                      key={c.id}
                      className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                              published
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-stone-800 text-stone-400 border-stone-700"
                            }`}
                          >
                            {c.status}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setCourseForm({ mode: "edit", course: c })}
                              title="Edit details"
                              className="p-2 rounded-lg bg-stone-800/80 hover:bg-amber-500/20 text-stone-400 hover:text-amber-400"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteCourse(c)}
                              disabled={busyId === c.id}
                              title="Delete course"
                              className="p-2 rounded-lg bg-stone-800/80 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-kalam text-2xl font-bold mb-2 leading-snug">{c.title}</h3>
                        <p className="text-xs text-stone-400 line-clamp-2 mb-4">{c.description}</p>

                        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300">{c.language}</span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 capitalize">{c.level}</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-bold">
                            {c.is_free ? "Free" : `₹${c.price}`}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 mb-5 space-y-1.5 text-xs text-stone-400">
                          <div className="flex justify-between">
                            <span>Modules / lessons</span>
                            <span className="font-semibold text-white">
                              {c.modules_count} / {c.lessons_count}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Students enrolled</span>
                            <span className="font-semibold text-amber-300">{c.enrolled_count}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-800/80 space-y-3">
                        <button
                          onClick={() => setCurriculumId(c.id)}
                          className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <ListOrdered className="w-4 h-4" /> Curriculum &amp; materials
                        </button>
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => togglePublish(c)}
                            disabled={busyId === c.id || !canPublish}
                            title={canPublish ? "" : "Add at least one lesson before publishing"}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border disabled:opacity-40 ${
                              published
                                ? "border-stone-700 text-stone-400 hover:text-rose-400 hover:border-rose-500/40"
                                : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                          >
                            {published ? "Move to draft" : "Publish"}
                          </button>
                          <Link
                            href={`/learn/${slugify(c.language)}/${c.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                          >
                            Preview <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === "profile" && <ProfileTab onMessage={setMessage} />}
      </main>

      {courseForm && (
        <CourseFormModal
          key={courseForm.mode === "edit" ? courseForm.course.id : "new"}
          state={courseForm}
          onClose={() => setCourseForm(null)}
          onSaved={(info) => {
            setCourseForm(null);
            setMessage({ type: "success", text: info.created ? "Draft created. Add modules and lessons, then publish." : "Course updated." });
            reload();
            if (info.created) setCurriculumId(info.id);
          }}
        />
      )}

      {curriculumId && (
        <CurriculumModal
          courseId={curriculumId}
          onClose={() => setCurriculumId(null)}
          onChanged={reload}
        />
      )}

      <Footer />
    </div>
  );
}

/* ═══════════════════ COURSE DETAILS MODAL ═══════════════════ */
function CourseFormModal({
  state,
  onClose,
  onSaved,
}: {
  state: { mode: "create" } | { mode: "edit"; course: CourseCard };
  onClose: () => void;
  onSaved: (info: { id: string; created: boolean }) => void;
}) {
  const editing = state.mode === "edit" ? state.course : null;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [language, setLanguage] = useState(editing?.language ?? "Hindi");
  const [level, setLevel] = useState(editing?.level ?? "foundation");
  const [category, setCategory] = useState(editing?.category ?? "grammar");
  const [duration, setDuration] = useState(editing?.duration ?? "");
  const [price, setPrice] = useState(editing ? Number(editing.price) || 0 : 0);
  const [tags, setTags] = useState((editing?.tags ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languageOptions = LANGUAGE_CATALOG.map((l) => l.name);
  if (!languageOptions.includes(language)) languageOptions.unshift(language);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (price < 0) return setError("Price cannot be negative.");
    setSaving(true);
    try {
      const body: CourseInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        language,
        level,
        category,
        duration: duration.trim() || undefined,
        price,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (editing) {
        await instructorAPI.updateCourse(editing.id, body);
        onSaved({ id: editing.id, created: false });
      } else {
        const created = await instructorAPI.createCourse(body);
        // Make sure a new course never goes live by accident
        if (created.status !== "draft") await instructorAPI.setStatus(created.id, "draft");
        onSaved({ id: created.id, created: true });
      }
    } catch (err) {
      setError(errMsg(err, "Could not save the course."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6 overflow-y-auto">
      <div className="bg-[#120F0C] border border-stone-700/80 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
          <h3 className="font-kalam text-3xl font-bold">{editing ? "Edit course" : "New course"}</h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">{error}</div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs text-stone-400 mb-1">Title *</label>
            <input
              required
              minLength={3}
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spoken Bengali: Daily Situations"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will learners achieve?"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={inputCls}>
                {languageOptions.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className={`${inputCls} capitalize`}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} capitalize`}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Duration</label>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 8 weeks" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Price (₹, 0 = free)</label>
              <input
                type="number"
                min={0}
                step={50}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={`${inputCls} font-mono`}
              />
            </div>
          </div>
          {price > 0 && (
            <p className="text-xs text-amber-300/80">
              Payments are not live yet. Students will see &quot;Payment coming soon&quot; and cannot enroll in paid courses.
            </p>
          )}

          <div>
            <label className="block text-xs text-stone-400 mb-1">Tags (comma separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Devanagari, Conversation" className={inputCls} />
          </div>

          <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving…" : editing ? "Save changes" : "Create course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════ PROFILE ═══════════════════ */
function ProfileTab({ onMessage }: { onMessage: (message: { type: "error" | "success"; text: string }) => void }) {
  const [profile, setProfile] = useState<Partial<InstructorProfile>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const api = instructorAPI as any;
    if (typeof api.getProfile !== "function") return;
    api.getProfile().then((value: InstructorProfile) => setProfile(value ?? {})).catch((e: unknown) => setError(errMsg(e)));
  }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const api = instructorAPI as any;
      if (typeof api.updateProfile === "function") await api.updateProfile(profile);
      onMessage({ type: "success", text: "Profile updated." });
    } catch (e) {
      setError(errMsg(e, "Could not save your profile."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-2xl p-6 sm:p-8 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-5">
      <div>
        <h2 className="font-kalam text-3xl font-bold">Public profile</h2>
        <p className="text-sm text-stone-400 mt-1">Tell learners a little about you.</p>
      </div>
      {error && <div className="px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">{error}</div>}
      <div>
        <label className="block text-xs text-stone-400 mb-1">Bio</label>
        <textarea
          rows={6}
          value={String((profile as any).bio ?? "")}
          onChange={(e) => setProfile((current) => ({ ...current, bio: e.target.value }))}
          className={inputCls}
          placeholder="Share your teaching experience and interests."
        />
      </div>
      <button disabled={saving} className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold disabled:opacity-50 flex items-center gap-2">
        <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

/* ═══════════════════ CURRICULUM MODAL ═══════════════════ */
function CurriculumModal({ courseId, onClose, onChanged }: { courseId: string; onClose: () => void; onChanged: () => void }) {
  const [modules, setModules] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = instructorAPI as any;

  const load = async () => {
    setLoading(true);
    try {
      const result = typeof api.getCurriculum === "function" ? await api.getCurriculum(courseId) : [];
      setModules(Array.isArray(result) ? result : result?.modules ?? []);
    } catch (e) {
      setError(errMsg(e, "Could not load the curriculum."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [courseId]);
  const ordered = useMemo(() => [...modules].sort(byOrder), [modules]);

  const addModule = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || typeof api.createModule !== "function") return;
    setSaving(true);
    setError(null);
    try {
      await api.createModule(courseId, { title: title.trim(), order_index: nextOrder(modules) });
      setTitle("");
      await load();
      onChanged();
    } catch (e) {
      setError(errMsg(e, "Could not add the module."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6">
      <div className="bg-[#120F0C] border border-stone-700/80 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
          <h3 className="font-kalam text-3xl font-bold">Curriculum &amp; materials</h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">{error}</div>}
        {loading ? <p className="text-stone-400">Loading curriculum…</p> : ordered.length === 0 ? <p className="text-stone-400 mb-5">No modules yet.</p> : (
          <div className="space-y-3 mb-6">
            {ordered.map((module) => <div key={module.id} className="p-4 rounded-xl bg-stone-900 border border-stone-800"><div className="font-semibold">{module.title}</div><div className="text-xs text-stone-500 mt-1">{module.lessons_count ?? module.lessons?.length ?? 0} lessons</div></div>)}
          </div>
        )}
        <form onSubmit={addModule} className="flex gap-2 pt-4 border-t border-stone-800">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New module title" className={inputCls} />
          <button type="submit" disabled={saving || !title.trim()} className="px-4 rounded-xl bg-amber-500 text-stone-950 font-bold disabled:opacity-50"><Plus className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
}