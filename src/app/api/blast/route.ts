import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { writeClient } from "@/sanity/lib/writeClient";
import { youtubeThumb, youtubeWatchUrl } from "@/lib/youtube";
import { siteUrl } from "@/lib/seo";

/**
 * Sanity webhook receiver for the new-episode email blast.
 *
 * Configure a second Sanity webhook (Settings -> API -> Webhooks) pointing at
 * https://deepdives237.com/api/blast, sharing SANITY_REVALIDATE_SECRET,
 * triggering on create/update of `episode` documents.
 *
 * When an episode is published and has no newsletterDraftCreated flag, this
 * creates a DRAFT broadcast in Kit (send_at: null) pre-filled from the episode,
 * then writes newsletterDraftCreated=true back so edits never spawn duplicate
 * drafts. Raissa reviews the draft in Kit and clicks send.
 *
 * Idempotency note: the flag write-back happens AFTER draft creation, so two
 * webhooks firing for the same episode within ~1s could in theory both create a
 * draft. That window is tiny and the cost is one extra draft to delete; we
 * favor "never flag without a real draft" over the race.
 */
type EpisodeDoc = {
  _type?: string;
  _id?: string;
  title?: string;
  youtubeId?: string;
  description?: string;
  publishedAt?: string;
  slug?: string | { current?: string };
  newsletterDraftCreated?: boolean;
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "SANITY_REVALIDATE_SECRET not configured" }, { status: 500 });
  }

  let body: EpisodeDoc = {};
  let valid = false;
  try {
    const parsed = await parseBody<EpisodeDoc>(req, secret);
    body = parsed.body ?? {};
    valid = parsed.isValidSignature === true;
  } catch {
    valid = false;
  }
  if (!valid) {
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

  if (body._type !== "episode") {
    return NextResponse.json({ skipped: "not an episode" });
  }
  if (body.newsletterDraftCreated) {
    return NextResponse.json({ skipped: "draft already created" });
  }

  const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;
  const { _id, title, youtubeId, description, publishedAt } = body;

  // Only act on fully-published episodes.
  if (!_id || !title || !youtubeId || !slug || !publishedAt) {
    return NextResponse.json({ skipped: "episode not ready (missing required fields)" });
  }

  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "KIT_API_KEY not configured" }, { status: 500 });
  }

  const episodeUrl = `${siteUrl()}/episodes/${slug}`;
  const watchUrl = youtubeWatchUrl(youtubeId);
  const thumb = youtubeThumb(youtubeId, "sd");

  const content = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111">
      <p style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#c8a25d;margin:0 0 12px">New episode</p>
      <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">${escapeHtml(title)}</h1>
      <a href="${watchUrl}"><img src="${thumb}" alt="${escapeHtml(title)}" width="100%" style="display:block;border:0;margin:0 0 16px"/></a>
      ${description ? `<p style="font-size:16px;line-height:1.6;margin:0 0 20px">${escapeHtml(description)}</p>` : ""}
      <p style="margin:0 0 24px">
        <a href="${watchUrl}" style="display:inline-block;background:#c8a25d;color:#050505;text-decoration:none;padding:12px 22px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase">Watch on YouTube</a>
      </p>
      <p style="font-size:14px;color:#555;margin:0"><a href="${episodeUrl}" style="color:#555">Read more on the site</a></p>
    </div>
  `.trim();

  try {
    const res = await fetch("https://api.kit.com/v4/broadcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey },
      body: JSON.stringify({
        subject: `New episode: ${title}`,
        content,
        send_at: null, // draft — Raissa reviews and sends from Kit
        public: false,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Kit broadcast create failed", res.status, detail);
      return NextResponse.json({ error: "Kit broadcast create failed" }, { status: 502 });
    }

    const created = (await res.json().catch(() => ({}))) as {
      broadcast?: { id?: number };
    };

    // Mark the episode so a later edit doesn't spawn a second draft.
    await writeClient.patch(_id).set({ newsletterDraftCreated: true }).commit();

    return NextResponse.json({
      created: true,
      broadcastId: created.broadcast?.id ?? null,
      episode: slug,
    });
  } catch (err) {
    console.error("Blast error", err);
    return NextResponse.json({ error: "Blast failed" }, { status: 502 });
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
