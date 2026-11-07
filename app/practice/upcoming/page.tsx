// app/practice/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import {
  Mic,
  Square,
  Headphones,
  PenTool,
  BookOpen,
  ClipboardCheck,
  Sparkles,
  Brain,
  Clock,
  Zap,
  Trophy,
  CheckCircle,
  XCircle,
  Volume2,
  ArrowLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

/* ============================================================================
 * 1. API CONTRACT (types)
 * Backend serializers should match these shapes (snake_case).
 * ========================================================================== */

type LanguageCode = "hi" | "ta" | "bn";

type LabId =
  | "listening"
  | "dictation"
  | "meaning-match"
  | "pronunciation"
  | "sound-recognition"
  | "assessment";

interface LanguageInfo {
  code: LanguageCode;
  name: string;
  native_name: string;
  speech_locale: string; // BCP-47 for text-to-speech, e.g. "hi-IN"
}

// GET /practice/progress/
interface PracticeProgress {
  streak_days: number;
  completed_sessions: number;
  todays_practice: number;
  average_score: number; // 0-100
}

// GET /practice/labs/?language=hi
interface LabSummary {
  id: LabId;
  title: string;
  description: string;
  duration_label: string;
  exercise_count: number;
  available: boolean; // false when no content exists for this language
}

interface Exercise {
  id: string;
  lab: Exclude<LabId, "assessment">;
  instruction: string;
  audio_url: string | null; // backend-served audio (TTS or recorded)
  display_text: string | null; // text shown to the learner
  options: string[] | null; // multiple-choice labs
  tts_text?: string; // MOCK ONLY: browser TTS fallback. Remove once audio_url is served.
}

// POST /practice/sessions/   body: { lab, language }
interface PracticeSession {
  session_id: string;
  lab: LabId;
  language: LanguageCode;
  exercises: Exercise[];
}

// POST /practice/sessions/{session_id}/answers/
// multipart/form-data when `audio` is present, JSON otherwise
interface SubmitAnswerPayload {
  exercise_id: string;
  answer_text?: string;
  audio?: Blob;
}
interface AnswerResult {
  correct: boolean;
  score: number; // 0-100
  expected_answer: string | null;
  feedback: string;
}

// POST /practice/sessions/{session_id}/complete/
interface SessionSummary {
  session_id: string;
  total_exercises: number;
  correct_count: number;
  average_score: number;
  level?: "Beginner" | "Elementary" | "Intermediate" | "Advanced"; // assessments only
}

/* ============================================================================
 * 2. MOCK API
 * Keep the signatures. Replace the bodies with real fetch calls later.
 * ========================================================================== */

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const LANGUAGES: LanguageInfo[] = [
  { code: "hi", name: "Hindi", native_name: "हिन्दी", speech_locale: "hi-IN" },
  { code: "ta", name: "Tamil", native_name: "தமிழ்", speech_locale: "ta-IN" },
  { code: "bn", name: "Bengali", native_name: "বাংলা", speech_locale: "bn-IN" },
];

interface MockContent {
  words: { text: string; meaning: string }[];
  sentences: { text: string; meaning: string }[];
  sound_pairs?: { target: string; options: string[] }[];
}

const CONTENT: Record<LanguageCode, MockContent> = {
  hi: {
    words: [
      { text: "जल", meaning: "Water" },
      { text: "पुस्तक", meaning: "Book" },
      { text: "विद्यालय", meaning: "School" },
      { text: "मित्र", meaning: "Friend" },
    ],
    sentences: [
      { text: "मुझे पानी चाहिए", meaning: "I need water" },
      { text: "वह स्कूल जा रहा है", meaning: "He is going to school" },
    ],
    sound_pairs: [
      { target: "ड", options: ["ड", "ड़", "द", "ट"] },
      { target: "त", options: ["त", "ट", "थ", "ठ"] },
      { target: "ड़", options: ["ड", "ड़", "ढ", "ढ़"] },
    ],
  },
  ta: {
    words: [
      { text: "தண்ணீர்", meaning: "Water" },
      { text: "புத்தகம்", meaning: "Book" },
      { text: "பள்ளி", meaning: "School" },
      { text: "நண்பன்", meaning: "Friend" },
    ],
    sentences: [
      { text: "எனக்கு தண்ணீர் வேண்டும்", meaning: "I need water" },
      { text: "அவன் பள்ளிக்குச் செல்கிறான்", meaning: "He is going to school" },
    ],
  },
  bn: {
    words: [
      { text: "জল", meaning: "Water" },
      { text: "বই", meaning: "Book" },
      { text: "স্কুল", meaning: "School" },
      { text: "বন্ধু", meaning: "Friend" },
    ],
    sentences: [
      { text: "আমার জল দরকার", meaning: "I need water" },
      { text: "সে স্কুলে যাচ্ছে", meaning: "He is going to school" },
    ],
  },
};

