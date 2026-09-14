"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, applied when the element scrolls into view. */
  delay?: number;
};

type RevealState = "visible" | "waiting" | "shown";

/**
 * Scroll-triggered fade-up wrapper. Content is server-rendered fully visible,
 * so whatever is on screen at load paints on the first frame and counts toward
 * LCP without waiting for JavaScript. After hydration, elements that start
 * below the fold are hidden and fade up as they scroll into view. Styles live
 * in globals.css under [data-reveal-state]; reduced motion skips all of it.
 */
export function Reveal({ delay = 0, children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    // Hiding happens off screen, so it is never a visible flash.
    setState("waiting");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        io.disconnect();
      },
      { rootMargin: "-80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal-state={state}
      style={delay > 0 ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
