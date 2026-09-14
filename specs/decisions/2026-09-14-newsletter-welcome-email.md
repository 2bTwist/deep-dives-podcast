# Decision record: newsletter welcome email (2026-09-14)

Grilling of `specs/plans/2026-09-14-groundwork-newsletter-welcome-email.md`. Every
decision below was put to the owner with a recommendation and its cost.

## Context

- Joining the list currently sends nothing. `src/app/api/newsletter/route.ts`
  creates or updates the contact in Resend (an upsert), adds it to the Newsletter
  segment, and returns.
- Resend's built-in unsubscribe link, `{{{RESEND_UNSUBSCRIBE_URL}}}`, only works in
  Broadcasts and Automations. Plain `emails.send` calls need an unsubscribe page we
  host ourselves.
- An Automation can only be started by a custom event sent from our code
  (`resend.events.send`). There is no "contact created" trigger.
- Resend's docs describe neither Automation re-entry rules nor whether an Automation
  skips unsubscribed contacts.
- The list is greenfield: the owner stated its only subscriber is Raissa.

## Decisions

| # | Decision | Chosen | Rejected, and why |
| --- | --- | --- | --- |
| 1 | Delivery | Signup sends the event `newsletter.subscribed`. A Resend Automation then sends a published template, and Resend handles unsubscribes. | **Direct `emails.send`:** needs our own signed unsubscribe endpoint that writes `unsubscribed` to Resend. That adds a trust boundary and changes the provider contract. |
| 2 | Contact lookup fails (network error or 5xx) | Subscribe as today and skip the welcome. Log only the error name and status. | **Return 502:** a new endpoint's blips would block signups that work today. **Welcome anyway:** returning or unsubscribed people could be emailed during an outage. |
| 3 | Welcome trigger fails after a successful subscribe | Return `{ ok: true }` and log only the error name and status. No retry. | **Show an error:** it would be false (they are subscribed), and a retry would count them as existing, so no welcome would follow anyway. |
| 4 | Voice | First person from Raissa, signed by her. This matches the signup promise (`CommunitySection.tsx:47`) and /about. | **"The Deep Dives team":** breaks the first-person promise. |
| 5 | Sender and replies | From "Raissa from Deep Dives" at `NEWSLETTER_FROM_EMAIL`. Reply-to `deepdives237@gmail.com`. | **Brand sender name:** less personal. **No reply-to:** contradicts the invitation to reply. |
| 6 | Postal address in footer | Ship without one for now. The owner accepted the risk. | **P.O. box first:** would block launch. |
| 7 | Button | "Watch the latest episode" linking to `https://deepdives237.com/episodes`. | **Latest episode passed in:** adds a Sanity read to signup. **YouTube subscribe:** a second ask right after subscribing. |
| 8 | Rendering tests | Real test sends to Gmail web, Gmail iOS in dark mode, Apple Mail in light and dark, and Outlook.com. | **Paid Litmus or Email on Acid trial:** signup and cost for one short email. |
| 9 | Authoring and ownership | Build once in React Email in the repo, verify it, and upload it as a Resend template. After that, Resend owns it and Raissa edits copy in the dashboard. The upload script refuses to overwrite an existing template. | **Code as the source of truth:** Raissa couldn't change a sentence without a developer. **Resend editor from scratch:** no control over dark-mode metadata or table layout. |
| 10 | Existing subscribers | No broadcast. The list is greenfield, and its one subscriber is Raissa, who sees the email through test sends. | An earlier answer chose a "thanks for being early" broadcast, sent by script with a dry run first. The owner's last answer made it moot, so the broadcast, its script, its sequencing and its safeguards are all dropped. |

## Tradeoffs accepted

- **A welcome can be missed.** When the lookup or the trigger fails, the subscriber
  gets no welcome, and nothing retries or alerts. The only trace is a Vercel log line.
- **Two welcomes are possible, rarely.** Two first-time signups for the same address
  in the same moment can both trigger one. The window is about a second, the same
  accepted race class as the blast route.
- **No postal address (CAN-SPAM exposure).** Every welcome ships without one, and so
  do the existing episode emails.
- **The repo file will go stale.** `emails/welcome.tsx` stops being authoritative
  after Raissa's first dashboard edit. A later restyle from code must start from the
  live template.
- **Some clients are untested.** Classic Outlook for Windows and Yahoo are not
  checked.
- **One extra click.** The button goes to the episodes list, not straight to the
  newest episode.

## Must be verified live (Phase 3)

- A fresh address receives exactly one welcome, and a repeat signup receives none.
- A contact who unsubscribed through the welcome stays unsubscribed. Signing up again
  sends no welcome.
- Record whether the received message carries `List-Unsubscribe` headers.
- Confirm the SDK's not-found response shape for `contacts.get` before relying on it.
