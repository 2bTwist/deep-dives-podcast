import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Contact form -> Resend -> Raissa's inbox.
 *
 * `from` must be a verified Resend sender on the domain; `replyTo` is the person
 * who wrote in, so she can just hit reply.
 *
 * Env: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { ok: false, error: "Contact form is not configured." },
      { status: 500 },
    );
  }

  const limit = rateLimit(`contact:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
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

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please fill in every field with valid details." },
      { status: 400 },
    );
  }

  // Honeypot tripped — pretend success.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, subject, message } = parsed.data;
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: `Deep Dives Website <${from}>`,
      to: [to],
      replyTo: email,
      subject: `[Deep Dives] ${subject} — ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      html: `<div style="font-family:system-ui,sans-serif;line-height:1.55">
        <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr/>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>`,
    });

    if (error) {
      console.error("Resend send failed", error);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend send error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}
