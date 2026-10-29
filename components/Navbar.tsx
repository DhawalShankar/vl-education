// components/Navbar.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Bell, Sun, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    setShowMenu(false);
    await logout();
    router.replace("/auth/login");
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-8 max-w-7xl mx-auto">
      <nav className="glass-panel rounded-full px-5 py-3 flex items-center justify-between shadow-2xl border border-white/10 bg-[#16130F]/85 backdrop-blur-xl">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/80 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all"
              >
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF5500] to-[#E64A00] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {user.full_name?.[0]}
                  </div>
                )}
                <span className="max-w-[120px] truncate">{user.full_name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/60" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#181512] border border-white/10 shadow-2xl p-2 z-50 backdrop-blur-2xl">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs text-white/95 font-semibold truncate">{user.full_name}</p>
                    <p className="text-[11px] text-white/50 truncate">{user.email}</p>
                    <p className="text-[10px] text-[#FF7700] uppercase font-bold tracking-wider mt-1">
                      {user.role}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#FF7700]" />
                    <span>My Dashboard</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 mt-1 border-t border-white/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#FF6600] text-white text-xs font-semibold transition-colors"
            >
              Sign In
            </Link>
          )}

          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-400/80">
            <Sun className="w-4 h-4" />
          </div>
        </div>
      </nav>
    </header>
  );
}