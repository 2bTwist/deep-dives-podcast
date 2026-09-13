"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { DropCap } from "./DropCap";

export function CommunitySection() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

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
    } catch {
      setState("error");
    }
  }

  return (
    <section className="relative bg-ink">
      <div className="mx-auto max-w-content px-8 py-24 lg:px-10 lg:py-28">
        <Reveal className="relative overflow-hidden bg-gold text-ink">
          {/* hairline ink rule inset */}
          <span aria-hidden className="absolute inset-x-8 top-0 h-px bg-ink/20" />
          <span aria-hidden className="absolute inset-x-8 bottom-0 h-px bg-ink/20" />

          <div className="grid gap-10 px-8 py-14 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:py-20">
            {/* Left — copy */}
            <div className="lg:col-span-6">
              <h2 className="font-display text-[44px] leading-[1.0] tracking-[-0.015em] text-ink lg:text-[56px]">
                <DropCap letter="F" color="ink" />irst in line
                <span className="italic font-light"> when a new episode drops.</span>
                <span className="clear-both block" />
              </h2>
              <p className="mt-5 max-w-md font-body italic text-ink/80 text-[18px] leading-[1.5]">
                I&rsquo;ll send the new episode when it&rsquo;s out, plus the occasional
                note about who&rsquo;s coming on next. No spam, ever.
              </p>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-6 lg:flex lg:items-end">
              <form onSubmit={submit} className="w-full">
                {/* Honeypot — hidden from humans, tempting to bots. */}
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
                {state === "success" ? (
                  <div className="border border-ink/30 p-8">
                    <p className="font-body text-[12px] uppercase tracking-[0.32em] text-ink/80">
                      You&rsquo;re in.
                    </p>
                    <p className="mt-3 font-display italic text-[28px] leading-[1.2] text-ink">
                      Talk soon.
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
                {state === "error" ? (
                  <p role="alert" className="mt-4 font-body text-[13px] font-medium text-ink underline decoration-ink/40 underline-offset-2">
                    Something went wrong. Please try again.
                  </p>
                ) : (
                  <p className="mt-4 font-body italic text-ink/60 text-[13px]">
                    No spam, ever.
                  </p>
                )}
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
