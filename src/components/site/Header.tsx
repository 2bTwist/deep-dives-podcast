"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";

const navLinks = [
  { label: "Episodes", href: "/episodes" },
  { label: "Articles", href: "/articles" },
  { label: "Guests",   href: "/guests" },
  { label: "About",    href: "/about" },
  { label: "Contact",  href: "/contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Intensify header backdrop after scrolling past the masthead.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 120);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock while overlay is open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Close on route change. Setting state in an effect is correct here:
  // mobile-nav openness reflects a route side effect, not derived state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Top-of-page gold rule — brand frame. Sits above everything. */}
      <div aria-hidden className="h-px w-full bg-gold-bright/70" />

      <header
        className={
          "sticky top-0 z-40 border-b transition-[background-color,backdrop-filter,border-color] duration-300 " +
          (scrolled
            ? "border-rule bg-ink/95 backdrop-blur-md"
            : "border-transparent bg-ink/70 backdrop-blur-[2px]")
        }
      >
        <div className="mx-auto flex h-[72px] max-w-content items-center justify-between px-8 lg:px-10">
          <Logo size={42} />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {navLinks.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={
                        "relative font-body text-[11px] uppercase tracking-[0.28em] transition-colors duration-200 " +
                        (active ? "text-gold" : "text-paper hover:text-gold")
                      }
                    >
                      {l.label}
                      {active && (
                        <span
                          aria-hidden
                          className="absolute -bottom-1.5 left-0 right-0 h-px bg-gold-bright"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-5 lg:gap-7">
            <SocialIcons className="hidden md:flex" />
            <a
              href="https://www.youtube.com/@DeepDives237?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden items-center gap-2.5 bg-gold px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright lg:inline-flex"
            >
              Subscribe
              <span className="text-[12px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((prev) => !prev)}
              className="grid h-11 w-11 place-items-center text-paper transition-colors hover:text-gold lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden
              >
                {open ? (
                  <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="17" x2="21" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay — only mounted while open. Fade-in via CSS animation,
          close is immediate so it doesn't keep paying backdrop-blur cost. */}
      {open && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Primary navigation"
          className="fixed inset-x-0 bottom-0 top-[72px] z-30 animate-fade-in bg-ink/[0.97] backdrop-blur-md lg:hidden"
        >
          <div className="flex h-full flex-col justify-between px-8 pb-12 pt-20">
            <nav aria-label="Mobile primary">
              <ul className="space-y-7">
                {navLinks.map((l) => {
                  const active = isActive(l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        className={
                          "group flex items-baseline justify-between font-display text-[44px] leading-none tracking-[-0.01em] transition-colors duration-200 " +
                          (active ? "text-gold" : "text-paper hover:text-gold")
                        }
                      >
                        <span>{l.label}</span>
                        <span className="text-[15px] opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-6">
              <a
                href="https://www.youtube.com/@DeepDives237?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright"
              >
                Subscribe on YouTube →
              </a>
              <SocialIcons />
              <p className="font-body italic text-sub text-[13px]">
                @DeepDives237 &middot; New episodes on YouTube.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