const LAB_META: Record<LabId, { title: string; description: string; duration_label: string }> = {
  listening: {
    title: "Listening Lab",
    description: "Hear a word, type what you heard, and check your accuracy.",
    duration_label: "5-10 min",
  },
  dictation: {
    title: "Dictation Lab",
    description: "Listen to full sentences, type them out, and get scored.",
    duration_label: "5-10 min",
  },
  "meaning-match": {
    title: "Meaning Match",
    description: "Hear a word and choose the correct meaning from four options.",
    duration_label: "5-8 min",
  },
  pronunciation: {
    title: "Pronunciation Practice",
    description: "Record yourself saying a word and get AI feedback.",
    duration_label: "5-10 min",
  },
  "sound-recognition": {
    title: "Sound Recognition",
    description: "Identify similar-sounding letters in the script.",
    duration_label: "5 min",
  },
  assessment: {
    title: "AI Assessment",
    description: "A mixed level check across listening, meaning and sounds.",
    duration_label: "10-15 min",
  },
};

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const normalize = (s: string) => s.trim().replace(/[।.,!?]/g, "").replace(/\s+/g, " ").toLowerCase();

// MOCK ONLY: in the real backend, expected answers never leave the server.
const mockSessions = new Map<string, Record<string, string>>();
const mockStats = { streak_days: 3, completed_sessions: 12, todays_practice: 0, average_score: 78 };

function buildExercises(lab: Exclude<LabId, "assessment">, lang: LanguageCode, answers: Record<string, string>): Exercise[] {
  const c = CONTENT[lang];
  const mk = (id: string, ex: Omit<Exercise, "id" | "lab" | "audio_url">, expected: string): Exercise => {
    answers[id] = expected;
    return { id, lab, audio_url: null, ...ex };
  };

  if (lab === "listening") {
    return c.words.map((w, i) =>
      mk(`${lab}-${i}`, { instruction: "Listen and type the word you hear", display_text: null, options: null, tts_text: w.text }, w.text)
    );
  }
  if (lab === "dictation") {
    return c.sentences.map((s, i) =>
      mk(`${lab}-${i}`, { instruction: "Listen and type the full sentence", display_text: null, options: null, tts_text: s.text }, s.text)
    );
  }
  if (lab === "meaning-match") {
    return c.words.map((w, i) => {
      const wrong = shuffle(c.words.filter((x) => x.meaning !== w.meaning)).slice(0, 3).map((x) => x.meaning);
      return mk(
        `${lab}-${i}`,
        { instruction: "Listen and choose the correct meaning", display_text: null, options: shuffle([w.meaning, ...wrong]), tts_text: w.text },
        w.meaning
      );
    });
  }
  if (lab === "pronunciation") {
    return c.words.map((w, i) =>
      mk(`${lab}-${i}`, { instruction: "Record yourself saying this word", display_text: w.text, options: null, tts_text: w.text }, w.text)
    );
  }
  // sound-recognition
  return (c.sound_pairs ?? []).map((p, i) =>
    mk(`${lab}-${i}`, { instruction: "Which letter did you hear?", display_text: null, options: shuffle(p.options), tts_text: p.target }, p.target)
  );
}

