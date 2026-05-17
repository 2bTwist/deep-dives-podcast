type Props = {
  /** Single character — the oversized initial. */
  letter: string;
  /** "gold" (default, for dark backgrounds) or "ink" (for the gold panel). */
  color?: "gold" | "ink";
  className?: string;
};

/**
 * Oversized italic Playfair initial. Floats left so the rest of the title
 * wraps to its right. Use inside an h1/h2 followed by the rest of the title.
 *
 * <h2 className="font-display text-[56px] lg:text-[72px] ...">
 *   <DropCap letter="C" />onversations
 *   <span className="block italic font-light text-sub">That Matter</span>
 * </h2>
 */
export function DropCap({ letter, color = "gold", className = "" }: Props) {
  const colorClass = color === "ink" ? "text-ink" : "text-gold";
  return (
    <span
      aria-hidden
      className={
        "float-left mr-3 -mt-2 font-display italic leading-[0.85] text-[96px] lg:mr-4 lg:text-[144px] " +
        colorClass +
        " " +
        className
      }
    >
      {letter}
    </span>
  );
}
