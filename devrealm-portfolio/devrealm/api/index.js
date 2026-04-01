'use strict';

require('dotenv').config({ path: '../.env' });

const express     = require('express');
const cors        = require('cors');
const rateLimit   = require('express-rate-limit');
const axios       = require('axios');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://iamraj.vercel.app',
    /\.vercel\.app$/,
  ],
  methods: ['GET', 'POST'],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max:      100,
  standardHeaders: true,
  legacyHeaders:   false,
});
app.use('/api', limiter);

// ── GitHub auth headers ───────────────────────────────────────────────────────
const ghHeaders = () => ({
  Accept: 'application/vnd.github.v3+json',
  ...(process.env.VITE_GITHUB_TOKEN
    ? { Authorization: `token ${process.env.VITE_GITHUB_TOKEN}` }
    : {}),
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ── Profile views proxy ───────────────────────────────────────────────────────
// Uses the public GitHub traffic API (requires token with repo scope for private,
// or just shows 0 for public repos without extra scope).
app.get('/api/profile-views', async (_req, res) => {
  try {
    const username = process.env.VITE_GITHUB_USERNAME || 'shivrajcodez';
    // GitHub doesn't expose profile view count publicly.
    // We approximate from the most-viewed repo's traffic.
    const reposRes = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=stars`,
      { headers: ghHeaders(), timeout: 5000 },
    );

    let totalViews = 0;
    // Try to get traffic for top repo (needs push access — will 403 for foreign repos)
    try {
      const topRepo = reposRes.data[0];
      if (topRepo) {
        const trafficRes = await axios.get(
          `https://api.github.com/repos/${username}/${topRepo.name}/traffic/views`,
          { headers: ghHeaders(), timeout: 4000 },
        );
        totalViews = trafficRes.data?.count ?? 0;
      }
    } catch {
      // No push access — return 0 gracefully
    }

    res.json({ views: totalViews });
  } catch (err) {
    console.error('profile-views error:', err.message);
    res.json({ views: 0 }); // always return 200 with 0 — never error out
  }
});

// ── Commit stats proxy (language breakdown from GitHub stats API) ─────────────
app.get('/api/commit-stats', async (req, res) => {
  try {
    const username = process.env.VITE_GITHUB_USERNAME || 'shivrajcodez';
    const reposRes = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      { headers: ghHeaders(), timeout: 8000 },
    );

    const langCounts = {};
    const repos = reposRes.data ?? [];

    await Promise.allSettled(
      repos
        .filter((r) => !r.fork)
        .slice(0, 20) // cap at 20 to avoid rate limits
        .map(async (repo) => {
          try {
            const langRes = await axios.get(
              `https://api.github.com/repos/${username}/${repo.name}/languages`,
              { headers: ghHeaders(), timeout: 3000 },
            );
            Object.entries(langRes.data ?? {}).forEach(([lang, bytes]) => {
              langCounts[lang] = (langCounts[lang] ?? 0) + bytes;
            });
          } catch { /* skip this repo */ }
        }),
    );

    const total = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(langCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([lang, bytes]) => ({
        lang,
        percentage: Math.round((bytes / total) * 100),
      }));

    res.json({ languages: sorted });
  } catch (err) {
    console.error('commit-stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch commit stats' });
  }
});

// ── GitHub user proxy (optional — avoids CORS in some envs) ──────────────────
app.get('/api/github/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`,
        { headers: ghHeaders(), timeout: 8000 }),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`,
        { headers: ghHeaders(), timeout: 8000 }),
    ]);
    res.json({ user: userRes.data, repos: reposRes.data });
  } catch (err) {
    const status = err.response?.status ?? 500;
    res.status(status).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 API running → http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health`);
  console.log(`   Views:   http://localhost:${PORT}/api/profile-views\n`);
});
