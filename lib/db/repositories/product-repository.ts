import { products, type DigitalCategory, type Product } from '@/data/products';
import type { ProductRecord } from '@/lib/db/schema/product';

export type ProductSearchParams = {
  q?: string;
  category?: string;
  sort?: 'new' | 'price_asc' | 'price_desc';
};

export function listProducts(): ProductRecord[] {
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    priceJpy: product.priceJpy,
    category: product.category,
    tags: product.tags,
    publishedAt: product.publishedAt
  }));
}

export function searchProducts(params: ProductSearchParams): Product[] {
  const normalizedQuery = params.q?.trim().toLowerCase();
  const filtered = products.filter((product) => {
    if (params.category && product.category !== params.category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery)
    );
  });

  const sorted = [...filtered];

  switch (params.sort) {
    case 'price_asc':
      sorted.sort((a, b) => a.priceJpy - b.priceJpy);
      break;
    case 'price_desc':
      sorted.sort((a, b) => b.priceJpy - a.priceJpy);
      break;
    case 'new':
    default:
      sorted.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
      break;
  }

  return sorted;
}

export function getProductById(productId: string) {
  return products.find((product) => product.id === productId);
}

export function listCategories(): DigitalCategory[] {
  return Array.from(new Set(products.map((product) => product.category))).sort();
}

export function listTags(): string[] {
  return Array.from(new Set(products.flatMap((product) => product.tags))).sort((a, b) => a.localeCompare(b, 'ja'));
}

export function getLatestProducts(limit: number): Product[] {
  const safeLimit = Math.max(0, Math.floor(limit));

  return [...products]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, safeLimit);
}
