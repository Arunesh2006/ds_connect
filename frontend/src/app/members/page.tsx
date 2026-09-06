'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Member, MemberCreate } from '@/types/api';
import { fetchMembers, createMember, deleteMember } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Users, PlusCircle, Search, Trash2, X } from 'lucide-react';

export default function MembersPage() {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeYear, setCollegeYear] = useState<number>(2);
  const [workingSection, setWorkingSection] = useState('Data Science');

  useEffect(() => {
    loadMembers();
  }, [search, yearFilter]);

  async function loadMembers() {
    setLoading(true);
    const yr = yearFilter === 'all' ? undefined : parseInt(yearFilter, 10);
    const data = await fetchMembers(search, undefined, yr);
    setMembers(data);
    setLoading(false);
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    await createMember({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@dsconnect.edu`,
      college_year: collegeYear,
      responsibility: workingSection,
      role: 'student',
    });
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setWorkingSection('Data Science');
    await loadMembers();
  }

  async function handleDelete(id: string, memberName: string) {
    if (!confirm(`Are you sure you want to remove ${memberName}?`)) return;
    await deleteMember(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-amber-100/40 dark:from-amber-950/20 to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-4">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            Cohort Roster & Team Leadership
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Team Members
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Directory of Data Science team members, academic batches, and working sections.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Search & Add Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or section..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Add Member
          </button>
        </div>

        {/* Member Cards (Name, Year, Working Section per prompt Section 6) */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">Loading team members...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-sm">
            No team members found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {members.map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-400/50 transition shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{m.name}</h3>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        title="Remove member"
                        className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-1">
                    {m.college_year ? `${m.college_year}${m.college_year === 1 ? 'st' : m.college_year === 2 ? 'nd' : m.college_year === 3 ? 'rd' : 'th'} Year` : 'Faculty / Lead'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md inline-block">
                    {m.responsibility || 'Data Science'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Team Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lakshya Saini"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. lakshya@dsconnect.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Year *</label>
                <select
                  value={collegeYear}
                  onChange={(e) => setCollegeYear(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Working Section *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Science, Event Lead, Hackathon Coordinator"
                  value={workingSection}
                  onChange={(e) => setWorkingSection(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg"
                >
                  Add to Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
