import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFromRef } from "@/sanity/lib/image";
import type { PortableTextContent } from "@/lib/types";

type ImageValue = {
  asset?: { _ref?: string };
  alt?: string;
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-6 font-body text-paper text-[19px] leading-[1.7] first:mt-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-14 font-display text-[32px] leading-[1.15] tracking-[-0.01em] text-paper lg:text-[40px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-12 font-display text-[24px] leading-[1.2] text-paper lg:text-[28px]">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-2 border-gold pl-6 font-display italic text-[24px] leading-[1.4] text-champagne lg:text-[28px]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-6 list-disc space-y-2 pl-6 font-body text-paper text-[19px] leading-[1.7] marker:text-gold">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-2 pl-6 font-body text-paper text-[19px] leading-[1.7] marker:text-gold">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-paper">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      const className =
        "text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-bright hover:decoration-gold";
      return external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      ) : (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const v = value as ImageValue;
      const src = urlFromRef(v.asset?._ref);
      if (!src) return null;
      return (
        <figure className="my-12">
          <div className="relative aspect-video w-full overflow-hidden bg-card">
            <Image
              src={src}
              alt={v.alt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </div>
          {v.alt ? (
            <figcaption className="mt-3 font-body italic text-sub text-[14px]">
              {v.alt}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

/**
 * Renders Sanity Portable Text styled to the editorial system. The opening
 * paragraph gets a gold drop cap via the `.article-body` CSS rule in globals.css
 * (CSS ::first-letter keeps inline marks intact and is request-safe).
 */
export function PortableBody({ value }: { value?: PortableTextContent }) {
  if (!value || !Array.isArray(value) || value.length === 0) return null;
  return (
    <div className="article-body">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
