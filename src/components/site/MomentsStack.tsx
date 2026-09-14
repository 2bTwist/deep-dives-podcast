"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";

export type Moment = {
  src: string;
  alt: string;
  vol: string;
  tag: string;
};

// Bottom-up rotations: depth 0 = bottom of deck, last = top card.
const ROTATIONS = [-4, 2.5, -2, 3] as const;
const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export function MomentsStack({
  moments,
  intervalMs = 6000,
}: {
  moments: Moment[];
  intervalMs?: number;
}) {
  const reduce = useReducedMotion();
  const n = moments.length;
  const [step, setStep] = useState(0);
  const [peelDir, setPeelDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(true);

  const peel = (dir: 1 | -1 = 1) => {
    setPeelDir(dir);
    setStep((s) => s + 1);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (!paused && inViewRef.current && !document.hidden) peel(1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [reduce, intervalMs, paused]);

  const topIdx = ((step % n) + n) % n;

  return (
    <div className="relative mx-auto" style={{ width: "min(360px, 78vw)" }}>
      <div
        ref={containerRef}
        className="relative select-none"
        style={{ aspectRatio: "5 / 7" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Bottom 3 cards — depth 0 (back) → 2 (just under top) */}
        {[0, 1, 2].map((depth) => {
          const stackPos = n - 1 - depth; // 3 = bottom, 1 = just under top
          const id = (((step + stackPos) % n) + n) % n;
          const rot = ROTATIONS[depth];
          const lift = (2 - depth) * 4; // px nudge — top of base shows a sliver
          return (
            <motion.div
              key={`base-${depth}`}
              className="absolute inset-0"
              style={{ zIndex: depth }}
              animate={{
                rotate: rot,
                y: -lift,
                scale: 1 - (2 - depth) * 0.015,
              }}
              transition={{ duration: 0.55, ease: EASE_EDITORIAL }}
            >
              <PolaroidCard moment={moments[id]} />
            </motion.div>
          );
        })}

        {/* Top card — AnimatePresence handles peel-off */}
        <AnimatePresence initial={false} custom={peelDir}>
          <motion.div
            key={step}
            className="absolute inset-0"
            style={{ zIndex: 10, touchAction: "pan-y" }}
            custom={peelDir}
            variants={{
              initial: {
                x: 0,
                y: -8,
                rotate: ROTATIONS[2],
                opacity: 1,
                scale: 0.985,
              },
              center: {
                x: 0,
                y: -12,
                rotate: ROTATIONS[3],
                opacity: 1,
                scale: 1,
              },
              peel: (dir: number) => ({
                x: `${dir * 135}%`,
                y: "-18%",
                rotate: dir * 30,
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.7, ease: EASE_EDITORIAL },
              }),
            }}
            initial="initial"
            animate="center"
            exit="peel"
            transition={{ duration: 0.55, ease: EASE_EDITORIAL }}
            drag={!reduce ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.55}
            whileDrag={{ scale: 1.02 }}
            whileTap={!reduce ? { scale: 0.985 } : undefined}
            onDragEnd={(_, info: PanInfo) => {
              const x = info.offset.x;
              const v = info.velocity.x;
              if (Math.abs(x) > 80 || Math.abs(v) > 500) {
                peel(x >= 0 ? 1 : -1);
              }
            }}
            onTap={(e) => {
              // ignore drag-tap noise
              if (e && "detail" in e && (e as MouseEvent).detail === 0) return;
              peel(1);
            }}
            role="button"
            tabIndex={0}
            aria-label={`${moments[topIdx].tag} — tap or swipe for next moment`}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
                e.preventDefault();
                peel(1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                peel(-1);
              }
            }}
          >
            <PolaroidCard moment={moments[topIdx]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicator pips */}
      <div className="mt-7 flex items-center justify-center gap-2">
        {moments.map((_, i) => {
          const active = i === topIdx;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (i === topIdx) return;
                const forward = (((i - topIdx) % n) + n) % n;
                const backward = n - forward;
                const dir: 1 | -1 = forward <= backward ? 1 : -1;
                const count = dir === 1 ? forward : backward;
                setPeelDir(dir);
                setStep((s) => s + dir * count);
              }}
              aria-label={`Show moment ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                active ? "w-6 bg-gold" : "w-1.5 bg-gold/35 hover:bg-gold/60"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

// Images load lazily: the stack sits far below the fold on /about, and a
// preload here would compete with the portrait, which is the page's LCP.
function PolaroidCard({ moment }: { moment: Moment }) {
  return (
    <div
      className="relative h-full w-full bg-paper ring-1 ring-black/5"
      style={{
        boxShadow:
          "0 30px 60px -18px rgba(0,0,0,0.65), 0 10px 24px -10px rgba(0,0,0,0.45)",
      }}
    >
      {/* Photo well */}
      <div className="px-[5.5%] pt-[5.5%]">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink">
          <Image
            src={moment.src}
            alt={moment.alt}
            fill
            sizes="(min-width: 768px) 360px, 78vw"
            className="object-cover"
            draggable={false}
          />
          {/* gold corner ornaments */}
          <span
            aria-hidden
            className="absolute left-2 top-2 h-3 w-3 border-l border-t border-gold/85"
          />
          <span
            aria-hidden
            className="absolute right-2 top-2 h-3 w-3 border-r border-t border-gold/85"
          />
          <span
            aria-hidden
            className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-gold/85"
          />
          <span
            aria-hidden
            className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-gold/85"
          />
        </div>
      </div>
      {/* Caption matte */}
      <div className="flex items-end justify-between px-[6%] pt-3.5 pb-[6%]">
        <div className="min-w-0">
          <p className="truncate font-display text-[15px] italic leading-none text-ink/90">
            {moment.tag}
          </p>
          <p className="mt-1.5 font-body text-[9px] uppercase tracking-[0.32em] text-ink/55">
            Off the Mic
          </p>
        </div>
        <p
          aria-hidden
          className="ml-2 shrink-0 font-display text-[22px] italic leading-none text-gold/90"
        >
          {moment.vol}
        </p>
      </div>
    </div>
  );
}
