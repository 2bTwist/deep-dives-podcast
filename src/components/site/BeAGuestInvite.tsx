"use client";

import { useEffect, useState } from "react";

// Each profession carries its article so the question stays grammatical.
const PROFESSIONS = [
  { article: "a", word: "founder" },
  { article: "a", word: "planner" },
  { article: "a", word: "pastor" },
  { article: "a", word: "lobbyist" },
  { article: "an", word: "organizer" },
  { article: "a", word: "writer" },
  { article: "a", word: "therapist" },
] as const;

const HOLD_MS = 2200;
/** Matches the invite-word keyframes in globals.css. */
const SWAP_MS = 400;

type Phase = "idle" | "leave" | "enter";

/**
 * Be-a-Guest hero question. The profession swaps every 2.2s. The first
 * profession is the SSR'd word so the line is meaningful for crawlers;
 * rotation kicks in client-side. CSS keyframes run the swap, which keeps an
 * animation library out of the homepage bundle.
 */
export function BeAGuestInvite() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let swap: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      setPhase("leave");
      swap = setTimeout(() => {
        setI((prev) => (prev + 1) % PROFESSIONS.length);
        setPhase("enter");
      }, SWAP_MS);
    }, HOLD_MS);
    return () => {
      clearInterval(id);
      clearTimeout(swap);
    };
  }, []);

  const { article, word } = PROFESSIONS[i];

  return (
    <p className="font-display text-[44px] leading-[1.02] tracking-[-0.015em] text-paper sm:text-[64px] sm:leading-[1.0] lg:text-[96px]">
      Are you {article}{" "}
      <span
        aria-live="polite"
        className="relative inline-block align-baseline italic font-light text-gold"
      >
        <span key={word} data-invite-word={phase} className="inline-block">
          {word}
        </span>
      </span>
      ?
    </p>
  );
}
