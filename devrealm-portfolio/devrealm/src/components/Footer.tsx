import React from 'react';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const SOCIAL = [
  { icon: <FiGithub />,   href: 'https://github.com/shivrajcodez',              label: 'GitHub'   },
  { icon: <FiLinkedin />, href: 'https://linkedin.com/in/shivrajmohite',        label: 'LinkedIn' },
  { icon: <FiMail />,     href: 'mailto:shivrajcodez@gmail.com',                label: 'Email'    },
];

const Footer: React.FC = () => (
  <footer className="py-12 px-6 md:px-16 border-t border-black/10 dark:border-white/10 bg-white dark:bg-black">
    <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
        © {new Date().getFullYear()} Shivraj Mohite — Built with React + Vite
      </p>

      <div className="flex items-center gap-6">
        {SOCIAL.map(({ icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          >
            {icon}
          </a>
        ))}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-700">
        &lt;/shivraj&gt;
      </p>
    </div>
  </footer>
);

export default Footer;
