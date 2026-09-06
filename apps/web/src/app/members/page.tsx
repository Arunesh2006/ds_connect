'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Profile } from '@/types/api';
import { fetchMembers } from '@/lib/api';
import { UserCheck, Github, Linkedin, Mail, Tag, GraduationCap } from 'lucide-react';

export default function MembersPage() {
  const [members, setMembers] = useState<Profile[]>([]);

  useEffect(() => {
    fetchMembers().then(setMembers);
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-sky-950/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-700/50 text-sky-300 text-xs font-semibold mb-4">
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            Internal Directory
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Cohort Members
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Connect with your Data Science peers, explore skills, and collaborate on projects and competitions.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 rounded-xl p-6 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`}
                    alt={m.name}
                    className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{m.name}</h3>
                    <p className="text-xs text-sky-400 font-medium flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" /> Year {m.college_year || 3} Student
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                  {m.bio || 'Data Science student focusing on Machine Learning & Analytics.'}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {m.skills.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60 flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-slate-500" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                {m.github_handle && (
                  <a
                    href={`https://github.com/${m.github_handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
                {m.linkedin_url && (
                  <a
                    href={m.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1 transition"
                  >
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
                <a
                  href={`mailto:${m.email}`}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition ml-auto"
                >
                  <Mail className="w-3.5 h-3.5" /> Contact
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
