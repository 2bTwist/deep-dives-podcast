import Link from "next/link";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";

const footerNav = [
  { label: "Episodes", href: "/episodes" },
  { label: "Guests",   href: "/guests" },
  { label: "About",    href: "/about" },
  { label: "Contact",  href: "/contact" },
] as const;

const legalNav = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms",   href: "/terms" },
] as const;

export function Footer() {
  return (
    <footer className="relative bg-ink">
      <div aria-hidden className="mx-auto h-px max-w-content bg-rule" />

      <div className="mx-auto max-w-content px-8 py-20 lg:px-10 lg:py-24">
        {/* Top grid — brand + nav + listen */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Logo withWordmark size={56} />
            <p className="mt-8 max-w-sm font-body italic text-sub text-[18px] leading-[1.55]">
              A show with Raissa. Going deep on the questions that shape modern life,
              with the experts who actually live them.
            </p>
            <p className="mt-8 font-body text-[12px] uppercase tracking-[0.32em] text-gold">
              @DeepDives237
            </p>
          </div>

          {/* Navigation column */}
          <div className="lg:col-span-3 lg:col-start-7">
            <p className="font-body text-[12px] uppercase tracking-[0.32em] text-muted">Explore</p>
            <ul className="mt-6 space-y-3">
              {footerNav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group relative inline-block font-body text-[15px] text-paper transition-colors hover:text-gold"
                  >
                    {l.label}
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Listen column */}
          <div className="lg:col-span-3">
            <p className="font-body text-[12px] uppercase tracking-[0.32em] text-muted">Listen</p>
            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href="https://www.youtube.com/@DeepDives237"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-block font-body text-[15px] text-paper transition-colors hover:text-gold"
                >
                  YouTube
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@DeepDives237?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-block font-body text-[15px] text-paper transition-colors hover:text-gold"
                >
                  Subscribe
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row — social + legal + meta */}
        <div className="mt-16 flex flex-col gap-6 border-t border-rule pt-8 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <SocialIcons />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <ul className="flex items-center gap-6">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-[13px] text-muted transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="font-body italic text-sub text-[13px]">
              © {new Date().getFullYear()} Deep Dives Podcast. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
