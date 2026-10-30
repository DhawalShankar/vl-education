// components/Navbar.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  Flame,
  Sparkles,
  Sun,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Shield,
  BookOpen,
} from "lucide-react";
import { useUserStreak, formatLocalDate } from "@/app/lib/streak";

type NavItem = { label: string; href: string; ready: boolean };

// ready:false => shown greyed with a "Soon" badge, not clickable.
// Flip to true when the page is built on real data.
const NAV_ITEMS: NavItem[] = [
  { label: "My Learning", href: "/dashboard", ready: true },
  { label: "Courses", href: "/learn", ready: true },
  { label: "Practice Labs", href: "/practice", ready: true },
  { label: "Challenges", href: "/challenges", ready: true },
  { label: "Certifications", href: "/certifications", ready: true },
  { label: "Community", href: "/community", ready: true },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const { streak } = useUserStreak(user?.email || user?.id);

  const handleLogout = async () => {
    setShowMenu(false);
    setShowStreak(false);
    await logout();
    router.replace("/auth/login");
  };

  const renderItem = (item: NavItem, mobile = false) => {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    const base = mobile ? "px-3 py-2.5 rounded-xl text-sm" : "text-[13px]";

    if (!item.ready) {
      return (
        <span
          key={item.href}
          className={`${base} flex items-center gap-1.5 text-white/30 cursor-not-allowed select-none`}
        >
          {item.label}
          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white/40">
            Soon
          </span>
        </span>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => {
          setShowMobile(false);
          setShowStreak(false);
          setShowMenu(false);
        }}
        className={`${base} flex items-center gap-1.5 transition-colors ${
          active ? "text-white font-semibold" : "text-white/70 hover:text-white"
        } ${mobile && active ? "bg-white/10" : ""}`}
      >
        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />}
        {item.label}
      </Link>
    );
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-8 max-w-7xl mx-auto">
      <nav className="glass-panel rounded-full px-5 py-3 flex items-center justify-between shadow-2xl border border-white/10 bg-[#16130F]/85 backdrop-blur-xl">
        {/* Brand Logo */}
        <Link href={isAuthenticated ? "/dashboard" : "/home"} className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="VartaLang Logo"
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-lg"
          />
        </Link>

        {/* Center Nav Links (desktop) */}
        <div className="hidden lg:flex items-center gap-6 font-medium">
          {NAV_ITEMS.map((item) => renderItem(item))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Daily Streak Indicator */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStreak(!showStreak);
                setShowMenu(false);
              }}
              title={`Daily Streak: ${streak.currentStreak} day${streak.currentStreak === 1 ? "" : "s"}`}
              aria-label="Daily Streak"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 hover:text-orange-300 transition-all group"
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span className="text-xs font-bold font-mono tracking-tight text-orange-200">
                {streak.currentStreak}
              </span>
            </button>

            {/* Streak Details Popover */}
            {showStreak && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#16130F]/95 border border-orange-500/30 shadow-2xl p-4 z-50 backdrop-blur-2xl">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Flame className="w-6 h-6 fill-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-kalam">
                      {streak.currentStreak} Day Streak!
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      {streak.currentStreak === 1
                        ? "Great start! Practice daily to grow it."
                        : "You're on fire! Keep learning today."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center mb-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                      Best Streak
                    </span>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      {streak.longestStreak} Days
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                      Total Active
                    </span>
                    <span className="text-sm font-bold text-orange-300 font-mono">
                      {streak.totalDaysActive} Days
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-[11px] text-stone-400 block mb-2 font-medium">
                    Last 7 Days Activity
                  </span>
                  <div className="flex justify-between items-center gap-1">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() - (6 - i));
                      const dateStr = formatLocalDate(d);
                      const isActive = streak.history.includes(dateStr);
                      const dayName = d.toLocaleDateString("en-US", { weekday: "narrow" });
                      return (
                        <div key={dateStr} className="flex flex-col items-center gap-1">
                          <div
                            title={dateStr}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                              isActive
                                ? "bg-orange-500 text-stone-950 shadow-md shadow-orange-500/30"
                                : "bg-white/5 text-stone-500 border border-white/5"
                            }`}
                          >
                            {isActive ? "🔥" : "·"}
                          </div>
                          <span className="text-[9px] text-stone-500 font-mono">{dayName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Link
                  href="/practice"
                  onClick={() => setShowStreak(false)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md font-kalam"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Practice to Extend Streak</span>
                </Link>
              </div>
            )}
          </div>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowMenu(!showMenu);
                  setShowStreak(false);
                }}
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
                <span className="max-w-[120px] truncate hidden sm:block">{user.full_name}</span>
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
                  {(user.role === "admin" ||
                    user.email?.toLowerCase() === "cosmoindiaprakashan@gmail.com") && (
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-amber-300 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  {user.role === "instructor" && (
                    <Link
                      href="/dashboard/instructor"
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-sky-300 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-sky-400" />
                      <span>Instructor Studio</span>
                    </Link>
                  )}

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

          <div className="hidden sm:flex w-9 h-9 rounded-full bg-white/5 border border-white/10 items-center justify-center text-amber-400/80">
            <Sun className="w-4 h-4" />
          </div>

          {/* Mobile menu toggle */}
          <button
            aria-label="Menu"
            onClick={() => {
              setShowMobile(!showMobile);
              setShowStreak(false);
              setShowMenu(false);
            }}
            className="lg:hidden w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/80"
          >
            {showMobile ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {showMobile && (
        <div className="lg:hidden mt-2 rounded-3xl bg-[#16130F]/95 border border-white/10 backdrop-blur-xl p-3 flex flex-col shadow-2xl gap-1">
          {NAV_ITEMS.map((item) => renderItem(item, true))}
          <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between px-3 py-1.5 text-xs text-stone-400">
            <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{streak.currentStreak} Day Streak</span>
            </div>
            <span className="text-[10px] text-stone-500 font-mono">
              Best: {streak.longestStreak}d
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
