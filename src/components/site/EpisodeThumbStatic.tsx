import Image from "next/image";
import { youtubeThumb } from "@/lib/youtube";

type Props = {
  id: string;
  alt: string;
} & Omit<React.ComponentProps<typeof Image>, "src" | "alt">;

/** Server-rendered YouTube thumbnail. Always 'sd' (640×480) — guaranteed for every public video. Use in grids. */
export function EpisodeThumbStatic({ id, alt, ...rest }: Props) {
  return <Image src={youtubeThumb(id, "sd")} alt={alt} {...rest} />;
}
