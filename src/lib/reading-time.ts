import type { PortableTextContent } from "@/lib/types";

/** Rough reading-time estimate (minutes) from Portable Text, at ~225 wpm. */
export function readingTimeMinutes(body?: PortableTextContent): number {
  if (!body || !Array.isArray(body)) return 1;
  let words = 0;
  for (const block of body) {
    const b = block as { _type?: string; children?: { text?: string }[] };
    if (b._type !== "block" || !Array.isArray(b.children)) continue;
    for (const child of b.children) {
      if (child.text) words += child.text.trim().split(/\s+/).filter(Boolean).length;
    }
  }
  return Math.max(1, Math.round(words / 225));
}
