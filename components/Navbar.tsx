// components/Navbar.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Bell, Sun, ChevronDown, LogOut, LayoutDashboard, Menu, X } from "lucide-react";

type NavItem = { label: string; href: string; ready: boolean };

// ready:false => shown greyed with a "Soon" badge, not clickable.
// Flip to true when the page is built on real data.
const NAV_ITEMS: NavItem[] = [
  { label: "My Learning", href: "/dashboard", ready: true },
  { label: "Courses", href: "/learn", ready: true },
  { label: "Practice Labs", href: "/practice", ready: false },
  { label: "Challenges", href: "/challenges", ready: false },
  { label: "Certifications", href: "/certifications", ready: false },
  { label: "Community", href: "/community", ready: false },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

  const handleLogout = async () => {
    setShowMenu(false);
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
        onClick={() => setShowMobile(false)}
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
        <Link href="/dashboard" className="flex items-center gap-2 group">
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
            onClick={() => setShowMobile(!showMobile)}
            className="lg:hidden w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/80"
          >
            {showMobile ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {showMobile && (
        <div className="lg:hidden mt-2 rounded-3xl bg-[#16130F]/95 border border-white/10 backdrop-blur-xl p-2 flex flex-col shadow-2xl">
          {NAV_ITEMS.map((item) => renderItem(item, true))}
        </div>
      )}
    </header>
  );
}