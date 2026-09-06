'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Profile, ProfileCreate } from '@/types/api';
import { fetchMembers, createMember, deleteMember } from '@/lib/api';
import {
  UserCheck,
  Github,
  Linkedin,
  Mail,
  Tag,
  GraduationCap,
  Building2,
  ShieldCheck,
  Plus,
  X,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const COMMON_RESPONSIBILITIES = [
  'Event Lead',
  'Placements & Internships Head',
  'Hackathons & Competitions Coordinator',
  'Faculty Advisor / Department Head',
  'Projects & Open Source Lead',
  'Community & WhatsApp Broadcast Lead',
  'Research & Publications Mentor'
];

export default function MembersPage() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'faculty'>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<ProfileCreate>({
    name: '',
    email: '',
    role: 'student',
    college_year: 3,
    responsibility: '',
    bio: '',
    skills: [],
    github_handle: '',
    linkedin_url: ''
  });
  const [skillsInput, setSkillsInput] = useState('');

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await fetchMembers();
      setMembers(data);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      name: '',
      email: '',
      role: 'student',
      college_year: 3,
      responsibility: '',
      bio: '',
      skills: [],
      github_handle: '',
      linkedin_url: ''
    });
    setSkillsInput('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handlePresetResponsibility = (preset: string) => {
    setFormData(prev => ({ ...prev, responsibility: preset }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const parsedSkills = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload: ProfileCreate = {
        ...formData,
        college_year: formData.role === 'faculty' ? null : Number(formData.college_year) || 3,
        skills: parsedSkills.length > 0 ? parsedSkills : ['Data Science'],
        github_handle: formData.github_handle?.trim() || undefined,
        linkedin_url: formData.linkedin_url?.trim() || undefined,
        bio: formData.bio?.trim() || (formData.role === 'faculty' ? 'College Faculty in Data Science.' : 'Data Science student focusing on ML & AI.')
      };

      await createMember(payload);
      await loadMembers();
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the cohort directory?`)) return;
    try {
      await deleteMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert('Failed to delete member.');
    }
  };

  // Filtered members
  const filteredMembers = members.filter(m => {
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !query ||
      m.name.toLowerCase().includes(query) ||
      (m.responsibility && m.responsibility.toLowerCase().includes(query)) ||
      m.skills.some(s => s.toLowerCase().includes(query)) ||
      m.email.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  const studentCount = members.filter(m => m.role === 'student').length;
  const facultyCount = members.filter(m => m.role === 'faculty').length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      {/* Header Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-sky-950/30 via-slate-900/30 to-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-700/50 text-sky-300 text-xs font-semibold mb-3">
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              Cohort Directory & Team Roster
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Cohort Members & Leads
            </h1>
            <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-2">
              Internal directory of Data Science students and college faculty, tracking assigned leadership responsibilities across competitions, placements, and events.
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 transition-all transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Member
          </button>
        </div>
      </section>

      {/* Controls: Search & Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-lg self-start">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                roleFilter === 'all'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({members.length})
            </button>
            <button
              onClick={() => setRoleFilter('student')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                roleFilter === 'student'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Students ({studentCount})
            </button>
            <button
              onClick={() => setRoleFilter('faculty')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                roleFilter === 'faculty'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Faculty ({facultyCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, role, responsibility..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
            />
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            Loading cohort members directory...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Members Found</h3>
            <p className="text-xs text-slate-400 mb-6">
              {searchTerm
                ? 'No cohort members match your current filter and search criteria.'
                : 'Your internal cohort directory is currently empty.'}
            </p>
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map(m => (
              <div
                key={m.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 transition-all shadow-sm flex flex-col justify-between group relative"
              >
                <div>
                  {/* Top bar with avatar, role badge, and delete */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name.replace(' ', '')}`}
                        alt={m.name}
                        className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 object-cover shrink-0"
                      />
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">
                          {m.name}
                        </h3>
                        {m.role === 'faculty' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 mt-0.5">
                            <Building2 className="w-3 h-3" /> College Faculty
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-800/60 mt-0.5">
                            <GraduationCap className="w-3 h-3" /> Year {m.college_year || 3} Student
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(m.id, m.name)}
                      title="Remove member"
                      className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition p-1 rounded-md hover:bg-slate-800 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Section Responsibility Highlight */}
                  {m.responsibility ? (
                    <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-sky-950/60 to-indigo-950/60 border border-sky-800/40">
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-sky-400 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                        Section Responsibility
                      </div>
                      <p className="text-xs font-semibold text-slate-100">
                        {m.responsibility}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-500 text-xs italic">
                      General Cohort Member
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {m.bio || 'Data Science cohort member.'}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {m.skills?.map(s => (
                      <span
                        key={s}
                        className="text-[11px] bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-500" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Links */}
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
                    <Mail className="w-3.5 h-3.5" /> {m.email.split('@')[0]}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-700/50 flex items-center justify-center text-sky-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add Cohort Member</h3>
                  <p className="text-xs text-slate-400">Add a student lead or college faculty with their responsibility.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 flex items-center gap-2 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Member Type <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'student', college_year: prev.college_year || 3 }))}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition cursor-pointer ${
                      formData.role === 'student'
                        ? 'bg-sky-950 border-sky-500 text-sky-300 shadow-sm'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'faculty', college_year: null }))}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition cursor-pointer ${
                      formData.role === 'faculty'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    College Faculty
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={formData.role === 'faculty' ? 'e.g. Dr. Rajesh Kumar' : 'e.g. Ananya Sharma'}
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@dsconnect.edu"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* College Year (Only for Students) */}
              {formData.role === 'student' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    College Year <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.college_year || 3}
                    onChange={e => setFormData(prev => ({ ...prev, college_year: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value={1}>1st Year (Freshman)</option>
                    <option value={2}>2nd Year (Sophomore)</option>
                    <option value={3}>3rd Year (Junior)</option>
                    <option value={4}>4th Year (Senior)</option>
                    <option value={5}>5th Year / Integrated</option>
                  </select>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>College Faculty profile — Academic year is not required.</span>
                </div>
              )}

              {/* Section Responsibility */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-sky-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Assigned Section Responsibility
                  </label>
                  <span className="text-[10px] text-slate-500">Pick preset or type custom</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Hackathons & Competitions Coordinator, Event Lead..."
                  value={formData.responsibility || ''}
                  onChange={e => setFormData(prev => ({ ...prev, responsibility: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none mb-2"
                />

                {/* Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_RESPONSIBILITIES.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetResponsibility(preset)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        formData.responsibility === preset
                          ? 'bg-sky-950 border-sky-500 text-sky-300 font-semibold'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills & Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Skills / Domain Expertise (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Machine Learning, PyTorch, Event Planning, NLP"
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bio / Focus Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief note on their focus area or contributions..."
                  value={formData.bio || ''}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Handles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GitHub Username (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. octocat"
                    value={formData.github_handle || ''}
                    onChange={e => setFormData(prev => ({ ...prev, github_handle: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    LinkedIn Profile URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin_url || ''}
                    onChange={e => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Add to Cohort'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
