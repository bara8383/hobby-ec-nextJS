import type { Metadata } from "next";

export const SITE_NAME = "Digital Assets EC";
export const SITE_BASE_URL = "https://example.com";

export function toAbsoluteUrl(path: string) {
  return `${SITE_BASE_URL}${path}`;
}

export function createMetadata(input: {
  title: string;
  description: string;
  path: string;
  image: string;
  index?: boolean;
  follow?: boolean;
}): Metadata {
  const url = toAbsoluteUrl(input.path);
  const index = input.index ?? true;
  const follow = input.follow ?? true;
  return {
    title: `${input.title} | ${SITE_NAME}`,
    description: input.description,
    alternates: { canonical: url },
    robots: {
      index,
      follow
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
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
