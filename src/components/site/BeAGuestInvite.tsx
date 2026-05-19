"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const PROFESSIONS = [
  "founder",
  "planner",
  "pastor",
  "lobbyist",
  "organizer",
  "writer",
  "therapist",
] as const;

/**
 * Be-a-Guest hero question. Renders the section's <h2> with the profession
 * crossfading every 2.2s. The first profession is the SSR'd word so the
 * h2 is meaningful for crawlers; rotation kicks in client-side.
 */
export function BeAGuestInvite() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setI((prev) => (prev + 1) % PROFESSIONS.length);
    }, 2200);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <p className="font-display text-[44px] leading-[1.02] tracking-[-0.015em] text-paper sm:text-[64px] sm:leading-[1.0] lg:text-[96px]">
      Are you a{" "}
      <span
        aria-live="polite"
        className="relative inline-block align-baseline italic font-light text-gold"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={PROFESSIONS[i]}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -18 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {PROFESSIONS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
      ?
    </p>
  );
}
