import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger);

// SplitText is a Club GreenSock plugin — we do a manual char split as fallback
interface Props {
  text: string;
  className?: string;
}

const ScrollRevealText: React.FC<Props> = ({ text, className = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Split text into individual character spans manually
    const chars = text.split('').map((ch) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      return span;
    });

    el.innerHTML = '';
    chars.forEach((s) => el.appendChild(s));

    const ctx = gsap.context(() => {
      gsap.from(chars, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, [text]);

  return <span ref={ref} className={className}>{text}</span>;
};

export default ScrollRevealText;
