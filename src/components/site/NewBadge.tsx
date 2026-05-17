type Props = {
  /** ISO date string for the episode. */
  publishedAt?: string;
  /** Days-old threshold for showing. Default 14. */
  maxDaysOld?: number;
  className?: string;
};

/**
 * Slanted gold "NEW" stamp. Absolute-positioned, defaults top-right.
 * Renders nothing if the episode is older than maxDaysOld. Parent must
 * be position:relative.
 */
export function NewBadge({ publishedAt, maxDaysOld = 14, className = "" }: Props) {
  if (!publishedAt) return null;
  const ageDays =
    (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays > maxDaysOld) return null;

  return (
    <span
      aria-label="New episode"
      className={
        "pointer-events-none absolute bottom-3 right-3 z-10 -rotate-[8deg] " +
        "border border-gold bg-ink/85 px-2.5 py-1 " +
        "font-body text-[10px] font-medium uppercase tracking-[0.28em] text-gold " +
        "shadow-[0_2px_8px_rgba(0,0,0,0.4)] " +
        className
      }
    >
      New
    </span>
  );
}
