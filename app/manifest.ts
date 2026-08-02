import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PALETTE } from "@/lib/tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    // The splash and address bar of an installed PWA, from the same token the
    // page background uses — so a colour change lands here too.
    background_color: PALETTE["bg-dark"],
    theme_color: PALETTE["bg-dark"],
    /*
     * Real files at the declared sizes.
     *
     * Both entries used to point at the same 1024×1024, 173KB source and
     * simply LABEL it 192 and 512. Chrome believed the labels, fetched the
     * file, and every visitor paid 173KB for an icon that is never shown on
     * the page. `npm run generate:logo` produces these.
     */
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
