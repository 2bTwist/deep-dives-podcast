"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";

export function CommunitySection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("submitting");
    // TODO: wire to Resend / ConvertKit / Supabase. Frontend-only for now.
    await new Promise((r) => setTimeout(r, 600));
    setState("success");
    setEmail("");
  }

  return (
    <section className="relative bg-ink">
      <div className="mx-auto max-w-[1400px] px-8 py-24 lg:px-10 lg:py-28">
        <Reveal className="relative overflow-hidden bg-gold text-ink">
          {/* hairline ink rule inset */}
          <span aria-hidden className="absolute inset-x-8 top-0 h-px bg-ink/20" />
          <span aria-hidden className="absolute inset-x-8 bottom-0 h-px bg-ink/20" />

          <div className="grid gap-10 px-8 py-14 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:py-20">
            {/* Left — copy */}
            <div className="lg:col-span-6">
              <p className="font-body text-[12px] uppercase tracking-[0.32em] text-ink/70">
                The Community
              </p>
              <h2 className="mt-5 font-display text-[44px] leading-[1.0] tracking-[-0.015em] text-ink lg:text-[56px]">
                Join the conversation <span className="italic font-light">before it airs.</span>
              </h2>
              <p className="mt-5 max-w-md font-body italic text-ink/80 text-[18px] leading-[1.5]">
                New episodes, behind-the-scenes notes, and the occasional thought too long for an
                Instagram caption. No spam, ever.
              </p>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-6 lg:flex lg:items-end">
              <form onSubmit={submit} className="w-full">
                {state === "success" ? (
                  <div className="border border-ink/30 p-8">
                    <p className="font-body text-[12px] uppercase tracking-[0.32em] text-ink/80">
                      You're in.
                    </p>
                    <p className="mt-3 font-display italic text-[28px] leading-[1.2] text-ink">
                      Welcome to the long-form.
                    </p>
                    <p className="mt-3 font-body italic text-ink/80 text-[14px]">
                      Next email lands when the next episode drops.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <label className="block">
                      <span className="sr-only">Email address</span>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="your@email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 w-full border border-ink/40 bg-transparent px-5 font-body text-[16px] text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={state === "submitting"}
                      className="group inline-flex h-14 items-center justify-center gap-3 bg-ink px-7 font-body text-[11px] uppercase tracking-[0.24em] text-paper transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-deep-gray disabled:opacity-50"
                    >
                      {state === "submitting" ? "Joining..." : "Join the List"}
                      {state !== "submitting" && (
                        <span className="text-[14px] transition-transform group-hover:translate-x-0.5">→</span>
                      )}
                    </button>
                  </div>
                )}
                <p className="mt-4 font-body italic text-ink/60 text-[13px]">
                  No spam, ever.
                </p>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
