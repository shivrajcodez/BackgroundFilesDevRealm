import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FiCornerDownRight, FiSend, FiUser } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

gsap.registerPlugin();

interface Entry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

/* Seeded starter entries so the page never looks empty */
const SEED_ENTRIES: Entry[] = [
  {
    id: '1',
    name: 'Visitor_01',
    message: 'Great portfolio! The 3D city visualization is insane 🔥',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    name: 'Recruiter_XYZ',
    message: 'Impressive backend architecture. Would love to connect.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const GuestBook: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<Entry[]>(() => {
    try {
      const stored = localStorage.getItem('guestbook');
      return stored ? [...JSON.parse(stored), ...SEED_ENTRIES] : SEED_ENTRIES;
    } catch {
      return SEED_ENTRIES;
    }
  });
  const [name,    setName]    = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.entry-row', {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
        delay: 0.3,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSending(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate network

    const entry: Entry = {
      id:        Date.now().toString(),
      name:      name.trim(),
      message:   message.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = [entry, ...entries];
    setEntries(updated);

    // Persist user-submitted entries only
    try {
      const userEntries = updated.filter(
        (e) => !SEED_ENTRIES.find((s) => s.id === e.id),
      );
      localStorage.setItem('guestbook', JSON.stringify(userEntries));
    } catch { /* storage full */ }

    setName('');
    setMessage('');
    setSending(false);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <main className="bg-white dark:bg-black min-h-screen">
      <Navbar />

      <div ref={ref} className="pt-32 pb-24 px-6 md:px-16 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <FiCornerDownRight className="text-red-500 w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest text-red-500">
              Guestbook // Sign
            </span>
          </div>
          <h1 className="text-[12vw] md:text-[6vw] font-black uppercase
                         leading-[0.85] tracking-tighter text-black dark:text-white">
            LEAVE A
            <br />
            <span className="text-transparent text-stroke-responsive opacity-40">
              MESSAGE
            </span>
          </h1>
          <p className="mt-6 text-sm text-zinc-500 font-light max-w-md">
            Say hello, leave feedback, or drop your GitHub handle.
            Messages are stored locally in your browser.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={submit}
          className="mb-16 p-8 border border-black/10 dark:border-white/10
                     hover:border-black dark:hover:border-white transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="Your name or handle"
                required
                className="bg-transparent border-b border-black/20 dark:border-white/20
                           focus:border-black dark:focus:border-white
                           outline-none py-2 text-sm font-mono transition-colors
                           placeholder:text-zinc-400"
              />
            </div>
            <div className="flex items-end">
              <span className="font-mono text-[10px] text-zinc-400">
                {message.length} / 200
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-8">
            <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Write something nice..."
              required
              className="bg-transparent border-b border-black/20 dark:border-white/20
                         focus:border-black dark:focus:border-white
                         outline-none py-2 text-sm font-mono resize-none transition-colors
                         placeholder:text-zinc-400"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 px-6 py-3
                       bg-black text-white dark:bg-white dark:text-black
                       font-mono text-xs uppercase tracking-widest
                       hover:opacity-80 disabled:opacity-40
                       transition-all"
          >
            {sending ? (
              'Sending...'
            ) : done ? (
              '✓ Signed!'
            ) : (
              <>
                Sign Guestbook <FiSend className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Entries */}
        <div className="space-y-0">
          <div className="flex items-center justify-between mb-6
                          border-b-2 border-black dark:border-white pb-2">
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Messages
            </h2>
            <span className="font-mono text-xs text-zinc-500">
              {entries.length} total
            </span>
          </div>

          {entries.map((entry) => (
            <div
              key={entry.id}
              className="entry-row flex gap-4 py-6
                         border-b border-black/10 dark:border-white/10
                         hover:border-black/30 dark:hover:border-white/30
                         transition-colors"
            >
              <div className="w-8 h-8 flex items-center justify-center
                              border border-black/20 dark:border-white/20
                              flex-shrink-0">
                <FiUser className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-bold text-sm uppercase tracking-tight">
                    {entry.name}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">
                    {timeAgo(entry.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400
                              font-light leading-relaxed">
                  {entry.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default GuestBook;
