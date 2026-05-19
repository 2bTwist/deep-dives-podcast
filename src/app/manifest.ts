import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deep Dive Podcast with Raissa",
    short_name: "Deep Dives",
    description:
      "A show with Raissa. Going deep on the questions that shape modern life, with the experts who actually live them. New on YouTube.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#c8a25d",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
