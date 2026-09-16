"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, ArrowRight, BookOpen } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
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

          {!submitted ? (
            <>
              <h2 className="font-kalam text-3xl font-bold text-white text-center mb-2">Forgot Password?</h2>
              <p className="text-stone-400 text-sm text-center mb-8">
                Enter your email and we'll send you a password reset link
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-stone-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-stone-700/50 rounded-xl text-stone-100 placeholder-stone-600 text-sm outline-none transition-all focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-kalam font-bold text-lg rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Send Reset Link <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="font-kalam text-3xl font-bold text-white mb-3">Check Your Inbox</h2>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                If an account exists for <span className="text-amber-300 font-semibold">{email}</span>, 
                you'll receive a password reset link shortly.
              </p>
            </div>
          )}

          <p className="text-center mt-6 text-sm text-stone-600">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
