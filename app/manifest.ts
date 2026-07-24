import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      { src: "/help24-icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/help24-icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
