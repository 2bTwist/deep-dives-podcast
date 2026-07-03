import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons";

/** The 7 guest archetypes — the sections of the guest wall. */
export const GUEST_ARCHETYPES = [
  "Founders & Operators",
  "Planners & Producers",
  "Clergy & Counselors",
  "Civic Voices",
  "Immigrants & Diaspora",
  "Creatives at Work",
  "Faith & Doubt",
] as const;

export const guest = defineType({
  name: "guest",
  title: "Guest",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      description: "Role or title, e.g. “Cybersecurity Executive”.",
    }),
    defineField({
      name: "company",
      type: "string",
      description: "Business or organization, e.g. “FinServePro”.",
    }),
    defineField({
      name: "archetype",
      title: "Archetype",
      type: "string",
      description: "Which section of the guest wall this person appears under.",
      options: {
        list: GUEST_ARCHETYPES.map((a) => ({ title: a, value: a })),
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      type: "image",
      title: "Photo",
      description: "Optional headshot. The wall works without it (typographic).",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt Text" })],
    }),
    defineField({
      name: "bio",
      type: "text",
      rows: 4,
      description: "Short bio, 2–4 sentences. Shown on the guest's profile page.",
    }),
    defineField({
      name: "episodes",
      title: "Episodes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "episode" }] }],
      description: "The episode(s) this guest appears in. Latest is shown first.",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "archetype", media: "photo" },
    prepare({ title, subtitle, media }) {
      return {
        title: (title as string) || "Unnamed guest",
        subtitle: (subtitle as string) || "No archetype",
        media: media as never,
      };
    },
  },
  orderings: [
    { title: "Name A–Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
});
