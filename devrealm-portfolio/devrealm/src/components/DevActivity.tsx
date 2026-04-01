import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiStar, FiCode, FiGitPullRequest, FiAlertCircle,
  FiArrowUpRight, FiEye, FiCornerDownRight, FiRefreshCw,
} from 'react-icons/fi';
import ScrollRevealText from './ScrollRevealText';
import MetricCard from './MetricCard';
import RepoCard from './RepoCard';
import { useGitHub } from '../hooks/useGitHub';

gsap.registerPlugin(ScrollTrigger);

const USERNAME = import.meta.env.VITE_GITHUB_USERNAME as string || 'shivrajcodez';

const DevActivity: React.FC = () => {
  const sectionRef      = useRef<HTMLDivElement>(null);
  const titleRef        = useRef<HTMLDivElement>(null);
  const cardsRef        = useRef<HTMLDivElement>(null);
  const langBarsRef     = useRef<HTMLDivElement>(null);

  const { data, languageStats, loading, error, refetch } = useGitHub(USERNAME);

  // ── Animations (only after data is ready) ──────────────────────────────────
  useEffect(() => {
    if (loading || !data) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
          y: 30, opacity: 0, duration: 1, ease: 'power3.out',
        });
      }

      if (cardsRef.current) {
        gsap.from(Array.from(cardsRef.current.children), {
          scrollTrigger: { trigger: cardsRef.current, start: 'top 85%' },
          y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        });
      }

      if (langBarsRef.current) {
        gsap.from(langBarsRef.current.querySelectorAll('.lang-row'), {
          scrollTrigger: { trigger: langBarsRef.current, start: 'top 85%' },
          x: -20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        });
        gsap.from(langBarsRef.current.querySelectorAll('.bar-fill'), {
          scrollTrigger: { trigger: langBarsRef.current, start: 'top 85%' },
          width: '0%', duration: 1.5, ease: 'power2.out', stagger: 0.1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, data]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="min-h-[20vh] flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-3 h-3 bg-black dark:bg-white animate-spin" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
            Loading_Metrics...
          </span>
        </div>
      </section>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <section className="min-h-[20vh] flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3 text-red-500">
          <FiAlertCircle className="w-5 h-5" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-center max-w-xs">
            {error ?? 'Data unavailable'}
          </span>
          <button
            onClick={refetch}
            className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest
                       text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <FiRefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      </section>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="activity"
      className="relative py-24 md:py-32 bg-white dark:bg-black font-sans text-black dark:text-white"
    >
      <div className="max-w-8xl mx-auto px-6 md:px-16 relative z-10">

        {/* ── Section header ── */}
        <div
          ref={titleRef}
          className="mb-20 grid grid-cols-1 md:grid-cols-12 gap-8
                     border-b border-black/20 dark:border-white/20 pb-8"
        >
          <div className="md:col-span-8">
            <div className="flex items-center gap-4 mb-4">
              <FiCornerDownRight className="text-red-500 w-6 h-6" />
              <span className="font-mono text-xs uppercase tracking-widest text-red-500">
                Activity // Log
              </span>
            </div>
            <h2 className="text-[15vw] md:text-[8vw] leading-[0.8] font-bold uppercase
                           tracking-tighter text-transparent text-stroke-responsive
                           opacity-60 select-none pointer-events-none">
              <ScrollRevealText text="CODE_BASE " />
            </h2>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end">
            <p className="text-sm md:text-base font-light text-zinc-600 dark:text-zinc-400
                          text-justify max-w-xs ml-auto">
              Real-time data pulled live from the GitHub ecosystem.
            </p>
          </div>
        </div>

        {/* ── Profile + Metric cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-16 px-0 lg:px-36">

          {/* Profile */}
          <div className="lg:col-span-4 flex flex-row md:flex-col gap-3 md:gap-6
                          justify-between md:justify-start items-center md:items-start">
            <div className="flex flex-row items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black dark:bg-white overflow-hidden
                              rounded-full grayscale mix-blend-multiply dark:mix-blend-normal flex-shrink-0">
                <img
                  src={data.user.avatar_url}
                  alt={data.user.login}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold uppercase tracking-tight">
                  {data.user.name ?? data.user.login}
                </h3>
                <a
                  href={data.user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] md:text-xs font-mono text-zinc-500
                             hover:text-red-500 transition-colors"
                >
                  @github_profile
                </a>
              </div>
            </div>

            <div className="flex flex-row gap-4 md:gap-8">
              <div className="flex flex-col border-l-2 border-black dark:border-white pl-3 md:pl-4">
                <span className="text-xl md:text-3xl font-bold leading-none">
                  {data.user.followers.toLocaleString()}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                  Followers
                </span>
              </div>
              <div className="flex flex-col border-l-2 border-black dark:border-white pl-3 md:pl-4">
                <span className="text-xl md:text-3xl font-bold leading-none">
                  {data.user.following.toLocaleString()}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                  Following
                </span>
              </div>
            </div>
          </div>

          {/* Metric cards */}
          <div ref={cardsRef} className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricCard
              icon={<FiStar />}
              title="Total Stars"
              value={data.stats.totalStars}
              description="Cumulative stars across all public repositories."
            />
            <MetricCard
              icon={<FiCode />}
              title="Public Repos"
              value={data.user.public_repos}
              description="Active libraries & experimental projects."
            />
            <MetricCard
              icon={<FiGitPullRequest />}
              title="Contributions"
              value={data.stats.totalContributions}
              description="Total commits, issues, and PRs across all years."
            />
            <MetricCard
              icon={<FiEye />}
              title="Profile Views"
              value={data.stats.profileViews}
              description="Total views on your GitHub profile page."
            />
          </div>
        </div>

        {/* ── Repos + Language stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 px-0 lg:px-36">

          {/* Recent repos */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="flex items-baseline justify-between mb-8
                            border-b-2 border-black dark:border-white pb-2">
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                Recent Projects
              </h3>
              <span className="font-mono text-xs uppercase tracking-widest text-red-600">
                Latest_Push
              </span>
            </div>

            <div className="flex flex-col">
              {data.repos
                .filter((r) => !r.fork)
                .slice(0, 4)
                .map((repo) => (
                  <RepoCard
                    key={repo.name}
                    name={repo.name}
                    stars={repo.stargazers_count}
                    forks={repo.forks_count}
                    language={repo.language}
                    url={repo.html_url}
                    updated={repo.updated_at}
                    description={repo.description}
                  />
                ))}
            </div>

            <a
              href={data.user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3
                         bg-black text-white dark:bg-white dark:text-black
                         text-xs font-bold uppercase tracking-widest
                         hover:opacity-80 transition-opacity duration-300"
            >
              View All on GitHub <FiArrowUpRight />
            </a>
          </div>

          {/* Language bars */}
          <div ref={langBarsRef} className="lg:col-span-4 order-1 lg:order-2">
            <div className="flex items-baseline justify-between mb-8
                            border-b-2 border-black dark:border-white pb-2">
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                Top Languages
              </h3>
              <span className="font-mono text-xs uppercase tracking-widest text-red-600">
                Usage%
              </span>
            </div>

            <div className="space-y-6">
              {languageStats.map(({ lang, percentage, color }) => (
                <div key={lang} className="lang-row cursor-default">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-lg font-bold flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ background: color }}
                      />
                      {lang}
                    </span>
                    <span className="font-mono text-sm text-zinc-500">{percentage}%</span>
                  </div>
                  <div className="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800 relative">
                    <div
                      className="bar-fill absolute top-0 left-0 h-[2px] -mt-[0.5px]"
                      style={{ width: `${percentage}%`, background: '#dc2626' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DevActivity;
