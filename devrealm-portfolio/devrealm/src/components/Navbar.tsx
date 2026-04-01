import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiDownload } from 'react-icons/fi';

const NAV_LINKS = [
  { label: 'Home',        path: '/'            },
  { label: 'Engineering', path: '/engineering' },
  { label: 'Guestbook',   path: '/guestbook'   },
];

const Navbar: React.FC = () => {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-6 md:px-12 py-4
        transition-all duration-300
        ${scrolled
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/10 dark:border-white/10'
          : 'bg-transparent'}
      `}
    >
      {/* Logo */}
      <Link
        to="/"
        className="font-display text-xl font-black tracking-widest uppercase
                   text-black dark:text-white hover:text-red-500 transition-colors"
      >
        MOHITE<span className="text-red-500">.</span>
      </Link>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(({ label, path }) => (
          <li key={path}>
            <Link
              to={path}
              className={`
                relative px-4 py-2 font-mono text-xs uppercase tracking-widest
                transition-colors duration-200
                ${pathname === path
                  ? 'text-red-500'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'}
              `}
            >
              {pathname === path && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="p-2 rounded-full border border-black/20 dark:border-white/20
                     hover:border-black dark:hover:border-white transition-colors"
        >
          {theme === 'dark' ? (
            <FiSun  className="w-4 h-4" />
          ) : (
            <FiMoon className="w-4 h-4" />
          )}
        </button>

        <a
          href="/resume.pdf"
          download
          className="hidden md:inline-flex items-center gap-2
                     px-4 py-2 border border-black dark:border-white
                     font-mono text-xs uppercase tracking-widest
                     hover:bg-black hover:text-white
                     dark:hover:bg-white dark:hover:text-black
                     transition-all duration-200"
        >
          <FiDownload className="w-3 h-3" />
          Resume
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
