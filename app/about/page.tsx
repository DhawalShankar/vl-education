"use client";
import Link from 'next/link';
import { ArrowLeft, Heart, Globe, Shield, Award, Users, BookOpen, Target } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const team = [
  { name: 'Priya Sharma', role: 'Co-founder & CEO', emoji: '👩‍💼', bg: 'from-amber-500 to-orange-500' },
  { name: 'Arjun Mehta', role: 'Co-founder & CTO', emoji: '👨‍💻', bg: 'from-blue-500 to-cyan-500' },
  { name: 'Kavya Nair', role: 'Head of Curriculum', emoji: '👩‍🏫', bg: 'from-purple-500 to-pink-500' },
  { name: 'Rohan Das', role: 'Head of AI & Labs', emoji: '👨‍🔬', bg: 'from-green-500 to-teal-500' },
];

const values = [
  { icon: Globe, title: 'Cultural Preservation', desc: 'Every language carries centuries of wisdom. We preserve and celebrate that heritage.', color: 'text-amber-400' },
  { icon: Users, title: 'Community First', desc: 'Language is inherently social. We build connections between learners and speakers.', color: 'text-blue-400' },
  { icon: Shield, title: 'Quality Standards', desc: 'Every resource is vetted by language experts and native speakers.', color: 'text-green-400' },
  { icon: Target, title: 'Exam Excellence', desc: 'We prepare learners not just to speak, but to excel in certifications and careers.', color: 'text-purple-400' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] relative overflow-hidden">
      <Navbar />

      {/* Background */}
      <div
        className="fixed inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 mb-6">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-amber-200">Our Mission</span>
          </div>
          <h1 className="font-kalam text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            About VartaLang
          </h1>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to preserve India's linguistic heritage by making world-class language education 
            accessible to everyone — from curious beginners to aspiring language professionals.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-20 p-10 rounded-3xl bg-stone-900/60 border border-stone-700/50">
          <h2 id="story" className="font-kalam text-4xl font-bold text-white mb-6">Our Story</h2>
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              VartaLang was born in 2024 from a simple frustration: despite India having 22 scheduled languages 
              and hundreds of dialects, quality language learning resources were fragmented, expensive, or simply 
              unavailable for most learners.
            </p>
            <p>
              Our founders — passionate linguists, educators, and technologists — set out to build a platform that 
              combines the structure of formal education with the flexibility of modern technology. The result is 
              VartaLang: a platform where a student in Chennai can learn Hindi for a government exam, a professional 
              in Delhi can master Tamil for a new assignment, and a diaspora family abroad can reconnect with their 
              mother tongue.
            </p>
            <p>
              Today, VartaLang serves learners across 6 languages with plans to expand to all 22 official Indian 
              languages, along with specialized exam preparation programs for IELTS, teacher certifications, and 
              government competitive examinations.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="font-kalam text-4xl font-bold text-white mb-10 text-center">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="p-7 rounded-2xl bg-stone-900/60 border border-stone-700/50 hover:border-amber-500/30 transition-all">
                  <Icon className={`w-8 h-8 ${val.color} mb-4`} />
                  <h3 className="font-kalam text-xl font-bold text-white mb-2">{val.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="font-kalam text-4xl font-bold text-white mb-10 text-center">The Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50 text-center hover:border-amber-500/30 transition-all">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.bg} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}>
                  {member.emoji}
                </div>
                <h3 className="font-kalam text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-stone-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: '6+', label: 'Languages', icon: Globe },
            { value: '500+', label: 'Learners', icon: Users },
            { value: '150+', label: 'Resources', icon: BookOpen },
            { value: '2024', label: 'Founded', icon: Award },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center p-6 rounded-2xl bg-stone-900/60 border border-stone-700/50">
                <Icon className="w-6 h-6 text-amber-400 mx-auto mb-3" />
                <div className="font-kalam text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-stone-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/learn"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold font-kalam text-lg transition-all hover:scale-105 shadow-2xl hover:shadow-amber-500/50"
          >
            Start Learning Today
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
