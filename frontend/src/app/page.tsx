'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Hackathon, Placement, Project, Member } from '@/types/api';
import { fetchHackathons, fetchPlacements, fetchProjects, fetchMembers } from '@/lib/api';
import {
  Trophy,
  Briefcase,
  FolderGit2,
  Users,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        const [hList, pList, prList, mList] = await Promise.all([
          fetchHackathons(),
          fetchPlacements(),
          fetchProjects(),
          fetchMembers()
        ]);
        setHackathons(hList.slice(0, 3));
        setPlacements(pList.slice(0, 3));
        setProjects(prList.slice(0, 3));
        setMembers(mList.slice(0, 4));
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-sky-100/50 via-white to-transparent dark:from-sky-950/30 dark:via-slate-900/40 dark:to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-700/60 text-sky-800 dark:text-sky-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            DS-Connect • Student Tech & Opportunity Hub
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            Data Science Team & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-400">
              Cohort Platform
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Centralized resources for our Data Science students: curated hackathon opportunities, verified placements, capstone project showcase, and peer leadership.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/hackathons"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-md shadow-sky-600/20 transition-all transform active:scale-95"
            >
              <Trophy className="w-4 h-4" />
              Explore Hackathons
            </Link>
            <Link
              href="/placements"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-sm transition shadow-sm"
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              View Placements
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-300 dark:border-slate-800 transition"
            >
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              Explore Projects
            </Link>
            <Link
              href="/members"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-300 dark:border-slate-800 transition"
            >
              <Users className="w-4 h-4 text-amber-400" />
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-10 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="text-center p-2">
            <span className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 block">4+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Hackathons</span>
          </div>
          <div className="text-center p-2 border-l border-slate-100 dark:border-slate-800">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 block">₹24.5 LPA</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Top Placement CTC</span>
          </div>
          <div className="text-center p-2 border-l border-slate-100 dark:border-slate-800">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 block">2</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Featured Projects</span>
          </div>
          <div className="text-center p-2 border-l border-slate-100 dark:border-slate-800">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 block">100%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">DPDP Consented</span>
          </div>
        </div>
      </section>

      {/* Latest Hackathons Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" /> Competitions & Sprints
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Latest Hackathons
            </h2>
          </div>
          <Link
            href="/hackathons"
            className="flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            View All ({hackathons.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hackathons.map((h) => (
            <div
              key={h.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400/50 transition flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
                    {h.mode || 'Online'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Due: {new Date(h.deadline).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{h.title}</h3>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mb-3">By {h.organizer}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {h.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{h.prize_pool || '$50K Pool'}</span>
                {h.external_link && (
                  <a
                    href={h.external_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    Register <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Placements Preview */}
      <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                <Briefcase className="w-4 h-4" /> Career Milestones
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Verified Placements & Offers
              </h2>
            </div>
            <Link
              href="/placements"
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Explore All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {placements.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
                      Class of {p.placement_year}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.company}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{p.role}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> DPDP Consented
                  </span>
                  {p.package_lpa && (
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {p.package_lpa} LPA
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section (Strictly simple: Name, Year, Working Section per prompt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" /> Team Roster
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Team Members
            </h2>
          </div>
          <Link
            href="/members"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            All Members <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400/50 transition shadow-sm"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{m.name}</h3>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-1">
                {m.college_year ? `${m.college_year}${m.college_year === 1 ? 'st' : m.college_year === 2 ? 'nd' : m.college_year === 3 ? 'rd' : 'th'} Year` : 'Faculty Advisor'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md font-medium inline-block">
                {m.responsibility || 'Data Science'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-950 text-center text-xs text-slate-500">
        <p>© 2026 DS-Connect — Data Science Student & Cohort Platform. Built with Next.js, FastAPI & Supabase.</p>
      </footer>
    </main>
  );
}
