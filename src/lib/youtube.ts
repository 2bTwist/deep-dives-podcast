export type YouTubeRes = "maxres" | "sd" | "hq" | "mq";

/**
 * YouTube static thumbnail URL.
 * Default 'sd' (640×480) is guaranteed for any public video.
 * Use 'maxres' (1280×720) only for hero/featured contexts paired with EpisodeThumb (client fallback).
 */
export function youtubeThumb(videoId: string, res: YouTubeRes = "sd") {
  return `https://i.ytimg.com/vi/${videoId}/${res}default.jpg`;
}

export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}`;
}
