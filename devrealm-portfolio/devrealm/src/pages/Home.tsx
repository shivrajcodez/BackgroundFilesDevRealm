import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowDownRight, FiGithub, FiLinkedin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DevActivity from '../components/DevActivity';
import MusicPrompt from '../components/MusicPrompt';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

/* ── Floating rune ambient particles ──────────────────────────────────────── */
const RUNES = ['⚔', '☕', '{ }', '//', '→', '∞', '<>', '01', '/**', '>>>'];

const FloatingRunes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const spawn = () => {
      const span = document.createElement('span');
      span.className = 'rune';
      span.textContent = RUNES[Math.floor(Math.random() * RUNES.length)];
      const dur = 14 + Math.random() * 14;
      span.style.cssText = `
        left: ${Math.random() * 100}vw;
        font-family: 'Share Tech Mono', monospace;
        font-size: ${14 + Math.random() * 12}px;
        color: rgba(0,0,0,0.06);
        animation-duration: ${dur}s;
        animation-delay: ${-Math.random() * dur}s;
      `;
      el.appendChild(span);
      setTimeout(() => span.remove(), (dur + 2) * 1000);
    };

    for (let i = 0; i < 10; i++) spawn();
    const interval = setInterval(() => {
      if (el.children.length < 15) spawn();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 dark:hidden"
    />
  );
};

/* ── Hero section ─────────────────────────────────────────────────────────── */
const Hero: React.FC = () => {
  const heroRef    = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(headRef.current,    { y: 60, opacity: 0, duration: 1.2 })
        .from(subRef.current,     { y: 30, opacity: 0, duration: 0.9 }, '-=0.6')
        .from(actionsRef.current, { y: 20, opacity: 0, duration: 0.8 }, '-=0.5');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col justify-end pb-16 md:pb-24
                 px-6 md:px-16 pt-32
                 bg-white dark:bg-black relative overflow-hidden"
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none
                      bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      <div className="max-w-8xl mx-auto w-full relative z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[1px] bg-red-500" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-red-500">
            Backend Engineer // DevOps
          </span>
        </div>

        {/* Main heading */}
        <h1
          ref={headRef}
          className="text-[18vw] md:text-[12vw] lg:text-[10vw]
                     font-black uppercase leading-[0.82] tracking-tighter
                     text-black dark:text-white mb-8"
        >
          MOHITE
          <br />
          <span className="text-transparent text-stroke-responsive opacity-40">
            SHIVRAJ
          </span>
        </h1>

        {/* Sub + actions row */}
        <div className="flex flex-col md:flex-row items-start md:items-end
                        justify-between gap-8 border-t border-black/20 dark:border-white/20 pt-8">
          <p
            ref={subRef}
            className="max-w-md text-base md:text-lg font-light
                       text-zinc-600 dark:text-zinc-400 leading-relaxed"
          >
            Building robust systems, scalable microservices, and automated
            deployment pipelines. Java · Spring Boot · AWS · Docker · Kubernetes.
          </p>

          <div ref={actionsRef} className="flex items-center gap-4 flex-shrink-0">
            <a
              href="https://github.com/shivrajcodez"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest
                         text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <FiGithub /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/shivrajmohite"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest
                         text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <FiLinkedin /> LinkedIn
            </a>
            <Link
              to="/engineering"
              className="flex items-center gap-2 px-6 py-3
                         bg-black text-white dark:bg-white dark:text-black
                         font-mono text-xs uppercase tracking-widest
                         hover:opacity-80 transition-opacity"
            >
              Projects <FiArrowDownRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2
                      font-mono text-[10px] uppercase tracking-widest text-zinc-400
                      animate-bounce">
        <span>Scroll</span>
        <span>↓</span>
      </div>
    </section>
  );
};

/* ── Tech stack section ───────────────────────────────────────────────────── */
const STACK = [
  { group: 'Backend',    items: ['Java 17', 'Spring Boot', 'Node.js', 'Express', 'Python'] },
  { group: 'Database',   items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'] },
  { group: 'DevOps',     items: ['Docker', 'Kubernetes', 'GitHub Actions', 'Jenkins'] },
  { group: 'Cloud',      items: ['AWS EC2', 'AWS S3', 'AWS RDS', 'ECS Fargate', 'Lambda'] },
  { group: 'Frontend',   items: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'] },
];

const TechStack: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current!.querySelectorAll('.stack-group'), {
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 px-6 md:px-16 bg-zinc-50 dark:bg-zinc-950
                 border-t border-black/10 dark:border-white/10"
    >
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <span className="w-8 h-[1px] bg-red-500" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-red-500">
            Tech Stack
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {STACK.map(({ group, items }) => (
            <div key={group} className="stack-group">
              <h4 className="font-mono text-[10px] uppercase tracking-widest
                             text-zinc-400 mb-4 pb-2
                             border-b border-black/10 dark:border-white/10">
                {group}
              </h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300
                               hover:text-black dark:hover:text-white transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Page ─────────────────────────────────────────────────────────────────── */
const Home: React.FC = () => (
  <main className="bg-white dark:bg-black">
    <FloatingRunes />
    <Navbar />
    <Hero />
    <TechStack />
    <DevActivity />
    <Footer />
    <MusicPrompt />
  </main>
);

export default Home;
