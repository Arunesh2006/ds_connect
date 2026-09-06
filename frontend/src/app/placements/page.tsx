'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Placement, Achievement, PlacementCreate, AchievementCreate } from '@/types/api';
import {
  fetchPlacements,
  createPlacement,
  fetchAchievements,
  createAchievement,
  publishWhatsApp
} from '@/lib/api';
import {
  Briefcase,
  Trophy,
  PlusCircle,
  CheckCircle2,
  ShieldCheck,
  X,
  MessageCircle,
  Check,
  MapPin,
  ExternalLink,
  Search
} from 'lucide-react';

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals & Details
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Forms
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [packageLpa, setPackageLpa] = useState('');
  const [location, setLocation] = useState('Bangalore / Hybrid');
  const [eligibility, setEligibility] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [description, setDescription] = useState('');
  
  // Achievement form
  const [achCategory, setAchCategory] = useState('Hackathon Win');
  const [achTitle, setAchTitle] = useState('');
  const [achDate, setAchDate] = useState('');

  useEffect(() => {
    loadAll();
  }, [search]);

  async function loadAll() {
    setLoading(true);
    const [pList, aList] = await Promise.all([
      fetchPlacements(search),
      fetchAchievements()
    ]);
    setPlacements(pList);
    setAchievements(aList);
    setLoading(false);
  }

  async function handleSharePlacement(p: Placement) {
    try {
      const res = await publishWhatsApp('placement', p.id);
      if (navigator.clipboard && res.formatted_text) {
        await navigator.clipboard.writeText(res.formatted_text);
      }
      setCopiedId(p.id);
      setTimeout(() => setCopiedId(null), 3000);
      window.open(res.share_url, '_blank');
    } catch (err) {
      console.error('WhatsApp share error:', err);
    }
  }

  async function handlePlacementSubmit(e: React.FormEvent) {
    e.preventDefault();
    const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    await createPlacement({
      company,
      role,
      package_lpa: packageLpa ? parseFloat(packageLpa) : undefined,
      location,
      eligibility,
      skills,
      application_link: applicationLink,
      description,
      placement_year: 2026,
      status: 'active',
      consent_for_public_display: true
    });
    setIsPlacementModalOpen(false);
    setCompany('');
    setRole('');
    setPackageLpa('');
    setSkillsInput('');
    await loadAll();
  }

  async function handleAchievementSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createAchievement({
      category: achCategory,
      title: achTitle,
      achievement_date: achDate,
    });
    setIsAchievementModalOpen(false);
    setAchTitle('');
    setAchDate('');
    await loadAll();
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-emerald-100/40 dark:from-emerald-950/20 to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4">
            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
            Hiring Opportunities & Verified Offers
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Placements & Careers
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Verified campus placements, intern hiring drives, and competition awards with 1-click WhatsApp community broadcast.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company, job role, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlacementModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Post Placement Drive
            </button>
            <button
              onClick={() => setIsAchievementModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Add Win
            </button>
          </div>
        </div>

        {/* Placements Cards */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-500" /> Active Hiring Drives & Verified Placements
          </h2>

          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">Loading placements...</div>
          ) : placements.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-sm">
              No placement records found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placements.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                        Class of {p.placement_year}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.company}</h3>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">{p.role}</p>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                      <MapPin className="w-3.5 h-3.5" /> {p.location || 'Hybrid'}
                    </div>

                    {p.skills && p.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {p.skills.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    {p.package_lpa ? (
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {p.package_lpa} LPA
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Best in Class</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedPlacement(p)}
                        className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline px-2 py-1 cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleSharePlacement(p)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                      >
                        {copiedId === p.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Opening!</span>
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Hackathon Wins & Awards ({achievements.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-start gap-3.5 shadow-sm"
              >
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                    {ach.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{ach.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">Awarded: {ach.achievement_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details Modal */}
      {selectedPlacement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedPlacement.company}</h3>
              <button onClick={() => setSelectedPlacement(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3">
              <div>
                <span className="text-xs text-slate-500 block">Job Role</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedPlacement.role}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-500 block">Package (CTC)</span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{selectedPlacement.package_lpa ? `${selectedPlacement.package_lpa} LPA` : 'Best in Class'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Location</span>
                  <p className="text-sm text-slate-900 dark:text-white">{selectedPlacement.location}</p>
                </div>
              </div>
              {selectedPlacement.eligibility && (
                <div>
                  <span className="text-xs text-slate-500 block">Eligibility</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{selectedPlacement.eligibility}</p>
                </div>
              )}
              {selectedPlacement.description && (
                <div>
                  <span className="text-xs text-slate-500 block">Description</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{selectedPlacement.description}</p>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              {selectedPlacement.application_link && (
                <a
                  href={selectedPlacement.application_link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5"
                >
                  Apply Online <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setSelectedPlacement(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Placement Modal */}
      {isPlacementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Post Placement / Hiring Opportunity</h3>
              <button onClick={() => setIsPlacementModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePlacementSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, Fractal"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SWE Intern"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Package (CTC in LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 24.5"
                    value={packageLpa}
                    onChange={(e) => setPackageLpa(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore / Hybrid"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Application Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={applicationLink}
                    onChange={(e) => setApplicationLink(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, SQL, React"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description / Eligibility</label>
                <textarea
                  rows={2}
                  placeholder="Overview of hiring criteria, rounds, and requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlacementModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save Placement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Achievement Modal */}
      {isAchievementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Hackathon Win</h3>
              <button onClick={() => setIsAchievementModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAchievementSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={achCategory}
                  onChange={(e) => setAchCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                >
                  <option value="Hackathon Win">Hackathon Win</option>
                  <option value="Certification">Industry Certification</option>
                  <option value="Paper Publication">Research Publication</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Place - Smart India Hackathon"
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={achDate}
                  onChange={(e) => setAchDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAchievementModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
