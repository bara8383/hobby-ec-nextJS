import { toAbsoluteUrl } from "@/lib/seo";
import type { Product } from "@/types";

export function createWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Digital Assets EC",
    url: toAbsoluteUrl("/")
  };
}

export function createItemListJsonLd(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: toAbsoluteUrl(`/products/${product.id}`),
      name: product.title
    }))
  };
}

export function createProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.id,
    image: product.image,
    offers: {
      "@type": "Offer",
      priceCurrency: "JPY",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: toAbsoluteUrl(`/products/${product.id}`)
    }
  };
}
