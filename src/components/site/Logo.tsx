import Link from "next/link";
import Image from "next/image";

/**
 * Official Deep Dives D-monogram (her real brand mark).
 * Source: youtube.com/@DeepDives237 channel avatar.
 * White-bg circle preserved (matches how it appears on YouTube + her own brand).
 */
export function Logo({
  withWordmark = false,
  size = 44,
}: {
  withWordmark?: boolean;
  size?: number;
}) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="Deep Dives Podcast, home">
      <span
        className="relative inline-block overflow-hidden rounded-full bg-paper ring-1 ring-gold/60 transition-all duration-300 group-hover:ring-gold-bright"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/raissa-avatar.png"
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
      </span>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-paper text-[16px] tracking-[0.16em] uppercase">
            Deep Dives
          </span>
          <span className="font-body italic text-gold text-[11px] tracking-[0.04em] mt-1">
            podcast with raissa
          </span>
        </span>
      )}
    </Link>
  );
}