const practiceApi = {
  // GET /practice/languages/
  async getLanguages(): Promise<LanguageInfo[]> {
    await delay(150);
    return LANGUAGES;
  },

  // GET /practice/progress/
  async getProgress(): Promise<PracticeProgress> {
    await delay();
    return { ...mockStats };
  },

  // GET /practice/labs/?language=hi
  async getLabs(language: LanguageCode): Promise<LabSummary[]> {
    await delay();
    const hasSounds = !!CONTENT[language].sound_pairs;
    const ids: LabId[] = ["listening", "dictation", "meaning-match", "pronunciation", "sound-recognition", "assessment"];
    return ids.map((id) => {
      const answers: Record<string, string> = {};
      const count =
        id === "assessment"
          ? 6
          : buildExercises(id, language, answers).length;
      return {
        id,
        ...LAB_META[id],
        exercise_count: count,
        available: id === "sound-recognition" ? hasSounds : true,
      };
    });
  },

  // POST /practice/sessions/   body: { lab, language }
  async startSession(lab: LabId, language: LanguageCode): Promise<PracticeSession> {
    await delay();
    const answers: Record<string, string> = {};
    let exercises: Exercise[];
    if (lab === "assessment") {
      const mix: Exclude<LabId, "assessment">[] = ["listening", "meaning-match", "dictation"];
      if (CONTENT[language].sound_pairs) mix.push("sound-recognition");
      exercises = mix.flatMap((l) => buildExercises(l, language, answers).slice(0, 2));
    } else {
      exercises = buildExercises(lab, language, answers);
    }
    const session_id = `mock-${Date.now()}`;
    mockSessions.set(session_id, answers);
    return { session_id, lab, language, exercises };
  },

  // POST /practice/sessions/{session_id}/answers/
  // Send multipart/form-data when payload.audio exists, JSON otherwise.
  async submitAnswer(sessionId: string, payload: SubmitAnswerPayload): Promise<AnswerResult> {
    await delay(400);
    const expected = mockSessions.get(sessionId)?.[payload.exercise_id] ?? null;

    if (payload.audio) {
      // Backend: run speech recognition / pronunciation scoring on the audio.
      const score = 70 + Math.floor(Math.random() * 26);
      return {
        correct: score >= 75,
        score,
        expected_answer: expected,
        feedback: score >= 75 ? "Clear pronunciation. Keep it up!" : "Try to stress the syllables more clearly.",
      };
    }

    const correct = !!expected && normalize(payload.answer_text ?? "") === normalize(expected);
    return {
      correct,
      score: correct ? 100 : 0,
      expected_answer: expected,
      feedback: correct ? "Correct!" : "Not quite. Check the correct answer below.",
    };
  },

  // POST /practice/sessions/{session_id}/complete/
  // Backend computes the summary from stored answers; the scores array is a mock shortcut.
  async completeSession(sessionId: string, lab: LabId, scores: number[]): Promise<SessionSummary> {
    await delay();
    const total = scores.length;
    const correct = scores.filter((s) => s >= 75).length;
    const avg = total ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
    mockStats.completed_sessions += 1;
    mockStats.todays_practice += total;
    mockSessions.delete(sessionId);
    return {
      session_id: sessionId,
      total_exercises: total,
      correct_count: correct,
      average_score: avg,
      level:
        lab === "assessment"
          ? avg >= 85 ? "Advanced" : avg >= 65 ? "Intermediate" : avg >= 40 ? "Elementary" : "Beginner"
          : undefined,
    };
  },
};

/* ============================================================================
 * 3. UI HELPERS
 * ========================================================================== */

const LAB_UI: Record<LabId, { icon: any; gradient: string }> = {
  listening: { icon: Headphones, gradient: "from-blue-500 to-indigo-600" },
  dictation: { icon: PenTool, gradient: "from-purple-500 to-pink-600" },
  "meaning-match": { icon: BookOpen, gradient: "from-green-500 to-teal-600" },
  pronunciation: { icon: Mic, gradient: "from-orange-500 to-red-600" },
  "sound-recognition": { icon: Sparkles, gradient: "from-yellow-500 to-orange-600" },
  assessment: { icon: ClipboardCheck, gradient: "from-violet-500 to-purple-600" },
};

