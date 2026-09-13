import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Write-enabled Sanity client for server-only mutations (e.g. setting the
 * newsletterDraftCreated flag after an episode email draft is created).
 * Never import this into client components — it carries the write token.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
