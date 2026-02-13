import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/lib/seo";

const APP_ENV = process.env.APP_ENV ?? process.env.NODE_ENV ?? "development";

export default function robots(): MetadataRoute.Robots {
  if (APP_ENV === "production") {
    return {
      rules: {
        userAgent: "*",
        allow: "/"
      },
      sitemap: `${SITE_BASE_URL}/sitemap.xml`
    };
  }

  return {
    rules: {
      userAgent: "*",
      disallow: "/"
    },
    sitemap: `${SITE_BASE_URL}/sitemap.xml`
  };
}
