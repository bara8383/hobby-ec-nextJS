import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { SITE_BASE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const staticPages: MetadataRoute.Sitemap = ["", "/products", "/cart", "/checkout", "/chat"].map((path) => ({
    url: `${SITE_BASE_URL}${path}`,
    lastModified: new Date()
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_BASE_URL}/products/${product.id}`,
    lastModified: new Date()
  }));

  return [...staticPages, ...productPages];
}
