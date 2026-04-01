import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Props {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
}

const MetricCard: React.FC<Props> = ({ icon, title, value, description }) => {
  const numRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || !numRef.current) return;
    hasAnimated.current = true;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate() {
        if (numRef.current) numRef.current.textContent = Math.floor(obj.val).toLocaleString();
      },
    });
  }, [value]);

  return (
    <div
      className="
        group flex flex-col gap-3 p-5
        border border-black/10 dark:border-white/10
        hover:border-black dark:hover:border-white
        transition-all duration-300
        bg-white dark:bg-black
      "
      data-cursor
    >
      <div className="text-red-500 w-5 h-5">{icon}</div>

      <div>
        <span
          ref={numRef}
          className="block text-3xl md:text-4xl font-black font-display tracking-tight leading-none"
        >
          {value.toLocaleString()}
        </span>
        <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
          {title}
        </span>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light hidden group-hover:block transition-all">
        {description}
      </p>
    </div>
  );
};

export default MetricCard;
