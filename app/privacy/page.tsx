"use client";
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden">
      <Navbar />
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`, backgroundSize: 'cover' }} />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><span className="text-sm">Back to Home</span>
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center"><Shield className="w-6 h-6 text-amber-400" /></div>
          <div>
            <p className="text-stone-500 text-sm">Last updated: September 2026</p>
            <h1 className="font-kalam text-4xl font-bold text-white">Privacy Policy</h1>
          </div>
        </div>
        <div className="prose prose-invert max-w-none space-y-8 text-stone-300">
          {[
            { title: '1. Information We Collect', body: 'We collect information you provide during registration (name, email, role) and usage data such as courses accessed, progress markers, and learning preferences. We do not sell your personal data to third parties.' },
            { title: '2. How We Use Your Information', body: 'Your data is used to personalize your learning experience, save course progress, send important platform updates, and improve our services. We may use anonymized, aggregated data for analytics.' },
            { title: '3. Data Storage & Security', body: 'All data is stored securely using industry-standard encryption. Access tokens are stored in localStorage and refresh tokens are used to maintain sessions. You can log out at any time to invalidate your session.' },
            { title: '4. Cookies', body: 'We use essential cookies to maintain your login session. We do not currently use tracking or advertising cookies. You can review our Cookie Policy for more details.' },
            { title: '5. Your Rights', body: 'You have the right to access, correct, or delete your personal data. To exercise these rights or make any privacy-related request, contact us at privacy@vartalang.com.' },
            { title: '6. Contact', body: 'For privacy concerns, write to us at privacy@vartalang.com. We aim to respond within 72 hours.' },
          ].map((s, i) => (
            <div key={i}>
              <h2 className="font-kalam text-2xl font-bold text-white mb-3">{s.title}</h2>
              <p className="leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
