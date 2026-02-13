import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/products";
import { SITE_BASE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublicProducts();

  const staticPages: MetadataRoute.Sitemap = ["", "/products"].map((path) => ({
    url: `${SITE_BASE_URL}${path}`,
    lastModified: new Date()
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_BASE_URL}/products/${product.id}`,
    lastModified: new Date(product.updatedAt)
  }));

  return [...staticPages, ...productPages];
}
