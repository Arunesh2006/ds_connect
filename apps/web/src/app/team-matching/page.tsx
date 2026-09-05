import Navbar from '@/components/Navbar';
import { fetchTeamRequests } from '@/lib/api';
import { Users, Sparkles, Tag, CheckCircle2, UserCheck, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function TeamMatchingPage() {
  const requests = await fetchTeamRequests();

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-purple-950/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 text-xs font-semibold mb-4">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            Peer Matchmaking
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Team Matcher
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Don't compete alone. Join existing teams or find peers with matching skills for Kaggle, Smart India Hackathon, and open-source challenges.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Open Team Requests ({requests.length})</h2>
            <p className="text-xs text-slate-400">Students actively looking for teammates.</p>
          </div>
          <Link
            href="/"
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            ← Back to Opportunities
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            No team requests posted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-xl p-6 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {req.role_needed}
                    </span>
                    <span className="text-xs text-slate-400">
                      Team: {req.current_members_count} / {req.max_members} members
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{req.title}</h3>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {req.skills_required.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60 flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3 text-slate-500" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Open to Join
                  </span>

                  <button className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-1.5 shadow-sm">
                    <MessageSquare className="w-3.5 h-3.5" /> Request to Join
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
