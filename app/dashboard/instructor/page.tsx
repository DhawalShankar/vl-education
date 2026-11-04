// app/dashboard/instructor/page.tsx
"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
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
import {
  CourseCard,
  CourseDetail,
  CourseInput,
  InstructorProfile,
  LessonInput,
  ModuleOut,
  instructorAPI,
} from "@/app/lib/api";
import { useApi } from "@/app/lib/useApi";
import { LANGUAGE_CATALOG, slugify } from "@/app/lib/languages";

const LEVELS = ["foundation", "intermediate", "professional", "mastery"];
const CATEGORIES = ["grammar", "vocabulary", "pronunciation", "conversation", "exam-prep", "cultural"];
const RESOURCE_TYPES = ["video", "pdf", "article", "audio"];

const inputCls =
  "w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors";
const errBoxCls = "px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300";

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
            {courses.error && <div className={`mb-6 ${errBoxCls}`}>Could not load your courses: {courses.error}</div>}

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
            setMessage({
              type: "success",
              text: info.created ? "Draft created. Add modules and lessons, then publish." : "Course updated.",
            });
            reload();
            if (info.created) setCurriculumId(info.id);
          }}
        />
      )}

      {curriculumId && (
        <CurriculumModal courseId={curriculumId} onClose={() => setCurriculumId(null)} onChanged={reload} />
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
        // api.createCourse already sends isPublished: false and modules: 0
        const created = await instructorAPI.createCourse(body);
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

        {error && <div className={`mb-4 ${errBoxCls}`}>{error}</div>}

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
type ProfileForm = {
  name: string;
  title: string;
  bio: string;
  languages: string; // comma separated in the UI
  experienceYears: number;
  avatarUrl: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  website: string;
  upiId: string;
  bankAccount: string;
};

const EMPTY_PROFILE: ProfileForm = {
  name: "",
  title: "",
  bio: "",
  languages: "",
  experienceYears: 0,
  avatarUrl: "",
  twitter: "",
  linkedin: "",
  youtube: "",
  website: "",
  upiId: "",
  bankAccount: "",
};

const toForm = (p: InstructorProfile): ProfileForm => ({
  name: p.name ?? "",
  title: p.title ?? "",
  bio: p.bio ?? "",
  languages: (p.languages ?? []).join(", "),
  experienceYears: p.experienceYears ?? 0,
  avatarUrl: p.avatarUrl ?? "",
  twitter: p.twitter ?? "",
  linkedin: p.linkedin ?? "",
  youtube: p.youtube ?? "",
  website: p.website ?? "",
  upiId: p.upiId ?? "",
  bankAccount: p.bankAccount ?? "",
});

function ProfileTab({ onMessage }: { onMessage: (message: { type: "error" | "success"; text: string }) => void }) {
  const [form, setForm] = useState<ProfileForm>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    instructorAPI
      .getProfile()
      .then((p) => {
        if (alive && p) setForm(toForm(p));
      })
      .catch((e) => alive && setError(errMsg(e, "Could not load your profile.")))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const set = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters.");
    setSaving(true);
    try {
      const saved = await instructorAPI.saveProfile({
        name: form.name.trim(),
        title: form.title.trim() || "Language Educator & Linguistic Mentor",
        bio: form.bio.trim(),
        languages: form.languages.split(",").map((l) => l.trim()).filter(Boolean),
        experienceYears: Math.max(0, Math.floor(form.experienceYears) || 0),
        avatarUrl: form.avatarUrl.trim(),
        twitter: form.twitter.trim(),
        linkedin: form.linkedin.trim(),
        youtube: form.youtube.trim(),
        website: form.website.trim(),
        upiId: form.upiId.trim(),
        bankAccount: form.bankAccount.trim(),
      });
      setForm(toForm(saved));
      onMessage({ type: "success", text: "Profile updated." });
    } catch (err) {
      setError(errMsg(err, "Could not save your profile."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 max-w-2xl rounded-2xl bg-white/5 border border-white/10 animate-pulse" />;

  const field = (label: string, key: keyof ProfileForm, placeholder = "") => (
    <div>
      <label className="block text-xs text-stone-400 mb-1">{label}</label>
      <input
        value={String(form[key])}
        onChange={(e) => set(key, e.target.value as never)}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );

  return (
    <form onSubmit={save} className="max-w-2xl p-6 sm:p-8 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-5">
      <div>
        <h2 className="font-kalam text-3xl font-bold">Public profile</h2>
        <p className="text-sm text-stone-400 mt-1">Tell learners a little about you.</p>
      </div>
      {error && <div className={errBoxCls}>{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("Full name *", "name", "Your name")}
        {field("Headline", "title", "Language Educator & Linguistic Mentor")}
      </div>

      <div>
        <label className="block text-xs text-stone-400 mb-1">Bio</label>
        <textarea
          rows={5}
          maxLength={2000}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          className={inputCls}
          placeholder="Share your teaching experience and interests."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("Languages (comma separated)", "languages", "Hindi, English")}
        <div>
          <label className="block text-xs text-stone-400 mb-1">Years of experience</label>
          <input
            type="number"
            min={0}
            value={form.experienceYears}
            onChange={(e) => set("experienceYears", Number(e.target.value))}
            className={`${inputCls} font-mono`}
          />
        </div>
      </div>

      {field("Avatar URL", "avatarUrl", "https://...")}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("Website", "website", "https://...")}
        {field("YouTube", "youtube", "https://youtube.com/@...")}
        {field("LinkedIn", "linkedin", "https://linkedin.com/in/...")}
        {field("X / Twitter", "twitter", "https://x.com/...")}
      </div>

      <div className="pt-4 border-t border-stone-800 space-y-3">
        <p className="text-xs text-stone-500">Payout details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {field("UPI ID", "upiId", "name@bank")}
          {field("Bank account", "bankAccount", "IFSC + account number")}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold disabled:opacity-50 flex items-center gap-2"
      >
        <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

/* ═══════════════════ CURRICULUM MODAL ═══════════════════ */
function CurriculumModal({ courseId, onClose, onChanged }: { courseId: string; onClose: () => void; onChanged: () => void }) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"curriculum" | "resources">("curriculum");
  const [moduleTitle, setModuleTitle] = useState("");
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  const load = async () => {
    try {
      setCourse(await instructorAPI.course(courseId));
    } catch (e) {
      setError(errMsg(e, "Could not load the curriculum."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const modules = useMemo(() => [...(course?.modules ?? [])].sort(byOrder), [course]);

  // Runs a mutation, refreshes the course, and reports errors in the modal. Returns true on success.
  const run = async (fn: () => Promise<unknown>): Promise<boolean> => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await load();
      onChanged();
      return true;
    } catch (e) {
      setError(errMsg(e));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const addModule = async (e: FormEvent) => {
    e.preventDefault();
    const title = moduleTitle.trim();
    if (title.length < 2) return setError("Module title must be at least 2 characters.");
    const ok = await run(() => instructorAPI.addModule(courseId, { title, order_index: nextOrder(modules) }));
    if (ok) setModuleTitle("");
  };

  const removeModule = (m: ModuleOut) => {
    if (!confirm(`Delete module "${m.title}" and its ${m.lessons.length} lesson(s)?`)) return;
    void run(() => instructorAPI.deleteModule(m.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6">
      <div className="bg-[#120F0C] border border-stone-700/80 rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-5">
          <div>
            <h3 className="font-kalam text-3xl font-bold">Curriculum &amp; materials</h3>
            {course && <p className="text-xs text-stone-500 mt-0.5">{course.title}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-5">
          {(
            [
              ["curriculum", "Modules & lessons"],
              ["resources", "Course resources"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                view === key ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-stone-400 hover:text-white hover:bg-stone-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <div className={`mb-4 ${errBoxCls}`}>{error}</div>}

        {loading ? (
          <p className="text-stone-400">Loading curriculum…</p>
        ) : !course ? null : view === "curriculum" ? (
          <>
            {modules.length === 0 ? (
              <p className="text-stone-400 text-sm mb-5">No modules yet. Add your first module below.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {modules.map((m) => {
                  const open = openModuleId === m.id;
                  const lessons = [...m.lessons].sort(byOrder);
                  return (
                    <div key={m.id} className="rounded-xl bg-stone-900 border border-stone-800">
                      <div className="flex items-center justify-between gap-3 p-4">
                        <button
                          type="button"
                          onClick={() => setOpenModuleId(open ? null : m.id)}
                          className="flex items-center gap-2 text-left flex-1 min-w-0"
                        >
                          {open ? <ChevronDown className="w-4 h-4 text-amber-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />}
                          <span className="min-w-0">
                            <span className="block font-semibold truncate">{m.title}</span>
                            <span className="block text-xs text-stone-500 mt-0.5">
                              {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeModule(m)}
                          disabled={busy}
                          title="Delete module"
                          className="p-2 rounded-lg bg-stone-800/80 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {open && (
                        <div className="px-4 pb-4 space-y-2 border-t border-stone-800/80 pt-3">
                          {lessons.length === 0 && <p className="text-xs text-stone-500">No lessons in this module yet.</p>}
                          {lessons.map((l) => (
                            <div key={l.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-stone-950/60 border border-stone-800/80">
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{l.title}</p>
                                <p className="text-[11px] text-stone-500 mt-0.5">
                                  {l.youtube_video_id ? "Video added" : "No video"}
                                  {l.notes_url ? " · Notes added" : ""}
                                  {l.is_preview ? " · Free preview" : ""}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => run(() => instructorAPI.updateLesson(l.id, { is_preview: !l.is_preview }))}
                                  title={l.is_preview ? "Remove free preview" : "Make free preview"}
                                  className={`p-2 rounded-lg disabled:opacity-50 ${
                                    l.is_preview ? "bg-amber-500/20 text-amber-300" : "bg-stone-800/80 text-stone-400 hover:text-amber-300"
                                  }`}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => {
                                    if (confirm(`Delete lesson "${l.title}"?`)) void run(() => instructorAPI.deleteLesson(l.id));
                                  }}
                                  title="Delete lesson"
                                  className="p-2 rounded-lg bg-stone-800/80 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 disabled:opacity-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}

                          <LessonForm
                            nextIndex={nextOrder(lessons)}
                            busy={busy}
                            onSubmit={(body) => run(() => instructorAPI.addLesson(m.id, body))}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <form onSubmit={addModule} className="flex gap-2 pt-4 border-t border-stone-800">
              <input
                required
                minLength={2}
                maxLength={150}
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                placeholder="New module title"
                className={inputCls}
              />
              <button
                type="submit"
                disabled={busy || moduleTitle.trim().length < 2}
                title="Add module"
                className="px-4 rounded-xl bg-amber-500 text-stone-950 font-bold disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <ResourcesPanel
            resources={course.resources ?? []}
            busy={busy}
            onAdd={(body) => run(() => instructorAPI.addResource(courseId, body))}
            onDelete={(id) => run(() => instructorAPI.deleteResource(courseId, id))}
          />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════ LESSON FORM ═══════════════════ */
function LessonForm({
  nextIndex,
  busy,
  onSubmit,
}: {
  nextIndex: number;
  busy: boolean;
  onSubmit: (body: LessonInput) => Promise<boolean>;
}) {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState("");
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const videoId = video.trim() ? extractYouTubeId(video) : null;
    if (video.trim() && !videoId) return setError("Enter a valid YouTube link or 11-character video ID.");
    if (notes.trim() && !isHttpUrl(notes)) return setError("Notes link must start with http:// or https://");

    const ok = await onSubmit({
      title: title.trim(),
      youtube_video_id: videoId ?? undefined,
      notes_url: notes.trim() || undefined,
      order_index: nextIndex,
      is_preview: preview,
    });
    if (ok) {
      setTitle("");
      setVideo("");
      setNotes("");
      setPreview(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2 pt-3 border-t border-stone-800/80">
      <p className="text-xs text-stone-400">Add a lesson</p>
      {error && <div className={errBoxCls}>{error}</div>}
      <input required minLength={2} maxLength={150} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" className={inputCls} />
      <input value={video} onChange={(e) => setVideo(e.target.value)} placeholder="YouTube link or video ID (optional)" className={inputCls} />
      <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes link, e.g. Google Drive (optional)" className={inputCls} />
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer">
          <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} className="accent-amber-500" />
          Free preview for non-enrolled students
        </label>
        <button
          type="submit"
          disabled={busy || title.trim().length < 2}
          className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs disabled:opacity-50 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add lesson
        </button>
      </div>
    </form>
  );
}

/* ═══════════════════ RESOURCES PANEL ═══════════════════ */
function ResourcesPanel({
  resources,
  busy,
  onAdd,
  onDelete,
}: {
  resources: { id: string; type: string; title: string; url: string }[];
  busy: boolean;
  onAdd: (body: { type: string; title: string; url: string }) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const [type, setType] = useState("video");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isHttpUrl(url)) return setError("Link must start with http:// or https://");
    const ok = await onAdd({ type, title: title.trim(), url: url.trim() });
    if (ok) {
      setTitle("");
      setUrl("");
    }
  };

  return (
    <div>
      {resources.length === 0 ? (
        <p className="text-stone-400 text-sm mb-5">No resources yet. Add PDFs, articles, audio or extra videos for the whole course.</p>
      ) : (
        <div className="space-y-2 mb-6">
          {resources.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-900 border border-stone-800">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.title}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-amber-400 hover:text-amber-300 truncate block">
                  {r.type} · {r.url}
                </a>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (confirm(`Delete resource "${r.title}"?`)) void onDelete(r.id);
                }}
                title="Delete resource"
                className="p-2 rounded-lg bg-stone-800/80 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 disabled:opacity-50 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="space-y-2 pt-4 border-t border-stone-800">
        {error && <div className={errBoxCls}>{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className={`${inputCls} capitalize`}>
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input required minLength={2} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className={`${inputCls} sm:col-span-3`} />
        </div>
        <div className="flex gap-2">
          <input required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputCls} />
          <button
            type="submit"
            disabled={busy || !title.trim() || !url.trim()}
            title="Add resource"
            className="px-4 rounded-xl bg-amber-500 text-stone-950 font-bold disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}