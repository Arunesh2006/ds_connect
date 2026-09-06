'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Project, ProjectCreate } from '@/types/api';
import { fetchProjects, createProject, publishWhatsApp } from '@/lib/api';
import {
  FolderGit2,
  Github,
  ExternalLink,
  PlusCircle,
  Tag,
  Search,
  MessageCircle,
  Check,
  X
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [techFilter, setTechFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  useEffect(() => {
    loadProjects();
  }, [search, techFilter]);

  async function loadProjects() {
    setLoading(true);
    const data = await fetchProjects(search, techFilter);
    setProjects(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const technologies = techInput.split(',').map((t) => t.trim()).filter(Boolean);
    await createProject({
      title,
      description,
      technologies: technologies.length > 0 ? technologies : ['Python'],
      repo_url: repoUrl || undefined,
      live_url: liveUrl || undefined,
      status: 'approved',
    });
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setTechInput('');
    setRepoUrl('');
    setLiveUrl('');
    await loadProjects();
  }

  async function handleShareWhatsApp(pr: Project) {
    try {
      const res = await publishWhatsApp('project', pr.id);
      if (navigator.clipboard && res.formatted_text) {
        await navigator.clipboard.writeText(res.formatted_text);
      }
      setCopiedId(pr.id);
      setTimeout(() => setCopiedId(null), 3000);
      window.open(res.share_url, '_blank');
    } catch (err) {
      console.error('WhatsApp share error:', err);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-indigo-100/40 dark:from-indigo-950/20 to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
            Student Capstones & Research Demos
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Project Showcase
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Explore cutting-edge Machine Learning, NLP, and Full-Stack systems engineered by Data Science students.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or technologies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">Loading project showcase...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-sm">
            No projects found. Click &quot;Submit Project&quot; to showcase your work!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((pr) => (
              <div
                key={pr.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{pr.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {pr.description || 'Innovative Data Science student project.'}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-6">
                    {pr.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {pr.repo_url && (
                      <a
                        href={pr.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" /> Code
                      </a>
                    )}
                    {pr.live_url && (
                      <a
                        href={pr.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handleShareWhatsApp(pr)}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  >
                    {copiedId === pr.id ? (
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
            ))}
          </div>
        )}
      </section>

      {/* Submit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Submit Student Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Resume Analyzer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Short Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="What problem does it solve? What ML models or architecture does it use?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Technologies (comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, FastAPI, PyTorch, React"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
                >
                  Submit Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
