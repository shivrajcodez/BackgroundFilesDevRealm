export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  location: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  size: number;
  fork: boolean;
  topics: string[];
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalContributions: number;
  profileViews: number;
}

export interface LanguageStat {
  lang: string;
  percentage: number;
  color: string;
}

export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
  stats: GitHubStats;
}
