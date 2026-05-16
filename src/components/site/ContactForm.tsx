"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { microHover } from "@/lib/motion";

const subjects = [
  "Guest pitch",
  "Press inquiry",
  "Partnership",
  "Just saying hi",
  "Something else",
] as const;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<(typeof subjects)[number]>("Just saying hi");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setState("submitting");
    // TODO: wire to Resend / Formspree / Supabase. Frontend-only for now.
    await new Promise((r) => setTimeout(r, 700));
    setState("success");
    setName("");
    setEmail("");
    setMessage("");
  }

  if (state === "success") {
    return (
      <div className="border border-rule bg-card p-10 lg:p-12">
        <p className="font-body text-[12px] uppercase tracking-[0.32em] text-gold">
          Message Received
        </p>
        <p className="mt-4 font-display italic text-[40px] leading-[1.1] text-paper">
          Thank you for writing.
        </p>
        <p className="mt-5 max-w-md font-body italic text-sub text-[16px] leading-[1.55]">
          I read every note. You'll hear back from us — usually within a week. Often sooner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="block font-body text-[11px] uppercase tracking-[0.32em] text-gold">
            Your Name
          </span>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-3 h-14 w-full border border-rule bg-transparent px-4 font-body text-[16px] text-paper placeholder:text-muted focus:border-gold focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="block font-body text-[11px] uppercase tracking-[0.32em] text-gold">
            Your Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-3 h-14 w-full border border-rule bg-transparent px-4 font-body text-[16px] text-paper placeholder:text-muted focus:border-gold focus:outline-none"
          />
        </label>
      </div>

      <fieldset>
        <legend className="block font-body text-[11px] uppercase tracking-[0.32em] text-gold">
          Subject
        </legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {subjects.map((s) => {
            const active = subject === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSubject(s)}
                className={
                  "border px-4 py-2 font-body text-[12px] uppercase tracking-[0.18em] transition-colors duration-200 " +
                  (active
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-rule text-muted hover:border-gold/60 hover:text-paper")
                }
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="block">
        <span className="block font-body text-[11px] uppercase tracking-[0.32em] text-gold">
          Your Message
        </span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what's on your mind. The longer the better."
          className="mt-3 w-full border border-rule bg-transparent px-4 py-4 font-body text-[16px] leading-[1.55] text-paper placeholder:text-muted focus:border-gold focus:outline-none"
        />
      </label>

      <motion.button
        type="submit"
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={microHover.transition}
        disabled={state === "submitting"}
        className="group inline-flex h-14 items-center justify-center gap-3 bg-gold px-8 font-body text-[12px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright disabled:opacity-50"
      >
        {state === "submitting" ? "Sending..." : "Send Message"}
        {state !== "submitting" && (
          <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        )}
      </motion.button>
    </form>
  );
}
