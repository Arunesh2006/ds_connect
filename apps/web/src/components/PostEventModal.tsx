'use client';

import { useState } from 'react';
import { X, Sparkles, Calendar, MapPin, ExternalLink, Tag } from 'lucide-react';
import { createOpportunity } from '@/lib/api';

interface PostEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PostEventModal({ isOpen, onClose, onSuccess }: PostEventModalProps) {
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [type, setType] = useState('hackathon');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('Online');
  const [externalLink, setExternalLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const deadlineIso = new Date(deadline).toISOString();

      await createOpportunity({
        title,
        organizer,
        type,
        deadline: deadlineIso,
        location,
        external_link: externalLink || undefined,
        tags: tags.length > 0 ? tags : ['Data Science'],
        description,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit event. Please check inputs.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Post an Opportunity</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-950/50 border border-red-800/80 rounded-lg text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. AI Champions League 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Organizer *</label>
              <input
                type="text"
                required
                placeholder="e.g. Google Cloud & DeepMind"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="hackathon">Hackathon</option>
                <option value="internship">Internship</option>
                <option value="workshop">Workshop</option>
                <option value="event">Event / Conference</option>
                <option value="research">Research Grant</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Deadline Date *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Location
              </label>
              <input
                type="text"
                placeholder="e.g. Online, Bengaluru, Hybrid"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" /> Registration / External URL
            </label>
            <input
              type="url"
              placeholder="https://hackathon.example.com"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-400" /> Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="Machine Learning, Python, LLM, Web3"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the opportunity, eligibility, prizes, or objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 rounded-lg transition shadow-md shadow-indigo-600/30"
            >
              {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
