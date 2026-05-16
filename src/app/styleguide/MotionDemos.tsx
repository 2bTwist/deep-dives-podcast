"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, reveal, stagger, microHover } from "@/lib/motion";

/** Staggered page-load reveal — the hero pattern. */
export function HeroRevealDemo() {
  const reduced = useReducedMotion();
  const items = [
    { kind: "eyebrow", text: "I — Real Stories. Real People. Real Impact." },
    { kind: "display", text: "Deep Dives" },
    { kind: "script", text: "Podcast" },
    { kind: "body", text: "Genuine conversations that inspire, educate, and empower." },
    { kind: "cta", text: "Watch Latest Episode" },
  ];

  return (
    <motion.div
      initial={reduced ? false : stagger(0.1, 0.12).initial}
      animate={stagger(0.1, 0.12).animate}
      className="space-y-5"
    >
      {items.map((it, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : reveal.initial}
          animate={reveal.animate}
          transition={reveal.transition}
        >
          {it.kind === "eyebrow" && (
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">{it.text}</p>
          )}
          {it.kind === "display" && (
            <p className="font-display text-[88px] leading-[0.95] -tracking-[0.01em]">{it.text}</p>
          )}
          {it.kind === "script" && (
            <p className="font-script text-gold text-[88px] leading-[0.85] -mt-3 -ml-1">{it.text}</p>
          )}
          {it.kind === "body" && (
            <p className="font-body text-sub text-[18px] leading-[1.55] max-w-md italic">{it.text}</p>
          )}
          {it.kind === "cta" && (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              transition={microHover.transition}
              className="mt-3 inline-flex items-center gap-3 bg-gold px-7 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
            >
              {it.text}
              <span className="text-[14px]">→</span>
            </motion.button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

/** Scroll-triggered fadeUp — section-level reveal. */
export function FadeUpDemo() {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : fadeUp.initial}
      whileInView={fadeUp.whileInView}
      viewport={fadeUp.viewport}
      transition={fadeUp.transition}
      className="border-t border-l border-rule px-10 py-14"
    >
      <p className="font-display text-3xl">This block reveals on scroll.</p>
      <p className="mt-3 text-sub italic">
        Duration 0.8s · expo-out · viewport margin -80px · respects prefers-reduced-motion.
      </p>
    </motion.div>
  );
}

/** Micro-hover button — fast, subtle. */
export function MicroHoverButton() {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={microHover.transition}
      className="inline-flex items-center gap-3 bg-gold px-7 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
    >
      Hover me
      <span className="text-[14px]">→</span>
    </motion.button>
  );
}
