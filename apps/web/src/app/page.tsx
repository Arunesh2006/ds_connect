import Navbar from '@/components/Navbar';
import OpportunityCard from '@/components/OpportunityCard';
import { fetchOpportunities } from '@/lib/api';
import { Sparkles, Search, PlusCircle } from 'lucide-react';

export default async function Home() {
  const opportunities = await fetchOpportunities();

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Empowering Data Science Students
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Discover Events, Form Teams & Advance Your Tech Career
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            DS-Connect unifies hackathons, open-source internships, peer matchmaking, and placement resources into a single high-performance platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#explore"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-lg transition shadow-md shadow-indigo-600/20"
            >
              Explore Opportunities
            </a>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold px-6 py-3 rounded-lg border border-slate-700 transition flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              Post an Event
            </button>
          </div>
        </div>
      </section>

      {/* Opportunities Directory Section */}
      <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Active Opportunities</h2>
            <p className="text-sm text-slate-400">
              Fetched in real-time from the DS-Connect FastAPI backend & PostgreSQL database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events, skills, tags..."
                className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
              />
            </div>
          </div>
        </div>

        {opportunities.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400">No opportunities found or backend is syncing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
