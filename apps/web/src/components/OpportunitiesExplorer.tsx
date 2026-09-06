'use client';

import { useState } from 'react';
import { Opportunity } from '@/types/api';
import OpportunityCard from '@/components/OpportunityCard';
import PostEventModal from '@/components/PostEventModal';
import { Search, PlusCircle, Filter } from 'lucide-react';
import { fetchOpportunities } from '@/lib/api';

interface OpportunitiesExplorerProps {
  initialOpportunities: Opportunity[];
}

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Hackathons', value: 'hackathon' },
  { label: 'Internships', value: 'internship' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Events', value: 'event' },
  { label: 'Research', value: 'research' },
];

export default function OpportunitiesExplorer({ initialOpportunities }: OpportunitiesExplorerProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleFilterChange(type: string) {
    setSelectedType(type);
    setLoading(true);
    const updated = await fetchOpportunities(type, searchQuery);
    setOpportunities(updated);
    setLoading(false);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const updated = await fetchOpportunities(selectedType, searchQuery);
    setOpportunities(updated);
    setLoading(false);
  }

  async function reloadOpportunities() {
    setLoading(true);
    const updated = await fetchOpportunities(selectedType, searchQuery);
    setOpportunities(updated);
    setLoading(false);
  }

  return (
    <>
      <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Curated Cohort Opportunities</h2>
            <p className="text-sm text-slate-400">
              Verified hackathons, research grants, and placement resources curated for our Data Science team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-52 sm:w-64"
              />
            </form>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Publish Event Notice
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-500 mr-1 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleFilterChange(cat.value)}
              className={`text-xs font-medium px-4 py-2 rounded-full transition flex-shrink-0 border ${
                selectedType === cat.value
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading opportunities...</div>
        ) : opportunities.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400 mb-4">No opportunities found in this category.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-indigo-400 hover:underline"
            >
              Publish a new notice
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </section>

      <PostEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={reloadOpportunities}
      />
    </>
  );
}
