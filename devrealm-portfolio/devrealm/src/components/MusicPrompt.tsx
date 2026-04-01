import React, { useEffect, useRef, useState } from 'react';
import { FiMusic, FiVolumeX, FiVolume2 } from 'react-icons/fi';

const MusicPrompt: React.FC = () => {
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [shown,   setShown]   = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the prompt after 2 seconds
    const t = setTimeout(() => {
      setShown(true);
      setTimeout(() => setVisible(true), 50);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  const toggle = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/music/ambient.mp3');
      audioRef.current.loop   = true;
      audioRef.current.volume = 0.3;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        console.warn('Audio autoplay blocked');
      }
    }
  };

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => setShown(false), 300);
  };

  if (!shown) return null;

  return (
    <div
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-4
        px-6 py-4
        bg-white dark:bg-black
        border border-black/20 dark:border-white/20
        shadow-2xl
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <FiMusic className="text-red-500 flex-shrink-0" />
      <span className="font-mono text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
        Ambient soundtrack available
      </span>
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest
                   px-3 py-1.5 border border-black dark:border-white
                   hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                   transition-all"
      >
        {playing ? <FiVolumeX className="w-3 h-3" /> : <FiVolume2 className="w-3 h-3" />}
        {playing ? 'Mute' : 'Play'}
      </button>
      <button
        onClick={dismiss}
        className="font-mono text-[10px] text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

export default MusicPrompt;
