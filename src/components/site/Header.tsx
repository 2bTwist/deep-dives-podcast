import Link from "next/link";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";

const navLinks = [
  { label: "Episodes", href: "/episodes" },
  { label: "Guests",   href: "/guests" },
  { label: "About",    href: "/about" },
  { label: "Contact",  href: "/contact" },
] as const;

export function Header() {
  return (
    <>
      {/* Top-of-page gold rule — brand frame. Sits above everything. */}
      <div aria-hidden className="h-px w-full bg-gold-bright/70" />

      <header className="sticky top-0 z-40 border-b border-rule bg-ink/85 backdrop-blur-[2px]">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-8 lg:px-10">
          {/* Left — monogram */}
          <Logo size={42} />

          {/* Center — nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-[11px] uppercase tracking-[0.28em] text-paper transition-colors duration-200 hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right — social + Subscribe */}
          <div className="flex items-center gap-7">
            <SocialIcons className="hidden md:flex" />
            <a
              href="https://www.youtube.com/@DeepDives237?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 bg-gold px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-200 hover:bg-gold-bright"
            >
              Subscribe
              <span className="text-[12px] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
