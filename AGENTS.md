# Deep Dives Podcast Repository Contract

This repository contains the public website for Deep Dives Podcast. Keep durable
repository guidance here. Current task state belongs in the active transcript, not
in repository instructions or handoff files.

## Authority

1. Current source, manifests, lockfile, and generated behavior define implemented behavior.
2. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
3. `src/app/globals.css` is the design-token source of truth.
4. Current tracked plans and research explain decisions only within their stated scope.
5. Git history is the authority for removed or superseded tracked material.

## Product and implementation invariants

- Preserve the site's editorial, premium visual direction and its accessible contrast.
- Use the existing Motion utilities and respect reduced motion.
- Keep responsive behavior deliberate at phone, tablet, and desktop widths.
- Do not infer current scope from an old plan or handoff. Confirm it from current code
  and the active request.
- Search the repository before removing routes, content models, integrations, or assets.
- Follow the installed Next.js version rather than remembered framework behavior.

## External state contract

- Sanity is authoritative for episode and editorial CMS state. Kit is authoritative
  for newsletter subscribers and broadcast drafts. Repository code and local process
  memory are not replicas or recovery sources for either provider.
- Keep `SANITY_API_WRITE_TOKEN` in server-only code. A client component must never
  import the write-enabled Sanity client, and logs or responses must not expose
  provider credentials or subscriber addresses.
- Newsletter signup is one external Kit write. The blast route is two ordered writes:
  create a Kit draft, then set `newsletterDraftCreated` on the Sanity episode. There
  is no transaction across those providers. Never describe the flag as proof that the
  two writes completed atomically.
- The current blast route can create duplicate Kit drafts when concurrent signed
  webhooks observe an unset flag. Webhook idempotency and the duplicate-draft race are
  unresolved architecture gaps. Do not redesign this boundary without an explicit
  decision covering idempotency ownership, recovery, and reversal.
- Repository code defines no provider-data purge or retention workflow. Deletion and
  recovery remain provider-managed until an explicit, tested workflow is added. Sanity
  schema changes and Kit contract changes require compatibility review against existing
  provider state; do not infer a migration from TypeScript types alone.
- Verify request validation, signature rejection, missing configuration, provider
  failure mapping, and write ordering with contract tests that use independent provider
  fakes. A local lint or typecheck result does not prove the live Sanity-to-Kit flow.
  Live-provider verification and a concurrency/idempotency test remain undriven.

## Verification

Run the smallest relevant checks while working, then run:

```sh
pnpm lint
pnpm typecheck
pnpm build
```

Lighthouse CI uses five runs and median assertions. Do not weaken its budgets or run
count to make a change pass. UI changes also require visual review at compact and
desktop widths, plus a reduced-motion check when motion changes.
