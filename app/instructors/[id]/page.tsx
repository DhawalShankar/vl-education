// app/instructors/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Globe, GraduationCap, Layers, Linkedin, Twitter, Users, Youtube, type LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { instructorAPI, learnAPI } from "@/app/lib/api";
import type { CourseCard, InstructorPublicProfile } from "@/app/lib/api";
import { slugify } from "@/app/lib/languages";

// Only https:// image URLs are rendered (FR-2.6). Anything else falls back to initials.
const isHttps = (v?: string | null): v is string => !!v && /^https:\/\//i.test(v.trim());
// Social links must be http(s) so a "javascript:" URL can never become a link
const isHttp = (v?: string | null): v is string => !!v && /^https?:\/\//i.test(v.trim());

function Avatar({ name, url }: { name: string; url?: string | null }) {
    const [failed, setFailed] = useState(false);
    const initial = name?.trim()?.[0]?.toUpperCase() ?? "?";

    if (isHttps(url) && !failed) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={url}
                alt={name}
                onError={() => setFailed(true)}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-amber-500/30 shrink-0"
            />
        );
    }
    return (
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 border-2 border-amber-500/30 flex items-center justify-center text-amber-300 font-kalam text-5xl font-bold shrink-0">
            {initial}
        </div>
    );
}

function Stat({ icon: Icon, value, label }: { icon: LucideIcon; value: string | number; label: string }) {
    return (
        <div className="px-5 py-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center gap-3">
            <Icon className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
                <p className="font-kalam text-2xl font-bold tabular-nums leading-none">{value}</p>
                <p className="text-xs text-stone-500 mt-1">{label}</p>
            </div>
        </div>
    );
}

/* ═══════════════════════════ PAGE ═══════════════════════════ */
export default function PublicInstructorPage() {
    const params = useParams<{ id: string }>();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [profile, setProfile] = useState<InstructorPublicProfile | null>(null);
    const [courses, setCourses] = useState<CourseCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        let alive = true;
        setLoading(true);
        setError(null);

        // The profile call 404s unless this instructor has a published course
        instructorAPI
            .publicProfile(id)
            .then(async (p) => {
                if (!alive) return;
                setProfile(p);
                // A failing course list should not hide the profile itself
                const list = await learnAPI.courses({ instructor_id: id }).catch(() => [] as CourseCard[]);
                if (alive) setCourses(list.filter((c) => c.status === "published"));
            })
            .catch((e) => alive && setError(e instanceof Error ? e.message : "Not found"))
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, [id]);

    const socials = profile
        ? ([
            { href: profile.website, label: "Website", icon: Globe },
            { href: profile.youtube, label: "YouTube", icon: Youtube },
            { href: profile.linkedin, label: "LinkedIn", icon: Linkedin },
            { href: profile.twitter, label: "X / Twitter", icon: Twitter },
        ] as const).filter((s) => isHttp(s.href))
        : [];

    const totalStudents = courses.reduce((a, c) => a + (c.enrolled_count || 0), 0);
    const totalLessons = courses.reduce((a, c) => a + (c.lessons_count || 0), 0);

    return (
        <div className="min-h-screen bg-[#0a0908] text-white flex flex-col justify-between">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20 w-full">
                {loading ? (
                    <div className="space-y-6">
                        <div className="h-44 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-48 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : !profile ? (
                    <div className="p-16 rounded-3xl bg-stone-900/40 border border-stone-800 text-center max-w-xl mx-auto">
                        <GraduationCap className="w-10 h-10 mx-auto mb-4 text-amber-400/50" />
                        <h1 className="font-kalam text-3xl font-bold mb-2">Instructor not found</h1>
                        <p className="text-sm text-stone-400 mb-6">
                            This page is only available while the instructor has a live course.
                            {error && error !== "Not found" ? ` (${error})` : ""}
                        </p>
                        <Link
                            href="/learn"
                            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold text-sm"
                        >
                            Browse courses
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <section className="p-6 sm:p-10 rounded-3xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
                            <Avatar name={profile.name} url={profile.avatarUrl} />
                            <div className="min-w-0 text-center sm:text-left">
                                <h1 className="font-kalam text-4xl sm:text-5xl font-bold tracking-tight">{profile.name}</h1>
                                {profile.title && <p className="text-amber-300/90 text-sm mt-1">{profile.title}</p>}

                                {(profile.languages?.length ?? 0) > 0 && (
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                                        {profile.languages.map((l) => (
                                            <span key={l} className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 text-xs">
                                                {l}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {socials.length > 0 && (
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-5">
                                        {socials.map(({ href, label, icon: Icon }) => (
                                            <a
                                                key={label}
                                                href={href!.trim()}
                                                target="_blank"
                                                rel="noopener noreferrer nofollow"
                                                className="px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                            >
                                                <Icon className="w-3.5 h-3.5" /> {label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Stats */}
                        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                            <Stat icon={BookOpen} value={courses.length} label={courses.length === 1 ? "Course" : "Courses"} />
                            <Stat icon={Users} value={totalStudents} label="Students" />
                            <Stat icon={Layers} value={totalLessons} label="Lessons" />
                            <Stat icon={GraduationCap} value={profile.experienceYears ?? 0} label="Years teaching" />
                        </section>

                        {/* Bio */}
                        {profile.bio?.trim() && (
                            <section className="mt-10">
                                <h2 className="font-kalam text-2xl font-bold mb-3">About</h2>
                                <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>
                            </section>
                        )}

                        {/* Courses */}
                        <section className="mt-10">
                            <h2 className="font-kalam text-2xl font-bold mb-4">Courses by {profile.name.split(" ")[0]}</h2>
                            {courses.length === 0 ? (
                                <p className="text-sm text-stone-500">No courses to show right now.</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {courses.map((c) => (
                                        <Link
                                            key={c.id}
                                            href={`/learn/${slugify(c.language)}/${c.id}`}
                                            className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 flex flex-col justify-between transition-all"
                                        >
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px]">
                                                    <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300">{c.language}</span>
                                                    <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 capitalize">{c.level}</span>
                                                </div>
                                                <h3 className="font-kalam text-2xl font-bold leading-snug group-hover:text-amber-300 transition-colors">
                                                    {c.title}
                                                </h3>
                                                {c.description && <p className="text-xs text-stone-400 line-clamp-2 mt-2">{c.description}</p>}
                                            </div>
                                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-stone-800/80 text-xs">
                                                <span className="text-stone-500">
                                                    {c.lessons_count} lesson{c.lessons_count === 1 ? "" : "s"} · {c.enrolled_count} enrolled
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-bold">
                                                    {c.is_free ? "Free" : `₹${c.price}`}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}