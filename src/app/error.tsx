"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col bg-ink">
      <div aria-hidden className="h-px w-full bg-gold-bright/70" />
      <section className="relative flex-1">
        <div className="mx-auto grid min-h-[80vh] max-w-[1400px] place-items-center px-8 py-32 lg:px-10">
          <div className="text-center">
            <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
              Something broke
            </p>
            <h1 className="mt-6 font-display text-[64px] leading-[0.96] tracking-[-0.015em] lg:text-[96px]">
              Off the <span className="italic font-light text-sub">air.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-md font-body italic text-sub text-[18px] leading-[1.55]">
              An unexpected error interrupted the page. Try again — if it keeps happening, head
              home and we'll get you back on track.
            </p>
            {error?.digest ? (
              <p className="mt-4 font-body text-[11px] uppercase tracking-[0.28em] text-muted">
                Reference: {error.digest}
              </p>
            ) : null}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={reset}
                className="group inline-flex items-center gap-3 bg-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright"
              >
                Try Again
                <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">↻</span>
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-3 border border-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold transition-colors duration-200 hover:bg-gold/10"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
