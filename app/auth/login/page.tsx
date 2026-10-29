// app/auth/login/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth?.isAuthenticated) router.replace("/dashboard");
  }, [auth?.isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setError(null);
    try {
      await auth.login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/25 text-sm outline-none focus:border-[#FF5500]";

  return (
    <div className="min-h-screen bg-[#0B0A08] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#14120E]/90 border border-white/10 rounded-3xl p-10 shadow-2xl shadow-black/80">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5500] to-[#FF8800] flex items-center justify-center mb-3">
            <span className="text-white text-xl font-black tracking-wider">VL</span>
          </div>
          <h1 className="text-2xl font-bold text-white">VartaLang LMS</h1>
          <p className="text-xs text-white/50 mt-1">Sign in with your VartaLang account</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl text-xs flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputCls}
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-white/50">Password</label>
              <a href="/forgot-password" className="text-xs text-[#FF7700] hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#FF5500] to-[#E64A00] hover:from-[#FF6600] hover:to-[#FF5500] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Signing in… (first login can take up to a minute)"
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}