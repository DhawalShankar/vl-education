"use client";
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden">
      <Navbar />
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`, backgroundSize: 'cover' }} />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><span className="text-sm">Back to Home</span>
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><FileText className="w-6 h-6 text-blue-400" /></div>
          <div>
            <p className="text-stone-500 text-sm">Last updated: September 2026</p>
            <h1 className="font-kalam text-4xl font-bold text-white">Terms of Service</h1>
          </div>
        </div>
        <div className="space-y-8 text-stone-300">
          {[
            { title: '1. Acceptance of Terms', body: 'By accessing and using VartaLang, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.' },
            { title: '2. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.' },
            { title: '3. Acceptable Use', body: 'You agree not to misuse our services, including attempting to access other users\' accounts, uploading harmful content, or using the platform for any illegal activities.' },
            { title: '4. Intellectual Property', body: 'All content on VartaLang, including course materials, videos, PDFs, and audio resources, is curated by our team and protected by applicable intellectual property laws.' },
            { title: '5. Termination', body: 'We reserve the right to suspend or terminate accounts that violate these terms. You may also close your account at any time by contacting support.' },
            { title: '6. Changes to Terms', body: 'We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the updated terms.' },
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
