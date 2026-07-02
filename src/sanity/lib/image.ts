import { projectId, dataset } from "../env";

/**
 * Build a cdn.sanity.io URL from a Sanity image asset `_ref` without pulling in
 * @sanity/image-url. Refs look like:
 *   image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg
 * which maps to:
 *   https://cdn.sanity.io/images/<projectId>/<dataset>/<assetId>-<dims>.<fmt>
 *
 * Returns null for malformed refs so callers can skip rendering.
 */
export function urlFromRef(ref?: string): string | null {
  if (!ref || !ref.startsWith("image-")) return null;
  const [, assetId, dimensions, format] = ref.split("-");
  if (!assetId || !dimensions || !format) return null;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${format}`;
}
