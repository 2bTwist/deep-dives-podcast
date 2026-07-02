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
        .title("Articles")
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList("article")
            .title("Articles")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
    ]);
