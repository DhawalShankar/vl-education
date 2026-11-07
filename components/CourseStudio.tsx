// components/CourseStudio.tsx
// Shared by app/dashboard/instructor/page.tsx and app/dashboard/admin/page.tsx
"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { ChevronDown, ChevronRight, Eye, Plus, Save, Trash2, X } from "lucide-react";
import {
  AdminInstructor,
  CourseCard,
  CourseDetail,
  CourseInput,
  LessonInput,
  ModuleOut,
  adminAPI,
  instructorAPI,
} from "@/app/lib/api";
import { LANGUAGE_CATALOG } from "@/app/lib/languages";

export const LEVELS = ["foundation", "intermediate", "professional", "mastery"];
export const CATEGORIES = ["grammar", "vocabulary", "pronunciation", "conversation", "exam-prep", "cultural"];
export const RESOURCE_TYPES = ["video", "pdf", "article", "audio"];

export const inputCls =
  "w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500 transition-colors";
export const errBoxCls = "px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300";

/* ── helpers ── */
export const errMsg = (e: unknown, fallback = "Something went wrong") => (e instanceof Error ? e.message : fallback);
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

/* ── status badge (draft | pending_review | published | rejected | archived) ── */
const STATUS_STYLE: Record<string, string> = {
  published: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  pending_review: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  rejected: "bg-red-500/15 text-red-300 border-red-500/30",
  archived: "bg-stone-800 text-stone-500 border-stone-700",
  draft: "bg-stone-800 text-stone-400 border-stone-700",
};
export const statusLabel = (s: string) => (s === "pending_review" ? "In review" : s);

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
        STATUS_STYLE[status] ?? STATUS_STYLE.draft
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}

/* ═══════════════════ COURSE DETAILS MODAL ═══════════════════
   Instructor: create/edit own course.
   Admin: pass `instructors` -> create form gets an instructor picker + "publish now". */
export function CourseFormModal({
  state,
  instructors,
  onClose,
  onSaved,
}: {
  state: { mode: "create" } | { mode: "edit"; course: CourseCard };
  instructors?: AdminInstructor[];
  onClose: () => void;
  onSaved: (info: { id: string; created: boolean; published: boolean }) => void;
}) {
  const editing = state.mode === "edit" ? state.course : null;
  const adminCreate = !!instructors && !editing;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [language, setLanguage] = useState(editing?.language ?? "Hindi");
  const [level, setLevel] = useState(editing?.level ?? "foundation");
  const [category, setCategory] = useState(editing?.category ?? "grammar");
  const [duration, setDuration] = useState(editing?.duration ?? "");
  const [price, setPrice] = useState(editing ? Number(editing.price) || 0 : 0);
  const [tags, setTags] = useState((editing?.tags ?? []).join(", "));
  const [instructorId, setInstructorId] = useState("");
  const [publishNow, setPublishNow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languageOptions = LANGUAGE_CATALOG.map((l) => l.name);
  if (!languageOptions.includes(language)) languageOptions.unshift(language);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (price < 0) return setError("Price cannot be negative.");
    if (adminCreate && !instructorId) return setError("Choose the instructor this course belongs to.");
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
        onSaved({ id: editing.id, created: false, published: false });
      } else if (adminCreate) {
        const created = await adminAPI.createCourse({ ...body, instructor_id: instructorId, publish: publishNow });
        onSaved({ id: created.id, created: true, published: publishNow });
      } else {
        // api.createCourse already sends isPublished: false and modules: 0
        const created = await instructorAPI.createCourse(body);
        onSaved({ id: created.id, created: true, published: false });
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
          {adminCreate && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Instructor *</label>
                <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)} className={inputCls}>
                  <option value="">Select an instructor…</option>
                  {instructors!.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.full_name} ({i.email})
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} className="accent-amber-500" />
                Publish immediately (skips review)
              </label>
              <p className="text-[11px] text-stone-500">
                The instructor can see this course but cannot edit it. You can add modules and lessons right after saving.
              </p>
            </div>
          )}

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

/* ═══════════════════ CURRICULUM MODAL ═══════════════════
   readOnly = view only (instructor while live / in review / admin-managed; admin review preview). */
export function CurriculumModal({
  courseId,
  readOnly = false,
  readOnlyNote,
  onClose,
  onChanged,
}: {
  courseId: string;
  readOnly?: boolean;
  readOnlyNote?: string;
  onClose: () => void;
  onChanged: () => void;
}) {
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
            <h3 className="font-kalam text-3xl font-bold">{readOnly ? "Curriculum" : "Curriculum & materials"}</h3>
            {course && <p className="text-xs text-stone-500 mt-0.5">{course.title}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {readOnly && (
          <div className="mb-5 px-4 py-3 rounded-xl text-xs bg-stone-900 border border-stone-800 text-stone-400">
            View only. {readOnlyNote}
          </div>
        )}

        {readOnly && course?.description && (
          <p className="mb-5 text-sm text-stone-300 whitespace-pre-line">{course.description}</p>
        )}

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
              <p className="text-stone-400 text-sm mb-5">
                {readOnly ? "This course has no modules yet." : "No modules yet. Add your first module below."}
              </p>
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
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => removeModule(m)}
                            disabled={busy}
                            title="Delete module"
                            className="p-2 rounded-lg bg-stone-800/80 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {open && (
                        <div className="px-4 pb-4 space-y-2 border-t border-stone-800/80 pt-3">
                          {lessons.length === 0 && <p className="text-xs text-stone-500">No lessons in this module yet.</p>}
                          {lessons.map((l) => (
                            <div key={l.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-stone-950/60 border border-stone-800/80">
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{l.title}</p>
                                <div className="flex flex-wrap items-center gap-x-3 mt-0.5 text-[11px] text-stone-500">
                                  {l.youtube_video_id ? (
                                    <a
                                      href={`https://www.youtube.com/watch?v=${l.youtube_video_id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-amber-400 hover:text-amber-300"
                                    >
                                      Watch video
                                    </a>
                                  ) : (
                                    <span>No video</span>
                                  )}
                                  {l.notes_url && (
                                    <a href={l.notes_url} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                                      Open notes
                                    </a>
                                  )}
                                  {l.is_preview && <span>Free preview</span>}
                                </div>
                              </div>
                              {!readOnly && (
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
                              )}
                            </div>
                          ))}

                          {!readOnly && (
                            <LessonForm
                              nextIndex={nextOrder(lessons)}
                              busy={busy}
                              onSubmit={(body) => run(() => instructorAPI.addLesson(m.id, body))}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!readOnly && (
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
            )}
          </>
        ) : (
          <ResourcesPanel
            resources={course.resources ?? []}
            busy={busy}
            readOnly={readOnly}
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
  readOnly,
  onAdd,
  onDelete,
}: {
  resources: { id: string; type: string; title: string; url: string }[];
  busy: boolean;
  readOnly: boolean;
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
        <p className="text-stone-400 text-sm mb-5">
          {readOnly ? "No resources added." : "No resources yet. Add PDFs, articles, audio or extra videos for the whole course."}
        </p>
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
              {!readOnly && (
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
              )}
            </div>
          ))}
        </div>
      )}

      {!readOnly && (
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
      )}
    </div>
  );
}