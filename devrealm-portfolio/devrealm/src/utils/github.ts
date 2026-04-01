import type { GitHubData, GitHubUser, GitHubRepo, LanguageStat } from '../types/github';

// ── Language colour map ──────────────────────────────────────────────────────
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript:  '#f7df1e',
  TypeScript:  '#3178c6',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  Python:      '#3572a5',
  Java:        '#b07219',
  'C++':       '#f34b7d',
  C:           '#555555',
  Shell:       '#89e051',
  Vue:         '#41b883',
  Dart:        '#00B4AB',
  Kotlin:      '#F18E33',
  Go:          '#00add8',
  Rust:        '#ce412b',
  Ruby:        '#cc342d',
  'C#':        '#9b4f96',
  PHP:         '#8892bf',
  Swift:       '#fa7343',
};

export const getLangColor = (lang: string): string =>
  LANGUAGE_COLORS[lang] ?? '#888888';

// ── Safe fetch with a hard timeout ──────────────────────────────────────────
export const fetchWithTimeout = (
  url: string,
  options: RequestInit = {},
  ms = 6000,
): Promise<Response> => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() =>
    clearTimeout(timer),
  );
};

// ── Build auth headers ───────────────────────────────────────────────────────
const getHeaders = (): HeadersInit => {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
  return {
    Accept: 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `token ${token}` } : {}),
  };
};

// ── Main data fetcher ────────────────────────────────────────────────────────
export const fetchGitHubData = async (username: string): Promise<GitHubData> => {
  const headers = getHeaders();

  const [userRes, reposRes] = await Promise.all([
    fetchWithTimeout(`https://api.github.com/users/${username}`, { headers }, 8000),
    fetchWithTimeout(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers },
      8000,
    ),
  ]);

  if (!userRes.ok) {
    if (userRes.status === 403)
      throw new Error('GitHub API rate limited — add VITE_GITHUB_TOKEN to your .env');
    if (userRes.status === 404) throw new Error('GitHub user not found');
    throw new Error(`GitHub API error: ${userRes.status}`);
  }

  const user: GitHubUser = await userRes.json();
  const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

  // Stars / forks
  let totalStars = 0;
  let totalForks = 0;
  if (Array.isArray(repos)) {
    repos.forEach((r) => {
      if (r.fork) return;
      totalStars += r.stargazers_count;
      totalForks += r.forks_count;
    });
  }

  // Contributions
  let totalContributions = 0;
  try {
    const contribRes = await fetchWithTimeout(
      `https://github-contributions-api.jogruber.de/v4/${username}`,
      {},
      5000,
    );
    if (contribRes.ok) {
      const d = await contribRes.json();
      totalContributions = Object.values(d.total ?? {}).reduce(
        (a: number, b) => a + (b as number),
        0,
      ) as number;
    }
  } catch {
    /* timed out — use estimate */
  }
  if (!totalContributions) totalContributions = user.public_repos * 12;

  // Profile views via backend proxy (optional, degrades gracefully)
  let profileViews = 0;
  try {
    const viewsRes = await fetchWithTimeout('/api/profile-views', {}, 4000);
    if (viewsRes.ok) {
      const d = await viewsRes.json();
      if (typeof d.views === 'number') profileViews = d.views;
    }
  } catch {
    /* backend asleep on Render free tier — show 0 */
  }

  return {
    user,
    repos: Array.isArray(repos) ? repos : [],
    stats: { totalStars, totalForks, totalContributions, profileViews },
  };
};

// ── Language percentage breakdown ────────────────────────────────────────────
export const calcLanguageStats = (repos: GitHubRepo[]): LanguageStat[] => {
  const counts: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.fork || !r.language) return;
    counts[r.language] = (counts[r.language] ?? 0) + (r.size || 1);
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  const top3 = sorted.slice(0, 3);
  const top3Total = top3.reduce((a, [, v]) => a + v, 0);

  const result: LanguageStat[] = top3.map(([lang, count]) => ({
    lang,
    percentage: Math.round((count / total) * 100),
    color: getLangColor(lang),
  }));

  const otherPct = Math.round(((total - top3Total) / total) * 100);
  if (otherPct > 0 && result.length === 3) {
    result.push({ lang: 'Others', percentage: otherPct, color: '#888888' });
  }

  return result;
};
