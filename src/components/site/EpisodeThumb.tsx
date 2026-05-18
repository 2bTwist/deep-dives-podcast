"use client";

import Image from "next/image";
import { useState } from "react";
import { youtubeThumb, type YouTubeRes } from "@/lib/youtube";

const order: YouTubeRes[] = ["maxres", "sd", "hq", "mq"];

type Props = {
  id: string;
  alt: string;
} & Omit<React.ComponentProps<typeof Image>, "src" | "alt">;

/** Client-side YouTube thumbnail with maxres → sd → hq → mq fallback. Use for hero/featured contexts where 1280×720 matters. */
export function EpisodeThumb({ id, alt, ...rest }: Props) {
  const [i, setI] = useState(0);
  return (
    <Image
      src={youtubeThumb(id, order[i])}
      alt={alt}
      onError={() => setI((n) => Math.min(n + 1, order.length - 1))}
      {...rest}
    />
  );
}
