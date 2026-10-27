"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { 
  Bell, 
  Sun, 
  ChevronDown, 
  BookOpen, 
  ShieldCheck, 
  LogOut,
  GraduationCap,
  KeyRound,
  Zap,
  AlertCircle,
  X,
  CheckCircle2
} from "lucide-react";

export default function Navbar() {
  const { 
    user, 
    loginAs, 
    loginWithSSO, 
    logout, 
    isAuthenticated,
    authError,
    clearAuthError
  } = useAuth();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showCustomSSO, setShowCustomSSO] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleCustomSSOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCode.trim()) return;
    try {
      await loginWithSSO(customCode.trim());
      setStatusNotice(`SSO code "${customCode}" exchanged successfully!`);
      setShowCustomSSO(false);
      setCustomCode("");
      setShowRoleMenu(false);
      setTimeout(() => setStatusNotice(null), 4000);
    } catch {
      // Error handled in AuthContext
    }
  };

  const handleSSOExchange = async (code: string) => {
    try {
      await loginWithSSO(code);
      setStatusNotice(`SSO exchange succeeded for "${code}"!`);
      setShowRoleMenu(false);
      setTimeout(() => setStatusNotice(null), 4000);
    } catch {
      // Error handled in AuthContext
    }
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Toast Notice / Backend Offline Alert */}
      {(authError || statusNotice) && (
        <div className="mb-3 max-w-lg mx-auto bg-[#1C1612]/95 border border-[#FF5500]/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            {statusNotice ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#FF8800] shrink-0" />
            )}
            <span className="text-white/90">
              {statusNotice || authError}
            </span>
          </div>
          <button 
            onClick={() => { clearAuthError(); setStatusNotice(null); }}
            className="text-white/50 hover:text-white p-1 rounded-lg ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <nav className="glass-panel rounded-full px-5 py-3 flex items-center justify-between shadow-2xl border border-white/10 bg-[#16130F]/85 backdrop-blur-xl">
        {/* Brand Logo */}
        <Link href="/test-frontend" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5500] to-[#FF8800] flex items-center justify-center shadow-lg shadow-[#FF5500]/25 group-hover:scale-105 transition-transform">
            <span className="text-white text-lg font-black tracking-wider">VL</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight font-display">
            VartaLang
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/80">
          <Link href="#learn" className="text-white font-semibold flex items-center gap-1.5 hover:text-[#FF6600] transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]"></span>
            Learn
          </Link>
          <Link href="#challenge" className="hover:text-white transition-colors">Challenge</Link>
          <Link href="#matches" className="hover:text-white transition-colors">Matches</Link>
          <Link href="#chats" className="hover:text-white transition-colors">Chats</Link>
          <Link href="#roles" className="hover:text-white transition-colors">Target Roles</Link>
          <Link href="#jobs" className="hover:text-white transition-colors">Jobs</Link>
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
        </div>

        {/* Right Action Icons & Auth / Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Notification Icon */}
          <button 
            aria-label="Notifications" 
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/80 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Quick Role & SSO Testing Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF5500] to-[#E64A00] flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                {user ? user.role[0] : "G"}
              </div>
              <span className="capitalize">{user ? user.role : "Guest"}</span>
              {user?.isMockOffline && (
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono">Mock</span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-white/60" />
            </button>

            {/* Dropdown Menu for Roles + SSO Testing */}
            {showRoleMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#181512] border border-white/10 shadow-2xl p-2 z-50 backdrop-blur-2xl"
              >
                {/* User Info Header */}
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Current Session</p>
                    {isAuthenticated && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/95 font-semibold truncate mt-0.5">
                    {user?.full_name || "Guest Visitor"}
                  </p>
                  <p className="text-[11px] text-white/50 truncate">
                    {user?.email || "Browse-only access"}
                  </p>
                </div>

                {/* Section 1: Standard Roles (dev-login) */}
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-white/40 tracking-wider">
                  Direct Role Switch
                </div>

                <button
                  onClick={() => { loginAs("student", "Priya Patel", "priya@vartalang.in"); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-[#FF7700]" />
                  <span>Student View (Priya)</span>
                </button>

                <button
                  onClick={() => { loginAs("instructor", "Hans Schmidt", "prof_schmidt@vartalang.in"); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Instructor View (Hans)</span>
                </button>

                <button
                  onClick={() => { loginAs("admin", "Platform Admin", "admin@vartalang.in"); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Admin View</span>
                </button>

                {/* Section 2: Real SSO Exchange Test */}
                <div className="my-1 border-t border-white/10 pt-1.5 px-2 text-[10px] uppercase font-bold text-amber-400/80 tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#FF5500]" />
                  <span>Test SSO Exchange</span>
                </div>

                <button
                  onClick={() => handleSSOExchange("mock_student_101")}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-amber-200/90 hover:text-amber-100 hover:bg-amber-500/10 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-[#FF7700]" />
                    <span>SSO Student Login</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">code: 101</span>
                </button>

                <button
                  onClick={() => handleSSOExchange("mock_instructor_202")}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-amber-200/90 hover:text-amber-100 hover:bg-amber-500/10 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SSO Instructor Login</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">code: 202</span>
                </button>

                {/* Custom SSO Code Input */}
                {!showCustomSSO ? (
                  <button
                    onClick={() => setShowCustomSSO(true)}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-[11px] text-white/50 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                  >
                    <span>+ Enter Custom SSO Code</span>
                  </button>
                ) : (
                  <form onSubmit={handleCustomSSOSubmit} className="p-2 bg-black/40 rounded-xl mt-1">
                    <input
                      type="text"
                      placeholder="e.g. mock_student_999"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#FF5500]"
                      autoFocus
                    />
                    <div className="flex items-center justify-end gap-1.5 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setShowCustomSSO(false)}
                        className="px-2 py-1 text-[10px] text-white/50 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-[10px] font-semibold bg-[#FF5500] hover:bg-[#FF6600] text-white rounded-md"
                      >
                        Exchange
                      </button>
                    </div>
                  </form>
                )}

                {/* Section 3: Logout */}
                {isAuthenticated && (
                  <button
                    onClick={() => { logout(); setShowRoleMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 mt-1 border-t border-white/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out (Be Guest)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Theme indicator */}
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-400/80">
            <Sun className="w-4 h-4" />
          </div>
        </div>
      </nav>
    </header>
  );
}
