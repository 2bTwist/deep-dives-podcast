import type { SchemaTypeDefinition } from "sanity";
import { episode } from "./episode";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [episode],
};
