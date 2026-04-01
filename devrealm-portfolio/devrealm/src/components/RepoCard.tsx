import React from 'react';
import { FiStar, FiGitBranch, FiArrowUpRight, FiClock } from 'react-icons/fi';
import { getLangColor } from '../utils/github';

interface Props {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  updated: string;
  description?: string | null;
}

const timeSince = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1)  return 'today';
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

const RepoCard: React.FC<Props> = ({ name, stars, forks, language, url, updated, description }) => {
  const color = getLangColor(language ?? 'Unknown');

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group flex items-start justify-between gap-4
        py-5 border-b border-black/10 dark:border-white/10
        hover:border-black dark:hover:border-white
        transition-colors duration-200
      "
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-base uppercase tracking-tight truncate">
            {name}
          </span>
          <FiArrowUpRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
        </div>

        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed line-clamp-1 mb-3">
            {description}
          </p>
        )}

        <div className="flex items-center gap-4 font-mono text-[11px] text-zinc-400">
          {language && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              {language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FiStar className="w-3 h-3" /> {stars.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <FiGitBranch className="w-3 h-3" /> {forks.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-zinc-500">
            <FiClock className="w-3 h-3" /> {timeSince(updated)}
          </span>
        </div>
      </div>
    </a>
  );
};

export default RepoCard;
