"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Zap, 
  KeyRound, 
  AlertCircle, 
  UserPlus, 
  CheckCircle2, 
  Compass 
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

interface Message {
  type: "success" | "error" | "warning";
  text: string;
}

type Role = "student" | "instructor";

export default function AuthPage() {
  const auth = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [role, setRole] = useState<Role>("student");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // SSO panel state
  const [showSSOPanel, setShowSSOPanel] = useState(false);
  const [customSSOCode, setCustomSSOCode] = useState("");

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setMessage(null);
  };

  const switchTab = (t: "login" | "register") => {
    setTab(t);
    setMessage(null);
  };

  const handleRedirect = (userRole: string) => {
    if (userRole === "admin") router.push("/dashboard/admin");
    else if (userRole === "instructor") router.push("/dashboard/instructor");
    else router.push("/dashboard");
  };

  const handleSSOLogin = async (code: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const user = await auth.loginWithSSO(code);
      setMessage({
        type: "success",
        text: `SSO authentication successful! Welcome, ${user.full_name || user.name}.`,
      });
      setTimeout(() => {
        handleRedirect(user.role);
      }, 800);
    } catch (err: any) {
      if (err.isUnlinked || (err.message && err.message.toLowerCase().includes("no linked account"))) {
        setMessage({
          type: "warning",
          text: "No linked VartaLang account found. Please register to create your LMS account below.",
        });
        // Auto-switch to register tab as requested
        setTab("register");
        if (code.includes("@")) {
          setForm((prev) => ({ ...prev, email: code }));
        }
      } else {
        setMessage({
          type: "error",
          text: err.message || "Failed to exchange SSO code.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      let user;
      if (tab === "login") {
        user = await auth.login(form.email, form.password);
      } else {
        user = await auth.register(form.name, form.email, form.password, role);
      }

      setMessage({ type: "success", text: `Welcome, ${user.full_name || user.name}! Redirecting...` });

      setTimeout(() => {
        handleRedirect(user.role);
      }, 700);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0A08] relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#14120E]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80">

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5500] to-[#FF8800] flex items-center justify-center shadow-lg shadow-[#FF5500]/30 mb-3">
              <span className="text-white text-xl font-black tracking-wider">VL</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">VartaLang LMS</h1>
            <p className="text-xs text-white/50 mt-1">Access courses, lesson tracking & community groups</p>
          </div>

          {/* Primary SSO Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowSSOPanel(!showSSOPanel)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E64A00] hover:from-[#FF6600] hover:to-[#FF5500] text-white text-sm font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-[#FF5500]/20 transition-all hover:scale-[1.01]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Continue with VartaLang SSO</span>
            </button>

            {/* SSO Dropdown Options */}
            {showSSOPanel && (
              <div className="mt-3 p-3.5 bg-black/50 border border-white/10 rounded-2xl space-y-2.5 animate-in fade-in duration-200">
                <p className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                  Select SSO Test Option:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSSOLogin("mock_student_101")}
                    disabled={loading}
                    className="py-2 px-3 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-white/90 border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>🎓 Student SSO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSSOLogin("mock_instructor_202")}
                    disabled={loading}
                    className="py-2 px-3 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-white/90 border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>📖 Instructor SSO</span>
                  </button>
                </div>

                {/* Simulate Unlinked Account Test */}
                <button
                  type="button"
                  onClick={() => handleSSOLogin("mock_unlinked_user_999")}
                  disabled={loading}
                  className="w-full py-2 px-3 text-xs font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Unlinked Account (Prompts Register)</span>
                </button>

                {/* Custom SSO Code Input */}
                <div className="pt-2 border-t border-white/10 flex gap-2">
                  <input
                    type="text"
                    value={customSSOCode}
                    onChange={(e) => setCustomSSOCode(e.target.value)}
                    placeholder="Or enter SSO Code / Token"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF5500]"
                  />
                  <button
                    type="button"
                    onClick={() => customSSOCode && handleSSOLogin(customSSOCode)}
                    disabled={!customSSOCode || loading}
                    className="px-3 py-1.5 bg-[#FF5500] hover:bg-[#FF6600] disabled:opacity-40 text-white text-xs font-semibold rounded-lg"
                  >
                    Exchange
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#14120E] px-3 text-[11px] font-medium text-white/40 uppercase tracking-wider">
              Or use credentials
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>

          {/* Tab switcher */}
          <div className="flex bg-black/40 rounded-xl p-1 mb-6 border border-white/5">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === "login"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab("register")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === "register"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Register
            </button>
          </div>

          {/* Alert Message */}
          {message && (
            <div
              className={`mb-5 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                message.type === "error"
                  ? "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                  : message.type === "warning"
                  ? "bg-amber-500/15 border border-amber-500/30 text-amber-200"
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              }`}
            >
              {message.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              {message.type === "warning" && <UserPlus className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
              {message.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role Selector on Register */}
            {tab === "register" && (
              <div>
                <label className="block text-xs text-white/50 mb-2">Select Role</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(["student", "instructor"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        role === r
                          ? "border-[#FF5500] bg-[#FF5500]/15 text-white shadow-sm"
                          : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {r === "student" ? "🎓 Student" : "📖 Instructor"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === "register" && (
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handle}
                  placeholder="e.g. Arjun Sharma"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/25 text-xs outline-none focus:border-[#FF5500]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                placeholder="you@vartalang.in"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/25 text-xs outline-none focus:border-[#FF5500]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs text-white/50">Password</label>
                {tab === "login" && (
                  <a href="/forgot-password" className="text-xs text-[#FF7700] hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handle}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 pr-10 text-white placeholder-white/25 text-xs outline-none focus:border-[#FF5500]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#FF5500] to-[#E64A00] hover:from-[#FF6600] hover:to-[#FF5500] text-white font-semibold text-xs rounded-xl shadow-lg shadow-[#FF5500]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{tab === "login" ? "Sign In with Email" : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick link to preview live course catalog */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <a
              href="/test-frontend"
              className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-[#FF7700] transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Or explore Course Catalog directly</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
