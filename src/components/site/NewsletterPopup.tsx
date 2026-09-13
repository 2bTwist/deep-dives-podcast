"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const DISMISS_KEY = "dd_news_popup_dismissed";
const SUBSCRIBED_KEY = "dd_news_subscribed";
const DISMISS_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const DELAY_MS = 30_000;

// Routes where the popup never shows (its own funnel surface / studio).
const SUPPRESSED = ["/studio", "/contact"];

function eligible(): boolean {
  try {
    if (localStorage.getItem(SUBSCRIBED_KEY)) return false;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - Number(dismissed) < DISMISS_WINDOW_MS) return false;
  } catch {
    // localStorage unavailable (privacy mode) — show once this session is fine.
  }
  return true;
}

export function NewsletterPopup() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const suppressed = SUPPRESSED.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Arm the 30s timer once per eligible page load.
  useEffect(() => {
    if (suppressed || !eligible()) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [suppressed]);

  const close = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, []);

  // Focus management + Escape + focus trap while open.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, close]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      if (!res.ok) throw new Error("request failed");
      setState("success");
      setEmail("");
      try {
        localStorage.setItem(SUBSCRIBED_KEY, "1");
      } catch {
        /* ignore */
      }
      setTimeout(() => setOpen(false), 1800);
    } catch {
      setState("error");
    }
  }

  const fade = reduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };
  const panelInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 };
  const panelAnimate = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-popup-title"
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelInitial}
            transition={fade}
            className="relative w-full max-w-md border border-gold/30 bg-card p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] lg:p-10"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center text-muted transition-colors hover:text-gold"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            {state === "success" ? (
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.32em] text-gold">
                  You&rsquo;re in.
                </p>
                <p className="mt-3 font-display italic text-[30px] leading-[1.15] text-paper">
                  Talk soon.
                </p>
              </div>
            ) : (
              <>
                <p className="font-body text-[11px] uppercase tracking-[0.32em] text-gold">
                  Deep Dives
                </p>
                <h2
                  id="news-popup-title"
                  className="mt-3 font-display text-[30px] leading-[1.1] tracking-[-0.01em] text-paper"
                >
                  First in line when a new episode drops.
                </h2>
                <p className="mt-3 font-body italic text-sub text-[15px] leading-[1.55]">
                  The new episode when it&rsquo;s out, plus a note on who&rsquo;s coming on
                  next. No spam, ever.
                </p>

                <form onSubmit={submit} className="mt-6 space-y-3">
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />
                  <label className="block">
                    <span className="sr-only">Email address</span>
                    <input
                      ref={inputRef}
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="your@email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 w-full border border-rule bg-transparent px-4 font-body text-[16px] text-paper placeholder:text-muted focus:border-gold focus:outline-none"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="group inline-flex h-14 w-full items-center justify-center gap-3 bg-gold px-7 font-body text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright disabled:opacity-50"
                  >
                    {state === "submitting" ? "Joining..." : "Join the List"}
                    {state !== "submitting" && (
                      <span className="text-[13px] transition-transform group-hover:translate-x-0.5">→</span>
                    )}
                  </button>
                  {state === "error" && (
                    <p role="alert" className="font-body text-[13px] text-youtube">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
