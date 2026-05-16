import type { StructureResolver } from "sanity/structure";
import { PlayIcon } from "@sanity/icons";

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
    ]);
