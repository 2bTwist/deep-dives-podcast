"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, applied after element enters viewport. */
  delay?: number;
};

/**
 * Scroll-triggered fade-up wrapper using IntersectionObserver + CSS transitions.
 * Replaces the previous motion-based Reveal so this component contributes
 * zero JS beyond the IO hook to the main bundle.
 *
 * Respects prefers-reduced-motion: renders shown immediately, no transition.
 */
export function Reveal({ delay = 0, children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (delay > 0) {
          setTimeout(() => setShown(true), delay * 1000);
        } else {
          setShown(true);
        }
        io.disconnect();
      },
      { rootMargin: "-80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition:
          "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: shown ? undefined : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
