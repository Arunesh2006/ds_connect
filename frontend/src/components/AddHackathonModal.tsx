'use client';

import { useState } from 'react';
import { X, Trophy, Calendar, MapPin, ExternalLink, Tag, Users, DollarSign, Sparkles } from 'lucide-react';
import { createHackathon } from '@/lib/api';

interface AddHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddHackathonModal({ isOpen, onClose, onSuccess }: AddHackathonModalProps) {
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [deadline, setDeadline] = useState('');
  const [mode, setMode] = useState('Online');
  const [location, setLocation] = useState('Online');
  const [prizePool, setPrizePool] = useState('₹1,00,000');
  const [teamSize, setTeamSize] = useState('1 - 4 Members');
  const [externalLink, setExternalLink] = useState('');
  const [tagsInput, setTagsInput] = useState('Machine Learning, Python');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!title.trim() || !organizer.trim() || !deadline || !description.trim()) {
        throw new Error('Please fill in all required fields (Title, Organizer, Deadline, Description).');
      }

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      // Parse deadline to ISO
      let deadlineIso: string;
      try {
        const d = new Date(deadline);
        if (isNaN(d.getTime())) {
          throw new Error('Invalid deadline date format');
        }
        deadlineIso = d.toISOString();
      } catch {
        throw new Error('Please select a valid deadline date.');
      }

      await createHackathon({
        title: title.trim(),
        organizer: organizer.trim(),
        deadline: deadlineIso,
        mode: mode || 'Online',
        location: location.trim() || 'Online',
        prize_pool: prizePool.trim() || undefined,
        team_size: teamSize.trim() || '1 - 4 Members',
        external_link: externalLink.trim() || undefined,
        tags: tags.length > 0 ? tags : ['Data Science', 'Hackathon'],
        description: description.trim(),
        status: 'published',
      });

      // Reset form
      setTitle('');
      setOrganizer('');
      setDeadline('');
      setMode('Online');
      setLocation('Online');
      setPrizePool('₹1,00,000');
      setTeamSize('1 - 4 Members');
      setExternalLink('');
      setTagsInput('Machine Learning, Python');
      setDescription('');

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add hackathon. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Add Hackathon Manually
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Directly add an upcoming competition or opportunity to the cohort directory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-xl text-red-700 dark:text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Hackathon / Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. National Generative AI & Data Hackathon 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Organizer / Host *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kaggle / IEEE Student Branch / Google Cloud"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Event Mode *
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              >
                <option value="Online">Online / Virtual</option>
                <option value="In-Person">In-Person / Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-500" /> Registration Deadline *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-500" /> Location
              </label>
              <input
                type="text"
                placeholder="e.g. Online or Campus Auditorium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Prize Pool / Rewards
              </label>
              <input
                type="text"
                placeholder="e.g. ₹2,50,000 or $50,000 USD"
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-500" /> Team Size
              </label>
              <input
                type="text"
                placeholder="e.g. 1 - 4 Members"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-sky-500" /> Registration / Link URL
            </label>
            <input
              type="url"
              placeholder="https://unstop.com/hackathons/... or https://kaggle.com/..."
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-sky-500" /> Technical Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="Machine Learning, LLMs, Computer Vision, PyTorch, Kaggle"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Description & Problem Statement *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Brief description of the challenge, domains, rules, or prizes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none transition leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-sky-900 rounded-xl transition shadow-md shadow-sky-600/20 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Adding Hackathon...' : 'Add Hackathon'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
