import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  attribution?: string;
  className?: string;
};

/**
 * Editorial pull quote with an oversized Allura script opening curly quote
 * hung in the left margin. The quote glyph IS the personality moment.
 */
export function PullQuote({ children, attribution, className = "" }: Props) {
  return (
    <figure className={"relative my-12 pl-14 lg:my-16 lg:pl-20 " + className}>
      <span
        aria-hidden
        className="absolute left-0 top-[-32px] font-script text-gold/55 text-[120px] leading-none lg:top-[-44px] lg:text-[160px]"
      >
        &ldquo;
      </span>
      <blockquote className="font-display italic text-paper text-[28px] leading-[1.25] tracking-[-0.01em] lg:text-[42px]">
        {children}
      </blockquote>
      {attribution && (
        <figcaption className="mt-5 font-body italic text-muted text-[13px] tracking-[0.05em]">
          · {attribution}
        </figcaption>
      )}
    </figure>
  );
}
