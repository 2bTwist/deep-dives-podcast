import Link from "next/link";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";

const footerNav = [
  { label: "Episodes", href: "/episodes" },
  { label: "Guests",   href: "/guests" },
  { label: "About",    href: "/about" },
  { label: "Contact",  href: "/contact" },
] as const;

const platforms = [
  { label: "YouTube",      href: "https://www.youtube.com/@DeepDives237" },
  { label: "Apple Podcasts", href: "#" },
  { label: "Spotify",      href: "#" },
  { label: "RSS",          href: "#" },
] as const;

export function Footer() {
  return (
    <footer className="relative bg-ink">
      <div aria-hidden className="mx-auto h-px max-w-[1400px] bg-rule" />

      <div className="mx-auto max-w-[1400px] px-8 py-20 lg:px-10 lg:py-24">
        {/* Top grid — brand + nav + platforms */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Logo withWordmark size={56} />
            <p className="mt-8 max-w-sm font-body italic text-sub text-[18px] leading-[1.55]">
              Genuine conversations that inspire, educate, and empower. Real stories. Real people.
              Real impact.
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
                    className="font-body text-[15px] text-paper transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Listen column */}
          <div className="lg:col-span-3">
            <p className="font-body text-[12px] uppercase tracking-[0.32em] text-muted">Listen</p>
            <ul className="mt-6 space-y-3">
              {platforms.map((p) => (
                <li key={p.label}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-[15px] text-paper transition-colors hover:text-gold"
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row — social + meta */}
        <div className="mt-16 flex flex-col gap-6 border-t border-rule pt-8 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <SocialIcons />
          <p className="font-body italic text-sub text-[13px]">
            © {new Date().getFullYear()} Deep Dives Podcast. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
