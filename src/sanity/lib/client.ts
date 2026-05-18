import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
};

export async function sanityFetch<T = unknown>({
  query,
  params = {},
  revalidate = 60,
  tags,
}: SanityFetchOptions): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags?.length ? false : revalidate,
      tags,
    },
  });
}
