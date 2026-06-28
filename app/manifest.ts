import type { MetadataRoute } from "next";

import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: BRAND.pwaId,
    name: `${BRAND.nameEn} — ${BRAND.taglineEn}`,
    short_name: BRAND.nameEn,
    description: BRAND.descriptionEn,
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    background_color: "#f8fafc",
    theme_color: "#064E3B",
    orientation: "portrait",
    lang: "en",
    dir: "auto",
    categories: ["education", "utilities"],
    prefer_related_applications: false,
    launch_handler: {
      client_mode: "navigate-existing",
    },
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile-home.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow",
        label: "Home — start a practice test in English or Urdu",
      },
      {
        src: "/screenshots/desktop-home.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "RaahPass on desktop",
      },
    ],
    shortcuts: [
      {
        name: "Start Practice Test",
        short_name: "Start Test",
        description: "Begin a 20-question mock exam",
        url: "/start",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Driving Guidelines",
        short_name: "Guidelines",
        description: "Read driving rules before your test",
        url: "/guidelines",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
