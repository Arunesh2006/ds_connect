'use client';

import Link from 'next/link';
import { Sparkles, Calendar, Users, Briefcase, Award } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>DS<span className="text-indigo-400">-Connect</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="flex items-center gap-1.5 hover:text-white transition">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Opportunities
          </Link>
          <Link href="#teams" className="flex items-center gap-1.5 hover:text-white transition">
            <Users className="w-4 h-4 text-purple-400" />
            Team Matcher
          </Link>
          <Link href="#projects" className="flex items-center gap-1.5 hover:text-white transition">
            <Award className="w-4 h-4 text-amber-400" />
            Projects
          </Link>
          <Link href="#placements" className="flex items-center gap-1.5 hover:text-white transition">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Placements
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700 transition"
          >
            FastAPI Docs ↗
          </a>
          <button className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition shadow-sm">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
