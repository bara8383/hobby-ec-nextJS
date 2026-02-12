import type { Metadata } from "next";

const SITE = "Digital Assets EC";
const BASE = "https://example.com";

export function createMetadata(input: {
  title: string;
  description: string;
  path: string;
  image: string;
}): Metadata {
  const url = `${BASE}${input.path}`;
  return {
    title: `${input.title} | ${SITE}`,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE,
      images: [{ url: input.image }],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [input.image]
    }
  };
}
