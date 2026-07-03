import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { BeAGuestInvite } from "@/components/site/BeAGuestInvite";

/**
 * "Be a Guest!" conversion band — the rotating-profession headline + a
 * Get in Touch CTA. Shared by /about and the homepage. `className` sets the
 * outer section tone so it can slot into each page's background rhythm.
 */
export function BeAGuestSection({
  className = "relative bg-surface",
}: {
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-content px-8 py-24 text-center lg:px-10 lg:py-32">
        <Reveal>
          <h2 className="font-display text-[36px] leading-[1.0] tracking-[-0.015em] text-paper sm:text-[44px] lg:text-[56px]">
            Be a <span className="italic font-light text-sub">Guest!</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 lg:mt-14">
          <BeAGuestInvite />
        </Reveal>

        <Reveal delay={0.18} className="mt-12 flex justify-center lg:mt-16">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 bg-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright"
          >
            Get in Touch
            <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </Reveal>
      </div>
      <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />
    </section>
  );
}
