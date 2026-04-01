devrealm/
│
├── index.html                          ← Root HTML entry
├── package.json                        ← Dependencies + scripts
├── vite.config.ts                      ← Vite + proxy setup
├── tailwind.config.js                  ← Custom fonts, colours, animations
├── postcss.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── vercel.json                         ← Rewrites + security headers
├── .gitignore                          ← node_modules, .env, dist excluded
├── .env.example                        ← Safe template to commit
│
├── src/
│   ├── main.tsx                        ← React root
│   ├── App.tsx                         ← Router + providers
│   ├── index.css                       ← Tailwind + cursor + animations
│   ├── types/github.ts                 ← All shared TS interfaces
│   ├── utils/github.ts                 ← fetchGitHubData, calcLanguageStats
│   ├── hooks/useGitHub.ts              ← Custom hook (data + loading + error + refetch)
│   ├── context/ThemeContext.tsx        ← Dark/light theme
│   ├── components/
│   │   ├── CustomCursor.tsx            ← Physics-lagged ring cursor
│   │   ├── Navbar.tsx                  ← Sticky nav + theme toggle + resume download
│   │   ├── Footer.tsx                  ← Social links
│   │   ├── MetricCard.tsx              ← Animated count-up card
│   │   ├── RepoCard.tsx                ← Repo row with language dot + timeSince
│   │   ├── ScrollRevealText.tsx        ← GSAP per-char scroll reveal
│   │   ├── MusicPrompt.tsx             ← Ambient audio prompt
│   │   └── DevActivity.tsx             ← ✅ FIXED GitHub metrics section
│   └── pages/
│       ├── Home.tsx                    ← Hero + TechStack + DevActivity
│       ├── Engineering.tsx             ← Projects + arch diagrams
│       └── GuestBook.tsx               ← Sign + read messages (localStorage)
│
├── api/
│   ├── package.json
│   └── index.js                        ← Express: /api/profile-views, /api/commit-stats
│
└── .github/workflows/deploy.yml        ← CI: lint → build → Vercel deploy
