#!/usr/bin/env node
/**
 * Uploads emails/welcome.tsx to Resend as the published template `newsletter-welcome`,
 * then creates the "Newsletter welcome" Automation (trigger `newsletter.subscribed`,
 * send that template). Run it once, by the owner, in their own shell:
 *
 *   node --env-file=.env.local scripts/publish-welcome-email.mjs --dry-run
 *   node --env-file=.env.local scripts/publish-welcome-email.mjs
 *
 * Needs RESEND_AUDIENCE_API_KEY and NEWSLETTER_FROM_EMAIL. Never paste the key into
 * chat, email, or messages. The script prints no credentials.
 *
 * After upload Resend owns the template (edited in the dashboard), so this script
 * refuses to overwrite: an existing template or Automation is left untouched.
 * The Automation is created disabled. Enable it in the dashboard after a test send,
 * and before the signup route that emits the event is deployed.
 * See specs/decisions/2026-09-14-newsletter-welcome-email.md.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Resend } from "resend";

const TEMPLATE_ALIAS = "newsletter-welcome";
const AUTOMATION_NAME = "Newsletter welcome";
const EVENT = "newsletter.subscribed";
const SUBJECT = "Welcome to Deep Dives";
const REPLY_TO = "deepdives237@gmail.com";

const dryRun = process.argv.includes("--dry-run");

function fail(message) {
  console.error(message);
  process.exit(1);
}

// Render with the React Email CLI so the upload matches `pnpm email:dev` exactly.
function renderWelcome() {
  const out = mkdtempSync(join(tmpdir(), "welcome-email-"));
  try {
    const email = join(process.cwd(), "node_modules", ".bin", "email");
    execFileSync(email, ["export", "--dir", "emails", "--outDir", join(out, "html"), "--silent"], { stdio: "inherit" });
    execFileSync(email, ["export", "--dir", "emails", "--outDir", join(out, "text"), "--plainText", "--silent"], { stdio: "inherit" });
    return {
      html: readFileSync(join(out, "html", "welcome.html"), "utf8"),
      text: readFileSync(join(out, "text", "welcome.txt"), "utf8"),
    };
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

const { html, text } = renderWelcome();
const unsubscribe = "{{{RESEND_UNSUBSCRIBE_URL}}}";
if (!html.includes(unsubscribe) || !text.includes(unsubscribe)) fail("Rendered email is missing the unsubscribe link.");
if (Buffer.byteLength(html) > 40_000) fail(`Rendered HTML is ${Buffer.byteLength(html)} bytes, over the 40KB budget.`);
console.log(`Rendered welcome: html ${Buffer.byteLength(html)} bytes, text ${Buffer.byteLength(text)} bytes.`);

const fromEmail = process.env.NEWSLETTER_FROM_EMAIL;
if (!fromEmail) fail("NEWSLETTER_FROM_EMAIL is not set.");
const from = `Raissa from Deep Dives <${fromEmail}>`;

if (dryRun) {
  console.log(`Dry run: would create template "${TEMPLATE_ALIAS}" (subject "${SUBJECT}", from ${from}, reply-to ${REPLY_TO}),`);
  console.log(`publish it, and create the disabled Automation "${AUTOMATION_NAME}" on event "${EVENT}".`);
  process.exit(0);
}

const apiKey = process.env.RESEND_AUDIENCE_API_KEY;
if (!apiKey) fail("RESEND_AUDIENCE_API_KEY is not set.");
const resend = new Resend(apiKey);

// Template: create and publish only when the alias does not exist yet.
let templateId;
const existing = await resend.templates.get(TEMPLATE_ALIAS);
if (existing.data) {
  templateId = existing.data.id;
  console.log(`Template "${TEMPLATE_ALIAS}" already exists (${existing.data.status}). Left unchanged.`);
} else if (existing.error?.statusCode === 404) {
  const created = await resend.templates
    .create({ name: "Newsletter welcome", alias: TEMPLATE_ALIAS, subject: SUBJECT, from, replyTo: REPLY_TO, html, text })
    .publish();
  if (created.error) fail(`Template create or publish failed: ${created.error.name} ${created.error.statusCode ?? ""}`);
  templateId = created.data.id;
  console.log(`Template "${TEMPLATE_ALIAS}" created and published.`);
} else {
  fail(`Template lookup failed: ${existing.error?.name} ${existing.error?.statusCode ?? ""}`);
}

// Automation: create only when none with this name exists.
const automations = await resend.automations.list();
if (automations.error) fail(`Automation list failed: ${automations.error.name} ${automations.error.statusCode ?? ""}`);
const found = automations.data.data.find((a) => a.name === AUTOMATION_NAME);
if (found) {
  console.log(`Automation "${AUTOMATION_NAME}" already exists (${found.status}). Left unchanged.`);
} else {
  const created = await resend.automations.create({
    name: AUTOMATION_NAME,
    status: "disabled",
    steps: [
      { key: "subscribed", type: "trigger", config: { eventName: EVENT } },
      { key: "welcome", type: "send_email", config: { template: { id: templateId } } },
    ],
    connections: [{ from: "subscribed", to: "welcome" }],
  });
  if (created.error) fail(`Automation create failed: ${created.error.name} ${created.error.statusCode ?? ""}`);
  console.log(`Automation "${AUTOMATION_NAME}" created, disabled. Enable it in the Resend dashboard after a test send.`);
}
