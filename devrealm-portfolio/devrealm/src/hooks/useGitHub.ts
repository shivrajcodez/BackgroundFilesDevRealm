import { useEffect, useState } from 'react';
import { fetchGitHubData, calcLanguageStats } from '../utils/github';
import type { GitHubData, LanguageStat } from '../types/github';

interface UseGitHubResult {
  data: GitHubData | null;
  languageStats: LanguageStat[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGitHub = (username: string): UseGitHubResult => {
  const [data, setData] = useState<GitHubData | null>(null);
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick((n) => n + 1);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchGitHubData(username);
        if (cancelled) return;
        setData(result);
        setLanguageStats(calcLanguageStats(result.repos));
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [username, tick]);

  return { data, languageStats, loading, error, refetch };
};
