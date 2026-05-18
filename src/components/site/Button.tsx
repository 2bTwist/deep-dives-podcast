import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";

type Common = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  /** Show a right-arrow that slides on hover. Defaults to true. */
  showArrow?: boolean;
};

type LinkProps = Common & {
  href: string;
  /** Render as <a target="_blank" rel="noopener noreferrer">. */
  external?: boolean;
  type?: never;
  disabled?: never;
  onClick?: never;
};

type ButtonProps = Common & {
  href?: never;
  external?: never;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type Props = LinkProps | ButtonProps;

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-bright disabled:opacity-50",
  secondary:
    "border border-gold text-gold hover:bg-gold/10",
};

const BASE_CLASSES =
  "group inline-flex items-center gap-3 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper";

const Arrow = () => (
  <span
    aria-hidden
    className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5"
  >
    →
  </span>
);

/**
 * Brand CTA button. Renders as <Link>, <a> (external), or <button> based on props.
 *
 *   <Button variant="primary" href="https://youtube.com/..." external>Subscribe on YouTube</Button>
 *   <Button variant="secondary" href="/episodes">Browse Episodes</Button>
 *   <Button variant="primary" type="submit" disabled={busy}>Send Message</Button>
 */
export function Button(props: Props) {
  const {
    variant = "primary",
    children,
    className = "",
    ariaLabel,
    showArrow = true,
  } = props;

  const allClasses = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`.trim();

  const content = (
    <>
      {children}
      {showArrow && <Arrow />}
    </>
  );

  // External anchor
  if ("href" in props && props.href && props.external) {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={allClasses}
      >
        {content}
      </a>
    );
  }

  // Internal link
  if ("href" in props && props.href) {
    return (
      <Link href={props.href} aria-label={ariaLabel} className={allClasses}>
        {content}
      </Link>
    );
  }

  // Button (form submit / on-click)
  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={ariaLabel}
      className={allClasses}
    >
      {content}
    </button>
  );
}
