import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight, FiGithub, FiCornerDownRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  arch?: string;
}

const PROJECTS: Project[] = [
  {
    title: 'Campus Management ERP',
    description:
      'Full-stack microservices ERP for campus operations — auth, payments, notifications. ' +
      'Spring Boot services on AWS ECS Fargate behind an Application Load Balancer. ' +
      'Kafka event bus, PostgreSQL + MongoDB dual persistence, Redis session cache.',
    tags: ['Java', 'Spring Boot', 'AWS ECS', 'Kafka', 'PostgreSQL', 'Redis', 'Docker'],
    arch: `
Client → CloudFront → ALB
  └─ Auth Service   (Spring Security + PostgreSQL)
  └─ Core Service   (Spring Boot + MongoDB + Redis)
  └─ Payment Service (Node.js + Stripe)
  └─ Notification   (SES + Kafka consumer)
    `,
  },
  {
    title: 'DevRealm',
    description:
      'Transform any GitHub profile into an interactive 3D RPG city. ' +
      'Three.js isometric city, RPG character system, achievement engine, ' +
      'AI roast generator and holographic share cards. ' +
      'Single-file zero-dependency frontend.',
    tags: ['Three.js', 'GitHub API', 'Vanilla JS', 'CSS', 'HTML'],
    live: 'https://devrealm.vercel.app',
    github: 'https://github.com/shivrajcodez/DevRealm',
  },
  {
    title: 'Distributed Task Queue',
    description:
      'High-throughput background job processor built on Redis + Bull. ' +
      'Supports retry strategies, dead-letter queues, priority lanes, and ' +
      'a real-time monitoring dashboard.',
    tags: ['Node.js', 'Redis', 'Bull', 'TypeScript', 'Docker'],
  },
  {
    title: 'CI/CD Pipeline Toolkit',
    description:
      'Reusable GitHub Actions workflows for Java + Spring Boot projects. ' +
      'Automated test, build, Docker push to ECR, and blue-green ECS deploy.',
    tags: ['GitHub Actions', 'AWS ECR', 'AWS ECS', 'Docker', 'Bash'],
  },
];

const ARCH_DIAGRAM = `
┌─────────────────────────────────────────────────────────┐
│                    VPC (Private Cloud)                   │
│                                                          │
│  User ──► CloudFront ──► ALB                             │
│                           │                             │
│              ┌────────────┴────────────┐                │
│              │    ECS Cluster (Fargate) │                │
│              │                         │                │
│           Auth Svc    Core Svc    Pay Svc               │
│              │           │           │                  │
│          PostgreSQL   MongoDB     Stripe                 │
│                         │                               │
│                       Redis ◄──── Session               │
│                         │                               │
│                       Kafka ──► Notification Svc        │
│                                      │                  │
│                                   AWS SES               │
└─────────────────────────────────────────────────────────┘
`;

const Engineering: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.proj-card', {
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-white dark:bg-black min-h-screen">
      <Navbar />

      <div ref={ref} className="pt-32 pb-24 px-6 md:px-16 max-w-8xl mx-auto">

        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <FiCornerDownRight className="text-red-500 w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest text-red-500">
              Engineering // Projects
            </span>
          </div>
          <h1 className="text-[12vw] md:text-[7vw] font-black uppercase
                         leading-[0.85] tracking-tighter text-black dark:text-white">
            WHAT I
            <br />
            <span className="text-transparent text-stroke-responsive opacity-40">BUILD</span>
          </h1>
        </div>

        {/* Architecture diagram */}
        <div className="mb-20 p-6 md:p-10 bg-zinc-50 dark:bg-zinc-950
                        border border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-red-500">
              System Architecture — Campus ERP
            </span>
          </div>
          <pre className="font-mono text-[11px] md:text-xs text-zinc-600 dark:text-zinc-400
                          leading-relaxed overflow-x-auto whitespace-pre">
            {ARCH_DIAGRAM}
          </pre>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="proj-card group flex flex-col gap-5 p-8
                         border border-black/10 dark:border-white/10
                         hover:border-black dark:hover:border-white
                         transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                  {p.title}
                </h2>
                <div className="flex gap-3 flex-shrink-0">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <FiGithub className="w-4 h-4" />
                    </a>
                  )}
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <FiArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                {p.description}
              </p>

              {p.arch && (
                <pre className="font-mono text-[10px] text-zinc-500 bg-zinc-50 dark:bg-zinc-950
                                p-4 leading-relaxed overflow-x-auto whitespace-pre border-l-2
                                border-red-500">
                  {p.arch}
                </pre>
              )}

              <div className="flex flex-wrap gap-2 mt-auto pt-4
                              border-t border-black/10 dark:border-white/10">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase tracking-widest
                               px-2 py-1 border border-black/15 dark:border-white/15
                               text-zinc-500 hover:border-red-500 hover:text-red-500
                               transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Engineering;
