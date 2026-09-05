import Navbar from '@/components/Navbar';
import OpportunitiesExplorer from '@/components/OpportunitiesExplorer';
import { fetchOpportunities } from '@/lib/api';
import { Sparkles, Users, Award, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const initialOpportunities = await fetchOpportunities();

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-indigo-950/25 via-slate-950/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Connecting 5,000+ Data Science Students
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Find Hackathons, Build Teams & Accelerate Your Career
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            DS-Connect unifies data science competitions, project collaboration, teammate search, and verified placement tracking into a single low-latency platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#explore"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/25"
            >
              Explore Opportunities ↓
            </a>
            <Link
              href="/team-matching"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold px-6 py-3 rounded-xl border border-slate-800 transition flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-purple-400" />
              Find Teammates
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-800/60 text-left">
            <div className="p-3">
              <p className="text-2xl font-bold text-white">50+</p>
              <p className="text-xs text-slate-400">Curated Events</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-indigo-400">100%</p>
              <p className="text-xs text-slate-400">Student Verified</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-purple-400">200+</p>
              <p className="text-xs text-slate-400">Formed Teams</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-emerald-400">DPDP</p>
              <p className="text-xs text-slate-400">Privacy Compliant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Opportunities Explorer */}
      <OpportunitiesExplorer initialOpportunities={initialOpportunities} />
    </main>
  );
}
