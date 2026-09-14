import { NextResponse } from "next/server";
import { Resend } from "resend";
import { newsletterSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

// Starts the Resend Automation "Newsletter welcome" (scripts/publish-welcome-email.mjs).
const WELCOME_EVENT = "newsletter.subscribed";

/**
 * Newsletter signup -> Resend contact in the Newsletter segment, plus a one-time
 * welcome for contacts Resend has never seen.
 *
 * Resend's contact create is an upsert, so a repeat signup is harmless. The
 * create never sends `unsubscribed`, so someone who unsubscribed stays
 * unsubscribed. Membership is added explicitly because the upsert is not
 * guaranteed to add segments to a contact that already exists.
 *
 * The welcome is decided by a lookup before the create: only a confirmed 404 counts
 * as new, so returning or unsubscribed people are never welcomed again. A failed
 * lookup or a failed event still subscribes and returns ok; the welcome is best
 * effort (specs/decisions/2026-09-14-newsletter-welcome-email.md).
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
    const isNew = await isNewContact(resend, email);

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

    if (isNew) await sendWelcome(resend, email);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend subscribe error", err instanceof Error ? err.name : typeof err);
    return failed();
  }
}

// Only a confirmed not-found counts as new. Any other outcome skips the welcome.
async function isNewContact(resend: Resend, email: string) {
  try {
    const existing = await resend.contacts.get({ email });
    if (existing.error?.statusCode === 404) return true;
    if (existing.error) {
      console.error("Resend contact lookup failed", existing.error.name, existing.error.statusCode);
    }
  } catch (err) {
    console.error("Resend contact lookup error", err instanceof Error ? err.name : typeof err);
  }
  return false;
}

// Runs after a successful subscribe, so a failure is logged and never surfaced.
async function sendWelcome(resend: Resend, email: string) {
  try {
    const sent = await resend.events.send({ event: WELCOME_EVENT, email });
    if (sent.error) {
      console.error("Resend welcome event failed", sent.error.name, sent.error.statusCode);
    }
  } catch (err) {
    console.error("Resend welcome event error", err instanceof Error ? err.name : typeof err);
  }
}
