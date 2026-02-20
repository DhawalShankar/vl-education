"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, BookOpen } from "lucide-react";

interface Message {
  type: "success" | "error";
  text: string;
}

type Role = "student" | "instructor";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [role, setRole] = useState<Role>("student");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setMessage(null);
  };

  const switchTab = (t: "login" | "register") => {
    setTab(t);
    setMessage(null);
    setRole("student");
    setForm({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const endpoint =
        tab === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const body =
        tab === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password, role };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      setMessage({ type: "success", text: `Welcome, ${data.data.user.name}! 🎓` });

      // Redirect based on role returned from backend
      const userRole = data.data.user.role;
      setTimeout(() => {
        window.location.href =
          userRole === "instructor" ? "/dashboard/instructor" : "/dashboard";
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex items-center justify-center px-4">

      {/* Background */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 bg-linear-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-stone-900/60 backdrop-blur-md border border-stone-700/50 rounded-2xl p-10">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-kalam text-2xl font-bold text-white">VartaLang</h1>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-black/30 rounded-xl p-1 mb-8 border border-white/5">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2.5 rounded-lg font-kalam text-base font-bold transition-all duration-200 ${
                  tab === t
                    ? "bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-300 shadow-sm"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-xl text-sm ${
                message.type === "error"
                  ? "bg-red-500/10 border border-red-500/20 text-red-300"
                  : "bg-green-500/10 border border-green-500/20 text-green-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Role Selector — only on Register */}
            {tab === "register" && (
              <div>
                <label className="block text-sm text-stone-400 mb-3">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["student", "instructor"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 font-kalam font-bold text-sm ${
                        role === r
                          ? "border-amber-500 bg-amber-500/10 text-amber-300"
                          : "border-stone-700/50 bg-white/5 text-stone-400 hover:border-stone-500 hover:text-white"
                      }`}
                    >
                      <span className="text-2xl">{r === "student" ? "🎓" : "📖"}</span>
                      <span className="capitalize">{r}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === "register" && (
              <div>
                <label className="block text-sm text-stone-400 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handle}
                  placeholder="Arjun Sharma"
                  required
                  className="w-full bg-white/5 border border-stone-700/50 rounded-xl px-4 py-3.5 text-stone-100 placeholder-stone-600 text-sm outline-none transition-all focus:border-amber-500/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-stone-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                placeholder="arjun@example.com"
                required
                className="w-full bg-white/5 border border-stone-700/50 rounded-xl px-4 py-3.5 text-stone-100 placeholder-stone-600 text-sm outline-none transition-all focus:border-amber-500/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-500/10"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-stone-400">Password</label>
                {tab === "login" && (
                  <a href="/forgot-password" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
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
                  className="w-full bg-white/5 border border-stone-700/50 rounded-xl px-4 py-3.5 pr-12 text-stone-100 placeholder-stone-600 text-sm outline-none transition-all focus:border-amber-500/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-amber-400 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {tab === "register" && (
                <p className="mt-2 text-xs text-stone-600">Min 8 chars, one uppercase, one number</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-6 py-4 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-kalam font-bold text-lg rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_24px_rgba(249,115,22,0.5)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span>{tab === "login" ? "Sign In" : "Create Account"}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-sm text-stone-600">
            {tab === "login" ? "New here? " : "Already have an account? "}
            <button
              onClick={() => switchTab(tab === "login" ? "register" : "login")}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              {tab === "login" ? "Create a free account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}