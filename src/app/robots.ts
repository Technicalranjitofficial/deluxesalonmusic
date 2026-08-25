import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [],
      },
    ],
    sitemap: "https://deluxesalonmusic.com/sitemap.xml",
    host: "https://deluxesalonmusic.com",
  };
}
