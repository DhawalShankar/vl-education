"use client";

import { useState, useEffect } from 'react';
import { BookOpen, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      label: 'Languages',
      hasDropdown: true,
      items: [
        { label: 'Hindi', icon: '📚' },
        { label: 'English', icon: '🌍' },
        { label: 'Tamil', icon: '📖' },
        { label: 'Telugu', icon: '✍️' },
        { label: 'Bengali', icon: '📝' },
        { label: 'View All 22+', icon: '🎓', highlight: true }
      ]
    },
    {
      label: 'Learning Paths',
      hasDropdown: true,
      items: [
        { label: 'Foundation Path', icon: '🚀' },
        { label: 'Professional Path', icon: '💼' },
        { label: 'Mastery Path', icon: '🎓' }
      ]
    },
    { label: 'Practice Labs', href: '#labs' },
    { label: 'Exam Prep', href: '#exams' },
    { label: 'About', href: '#about' }
  ];

  return (
    <>
      {/* Main Navbar Container */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Logo - Transitions from center to left */}
          <div 
            className={`fixed transition-all duration-700 ease-out ${
              isScrolled 
                ? 'left-8 top-4 opacity-100 translate-x-0' 
                : 'left-1/2 top-6 opacity-0 -translate-x-1/2 pointer-events-none'
            }`}
          >
            <div className="flex items-center space-x-3 cursor-pointer group px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="VartaLang Logo" 
                  className="w-15 object-contain drop-shadow-lg group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h1 className="font-kalam text-2xl font-bold text-white drop-shadow-lg">
                  VartaLang
                </h1>
              </div>
            </div>
          </div>

          {/* Contact Button - Transitions from center to right */}
          <div 
            className={`fixed hidden lg:block transition-all duration-700 ease-out ${
              isScrolled 
                ? 'right-8 top-4 opacity-100 translate-x-0' 
                : 'right-1/2 top-6 opacity-0 translate-x-1/2 pointer-events-none'
            }`}
          >
            <button className="group relative px-8 py-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_24px_rgba(249,115,22,0.5)] hover:scale-[1.02] flex items-center space-x-2 font-kalam text-base">
              <span>Contact</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Center Pill - Contains logo, nav, and contact button */}
          <div className="flex justify-center">
            <div className={`relative transition-all duration-500 ease-out backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-full border border-white/10 ${
              isScrolled ? 'bg-black/40' : 'bg-white/10'
            }`}>
              <div className="flex items-center justify-between px-6 h-16 gap-4">
                {/* Logo - Visible when NOT scrolled */}
                <div 
                  className={`flex items-center space-x-3 cursor-pointer group transition-all duration-700 ease-out ${
                    isScrolled 
                      ? 'opacity-0 w-0 overflow-hidden pointer-events-none' 
                      : 'opacity-100 w-auto'
                  }`}
                >
                  <div className="relative">
                    <img 
                      src="/logo.png" 
                      alt="VartaLang Logo" 
                      className="w-15 object-contain drop-shadow-lg group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h1 className="font-kalam text-2xl font-bold text-white drop-shadow-lg whitespace-nowrap">
                      VartaLang
                    </h1>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-2">
                  {navLinks.map((link, index) => (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.hasDropdown ? (
                        <>
                          <button className="px-6 py-2.5 text-white hover:text-amber-300 font-bold transition-all duration-200 flex items-center space-x-1 group rounded-full hover:bg-white/10 font-kalam text-base">
                            <span>{link.label}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                              activeDropdown === link.label ? 'rotate-180' : ''
                            }`} />
                          </button>
                          
                          {activeDropdown === link.label && (
                            <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                              {link.items?.map((item, idx) => (
                                <button
                                  key={idx}
                                  className={`w-full text-left px-5 py-3.5 text-stone-700 hover:text-amber-600 hover:bg-amber-50/50 transition-all flex items-center space-x-3 border-b border-stone-100 last:border-0 font-kalam ${
                                    item.highlight ? 'bg-linear-to-r from-amber-50 to-orange-50 font-semibold' : ''
                                  }`}
                                >
                                  <span className="text-xl">{item.icon}</span>
                                  <span className="text-sm">{item.label}</span>
                                </button>
                              ))}
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

                {/* Contact Button - Visible when NOT scrolled */}
                <div 
                  className={`hidden lg:block transition-all duration-700 ease-out ${
                    isScrolled 
                      ? 'opacity-0 w-0 overflow-hidden pointer-events-none' 
                      : 'opacity-100 w-auto'
                  }`}
                >
                  <button className="group relative px-8 py-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_24px_rgba(249,115,22,0.5)] hover:scale-[1.02] flex items-center space-x-2 font-kalam text-base whitespace-nowrap">
                    <span>Contact</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-white hover:text-amber-300 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 mx-4 bg-black/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 border border-white/10">
            <div className="px-6 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <div key={index}>
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                        className="w-full text-left px-4 py-3 text-white hover:text-amber-300 font-bold transition-all flex items-center justify-between rounded-xl hover:bg-white/10 font-kalam text-base"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === link.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {activeDropdown === link.label && (
                        <div className="mt-2 ml-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          {link.items?.map((item, idx) => (
                            <button
                              key={idx}
                              className="w-full text-left px-4 py-2.5 text-white/80 hover:text-amber-300 hover:bg-white/10 transition-all flex items-center space-x-3 text-sm rounded-lg font-kalam"
                            >
                              <span>{item.icon}</span>
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={link.href}
                      className="block px-4 py-3 text-white hover:text-amber-300 font-bold transition-all rounded-xl hover:bg-white/10 font-kalam text-base"
                    >
                      {link.label}
                    </a>
                  )}
                </div>
              ))}
              
              {/* Mobile Contact Button */}
              <div className="pt-4">
                <button className="w-full px-6 py-3.5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full shadow-lg flex items-center justify-center space-x-2 font-kalam text-base">
                  <span>Contact</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className={`transition-all duration-500 ${isScrolled ? 'h-24' : 'h-32'}`}></div>
    </>
  );
}