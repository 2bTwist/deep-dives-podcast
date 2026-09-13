# Deep Dives Podcast

The public website for Deep Dives Podcast with Raissa. Current tracked source and the
production build define which routes and integrations are implemented.

## Stack

- Next.js App Router and React
- TypeScript
- Tailwind CSS
- Motion
- Sanity

The installed Next.js documentation under `node_modules/next/dist/docs/` is the
framework reference for this repository. Design tokens live in
`src/app/globals.css`, and shared motion presets live in `src/lib/motion.ts`.

## Development

```sh
pnpm install
pnpm dev
```

Before review, run:

```sh
pnpm lint
pnpm typecheck
pnpm build
```

UI changes should also be reviewed at compact and desktop widths. Verify reduced
motion whenever animation or transition behavior changes.
