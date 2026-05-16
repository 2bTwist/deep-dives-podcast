import type { Episode } from "@/lib/types";

/**
 * Seed episodes pulled from youtube.com/@DeepDives237 on 2026-05-16.
 * Real video IDs + titles. Categories/guests/slugs assigned editorially.
 * SWAP for Sanity queries in the post-homepage phase.
 */
export const episodes: Episode[] = [
  {
    youtubeId: "Y2trutykmrs",
    title: "You Don't Have the American Dream. You Have a Job.",
    slug: "american-dream-job",
    category: "Career",
    duration: "35:34",
    publishedAt: "2026-04-22",
    description:
      "A long-form conversation on the gap between the American Dream as marketed and the reality most workers actually live.",
  },
  {
    youtubeId: "2l0CTpVgZTQ",
    title: "The Truth About Solar Energy No One Tells You",
    slug: "solar-energy-truth",
    category: "Entrepreneurship",
    duration: "34:03",
    publishedAt: "2026-03-18",
    description: "What the industry brochures leave out about installing, financing, and living with solar.",
  },
  {
    youtubeId: "M-WWhpUcbKI",
    title: "The Secret World of Lobbying: What Business Owners NEED to Know",
    slug: "lobbying-secrets",
    category: "Entrepreneurship",
    duration: "39:28",
    publishedAt: "2026-02-09",
    description: "Behind the closed-door system that shapes the rules small businesses have to play by.",
  },
  {
    youtubeId: "rHdu50hSOKI",
    title: "The Truth About Being a Wedding Planner (It's Not What You Think)",
    slug: "wedding-planner-truth",
    category: "Creativity",
    duration: "41:48",
    publishedAt: "2026-01-14",
    description: "Inside the unglamorous reality of one of the most-romanticized creative professions.",
  },
  {
    youtubeId: "uakqFJ8XEmM",
    title: "Why Your Voice Feels Small in Democracy",
    slug: "voice-in-democracy",
    category: "Faith",
    duration: "37:50",
    publishedAt: "2025-12-02",
    description: "On power, participation, and the quiet ways institutions teach us our voices don't count.",
  },
  {
    youtubeId: "TuD4QXbhGY4",
    title: "Most Men Won't Admit This",
    slug: "men-wont-admit",
    category: "Relationships",
    duration: "54:08",
    publishedAt: "2025-10-28",
    description: "An unguarded conversation about what men carry in private and almost never speak aloud.",
  },
];

export const featuredEpisode = episodes[0];
