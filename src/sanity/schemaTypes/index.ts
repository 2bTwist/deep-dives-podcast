import type { SchemaTypeDefinition } from "sanity";
import { episode } from "./episode";
import { article } from "./article";
import { guest } from "./guest";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [episode, article, guest],
};
