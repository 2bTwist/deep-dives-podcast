import { NextStudio } from "next-sanity/studio";
import { metadata as studioMetadata, viewport } from "next-sanity/studio";
import type { Metadata } from "next";
import config from "../../../../sanity.config";

export const dynamic = "force-static";
export { viewport };
export const metadata: Metadata = {
  ...studioMetadata,
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
