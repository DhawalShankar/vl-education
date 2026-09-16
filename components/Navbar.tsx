"use client";

import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, ArrowRight, LogOut, User } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };

  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const auth = useAuth();
  const { user, logout, isAuthenticated, loading } = auth || {
    user: null, logout: async () => {}, isAuthenticated: false, loading: true,
  };
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // ─── Guest navigation (not logged in) ───────────────────────────────────────
  const guestLinks = [
    {
      label: 'Languages',
      hasDropdown: true,
      items: [
        { label: 'Hindi', icon: '📚', href: '/learn/hindi' },
        { label: 'English', icon: '🌍', href: '/learn/english' },
        { label: 'Tamil', icon: '📖', href: '/learn/tamil' },
        { label: 'Telugu', icon: '✍️', href: '/learn/telugu' },
        { label: 'Bengali', icon: '📝', href: '/learn/bengali' },
        { label: 'View All 22+', icon: '🎓', href: '/learn', highlight: true },
      ],
    },
    {
      label: 'Learning Paths',
      hasDropdown: true,
      items: [
        { label: 'Foundation Path', icon: '🚀', href: '/learn?path=foundation' },
        { label: 'Professional Path', icon: '💼', href: '/learn?path=professional' },
        { label: 'Mastery Path', icon: '🎓', href: '/learn?path=mastery' },
      ],
    },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
  ];

  // ─── Authenticated navigation ─────────────────────────────────────────────
  const authLinks = [
    {
      label: 'Languages',
      hasDropdown: true,
      items: [
        { label: 'Hindi', icon: '📚', href: '/learn/hindi' },
        { label: 'English', icon: '🌍', href: '/learn/english' },
        { label: 'Tamil', icon: '📖', href: '/learn/tamil' },
        { label: 'Telugu', icon: '✍️', href: '/learn/telugu' },
        { label: 'Bengali', icon: '📝', href: '/learn/bengali' },
        { label: 'View All 22+', icon: '🎓', href: '/learn', highlight: true },
      ],
    },
    { label: 'Learn', href: '/learn' },
    { label: 'Practice', href: '/practice' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  const navLinks = isAuthenticated ? authLinks : guestLinks;

  return (
    <>
      {/* ── Mobile Navbar ── */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Logo */}
            <a href="/" className="flex items-center space-x-3 cursor-pointer group">
              <img src="/logo.png" alt="VartaLang Logo" className="w-10 object-contain drop-shadow-lg" />
              <h1 className="font-kalam text-xl font-bold text-white drop-shadow-lg">VartaLang</h1>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-amber-300 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="bg-black/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <div key={index}>
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                        className="w-full text-left px-4 py-3 text-white hover:text-amber-300 font-bold transition-all flex items-center justify-between rounded-xl hover:bg-white/10 font-kalam text-base"
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === link.label && (
                        <div className="mt-2 ml-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          {link.items?.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="w-full text-left px-4 py-2.5 text-white/80 hover:text-amber-300 hover:bg-white/10 transition-all flex items-center space-x-3 text-sm rounded-lg font-kalam"
                            >
                              <span>{item.icon}</span>
                              <span>{item.label}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-white hover:text-amber-300 font-bold transition-all rounded-xl hover:bg-white/10 font-kalam text-base"
                    >
                      {link.label}
                    </a>
                  )}
                </div>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-stone-400 text-sm font-kalam">
                      Hi, <span className="text-amber-300 font-bold">{user?.name}</span>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full px-6 py-3.5 bg-stone-800 border border-stone-700 text-red-400 font-bold rounded-full flex items-center justify-center space-x-2 font-kalam text-base hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full px-6 py-3 border border-stone-600 text-stone-200 font-bold rounded-full font-kalam text-base hover:border-amber-500 transition-all mb-2">
                        Login
                      </button>
                    </a>
                    <a href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full shadow-lg flex items-center justify-center space-x-2 font-kalam text-base">
                        <span>Sign Up</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Desktop Navbar ── */}
      <nav className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Logo — top-left when scrolled */}
          <div className={`fixed transition-all duration-700 ease-out ${isScrolled ? 'left-8 top-4 opacity-100 translate-x-0' : 'left-1/2 top-6 opacity-0 -translate-x-1/2 pointer-events-none'}`}>
            <a href="/" className="flex items-center space-x-3 cursor-pointer group px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
              <img src="/logo.png" alt="VartaLang Logo" className="w-15 object-contain drop-shadow-lg group-hover:scale-105 transition-transform" />
              <h1 className="font-kalam text-2xl font-bold text-white drop-shadow-lg">VartaLang</h1>
            </a>
          </div>

          {/* Auth Buttons — top-right when scrolled */}
          <div className={`fixed transition-all duration-700 ease-out ${isScrolled ? 'right-8 top-4 opacity-100 translate-x-0' : 'right-1/2 top-6 opacity-0 translate-x-1/2 pointer-events-none'}`}>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-stone-300 text-sm font-kalam px-3 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
                  <User className="w-4 h-4 inline mr-1 text-amber-400" />{user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 bg-stone-900/80 border border-stone-700 text-red-400 hover:text-red-300 hover:border-red-500/50 font-bold rounded-full transition-all font-kalam text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/auth/login">
                  <button className="px-5 py-2.5 border border-stone-600 hover:border-amber-500 bg-black/40 backdrop-blur-xl text-stone-200 font-bold rounded-full transition-all font-kalam text-sm">
                    Login
                  </button>
                </a>
                <a href="/auth/login">
                  <button className="group relative px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_24px_rgba(249,115,22,0.5)] hover:scale-[1.02] flex items-center space-x-2 font-kalam text-base">
                    <span>Sign Up</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </a>
              </div>
            )}
          </div>

          {/* Center Pill */}
          <div className="flex justify-center">
            <div className={`relative transition-all duration-500 ease-out backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-full border border-white/10 ${isScrolled ? 'bg-black/40' : 'bg-white/10'}`}>
              <div className="flex items-center justify-between px-6 h-16 gap-4">

                {/* Logo — visible when NOT scrolled */}
                <div className={`flex items-center space-x-3 cursor-pointer group transition-all duration-700 ease-out ${isScrolled ? 'opacity-0 w-0 overflow-hidden pointer-events-none' : 'opacity-100 w-auto'}`}>
                  <a href="/" className="flex items-center space-x-3">
                    <img src="/logo.png" alt="VartaLang Logo" className="w-15 object-contain drop-shadow-lg group-hover:scale-105 transition-transform" />
                    <h1 className="font-kalam text-2xl font-bold text-white drop-shadow-lg whitespace-nowrap">VartaLang</h1>
                  </a>
                </div>

                {/* Desktop Navigation Links */}
                <div className="flex items-center space-x-2">
                  {navLinks.map((link, index) => (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => link.hasDropdown && openDropdown(link.label)}
                      onMouseLeave={closeDropdown}
                    >
                      {link.hasDropdown ? (
                        <>
                          <button className="px-6 py-2.5 text-white hover:text-amber-300 font-bold transition-all duration-200 flex items-center space-x-1 group rounded-full hover:bg-white/10 font-kalam text-base">
                            <span>{link.label}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                          </button>

                          {activeDropdown === link.label && (
                            <div
                              className="absolute top-full left-0 pt-3 w-64"
                              onMouseEnter={cancelClose}
                              onMouseLeave={closeDropdown}
                            >
                            <div className="bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                              {link.items?.map((item, idx) => (
                                <a
                                  key={idx}
                                  href={item.href}
                                  className={`w-full text-left px-5 py-3.5 text-stone-700 hover:text-amber-600 hover:bg-amber-50/50 transition-all flex items-center space-x-3 border-b border-stone-100 last:border-0 font-kalam ${item.highlight ? 'bg-gradient-to-r from-amber-50 to-orange-50 font-semibold' : ''}`}
                                >
                                  <span className="text-xl">{item.icon}</span>
                                  <span className="text-sm">{item.label}</span>
                                </a>
                              ))}
                            </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <a
                          href={link.href}
                          className="px-6 py-2.5 text-white hover:text-amber-300 font-bold transition-all duration-200 rounded-full hover:bg-white/10 block text-base font-kalam"
                        >
                          {link.label}
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {/* Auth Buttons in pill — visible when NOT scrolled */}
                <div className={`transition-all duration-700 ease-out ${isScrolled ? 'opacity-0 w-0 overflow-hidden pointer-events-none' : 'opacity-100 w-auto'}`}>
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <span className="text-stone-300 text-sm font-kalam whitespace-nowrap">
                        <User className="w-4 h-4 inline mr-1 text-amber-400" />{user?.name}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2.5 bg-stone-900/60 border border-stone-700 text-red-400 hover:text-red-300 hover:border-red-500/50 font-bold rounded-full transition-all font-kalam text-sm whitespace-nowrap"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <a href="/auth/login">
                        <button className="px-5 py-2.5 border border-stone-600 hover:border-amber-500 text-stone-200 font-bold rounded-full transition-all font-kalam text-sm whitespace-nowrap">
                          Login
                        </button>
                      </a>
                      <a href="/auth/login">
                        <button className="group relative px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_24px_rgba(249,115,22,0.5)] hover:scale-[1.02] flex items-center space-x-2 font-kalam text-base whitespace-nowrap">
                          <span>Sign Up</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16 lg:h-32"></div>
    </>
  );
}