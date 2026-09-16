"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, ArrowRight, BookOpen, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { authAPI } from "@/app/lib/api";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  // ── Forgot mode ───────────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // ── Reset mode ────────────────────────────────────────────────────────────
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // ── Forgot password submit ─────────────────────────────────────────────────
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authAPI.forgotPassword(email);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Reset password submit ──────────────────────────────────────────────────
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (password !== confirm) {
      setResetError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setResetError("Password must be at least 8 characters.");
      return;
    }
    if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setResetError("Password must contain at least one uppercase letter and one number.");
      return;
    }
    setResetLoading(true);
    try {
      const res = await authAPI.resetPassword(resetToken!, password);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      setResetDone(true);
    } catch (err: any) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
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
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-stone-900/60 backdrop-blur-md border border-stone-700/50 rounded-2xl p-10">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-kalam text-2xl font-bold text-white">VartaLang</h1>
          </div>

          {/* ── RESET MODE (token in URL) ─────────────────────────────── */}
          {resetToken ? (
            resetDone ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="font-kalam text-3xl font-bold text-white mb-3">Password Reset!</h2>
                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                  Your password has been updated. You are now logged in.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-kalam font-bold rounded-xl transition-all hover:scale-[1.02]"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                <h2 className="font-kalam text-3xl font-bold text-white text-center mb-2">Set New Password</h2>
                <p className="text-stone-400 text-sm text-center mb-8">
                  Choose a strong password for your account
                </p>

                {resetError && (
                  <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
                    {resetError}
                  </div>
                )}

                <form onSubmit={handleReset} className="space-y-5">
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                      <input
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 chars, 1 uppercase, 1 number"
                        required
                        className="w-full pl-10 pr-10 py-3.5 bg-white/5 border border-stone-700/50 rounded-xl text-stone-100 placeholder-stone-600 text-sm outline-none transition-all focus:border-amber-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                      <input
                        type={showPw ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repeat password"
                        required
                        className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-stone-700/50 rounded-xl text-stone-100 placeholder-stone-600 text-sm outline-none transition-all focus:border-amber-500/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-kalam font-bold text-lg rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetLoading ? "Resetting..." : "Reset Password"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </>
            )
          ) : (
            /* ── FORGOT MODE ───────────────────────────────────────────── */
            submitted ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="font-kalam text-3xl font-bold text-white mb-3">Check Your Inbox</h2>
                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                  If an account exists for{" "}
                  <span className="text-amber-300 font-semibold">{email}</span>, you will receive
                  reset instructions shortly.
                </p>
                <p className="text-xs text-stone-600">
                  Tip: check your spam folder too.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-kalam text-3xl font-bold text-white text-center mb-2">
                  Forgot Password?
                </h2>
                <p className="text-stone-400 text-sm text-center mb-8">
                  Enter your email and we&apos;ll send you a password reset link
                </p>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-300">
                    {error}
                  </div>
                )}

                <form onSubmit={handleForgot} className="space-y-5">
                  <div>
                    <label className="block text-sm text-stone-400 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-stone-700/50 rounded-xl text-stone-100 placeholder-stone-600 text-sm outline-none transition-all focus:border-amber-500/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-kalam font-bold text-lg rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Reset Link"} <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </>
            )
          )}

          <p className="text-center mt-6 text-sm text-stone-600">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
