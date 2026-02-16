import { products } from '@/data/products';
import type { ProductRecord } from '@/lib/db/schema/product';

export function listProducts(): ProductRecord[] {
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    priceJpy: product.priceJpy,
    category: product.category,
    tags: product.tags
  }));
}
