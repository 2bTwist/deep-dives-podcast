type Props = {
  /** Name to render in Allura script. */
  name?: string;
  className?: string;
};

/**
 * Hand-set Allura script signature with a slightly imperfect SVG underline
 * drawn beneath it. Use as a sign-off after a long-form passage.
 */
export function HandSignature({ name = "Raissa", className = "" }: Props) {
  return (
    <div className={"inline-flex flex-col items-start " + className}>
      <span className="font-script text-gold leading-none text-[64px] lg:text-[80px]">
        {name}
      </span>
      <svg
        viewBox="0 0 200 14"
        aria-hidden
        className="-mt-1 w-[150px] text-gold/80 lg:w-[190px]"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* hand-drawn-feeling cubic curve: slight rise, dip, rise, settle */}
        <path
          d="M 3 8 C 28 4, 62 11, 96 5 S 158 9, 197 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
