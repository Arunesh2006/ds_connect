import Navbar from '@/components/Navbar';
import OpportunitiesExplorer from '@/components/OpportunitiesExplorer';
import { fetchOpportunities } from '@/lib/api';
import { Sparkles, Users, FolderGit2, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const initialOpportunities = await fetchOpportunities();

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-indigo-950/20 via-slate-950/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            DS-Connect • Internal Cohort & Team Portal
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Data Science Team & Cohort Platform
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Centralized resources for our Data Science students: curated hackathon opportunities, internal team formation, project showcase portfolios, and verified placement tracking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#explore"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/25"
            >
              Curated Events ↓
            </Link>
            <Link
              href="/team-matching"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold px-6 py-3 rounded-xl border border-slate-800 transition flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-purple-400" />
              Team Matcher
            </Link>
            <Link
              href="/projects"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold px-6 py-3 rounded-xl border border-slate-800 transition flex items-center gap-2"
            >
              <FolderGit2 className="w-4 h-4 text-amber-400" />
              Project Showcase
            </Link>
            <Link
              href="/placements"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold px-6 py-3 rounded-xl border border-slate-800 transition flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              Placements
            </Link>
          </div>
        </div>
      </section>

      <OpportunitiesExplorer initialOpportunities={initialOpportunities} />
    </main>
  );
}
