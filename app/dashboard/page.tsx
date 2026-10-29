// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const auth = useAuth();
  const router = useRouter();
  const user = auth?.user;
  const loading = auth?.loading ?? true;

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="text-amber-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await auth?.logout();
    router.replace("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0908] text-white">
      <div className="border-b border-stone-800/50 bg-stone-900/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold">VartaLang</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/20 capitalize">
            {user.role}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm font-bold">
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-stone-400 text-sm hidden sm:block">{user.full_name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-stone-500 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.full_name} 👋</h1>
        <p className="text-stone-500 text-sm mb-8">{user.email}</p>

        <div className="bg-stone-900/40 border border-stone-700/50 rounded-2xl p-10 text-center text-stone-500">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-amber-400/30" />
          <p>Your courses will appear here.</p>
        </div>
      </div>
    </div>
  );
}