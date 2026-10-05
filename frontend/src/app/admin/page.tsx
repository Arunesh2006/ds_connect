'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  Hackathon,
  Placement,
  Project,
  Member,
  HackathonCreate,
  PlacementCreate
} from '@/types/api';
import {
  fetchHackathons,
  createHackathon,
  deleteHackathon,
  fetchPlacements,
  createPlacement,
  deletePlacement,
  fetchAllProjectsAdmin,
  updateProject,
  deleteProject,
  fetchMembers,
  createMember,
  deleteMember,
  publishWhatsApp,
  triggerDiscovery
} from '@/lib/api';
import {
  ShieldAlert,
  Trophy,
  Briefcase,
  FolderGit2,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  MessageCircle,
  Check,
  Sparkles,
  ExternalLink,
  Globe,
  Loader2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'hackathons' | 'placements' | 'projects' | 'members' | 'whatsapp'>('overview');

  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [crawlNotice, setCrawlNotice] = useState<string | null>(null);

  // WhatsApp form
  const [waText, setWaText] = useState('');
  const [waResult, setWaResult] = useState<any>(null);
  const [broadcasting, setBroadcasting] = useState(false);

  // Quick Add forms
  const [newHName, setNewHName] = useState('');
  const [newHOrg, setNewHOrg] = useState('');
  const [newHDesc, setNewHDesc] = useState('');
  const [newHPrize, setNewHPrize] = useState('$50,000 USD');

  const [newPCompany, setNewPCompany] = useState('');
  const [newPRole, setNewPRole] = useState('');
  const [newPPkg, setNewPPkg] = useState('18.0');

  const [newMName, setNewMName] = useState('');
  const [newMYear, setNewMYear] = useState(2);
  const [newMSection, setNewMSection] = useState('Data Science');

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const [h, p, pr, m] = await Promise.all([
      fetchHackathons(),
      fetchPlacements(),
      fetchAllProjectsAdmin(),
      fetchMembers()
    ]);
    setHackathons(h);
    setPlacements(p);
    setProjects(pr);
    setMembers(m);
    setLoading(false);
  }

  async function handleAddHackathon(e: React.FormEvent) {
    e.preventDefault();
    await createHackathon({
      title: newHName,
      organizer: newHOrg,
      description: newHDesc || 'Exciting ML & AI sprint competition.',
      deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
      prize_pool: newHPrize,
      tags: ['AI', 'Data Science'],
      mode: 'Online',
      team_size: '1-4',
      status: 'published'
    });
    setNewHName('');
    setNewHOrg('');
    setNewHDesc('');
    await loadAll();
  }

  async function handleDeleteHackathon(id: string) {
    if (!confirm('Delete this hackathon?')) return;
    await deleteHackathon(id);
    setHackathons((prev) => prev.filter((h) => h.id !== id));
  }

  async function handleTriggerCrawler() {
    try {
      setDiscovering(true);
      setCrawlNotice('Autonomous crawler active: searching Kaggle, Devpost, MLH and open feeds...');
      const res = await triggerDiscovery();
      await loadAll();
      setCrawlNotice(`Discovery Complete: ${res.total_fetched || 0} events crawled, ${res.new_opportunities_added || 0} new added, ${res.duplicates_skipped || 0} duplicates skipped.`);
      setTimeout(() => setCrawlNotice(null), 8000);
    } catch (err: any) {
      setCrawlNotice(`Crawler error: ${err.message || 'Failed to complete discovery'}`);
      setTimeout(() => setCrawlNotice(null), 5000);
    } finally {
      setDiscovering(false);
    }
  }

  async function handleAddPlacement(e: React.FormEvent) {
    e.preventDefault();
    await createPlacement({
      company: newPCompany,
      role: newPRole,
      package_lpa: parseFloat(newPPkg) || 18.0,
      placement_year: 2026,
      skills: ['Python', 'SQL', 'Data Science'],
      location: 'Hybrid',
      status: 'active',
      consent_for_public_display: true
    });
    setNewPCompany('');
    setNewPRole('');
    await loadAll();
  }

  async function handleDeletePlacement(id: string) {
    if (!confirm('Delete this placement record?')) return;
    await deletePlacement(id);
    setPlacements((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleApproveProject(id: string, newStatus: string) {
    await updateProject(id, { status: newStatus });
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('Delete this project?')) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    await createMember({
      name: newMName,
      email: `${newMName.toLowerCase().replace(/\s+/g, '')}@dsconnect.edu`,
      college_year: newMYear,
      responsibility: newMSection,
      role: 'student'
    });
    setNewMName('');
    setNewMSection('Data Science');
    await loadAll();
  }

  async function handleDeleteMember(id: string) {
    if (!confirm('Remove member?')) return;
    await deleteMember(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleBroadcastWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    setBroadcasting(true);
    try {
      const res = await publishWhatsApp('custom', undefined, waText);
      setWaResult(res);
      if (navigator.clipboard && res.formatted_text) {
        await navigator.clipboard.writeText(res.formatted_text);
      }
      window.open(res.share_url, '_blank');
    } catch (err: any) {
      alert('Broadcast error: ' + err.message);
    } finally {
      setBroadcasting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-indigo-50 dark:bg-indigo-950/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Administrative Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status: Authenticated Admin</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
          {[
            { id: 'overview', label: 'Overview', icon: Sparkles },
            { id: 'hackathons', label: `Hackathons (${hackathons.length})`, icon: Trophy },
            { id: 'placements', label: `Placements (${placements.length})`, icon: Briefcase },
            { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
            { id: 'members', label: `Members (${members.length})`, icon: Users },
            { id: 'whatsapp', label: 'WhatsApp Broadcast', icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold block">Active Hackathons</span>
                <span className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1 block">{hackathons.length}</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold block">Active Placements</span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{placements.length}</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold block">Total Projects</span>
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">{projects.length}</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold block">Total Members</span>
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{members.length}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Quick WhatsApp Community Broadcast</h3>
              <p className="text-xs text-slate-500 mb-4">
                Trigger an official announcement broadcast formatted according to the DS-Connect standard templates.
              </p>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Open Broadcast Studio
              </button>
            </div>
          </div>
        )}

        {/* HACKATHONS */}
        {activeTab === 'hackathons' && (
          <div className="space-y-6">
            {/* Crawler & Discovery Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-500" />
                  Autonomous Web Discovery & Scraping Pipeline
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Crawls MLH, Kaggle, Devpost feeds & open challenge platforms. Deduplicates and upserts directly to PostgreSQL.
                </p>
                {crawlNotice && (
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1 animate-pulse">
                    {crawlNotice}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleTriggerCrawler}
                disabled={discovering}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer whitespace-nowrap active:scale-95 transition"
              >
                {discovering ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Crawling Web...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Trigger Crawler Engine</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleAddHackathon} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Hackathon Name *"
                value={newHName}
                onChange={(e) => setNewHName(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                required
                placeholder="Organizer *"
                value={newHOrg}
                onChange={(e) => setNewHOrg(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Prize Pool"
                value={newHPrize}
                onChange={(e) => setNewHPrize(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Hackathon
              </button>
            </form>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Organizer</th>
                    <th className="p-3.5">Prize Pool</th>
                    <th className="p-3.5">Deadline</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {hackathons.map((h) => (
                    <tr key={h.id}>
                      <td className="p-3.5 font-bold">{h.title}</td>
                      <td className="p-3.5 text-slate-500">{h.organizer}</td>
                      <td className="p-3.5 font-semibold text-amber-500">{h.prize_pool}</td>
                      <td className="p-3.5">{new Date(h.deadline).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteHackathon(h.id)}
                          className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PLACEMENTS */}
        {activeTab === 'placements' && (
          <div className="space-y-6">
            <form onSubmit={handleAddPlacement} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Company *"
                value={newPCompany}
                onChange={(e) => setNewPCompany(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                required
                placeholder="Role *"
                value={newPRole}
                onChange={(e) => setNewPRole(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Package LPA"
                value={newPPkg}
                onChange={(e) => setNewPPkg(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Placement
              </button>
            </form>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">Company</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Package</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {placements.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3.5 font-bold">{p.company}</td>
                      <td className="p-3.5 text-slate-500">{p.role}</td>
                      <td className="p-3.5 font-bold text-emerald-500">{p.package_lpa ? `${p.package_lpa} LPA` : '-'}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 uppercase">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeletePlacement(p.id)}
                          className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Project Title</th>
                  <th className="p-3.5">Technologies</th>
                  <th className="p-3.5">Review Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {projects.map((pr) => (
                  <tr key={pr.id}>
                    <td className="p-3.5 font-bold">{pr.title}</td>
                    <td className="p-3.5 text-slate-500">{pr.technologies?.join(', ')}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        pr.status === 'approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                      }`}>
                        {pr.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {pr.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveProject(pr.id, 'approved')}
                          className="text-emerald-500 hover:underline font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteProject(pr.id)}
                        className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MEMBERS */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <form onSubmit={handleAddMember} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Full Name *"
                value={newMName}
                onChange={(e) => setNewMName(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              />
              <select
                value={newMYear}
                onChange={(e) => setNewMYear(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
              <input
                type="text"
                required
                placeholder="Working Section *"
                value={newMSection}
                onChange={(e) => setNewMSection(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </form>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Year</th>
                    <th className="p-3.5">Working Section</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td className="p-3.5 font-bold">{m.name}</td>
                      <td className="p-3.5 text-slate-500">{m.college_year ? `Year ${m.college_year}` : 'Faculty'}</td>
                      <td className="p-3.5 font-semibold text-amber-500">{m.responsibility}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteMember(m.id)}
                          className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WHATSAPP BROADCAST */}
        {activeTab === 'whatsapp' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl">
            <h3 className="text-base font-bold mb-1 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              WhatsApp Community Broadcast Studio
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Enter announcement message below. If WhatsApp Cloud API credentials are configured, the backend posts directly to the destination. Otherwise, it automatically generates a pre-formatted link with instant clipboard copy.
            </p>

            <form onSubmit={handleBroadcastWhatsApp} className="space-y-4 text-xs">
              <textarea
                rows={5}
                required
                placeholder="Enter announcement text to broadcast..."
                value={waText}
                onChange={(e) => setWaText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-mono"
              />

              <button
                type="submit"
                disabled={broadcasting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                {broadcasting ? 'Broadcasting...' : 'Broadcast to WhatsApp'}
              </button>
            </form>

            {waResult && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <Check className="w-4 h-4" />
                  <span>{waResult.message}</span>
                </div>
                <div className="p-2.5 rounded bg-white dark:bg-slate-900 font-mono text-[11px] whitespace-pre-wrap border border-slate-200 dark:border-slate-800">
                  {waResult.formatted_text}
                </div>
                <a
                  href={waResult.share_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-600 font-bold hover:underline mt-2"
                >
                  Direct Share Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
