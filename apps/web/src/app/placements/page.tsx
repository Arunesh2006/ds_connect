'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Placement, Achievement } from '@/types/api';
import { fetchPlacements, createPlacement, fetchAchievements, createAchievement } from '@/lib/api';
import { Briefcase, Trophy, PlusCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  // Placement form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [packageLpa, setPackageLpa] = useState('');
  const [placementYear, setPlacementYear] = useState('2026');
  const [consent, setConsent] = useState(true);

  // Achievement form state
  const [achCategory, setAchCategory] = useState('Hackathon Win');
  const [achTitle, setAchTitle] = useState('');
  const [achDate, setAchDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [pList, aList] = await Promise.all([fetchPlacements(), fetchAchievements()]);
    setPlacements(pList);
    setAchievements(aList);
  }

  async function handlePlacementSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createPlacement({
      company,
      role,
      package_lpa: packageLpa ? parseFloat(packageLpa) : undefined,
      placement_year: parseInt(placementYear, 10),
      consent_for_public_display: consent,
    });
    setIsPlacementModalOpen(false);
    setCompany('');
    setRole('');
    setPackageLpa('');
    await loadData();
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
    await loadData();
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-emerald-950/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold mb-4">
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            Career Records & Honors
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Cohort Placements & Achievements
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Verified hiring outcomes, job offers, and competition wins. Regulated in accordance with the India DPDP Act 2023.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Placements Section */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" /> Verified Placements ({placements.length})
              </h2>
              <p className="text-xs text-slate-400">Offers accepted by students with explicit consent.</p>
            </div>
            <button
              onClick={() => setIsPlacementModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Record Placement
            </button>
          </div>

          {placements.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
              No placement records logged yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {placements.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Class of {p.placement_year}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{p.company}</h3>
                    <p className="text-sm text-slate-300">{p.role}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> DPDP Consented
                    </span>
                    {p.package_lpa && (
                      <span className="text-sm font-bold text-emerald-400">{p.package_lpa} LPA</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Hackathon Wins & Honors ({achievements.length})
              </h2>
              <p className="text-xs text-slate-400">Awards and certifications earned by the cohort.</p>
            </div>
            <button
              onClick={() => setIsAchievementModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              Add Achievement
            </button>
          </div>

          {achievements.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
              No achievements logged yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div key={ach.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-amber-400 font-semibold uppercase">{ach.category}</span>
                    <h4 className="text-base font-bold text-white">{ach.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Awarded on {ach.achievement_date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Record Placement Modal */}
      {isPlacementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Record Placement Offer</h3>
              <button onClick={() => setIsPlacementModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlacementSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microsoft, Google, Fractal Analytics"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Associate Data Scientist, ML Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Package (CTC in LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 18.5"
                    value={packageLpa}
                    onChange={(e) => setPackageLpa(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Batch Year *</label>
                  <input
                    type="number"
                    required
                    value={placementYear}
                    onChange={(e) => setPlacementYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded"
                />
                <label htmlFor="consent" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
                  I grant explicit consent under India DPDP Act 2023 for my placement outcome to be displayed to the cohort directory.
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPlacementModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Achievement Modal */}
      {isAchievementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Add Hackathon Win / Certificate</h3>
              <button onClick={() => setIsAchievementModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAchievementSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  value={achCategory}
                  onChange={(e) => setAchCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Hackathon Win">Hackathon Win (1st / 2nd / 3rd)</option>
                  <option value="Certification">Industry Certification (AWS / TF / GCP)</option>
                  <option value="Paper Publication">Research Paper Accepted</option>
                  <option value="Open Source">Major Open Source Contribution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Place at Smart India Hackathon"
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={achDate}
                  onChange={(e) => setAchDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAchievementModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg"
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
