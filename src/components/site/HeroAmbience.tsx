/**
 * Atmospheric flourishes for the centered hero — sparkles only.
 * Small gold "✦" stars scattered around the masthead, gentle pulse
 * animation. No bloom, no blur, no other ornaments.
 */
export function HeroAmbience() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Twinkle className="left-[14%] top-[18%]" size={14} delay="0s" opacity={0.7} />
      <Twinkle className="right-[16%] top-[22%]" size={10} delay="1.2s" opacity={0.5} />
      <Twinkle className="left-[22%] top-[58%]" size={8} delay="2.4s" opacity={0.45} />
      <Twinkle className="right-[20%] top-[62%]" size={12} delay="0.6s" opacity={0.55} />
      <Twinkle className="left-[8%] top-[42%]" size={6} delay="1.8s" opacity={0.35} />
      <Twinkle className="right-[8%] top-[44%]" size={6} delay="3.0s" opacity={0.35} />
    </div>
  );
}

function Twinkle({
  className,
  size,
  delay,
  opacity,
}: {
  className: string;
  size: number;
  delay: string;
  opacity: number;
}) {
  return (
    <svg
      className={`absolute text-gold hero-twinkle ${className}`}
      style={{ width: size, height: size, opacity, animationDelay: delay }}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 1 L13.2 10.8 L23 12 L13.2 13.2 L12 23 L10.8 13.2 L1 12 L10.8 10.8 Z" />
    </svg>
  );
}
