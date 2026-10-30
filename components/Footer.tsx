"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  const platformLinks = [
    { label: "Courses", href: "/learn" },
    { label: "Practice Labs", href: "/practice" },
    { label: "Challenges", href: "/challenges" },
    { label: "Certifications", href: "/certifications" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Community", href: "/community" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Help Center", href: "/help" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  const socialLinks = [
    {
      name: "X (Twitter)",
      handle: "@vartalang",
      href: "https://x.com/vartalang",
      icon: Twitter,
    },
    {
      name: "Instagram",
      handle: "@vartalang",
      href: "https://instagram.com/vartalang",
      icon: Instagram,
    },
    {
      name: "YouTube",
      handle: "@vartalang",
      href: "https://youtube.com/@vartalang",
      icon: Youtube,
    },
    {
      name: "LinkedIn",
      handle: "@vartalang",
      href: "https://linkedin.com/company/vartalang",
      icon: Linkedin,
    },
    {
      name: "Facebook",
      handle: "@vartalang",
      href: "https://facebook.com/vartalang",
      icon: Facebook,
    },
  ];

  return (
    <footer className="relative bg-[#070605] border-t border-stone-800/80 text-stone-300">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-stone-800/70">
          
          {/* Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="VartaLang Logo"
                className="h-10 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="font-kalam text-2xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                VartaLang
              </span>
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Preserving India&apos;s rich linguistic heritage through modern, AI-powered
              language education. An initiative by Cosmo India Prakashan.
            </p>

            {/* Social Handles */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-stone-400">Social</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  @vartalang
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${social.name}: ${social.handle}`}
                      aria-label={`${social.name}: ${social.handle}`}
                      className="w-9 h-9 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800/80 text-stone-400 hover:text-amber-400 flex items-center justify-center transition-all hover:scale-105"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-kalam text-lg font-bold text-white mb-4 tracking-wide">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-kalam text-lg font-bold text-white mb-4 tracking-wide">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-kalam text-lg font-bold text-white mb-4 tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:support@cosmoindiaprakashan.in"
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-start gap-2.5 group"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                  <span className="break-all">support@cosmoindiaprakashan.in</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+917388270331"
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>+91 73882 70331</span>
                </a>
              </li>
              <li className="text-stone-400 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <span>Kanpur, Uttar Pradesh, India</span>
              </li>
              <li>
                <a
                  href="https://vartalang.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-2.5 group"
                >
                  <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>vartalang.in</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>© 2026 VartaLang · Cosmo India Prakashan. Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>in India</span>
          </div>

          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-stone-500 hover:text-amber-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
