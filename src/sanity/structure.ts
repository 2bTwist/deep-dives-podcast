import type { StructureResolver } from "sanity/structure";
import { PlayIcon, DocumentTextIcon } from "@sanity/icons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Deep Dives")
    .items([
      S.listItem()
        .title("Episodes")
        .icon(PlayIcon)
        .child(
          S.documentTypeList("episode")
            .title("Episodes")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Blog")
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList("article")
            .title("Blog")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
    ]);
