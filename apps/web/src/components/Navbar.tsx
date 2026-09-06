'use client';

import Link from 'next/link';
import { Sparkles, Calendar, Users, FolderGit2, Briefcase, UserCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>DS<span className="text-indigo-400">-Connect</span></span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700 text-indigo-300 ml-1">Cohort</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="flex items-center gap-1.5 hover:text-white transition">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Opportunities
          </Link>
          <Link href="/team-matching" className="flex items-center gap-1.5 hover:text-white transition">
            <Users className="w-4 h-4 text-purple-400" />
            Team Matcher
          </Link>
          <Link href="/projects" className="flex items-center gap-1.5 hover:text-white transition">
            <FolderGit2 className="w-4 h-4 text-amber-400" />
            Projects Showcase
          </Link>
          <Link href="/placements" className="flex items-center gap-1.5 hover:text-white transition">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Placements & Wins
          </Link>
          <Link href="/members" className="flex items-center gap-1.5 hover:text-white transition">
            <UserCheck className="w-4 h-4 text-sky-400" />
            Cohort Members
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/members"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            My Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