function speak(text: string, locale: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = locale;
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

const card = "bg-stone-900/60 backdrop-blur-sm border-2 border-stone-700/50 rounded-2xl";

/* ============================================================================
 * 4. SESSION VIEW
 * ========================================================================== */

function SessionView({
  session,
  locale,
  onExit,
  onDone,
}: {
  session: PracticeSession;
  locale: string;
  onExit: () => void;
  onDone: (summary: SessionSummary) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  // pronunciation recording
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [micError, setMicError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const ex = session.exercises[idx];
  const isLast = idx === session.exercises.length - 1;
  const isRecordLab = ex.lab === "pronunciation";
  const isChoice = !!ex.options;

  // Auto-play audio when a new exercise appears
  useEffect(() => {
    if (ex.tts_text) speak(ex.tts_text, locale);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
  }, []);

  const startRecording = async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        setAudioBlob(new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" }));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      setMicError("Microphone access was denied or is unavailable.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const canSubmit = isRecordLab ? !!audioBlob : isChoice ? !!selected : text.trim().length > 0;

  const submit = async () => {
    if (!canSubmit || busy) return;
    setBusy(true);
    try {
      const res = await practiceApi.submitAnswer(session.session_id, {
        exercise_id: ex.id,
        ...(isRecordLab ? { audio: audioBlob! } : { answer_text: isChoice ? selected! : text }),
      });
      setResult(res);
      setScores((s) => [...s, res.score]);
    } finally {
      setBusy(false);
    }
  };

  const next = async () => {
    if (isLast) {
      setBusy(true);
      const summary = await practiceApi.completeSession(session.session_id, session.lab, scores);
      onDone(summary);
      return;
    }
    setIdx((i) => i + 1);
    setText("");
    setSelected(null);
    setResult(null);
    setAudioBlob(null);
    setMicError("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="flex items-center gap-2 text-sm text-stone-400 hover:text-amber-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>
        <span className="text-sm text-stone-400">
          {idx + 1} / {session.exercises.length}
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-stone-800 mb-8 overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-amber-500 to-orange-500 transition-all"
          style={{ width: `${((idx + (result ? 1 : 0)) / session.exercises.length) * 100}%` }}
        />
      </div>

      <div className={`${card} p-8`}>
        <p className="text-sm font-semibold text-amber-300 mb-4">{ex.instruction}</p>

        {ex.display_text && <p className="font-kalam text-5xl text-white text-center my-6">{ex.display_text}</p>}

        {ex.tts_text && (
          <button
            onClick={() => speak(ex.tts_text!, locale)}
            className="mx-auto mb-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-200 hover:bg-blue-500/30 transition-all"
          >
            <Volume2 className="w-5 h-5" /> Play audio
          </button>
        )}

        {/* Typed answer */}
        {!isChoice && !isRecordLab && (
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!!result}
            onKeyDown={(e) => e.key === "Enter" && (result ? next() : submit())}
            placeholder="Type your answer here"
            className="w-full px-5 py-4 rounded-xl bg-stone-950/60 border-2 border-stone-700/50 text-white text-lg outline-none focus:border-amber-500/50"
          />
        )}

        {/* Multiple choice */}
        {isChoice && (
          <div className="grid grid-cols-2 gap-3">
            {ex.options!.map((opt) => {
              const isSel = selected === opt;
              const isCorrect = result && opt === result.expected_answer;
              const isWrong = result && isSel && !result.correct;
              return (
                <button
                  key={opt}
                  disabled={!!result}
                  onClick={() => setSelected(opt)}
                  className={`px-4 py-4 rounded-xl border-2 text-lg font-medium transition-all ${
                    isCorrect
                      ? "border-green-500 bg-green-500/20 text-green-200"
                      : isWrong
                      ? "border-red-500 bg-red-500/20 text-red-200"
                      : isSel
                      ? "border-amber-500 bg-amber-500/20 text-amber-200"
                      : "border-stone-700/50 bg-stone-950/60 text-white hover:border-amber-500/40"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Recording */}
        {isRecordLab && (
          <div className="flex flex-col items-center gap-3">
            {!recording ? (
              <button
                onClick={startRecording}
                disabled={!!result}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all disabled:opacity-50"
              >
                <Mic className="w-5 h-5" /> {audioBlob ? "Record again" : "Start recording"}
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white animate-pulse"
              >
                <Square className="w-5 h-5" /> Stop recording
              </button>
            )}
            {audioBlob && !recording && <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />}
            {micError && <p className="text-sm text-red-300">{micError}</p>}
          </div>
        )}

        {/* Feedback */}
        {result && (
          <div
            className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${
              result.correct ? "bg-green-500/10 border-green-500/30 text-green-200" : "bg-red-500/10 border-red-500/30 text-red-200"
            }`}
          >
            {result.correct ? <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 shrink-0" />}
            <div className="text-sm">
              <p className="font-semibold">{result.feedback}</p>
              {isRecordLab && <p className="mt-1">Score: {result.score}/100</p>}
              {!result.correct && !isRecordLab && result.expected_answer && (
                <p className="mt-1">
                  Correct answer: <span className="font-bold">{result.expected_answer}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!result ? (
            <button
              onClick={submit}
              disabled={!canSubmit || busy}
              className="px-8 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {busy ? "Checking..." : "Check"}
            </button>
          ) : (
            <button
              onClick={next}
              disabled={busy}
              className="px-8 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all flex items-center gap-2 disabled:opacity-40"
            >
              {isLast ? "Finish" : "Next"} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 5. PAGE
 * ========================================================================== */

type View = "home" | "session" | "summary";

export default function PracticePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<View>("home");
  const [languages, setLanguages] = useState<LanguageInfo[]>([]);
  const [language, setLanguage] = useState<LanguageCode>("hi");
  const [progress, setProgress] = useState<PracticeProgress | null>(null);
  const [labs, setLabs] = useState<LabSummary[]>([]);
  const [labsLoading, setLabsLoading] = useState(true);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [starting, setStarting] = useState<LabId | null>(null);

  // Auth guard (same pattern as dashboard)
  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth/login");
  }, [authLoading, user, router]);

  // Languages + progress
  useEffect(() => {
    if (!user) return;
    practiceApi.getLanguages().then(setLanguages);
    practiceApi.getProgress().then(setProgress);
  }, [user]);

  // Labs for selected language
  useEffect(() => {
    if (!user) return;
    setLabsLoading(true);
    practiceApi.getLabs(language).then((l) => {
      setLabs(l);
      setLabsLoading(false);
    });
  }, [user, language]);

  const locale = languages.find((l) => l.code === language)?.speech_locale ?? "hi-IN";

  const startLab = async (lab: LabSummary) => {
    if (!lab.available || starting) return;
    setStarting(lab.id);
    try {
      const s = await practiceApi.startSession(lab.id, language);
      setSession(s);
      setView("session");
    } finally {
      setStarting(null);
    }
  };

  const backHome = () => {
    setView("home");
    setSession(null);
    setSummary(null);
    practiceApi.getProgress().then(setProgress);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-amber-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden">
      <Navbar />

      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20 relative z-10">
        {/* ---------------- HOME ---------------- */}
        {view === "home" && (
          <>
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-cyan-500/20 border-2 border-cyan-400/30 backdrop-blur-sm">
                  <Brain className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm font-semibold text-cyan-100 tracking-wide">AI-Powered Practice</span>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                </div>
              </div>
              <h1 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-4">
                Practice Labs
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-200 to-amber-300">
                  Master Your Skills
                </span>
              </h1>
              <p className="text-lg text-stone-300 max-w-2xl mx-auto">
                Listening, speaking and comprehension exercises for Indian languages.
              </p>
            </div>

            {/* Language selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-5 py-2.5 rounded-full border-2 transition-all ${
                    language === l.code
                      ? "bg-amber-500/20 border-amber-500 text-amber-200"
                      : "bg-stone-900/60 border-stone-700/50 text-stone-300 hover:border-amber-500/40"
                  }`}
                >
                  <span className="font-semibold">{l.name}</span>
                  <span className="ml-2 text-stone-400">{l.native_name}</span>
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
              {[
                { label: "Streak", value: progress ? `${progress.streak_days} days` : "–", color: "text-amber-400", icon: Trophy },
                { label: "Sessions", value: progress?.completed_sessions ?? "–", color: "text-green-400", icon: CheckCircle },
                { label: "Today", value: progress ? `${progress.todays_practice} ex` : "–", color: "text-blue-400", icon: Zap },
                { label: "Avg score", value: progress ? `${progress.average_score}%` : "–", color: "text-purple-400", icon: Sparkles },
              ].map((s) => (
                <div key={s.label} className={`${card} p-5 flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-stone-800/60 flex items-center justify-center shrink-0">
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold font-kalam ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-stone-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Labs */}
            <h2 className="font-kalam text-3xl font-bold text-white mb-6 text-center">Choose Your Practice</h2>

            {labsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-56 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {labs.map((lab) => {
                  const ui = LAB_UI[lab.id];
                  const Icon = ui.icon;
                  return (
                    <button
                      key={lab.id}
                      onClick={() => startLab(lab)}
                      disabled={!lab.available || !!starting}
                      className={`group text-left p-8 ${card} transition-all ${
                        lab.available
                          ? "hover:border-amber-500/50 hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/20"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 rounded-xl bg-linear-to-br ${ui.gradient}`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        {lab.id === "assessment" && (
                          <span className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30 text-xs font-medium text-purple-200">
                            Level check
                          </span>
                        )}
                        {!lab.available && (
                          <span className="px-3 py-1.5 rounded-lg bg-stone-700/40 border border-stone-600/40 text-xs text-stone-300">
                            Not available yet
                          </span>
                        )}
                      </div>

                      <h3 className="font-kalam text-2xl font-bold text-white mb-3">{lab.title}</h3>
                      <p className="text-sm mb-6 text-stone-400 leading-relaxed">{lab.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span className="text-stone-400">{lab.duration_label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span className="text-stone-400">{lab.exercise_count} ex</span>
                          </div>
                        </div>
                        {starting === lab.id ? (
                          <span className="text-xs text-amber-300 animate-pulse">Starting...</span>
                        ) : (
                          <ChevronRight className="w-5 h-5 text-amber-400 transition-transform group-hover:translate-x-1" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ---------------- SESSION ---------------- */}
        {view === "session" && session && (
          <SessionView
            session={session}
            locale={locale}
            onExit={backHome}
            onDone={(s) => {
              setSummary(s);
              setView("summary");
            }}
          />
        )}

        {/* ---------------- SUMMARY ---------------- */}
        {view === "summary" && summary && (
          <div className="max-w-xl mx-auto">
            <div className={`${card} p-10 text-center`}>
              <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-400" />
              <h2 className="font-kalam text-4xl font-bold text-white mb-2">Session Complete</h2>
              <p className="text-stone-400 mb-8">Here is how you did.</p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-700/50">
                  <p className="text-3xl font-bold font-kalam text-amber-400">{summary.average_score}%</p>
                  <p className="text-xs text-stone-500 mt-1">Average score</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-700/50">
                  <p className="text-3xl font-bold font-kalam text-green-400">
                    {summary.correct_count}/{summary.total_exercises}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Correct</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-700/50">
                  <p className="text-3xl font-bold font-kalam text-purple-400">{summary.level ?? "–"}</p>
                  <p className="text-xs text-stone-500 mt-1">Level</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={backHome}
                  className="px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all"
                >
                  Back to labs
                </button>
                <button
                  onClick={async () => {
                    if (!session) return;
                    const s = await practiceApi.startSession(session.lab, session.language);
                    setSession(s);
                    setSummary(null);
                    setView("session");
                  }}
                  className="px-6 py-3 rounded-xl font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Try again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}