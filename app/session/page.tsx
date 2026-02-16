"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { 
  ArrowLeft,
  Volume2,
  Mic,
  Send,
  CheckCircle,
  XCircle,
  SkipForward,
  RotateCcw,
  Award,
  TrendingUp
} from "lucide-react";
import { useDarkMode } from '@/lib/DarkModeContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Exercise {
  id: string;
  type: 'listening' | 'pronunciation' | 'meaning' | 'dictation' | 'sound';
  question: string;
  audioUrl?: string;
  options?: string[];
  correctAnswer: string;
}

interface LabSession {
  labId: string;
  language: string;
  exercises: Exercise[];
  totalExercises: number;
}

function PracticeSessionContent() {
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const labId = searchParams.get('lab');
  const language = searchParams.get('language');

  const [session, setSession] = useState<LabSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Check authentication first
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    
    setIsAuthenticating(false);
    
    if (!labId || !language) {
      router.push('/practice');
      return;
    }
    fetchLabSession();
  }, [labId, language]);

  const fetchLabSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/practice/lab/${labId}?language=${language}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
      } else {
        // Mock data for demo
        setSession(getMockSession(labId, language));
      }
    } catch (error) {
      console.error("Fetch lab session error:", error);
      setSession(getMockSession(labId, language));
    } finally {
      setLoading(false);
    }
  };

  const getMockSession = (labId: string | null, lang: string | null): LabSession => {
    const baseExercises = {
      'listening-lab': [
        {
          id: '1',
          type: 'listening' as const,
          question: 'Listen and write what you hear:',
          audioUrl: '/audio/hindi-word-1.mp3', // Mock URL
          correctAnswer: 'नमस्ते'
        },
        {
          id: '2',
          type: 'listening' as const,
          question: 'Listen and write what you hear:',
          audioUrl: '/audio/hindi-word-2.mp3',
          correctAnswer: 'धन्यवाद'
        }
      ],
      'meaning-match': [
        {
          id: '1',
          type: 'meaning' as const,
          question: 'What does "नमस्ते" mean?',
          audioUrl: '/audio/namaste.mp3',
          options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
          correctAnswer: 'Hello'
        },
        {
          id: '2',
          type: 'meaning' as const,
          question: 'What does "पानी" mean?',
          audioUrl: '/audio/paani.mp3',
          options: ['Food', 'Water', 'Air', 'Fire'],
          correctAnswer: 'Water'
        }
      ],
      'pronunciation-recording': [
        {
          id: '1',
          type: 'pronunciation' as const,
          question: 'Record yourself saying: "नमस्ते"',
          correctAnswer: 'नमस्ते'
        },
        {
          id: '2',
          type: 'pronunciation' as const,
          question: 'Record yourself saying: "मैं ठीक हूँ"',
          correctAnswer: 'मैं ठीक हूँ'
        }
      ]
    };

    const exercises = baseExercises[labId as keyof typeof baseExercises] || baseExercises['listening-lab'];

    return {
      labId: labId || 'listening-lab',
      language: lang || 'Hindi',
      exercises,
      totalExercises: exercises.length
    };
  };

  const playAudio = () => {
    if (!session || !session.exercises[currentIndex].audioUrl) return;
    
    if (audioRef.current) {
      audioRef.current.src = session.exercises[currentIndex].audioUrl || '';
      setIsPlaying(true);
      audioRef.current.play().then(() => {
        audioRef.current!.onended = () => setIsPlaying(false);
      }).catch(err => {
        console.error("Audio play error:", err);
        setIsPlaying(false);
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordingBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const checkAnswer = () => {
    if (!session) return;

    const currentExercise = session.exercises[currentIndex];
    let isCorrect = false;

    if (currentExercise.type === 'listening' || currentExercise.type === 'dictation') {
      isCorrect = userAnswer.trim().toLowerCase() === currentExercise.correctAnswer.toLowerCase();
    } else if (currentExercise.type === 'meaning') {
      isCorrect = selectedOption === currentExercise.correctAnswer;
    } else if (currentExercise.type === 'pronunciation') {
      // For pronunciation, we just accept the recording
      isCorrect = recordingBlob !== null;
    }

    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      nextExercise();
    }, 1500);
  };

  const nextExercise = () => {
    if (!session) return;

    if (currentIndex < session.totalExercises - 1) {
      setCurrentIndex(currentIndex + 1);
      resetExercise();
    } else {
      setShowResults(true);
    }
  };

  const resetExercise = () => {
    setUserAnswer("");
    setSelectedOption(null);
    setRecordingBlob(null);
    setFeedback(null);
  };

  const restartLab = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResults(false);
    resetExercise();
  };

  if (loading || isAuthenticating) {
    return (
      <div className={`pt-20 min-h-screen ${darkMode ? "bg-[#1a1410]" : "bg-[#FFF9F5]"}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className={darkMode ? 'text-orange-200' : 'text-gray-700'}>
              {isAuthenticating ? 'Checking authentication...' : 'Loading lab...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`pt-20 min-h-screen ${darkMode ? "bg-[#1a1410]" : "bg-[#FFF9F5]"}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto p-4 text-center">
          <p className={darkMode ? 'text-orange-200' : 'text-gray-700'}>Lab not found</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / session.totalExercises) * 100);
    
    return (
      <div className={`pt-20 min-h-screen ${darkMode ? "bg-[#1a1410]" : "bg-[#FFF9F5]"}`}>
        <Navbar />
        <div className="max-w-2xl mx-auto p-4">
          <div className={`rounded-3xl p-8 text-center ${
            darkMode ? "bg-orange-900/10 border border-orange-800/30" : "bg-white border border-orange-200"
          }`}>
            <div className="mb-6">
              <Award className={`w-20 h-20 mx-auto mb-4 ${
                percentage >= 70 ? "text-yellow-500" : darkMode ? "text-orange-400" : "text-orange-600"
              }`} />
              <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-orange-100" : "text-orange-900"}`}>
                Lab Complete!
              </h2>
              <p className={`text-lg ${darkMode ? "text-orange-200/70" : "text-orange-700/70"}`}>
                {session.language} - {labId}
              </p>
            </div>

            <div className={`rounded-2xl p-6 mb-6 ${
              darkMode ? "bg-orange-900/20" : "bg-orange-50"
            }`}>
              <div className="text-6xl font-bold mb-2 bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                {percentage}%
              </div>
              <p className={`text-lg ${darkMode ? "text-orange-200" : "text-orange-800"}`}>
                {score} out of {session.totalExercises} correct
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/practice')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  darkMode 
                    ? "bg-orange-900/30 text-orange-200 border border-orange-800/30 hover:bg-orange-900/50" 
                    : "bg-orange-100 text-orange-800 border border-orange-300 hover:bg-orange-200"
                }`}
              >
                Back to Labs
              </button>
              <button
                onClick={restartLab}
                className="flex-1 py-3 rounded-xl bg-linear-to-r from-orange-500 to-red-600 text-white font-medium hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Retry Lab
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentExercise = session.exercises[currentIndex];

  return (
    <div className={`pt-20 min-h-screen ${darkMode ? "bg-[#1a1410]" : "bg-[#FFF9F5]"}`}>
      <Navbar />
      
      <audio ref={audioRef} />

      <div className="max-w-3xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/practice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              darkMode 
                ? "bg-orange-900/30 text-orange-200 hover:bg-orange-900/50" 
                : "bg-orange-100 text-orange-800 hover:bg-orange-200"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Exit Lab
          </button>

          <div className={`px-4 py-2 rounded-xl font-semibold ${
            darkMode ? "bg-orange-900/20 text-orange-100" : "bg-orange-100 text-orange-900"
          }`}>
            {currentIndex + 1} / {session.totalExercises}
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`h-2 rounded-full mb-8 ${darkMode ? "bg-orange-900/20" : "bg-orange-100"}`}>
          <div 
            className="h-full rounded-full bg-linear-to-r from-orange-500 to-red-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / session.totalExercises) * 100}%` }}
          />
        </div>

        {/* Exercise Card */}
        <div className={`rounded-3xl p-8 ${
          darkMode ? "bg-orange-900/10 border border-orange-800/30" : "bg-white border border-orange-200"
        }`}>
          {/* Question */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-orange-100" : "text-orange-900"}`}>
              {currentExercise.question}
            </h2>

            {/* Audio Player for listening/meaning exercises */}
            {(currentExercise.type === 'listening' || currentExercise.type === 'meaning' || currentExercise.type === 'dictation') && currentExercise.audioUrl && (
              <button
                onClick={playAudio}
                disabled={isPlaying}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
                  isPlaying
                    ? darkMode 
                      ? "bg-orange-900/50 text-orange-300 cursor-not-allowed" 
                      : "bg-orange-200 text-orange-700 cursor-not-allowed"
                    : "bg-linear-to-r from-orange-500 to-red-600 text-white hover:scale-[1.02]"
                }`}
              >
                <Volume2 className="w-5 h-5" />
                {isPlaying ? "Playing..." : "Play Audio"}
              </button>
            )}

            {/* Target word for pronunciation */}
            {currentExercise.type === 'pronunciation' && (
              <div className={`p-6 rounded-2xl text-center ${
                darkMode ? "bg-orange-900/20" : "bg-orange-50"
              }`}>
                <div className="text-4xl font-bold mb-2">
                  {currentExercise.correctAnswer}
                </div>
                <p className={`text-sm ${darkMode ? "text-orange-200/70" : "text-orange-700/70"}`}>
                  Say this word clearly
                </p>
              </div>
            )}
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            {/* Text input for listening/dictation */}
            {(currentExercise.type === 'listening' || currentExercise.type === 'dictation') && (
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type what you heard..."
                disabled={feedback !== null}
                className={`w-full px-6 py-4 rounded-xl border text-lg outline-none ${
                  darkMode 
                    ? "bg-orange-900/20 border-orange-800/30 text-orange-100 placeholder:text-orange-400/50" 
                    : "bg-orange-50 border-orange-300 text-orange-950 placeholder:text-orange-400"
                } ${feedback === 'correct' ? 'border-green-500' : feedback === 'wrong' ? 'border-red-500' : ''}`}
              />
            )}

            {/* Multiple choice for meaning */}
            {currentExercise.type === 'meaning' && currentExercise.options && (
              <div className="grid grid-cols-2 gap-3">
                {currentExercise.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    disabled={feedback !== null}
                    className={`p-4 rounded-xl font-medium transition-all ${
                      selectedOption === option
                        ? "bg-linear-to-r from-orange-500 to-red-600 text-white scale-[1.02]"
                        : darkMode 
                          ? "bg-orange-900/20 text-orange-200 hover:bg-orange-900/30 border border-orange-800/30" 
                          : "bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-300"
                    } ${feedback === 'correct' && selectedOption === option ? 'border-green-500' : feedback === 'wrong' && selectedOption === option ? 'border-red-500' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Recording for pronunciation */}
            {currentExercise.type === 'pronunciation' && (
              <div className="text-center space-y-4">
                {!recordingBlob ? (
                  <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all ${
                      isRecording 
                        ? "bg-red-500 scale-110 animate-pulse" 
                        : "bg-linear-to-r from-orange-500 to-red-600 hover:scale-110"
                    }`}
                  >
                    <Mic className="w-10 h-10 text-white" />
                  </button>
                ) : (
                  <div className={`p-4 rounded-xl ${darkMode ? "bg-green-900/20 border border-green-800/30" : "bg-green-50 border border-green-200"}`}>
                    <CheckCircle className={`w-12 h-12 mx-auto mb-2 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                    <p className={`font-medium ${darkMode ? "text-green-300" : "text-green-700"}`}>
                      Recording captured!
                    </p>
                  </div>
                )}
                <p className={`text-sm ${darkMode ? "text-orange-200/70" : "text-orange-700/70"}`}>
                  {isRecording ? "Recording..." : recordingBlob ? "Ready to submit" : "Hold to record"}
                </p>
              </div>
            )}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
              feedback === 'correct'
                ? darkMode ? "bg-green-900/20 border border-green-800/30" : "bg-green-50 border border-green-200"
                : darkMode ? "bg-red-900/20 border border-red-800/30" : "bg-red-50 border border-red-200"
            }`}>
              {feedback === 'correct' ? (
                <>
                  <CheckCircle className={`w-6 h-6 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                  <span className={`font-semibold ${darkMode ? "text-green-300" : "text-green-700"}`}>
                    Correct! Well done!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className={`w-6 h-6 ${darkMode ? "text-red-400" : "text-red-600"}`} />
                  <div>
                    <span className={`font-semibold block ${darkMode ? "text-red-300" : "text-red-700"}`}>
                      Not quite right
                    </span>
                    <span className={`text-sm ${darkMode ? "text-red-400/70" : "text-red-600/70"}`}>
                      Correct answer: {currentExercise.correctAnswer}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Submit Button */}
          {feedback === null && (
            <button
              onClick={checkAnswer}
              disabled={
                (currentExercise.type === 'listening' && !userAnswer.trim()) ||
                (currentExercise.type === 'meaning' && !selectedOption) ||
                (currentExercise.type === 'pronunciation' && !recordingBlob) ||
                (currentExercise.type === 'dictation' && !userAnswer.trim())
              }
              className="w-full mt-6 py-4 rounded-xl bg-linear-to-r from-orange-500 to-red-600 text-white font-semibold text-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Check Answer
            </button>
          )}
        </div>

        {/* Score Display */}
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl ${
            darkMode ? "bg-orange-900/20 text-orange-100" : "bg-orange-100 text-orange-900"
          }`}>
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">
              Score: {score} / {currentIndex + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PracticeSessionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-700">Loading practice session...</p>
        </div>
      </div>
    }>
      <PracticeSessionContent />
    </Suspense>
  );
}