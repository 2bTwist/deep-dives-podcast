#!/usr/bin/env node
/**
 * One-shot seed for the Deep Dives Sanity dataset.
 * Reads creds from .env.local (run with `node --env-file=.env.local scripts/seed-sanity.mjs`).
 * Creates 6 long-form episodes as published documents.
 */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing one of: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-16",
  token,
  useCdn: false,
});

const episodes = [
  {
    title: "Most Men Won't Admit This.",
    slug: "most-men-wont-admit",
    youtubeId: "TuD4QXbhGY4",
    category: "Relationships",
    duration: "54:08",
    publishedAt: "2026-04-25T20:40:45Z",
    description:
      "An unguarded conversation about what men carry in private and almost never speak aloud.",
  },
  {
    title: "You Don't Have the American Dream. You Have a Job.",
    slug: "american-dream-job",
    youtubeId: "Y2trutykmrs",
    category: "Career",
    duration: "35:34",
    publishedAt: "2026-04-09T13:44:51Z",
    description:
      "A long-form conversation on the gap between the American Dream as marketed and the reality most workers actually live.",
  },
  {
    title: "The Truth About Being a Wedding Planner (It's Not What You Think).",
    slug: "wedding-planner-truth",
    youtubeId: "rHdu50hSOKI",
    category: "Creativity",
    duration: "41:48",
    publishedAt: "2026-02-25T21:32:33Z",
    description:
      "Inside the unglamorous reality of one of the most-romanticized creative professions.",
  },
  {
    title: "Why Your Voice Feels Small in Democracy",
    slug: "voice-in-democracy",
    youtubeId: "uakqFJ8XEmM",
    category: "Faith",
    duration: "37:50",
    publishedAt: "2026-01-24T16:17:25Z",
    description:
      "On power, participation, and the quiet ways institutions teach us our voices don't count.",
  },
  {
    title: "The Secret World of Lobbying: What Business Owners NEED to Know",
    slug: "lobbying-secrets",
    youtubeId: "M-WWhpUcbKI",
    category: "Entrepreneurship",
    duration: "39:28",
    publishedAt: "2025-12-23T05:39:19Z",
    description:
      "Behind the closed-door system that shapes the rules small businesses have to play by.",
  },
  {
    title: "The Truth About Solar Energy No One Tells You",
    slug: "solar-energy-truth",
    youtubeId: "2l0CTpVgZTQ",
    category: "Entrepreneurship",
    duration: "34:03",
    publishedAt: "2025-11-12T20:07:28Z",
    description:
      "What the industry brochures leave out about installing, financing, and living with solar.",
  },
];

console.log(`→ seeding ${episodes.length} episodes to ${projectId}/${dataset}`);

for (const ep of episodes) {
  const doc = {
    _type: "episode",
    title: ep.title,
    slug: { _type: "slug", current: ep.slug },
    youtubeId: ep.youtubeId,
    category: ep.category,
    duration: ep.duration,
    publishedAt: ep.publishedAt,
    description: ep.description,
  };
  try {
    const result = await client.create(doc);
    console.log(`  ✓ ${result._id}  ${ep.title}`);
  } catch (err) {
    console.error(`  ✗ ${ep.title}: ${err.message}`);
    process.exitCode = 1;
  }
}

const total = await client.fetch('count(*[_type == "episode"])');
console.log(`\ndataset now contains ${total} episode(s)`);
