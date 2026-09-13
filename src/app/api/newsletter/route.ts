import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Newsletter signup -> Kit (ConvertKit) v4 API.
 *
 * Adds the email to the configured Kit form. Single opt-in is a setting ON THE
 * KIT FORM itself (set in the Kit dashboard), so the subscriber is active
 * immediately and our "You're in" copy stays truthful.
 *
 * Env: KIT_API_KEY, KIT_NEWSLETTER_FORM_ID
 */
export async function POST(req: Request) {
  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_NEWSLETTER_FORM_ID;
  if (!apiKey || !formId) {
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

  // Honeypot tripped — pretend success so bots don't learn anything.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const headers = { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey };
  const body = JSON.stringify({ email_address: parsed.data.email });
  const failed = () =>
    NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 502 },
    );

  try {
    // Kit v4 only adds EXISTING subscribers to a form, so upsert the subscriber
    // first. The upsert never changes state, so an unsubscribed address stays
    // unsubscribed. Log status codes only: Kit error bodies can echo the address.
    const created = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers,
      body,
    });
    if (!created.ok) {
      console.error("Kit subscriber upsert failed", created.status);
      return failed();
    }

    const added = await fetch(`https://api.kit.com/v4/forms/${formId}/subscribers`, {
      method: "POST",
      headers,
      body,
    });
    if (!added.ok) {
      console.error("Kit add-to-form failed", added.status);
      return failed();
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Kit subscribe error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}
