type Props = {
  /** Single character — the oversized initial. */
  letter: string;
  /** "gold" (default, for dark backgrounds) or "ink" (for the gold panel). */
  color?: "gold" | "ink";
  /**
   * Pick the scale based on the surrounding heading size at lg:
   * - "md" for headings 56-72px (e.g. ConversationsSection h2, related "More")
   * - "lg" (default) for 88-112px hero / section headings
   * - "xl" for 140px+ true page-cover treatments
   *
   * Always match the size to the heading. Too-large drop caps orphan the
   * rest of the title onto the next line at narrower column widths.
   */
  size?: "md" | "lg" | "xl";
  className?: string;
};

const SIZE_CLASSES = {
  md: "text-[56px] sm:text-[80px] lg:text-[112px]",
  lg: "text-[64px] sm:text-[96px] lg:text-[144px]",
  xl: "text-[80px] sm:text-[120px] lg:text-[180px]",
} as const;

/**
 * Oversized italic Playfair initial. Floats left so the rest of the title
 * wraps to its right. Use inside an h1/h2 followed by the rest of the title.
 *
 * <h2 className="font-display text-[56px] lg:text-[72px] ...">
 *   <DropCap letter="C" size="md" />onversations
 *   <span className="block italic font-light text-sub">That Matter</span>
 * </h2>
 */
export function DropCap({ letter, color = "gold", size = "lg", className = "" }: Props) {
  const colorClass = color === "ink" ? "text-ink" : "text-gold";
  return (
    <span
      aria-hidden
      className={
        "float-left mr-2 -mt-1 font-display italic leading-[0.82] " +
        "sm:mr-3 sm:-mt-2 sm:leading-[0.85] " +
        "lg:mr-4 " +
        SIZE_CLASSES[size] +
        " " +
        colorClass +
        " " +
        className
      }
    >
      {letter}
    </span>
  );
}
