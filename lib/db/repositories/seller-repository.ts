import { listProducts } from '@/lib/db/repositories/product-repository';
import { listOrders, listOrderItemsByOrderId } from '@/lib/db/repositories/order-repository';

const sellerProductMap: Record<string, string[]> = {
  'seller-demo': ['tokyo-night-wallpaper-pack', 'nature-photo-bundle', 'flat-illustration-kit'],
  'admin-demo': ['lofi-music-starter-pack']
};

const TEST_SELLER_PRODUCT_SLUG = 'lofi-music-starter-pack';

export function listSellerListings(sellerId: string) {
  const slugs = sellerProductMap[sellerId] ?? [];
  return listProducts().filter((product) => slugs.includes(product.slug));
}

export function registerTestListingForSeller(sellerId: string) {
  const slugs = sellerProductMap[sellerId] ?? [];
  if (slugs.includes(TEST_SELLER_PRODUCT_SLUG)) {
    return false;
  }

  sellerProductMap[sellerId] = [...slugs, TEST_SELLER_PRODUCT_SLUG];
  return true;
}

export function listSoldItemsForSeller(sellerId: string) {
  const slugs = new Set((sellerProductMap[sellerId] ?? []).map((slug) => slug));

  return listOrders().flatMap((order) =>
    listOrderItemsByOrderId(order.id)
      .filter((item) => slugs.has(item.productSlug))
      .map((item) => ({ order, item }))
  );
}
