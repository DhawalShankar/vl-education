"use client";

import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Globe,
  Award,
  Shield,
  Heart
} from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Our Story', href: '#story' },
    { label: 'Careers', href: '#careers' },
    { label: 'Press Kit', href: '#press' },
    { label: 'Blog', href: '#blog' }
  ];

  const languages = [
    { label: 'Hindi', href: '#hindi' },
    { label: 'English', href: '#english' },
    { label: 'Tamil', href: '#tamil' },
    { label: 'Telugu', href: '#telugu' },
    { label: 'Bengali', href: '#bengali' },
    { label: 'View All 22+', href: '#all' }
  ];

  const resources = [
    { label: 'Learning Paths', href: '#paths' },
    { label: 'Practice Labs', href: '#labs' },
    { label: 'Exam Preparation', href: '#exams' },
    { label: 'Teacher Resources', href: '#teachers' },
    { label: 'Help Center', href: '#help' }
  ];

  const legal = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'Accessibility', href: '#accessibility' }
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' }
  ];

  return (
    <footer className="relative bg-stone-950 border-t-2 border-amber-500/20">
      {/* Blackboard Texture */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/logo.png" 
                  alt="VartaLang Logo" 
                  className="w-12 h-12 object-contain drop-shadow-lg"
                />
                <h3 className="font-kalam text-3xl font-bold text-white">
                  VartaLang
                </h3>
              </div>
              
              <p className="text-stone-400 mb-6 leading-relaxed text-sm">
                Preserving India's linguistic heritage through world-class education. 
                Master any language with AI-powered labs, curated curriculums, and 
                exceptional mentor support.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-900/60 border border-stone-700/50 rounded-lg">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-stone-300 font-semibold">ISO Certified</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-900/60 border border-stone-700/50 rounded-lg">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-stone-300 font-semibold">Expert Curated</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/50 flex items-center justify-center transition-all hover:scale-110 group"
                    >
                      <Icon className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="font-kalam text-xl font-bold text-white mb-6">Company</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-stone-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div className="lg:col-span-2">
              <h4 className="font-kalam text-xl font-bold text-white mb-6">Languages</h4>
              <ul className="space-y-3">
                {languages.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-stone-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="lg:col-span-2">
              <h4 className="font-kalam text-xl font-bold text-white mb-6">Resources</h4>
              <ul className="space-y-3">
                {resources.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-stone-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h4 className="font-kalam text-xl font-bold text-white mb-6">Contact</h4>
              <ul className="space-y-4">
                <li>
                  <a 
                    href="mailto:hello@vartalang.com"
                    className="text-stone-400 hover:text-amber-400 transition-colors text-sm flex items-start gap-3 group"
                  >
                    <Mail className="w-4 h-4 mt-0.5 text-amber-400" />
                    <span>hello@vartalang.com</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+911234567890"
                    className="text-stone-400 hover:text-amber-400 transition-colors text-sm flex items-start gap-3 group"
                  >
                    <Phone className="w-4 h-4 mt-0.5 text-amber-400" />
                    <span>+91 123 456 7890</span>
                  </a>
                </li>
                <li className="text-stone-400 text-sm flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                  <span>Mumbai, Maharashtra<br />India</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Newsletter Section */}
          <div className="border-t border-stone-800/50 pt-12 pb-8">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h3 className="font-kalam text-3xl font-bold text-white mb-3">
                Stay Connected
              </h3>
              <p className="text-stone-400 mb-6">
                Get the latest updates on new languages, features, and learning resources
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 bg-stone-900/60 border border-stone-700/50 rounded-full text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <button 
                  type="submit"
                  className="px-8 py-3 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-full transition-all hover:shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2 font-kalam"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-stone-800/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Copyright */}
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <span>© 2026 VartaLang. Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>in India</span>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center gap-6">
                {legal.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-stone-500 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-stone-500" />
                <select className="bg-transparent border border-stone-700/50 rounded-lg px-3 py-1.5 text-stone-400 text-sm focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer">
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="ta">தமிழ்</option>
                  <option value="te">తెలుగు</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-8 text-center">
            <p className="text-xs text-stone-600 font-kalam italic">
              "Preserving India's Linguistic Heritage Through Modern Education"
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}