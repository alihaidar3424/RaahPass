import type { MetadataRoute } from "next";
import { guidelines } from "@/data/guidelines";
import { getAllSigns } from "@/lib/traffic-signs";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://raah-pass.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/sign-test",
    "/signs",
    "/fees",
    "/about",
    "/contact",
    "/guidelines",
    "/start",
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    for (const lang of ["en", "ur"] as const) {
      const qs = `lang=${lang}`;
      entries.push({
        url: `${BASE}${path}?${qs}`,
        lastModified: now,
        changeFrequency: path === "" || path === "/sign-test" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }

  for (const sign of getAllSigns()) {
    for (const lang of ["en", "ur"] as const) {
      entries.push({
        url: `${BASE}/signs/${sign.slug}?lang=${lang}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  for (const g of guidelines) {
    for (const lang of ["en", "ur"] as const) {
      entries.push({
        url: `${BASE}/guidelines/${g.slug}?lang=${lang}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
