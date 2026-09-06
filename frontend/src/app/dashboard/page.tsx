'use client';

import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Trophy, Briefcase, FolderGit2, Users, ShieldAlert, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { role, isAdmin } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-sky-100/40 dark:from-sky-950/20 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-semibold mb-3 inline-flex">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Active Role: {role.toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student & Team Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access your cohort features, submit capstone projects, and explore upcoming deadlines.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/hackathons"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition shadow-sm"
          >
            <Trophy className="w-6 h-6 text-purple-500 mb-2" />
            <h3 className="font-bold text-sm">Hackathons</h3>
            <p className="text-xs text-slate-500 mt-0.5">Explore active challenges</p>
          </Link>
          <Link
            href="/placements"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition shadow-sm"
          >
            <Briefcase className="w-6 h-6 text-emerald-500 mb-2" />
            <h3 className="font-bold text-sm">Placements</h3>
            <p className="text-xs text-slate-500 mt-0.5">Verified hiring drives</p>
          </Link>
          <Link
            href="/projects"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition shadow-sm"
          >
            <FolderGit2 className="w-6 h-6 text-indigo-500 mb-2" />
            <h3 className="font-bold text-sm">Projects</h3>
            <p className="text-xs text-slate-500 mt-0.5">Submit capstones</p>
          </Link>
          <Link
            href="/members"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition shadow-sm"
          >
            <Users className="w-6 h-6 text-amber-500 mb-2" />
            <h3 className="font-bold text-sm">Team Roster</h3>
            <p className="text-xs text-slate-500 mt-0.5">Meet the cohort</p>
          </Link>
        </div>

        {isAdmin && (
          <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-500" />
                Administrative Access Enabled
              </h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5">
                You have permission to manage placements, publish hackathons, approve student projects, and trigger WhatsApp broadcasts.
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
            >
              Open Admin Dashboard
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
