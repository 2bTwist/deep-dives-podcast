import { defineType, defineField } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  icon: DocumentTextIcon,
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
      name: "excerpt",
      type: "text",
      rows: 3,
      description:
        "1-2 sentence summary. Shown on cards, used as the meta description and social preview.",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Cover Image",
      description: "Optional. Falls back to a branded default if empty.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
        }),
      ],
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Body",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt Text" }),
          ],
        },
      ],
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
          { title: "Mental Health", value: "Mental Health" },
        ],
        layout: "radio",
      },
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
        "Optional. Set when you materially update the article. Drives the 'Updated' label and the dateModified field in schema.",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured",
      description: "Pin this article to the top of the Articles index.",
      initialValue: false,
    }),
    defineField({
      name: "relatedEpisode",
      type: "reference",
      title: "Related Episode",
      description:
        "Required. The episode this article is based on. Its YouTube video is shown at the top of the article and links through to the episode page.",
      to: [{ type: "episode" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      publishedAt: "publishedAt",
      featured: "featured",
      media: "coverImage",
    },
    prepare({ title, subtitle, publishedAt, featured, media }) {
      const date = publishedAt
        ? new Date(publishedAt as string).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";
      const meta = [featured ? "★ Featured" : null, subtitle, date]
        .filter(Boolean)
        .join(" · ");
      return {
        title: (title as string) || "Untitled article",
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
