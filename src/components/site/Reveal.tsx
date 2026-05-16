"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Delay before this element's reveal starts. Use for staggered grids. */
  delay?: number;
};

/** Scroll-triggered fade-up wrapper. Renders a plain div under prefers-reduced-motion. */
export function Reveal({ delay = 0, children, className }: Props) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      initial={fadeUp.initial}
      whileInView={fadeUp.whileInView}
      viewport={fadeUp.viewport}
      transition={{ ...fadeUp.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
