import { defineType, defineField } from "sanity";
import { PlayIcon } from "@sanity/icons";

export const episode = defineType({
  name: "episode",
  title: "Episode",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "youtubeId",
      title: "YouTube Video ID",
      type: "string",
      description:
        'The 11-character ID from a YouTube URL — the part after v=. For youtube.com/watch?v=dQw4w9WgXcQ the ID is "dQw4w9WgXcQ".',
      validation: (rule) => rule.required().length(11),
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Entrepreneurship", value: "Entrepreneurship" },
          { title: "Finance", value: "Finance" },
          { title: "Relationships", value: "Relationships" },
          { title: "Career", value: "Career" },
          { title: "Faith", value: "Faith" },
          { title: "Creativity", value: "Creativity" },
          { title: "Immigrant Journeys", value: "Immigrant Journeys" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "duration",
      type: "string",
      description: 'Display duration, e.g. "54:08" or "1:12:34".',
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dateModified",
      title: "Last Updated",
      type: "datetime",
      description:
        "Optional. Set when you materially update an episode (description rewrite, transcript added, corrections). Drives the 'Updated' label and the dateModified field in schema. Leave empty for un-edited episodes.",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "guest",
      type: "string",
      description: "Guest name (optional).",
    }),
    defineField({
      name: "guestRole",
      type: "string",
      description: "Guest title or role (optional).",
    }),
    defineField({
      name: "newsletterDraftCreated",
      type: "boolean",
      title: "Newsletter Draft Created",
      readOnly: true,
      description:
        "Set automatically when the new-episode email draft is created in Resend. Leave this alone — it prevents duplicate drafts.",
    }),
    defineField({
      name: "thumbnailOverride",
      type: "image",
      title: "Thumbnail Override",
      description:
        "Optional: upload a custom thumbnail. Falls back to YouTube's if empty.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      duration: "duration",
      publishedAt: "publishedAt",
      media: "thumbnailOverride",
    },
    prepare({ title, subtitle, duration, publishedAt, media }) {
      const date = publishedAt
        ? new Date(publishedAt as string).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";
      const meta = [subtitle, duration, date].filter(Boolean).join(" · ");
      return {
        title: (title as string) || "Untitled episode",
        subtitle: meta || "Uncategorized",
        media: media as never,
      };
    },
  },
  orderings: [
    {
      title: "Latest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Oldest first",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
});
