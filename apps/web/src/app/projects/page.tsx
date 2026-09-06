'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Project } from '@/types/api';
import { fetchProjects, createProject } from '@/lib/api';
import { FolderGit2, PlusCircle, Github, ExternalLink, Tag, X } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const list = await fetchProjects();
    setProjects(list);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const tech = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      await createProject({
        title,
        description,
        technologies: tech.length > 0 ? tech : ['Python'],
        repo_url: repoUrl || undefined,
        live_url: liveUrl || undefined,
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setTechnologies('');
      setRepoUrl('');
      setLiveUrl('');
      await loadProjects();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-amber-950/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 text-xs font-semibold mb-4">
            <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
            Cohort Portfolio
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Student Projects Showcase
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Explore machine learning prototypes, computer vision systems, and data analytics tools built by members of our Data Science cohort.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Cohort Projects ({projects.length})</h2>
            <p className="text-xs text-slate-400">Open-source code, live demos, and research models.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            No projects added yet. Click "Add Project" to publish your first showcase!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-xl p-6 transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{proj.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {proj.description || 'No description provided.'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60 flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3 text-slate-500" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  {proj.repo_url && (
                    <a
                      href={proj.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-medium"
                    >
                      <Github className="w-3.5 h-3.5" /> Source Code
                    </a>
                  )}
                  {proj.live_url && (
                    <a
                      href={proj.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-medium"
                    >
                      Live Demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Add Project to Showcase</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brain Tumor Segmentation with UNet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your model, dataset, and accuracy metrics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  placeholder="PyTorch, OpenCV, Flask, Next.js"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://my-model.app"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm"
                >
                  {loading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
