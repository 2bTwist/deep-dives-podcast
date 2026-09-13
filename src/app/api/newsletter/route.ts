import { NextResponse } from "next/server";
import { Resend } from "resend";
import { newsletterSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Newsletter signup -> Resend contact in the Newsletter segment.
 *
 * Resend's contact create is an upsert, so a repeat signup is harmless. The
 * create never sends `unsubscribed`, so someone who unsubscribed stays
 * unsubscribed. Membership is added explicitly because the upsert is not
 * guaranteed to add segments to a contact that already exists.
 *
 * Env: RESEND_AUDIENCE_API_KEY (full access, server only), RESEND_NEWSLETTER_SEGMENT_ID
 */
export async function POST(req: Request) {
  const apiKey = process.env.RESEND_AUDIENCE_API_KEY;
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  if (!apiKey || !segmentId) {
    return NextResponse.json(
      { ok: false, error: "Newsletter is not configured." },
      { status: 500 },
    );
  }

  const limit = rateLimit(`newsletter:${clientIp(req)}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  // Honeypot tripped: pretend success so bots don't learn anything.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const email = parsed.data.email;
  const resend = new Resend(apiKey);
  const failed = () =>
    NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 502 },
    );

  // Log only the error name and status: Resend messages can echo the address.
  try {
    const created = await resend.contacts.create({ email });
    if (created.error) {
      console.error("Resend contact create failed", created.error.name, created.error.statusCode);
      return failed();
    }

    const added = await resend.contacts.segments.add({ contactId: created.data.id, segmentId });
    if (added.error) {
      console.error("Resend segment add failed", added.error.name, added.error.statusCode);
      return failed();
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend subscribe error", err instanceof Error ? err.name : typeof err);
    return failed();
  }
}
