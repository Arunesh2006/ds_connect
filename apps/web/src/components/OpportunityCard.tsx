import { Opportunity } from '@/types/api';
import { Calendar, MapPin, ExternalLink, Users, Tag } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const deadlineDate = new Date(opportunity.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const typeColorMap: Record<string, string> = {
    hackathon: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    internship: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    workshop: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    event: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const badgeStyle = typeColorMap[opportunity.type] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <div className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 transition flex flex-col justify-between hover:shadow-lg hover:shadow-indigo-500/5">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${badgeStyle}`}>
            {opportunity.type}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Due: {formattedDeadline}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-indigo-400 transition">
          {opportunity.title}
        </h3>
        <p className="text-xs text-indigo-300 font-medium mb-3">
          Organized by {opportunity.organizer}
        </p>

        <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {opportunity.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {opportunity.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60 flex items-center gap-1"
            >
              <Tag className="w-3 h-3 text-slate-500" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          {opportunity.location}
        </span>

        <div className="flex items-center gap-2">
          <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md transition flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Find Team
          </button>
          {opportunity.external_link && (
            <a
              href={opportunity.external_link}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md transition flex items-center gap-1 font-medium"
            >
              Apply <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
