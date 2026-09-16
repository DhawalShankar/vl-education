"use client";
import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const openings = [
  { title: 'Senior Frontend Engineer', team: 'Engineering', type: 'Full-time', location: 'Remote / Mumbai', emoji: '💻' },
  { title: 'Curriculum Designer — Hindi', team: 'Education', type: 'Full-time', location: 'Remote', emoji: '📚' },
  { title: 'Curriculum Designer — Tamil', team: 'Education', type: 'Full-time', location: 'Remote', emoji: '🌴' },
  { title: 'AI/ML Engineer', team: 'Engineering', type: 'Full-time', location: 'Bangalore / Remote', emoji: '🤖' },
  { title: 'Community Manager', team: 'Growth', type: 'Full-time', location: 'Remote', emoji: '🤝' },
  { title: 'Language Expert (Freelance)', team: 'Education', type: 'Freelance', location: 'Remote', emoji: '✍️' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden">
      <Navbar />
      <div className="fixed inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-200">We're Hiring</span>
          </div>
          <h1 className="font-kalam text-5xl md:text-6xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto">
            Help us preserve India's linguistic heritage. We're a remote-first team passionate about education, technology, and languages.
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {openings.map((job, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl w-12 h-12 flex items-center justify-center">{job.emoji}</div>
                <div>
                  <h3 className="font-kalam text-lg font-bold text-white group-hover:text-amber-200 transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-stone-500 flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.team}</span>
                    <span className="text-xs text-stone-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="text-xs text-stone-500 flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                  </div>
                </div>
              </div>
              <a
                href="mailto:careers@vartalang.com"
                className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-sm font-semibold font-kalam transition-all"
              >
                Apply <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <div className="text-center p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50">
          <h2 className="font-kalam text-3xl font-bold text-white mb-3">Don't See Your Role?</h2>
          <p className="text-stone-400 mb-6">We're always looking for talented people. Send us your CV and tell us how you'd contribute.</p>
          <a href="mailto:careers@vartalang.com" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl font-kalam transition-all hover:scale-105">
            Send Open Application <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
