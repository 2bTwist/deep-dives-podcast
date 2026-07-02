import type { SchemaTypeDefinition } from "sanity";
import { episode } from "./episode";
import { article } from "./article";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [episode, article],
};
