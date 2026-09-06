'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Hackathon } from '@/types/api';
import { fetchHackathons, publishWhatsApp } from '@/lib/api';
import {
  Trophy,
  Calendar,
  MapPin,
  Tag,
  ExternalLink,
  MessageCircle,
  Check,
  Search,
  Users
} from 'lucide-react';

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadHackathons();
  }, [search, modeFilter]);

  async function loadHackathons() {
    setLoading(true);
    const data = await fetchHackathons(search, modeFilter);
    setHackathons(data);
    setLoading(false);
  }

  async function handleShareWhatsApp(h: Hackathon) {
    try {
      const res = await publishWhatsApp('hackathon', h.id);
      if (navigator.clipboard && res.formatted_text) {
        await navigator.clipboard.writeText(res.formatted_text);
      }
      setCopiedId(h.id);
      setTimeout(() => setCopiedId(null), 3000);
      window.open(res.share_url, '_blank');
    } catch (err) {
      console.error('WhatsApp share error:', err);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-sky-100/40 dark:from-sky-950/20 to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-semibold mb-4">
            <Trophy className="w-3.5 h-3.5 text-sky-500" />
            Competitions & Innovation Sprints
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Hackathons & Challenges
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Curated machine learning competitions, Kaggle olympiads, and university hackathons with 1-click WhatsApp community broadcast.
          </p>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            {['all', 'Online', 'In-Person', 'Hybrid'].map((mode) => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  modeFilter === mode
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode === 'all' ? 'All Modes' : mode}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hackathons, organizer, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </section>

      {/* Hackathons Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading curated hackathons...</div>
        ) : hackathons.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md mx-auto shadow-sm">
            <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Hackathons Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search or mode filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((h) => (
              <div
                key={h.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400/60 dark:hover:border-sky-500/50 rounded-2xl p-6 transition flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                      {h.mode || 'Online'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Due: {new Date(h.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {h.title}
                  </h3>
                  <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-3">
                    Organized by {h.organizer}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 rounded">
                      🏆 {h.prize_pool || '$50,000 USD'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {h.team_size || '1-4'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {h.location || 'Online'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-5 leading-relaxed">
                    {h.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {h.tags?.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {h.external_link ? (
                    <a
                      href={h.external_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      Register <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Open Participation</span>
                  )}

                  <button
                    onClick={() => handleShareWhatsApp(h)}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    {copiedId === h.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Opening WhatsApp!</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>Post to WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
