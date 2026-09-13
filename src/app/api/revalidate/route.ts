import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook receiver. Configure a webhook in Sanity Studio (Settings → API → Webhooks)
 * pointing at https://deepdives237.com/api/revalidate with the same secret set in
 * SANITY_REVALIDATE_SECRET. Trigger on create/update/delete of `episode` documents.
 *
 * Manual fallback: POST with `Authorization: Bearer <SANITY_REVALIDATE_SECRET>` and
 * an optional JSON body `{ "slug": "<episode-slug>" }` to revalidate everything.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "SANITY_REVALIDATE_SECRET not configured" }, { status: 500 });
  }

  let body: Record<string, unknown> = {};
  let isValidSignature = false;

  try {
    const parsed = await parseBody<Record<string, unknown>>(req, secret);
    body = parsed.body ?? {};
    isValidSignature = parsed.isValidSignature === true;
  } catch {
    isValidSignature = false;
  }

  if (!isValidSignature) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      body = await req.json();
    } catch {
      body = {};
    }
  }

  revalidateTag("episode", "max");
  revalidateTag("article", "max");
  revalidatePath("/");
  revalidatePath("/episodes");
  revalidatePath("/blog");
  revalidatePath("/guests");

  // The webhook body carries the document type + slug. Fall back to a generic
  // `slug` for the manual bearer path (treated as an episode for compatibility).
  const type = typeof body._type === "string" ? body._type : undefined;
  const slug = typeof body.slug === "string" ? body.slug : undefined;
  if (slug) {
    if (type === "article") revalidatePath(`/blog/${slug}`);
    else revalidatePath(`/episodes/${slug}`);
  }

  return NextResponse.json({
    revalidated: true,
    via: isValidSignature ? "sanity-webhook" : "bearer",
    type: type ?? null,
    slug: slug ?? null,
    at: new Date().toISOString(),
  });
}
