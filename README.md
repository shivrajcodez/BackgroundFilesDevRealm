🏗️ Project Structure
devrealm/
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── vercel.json
├── .gitignore
├── .env.example
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/github.ts
│   ├── utils/github.ts
│   ├── hooks/useGitHub.ts
│   ├── context/ThemeContext.tsx
│   │
│   ├── components/
│   │   ├── CustomCursor.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MetricCard.tsx
│   │   ├── RepoCard.tsx
│   │   ├── ScrollRevealText.tsx
│   │   ├── MusicPrompt.tsx
│   │   └── DevActivity.tsx
│   │
│   └── pages/
│       ├── Home.tsx
│       ├── Engineering.tsx
│       └── GuestBook.tsx
│
├── api/
│   ├── package.json
│   └── index.js
│
└── .github/workflows/deploy.yml
