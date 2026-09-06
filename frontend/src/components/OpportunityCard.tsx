'use client';

import { useState } from 'react';
import { Opportunity } from '@/types/api';
import { Calendar, MapPin, Tag, Share2, Check, MessageCircle } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [copied, setCopied] = useState(false);

  const deadlineDate = new Date(opportunity.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const typeColorMap: Record<string, string> = {
    hackathon: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    internship: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    workshop: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    event: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    research: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  const oppType = opportunity.type || opportunity.mode || 'hackathon';
  const badgeStyle = typeColorMap[oppType.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  function handleShareWhatsApp() {
    // Generate clean, formatted WhatsApp announcement text
    const tagsFormatted = opportunity.tags && opportunity.tags.length > 0 
      ? opportunity.tags.map(t => `#${t.replace(/\s+/g, '')}`).join(' ') 
      : '#DataScience #Hackathon';

    const message = `📢 *NEW DATA SCIENCE OPPORTUNITY!*\n\n` +
      `🏆 *${opportunity.title.trim()}*\n` +
      `🏢 *Organizer:* ${opportunity.organizer}\n` +
      `🏷️ *Category:* ${oppType.toUpperCase()}\n` +
      `📅 *Deadline:* ${formattedDeadline}\n` +
      `📍 *Location:* ${opportunity.location}\n` +
      `🏷️ *Tags:* ${tagsFormatted}\n\n` +
      `📝 *Overview:*\n${opportunity.description.trim()}\n\n` +
      (opportunity.external_link ? `🔗 *Details / Apply:* ${opportunity.external_link}\n\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `*DS-Connect Cohort Community*`;

    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).catch(() => {});
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    // Open WhatsApp Web or Mobile app pre-filled with the message
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

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

        <button
          onClick={handleShareWhatsApp}
          title="Click to automatically create formatted announcement and post to WhatsApp Community"
          className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Copied & Opening WhatsApp!</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Post to WhatsApp</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
