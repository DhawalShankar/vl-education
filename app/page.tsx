"use client";
import React, { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CourseExplorer from "@/components/CourseExplorer";
import Footer from "@/components/Footer";

export default function Home() {
  const explorerRef = useRef<HTMLDivElement>(null);

  const scrollToExplorer = () => {
    explorerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#0B0A08] text-white selection:bg-[#FF5500] selection:text-white">
      {/* Floating Pill Header */}
      <Navbar />

      {/* Hero Section matching VartaLang Brand Screenshot */}
      <Hero onExploreClick={scrollToExplorer} />

      {/* Course Explorer with 3-Tier Hierarchy */}
      <div ref={explorerRef}>
        <CourseExplorer />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
