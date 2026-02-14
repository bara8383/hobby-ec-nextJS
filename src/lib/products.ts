import type { Product } from "@/types";

const PRODUCTS: Product[] = [
  {
    id: "aurora-wallpaper-4k",
    title: "Aurora Wallpaper 4K",
    description: "高解像度のオーロラ壁紙セット（4枚）。",
    category: "wallpaper",
    price: 1200,
    image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=80",
    downloadFile: "/downloads/aurora-pack.zip",
    isPublished: true,
    updatedAt: "2026-01-10T00:00:00.000Z"
  },
  {
    id: "city-night-photo-pack",
    title: "City Night Photo Pack",
    description: "夜景写真10枚の商用利用可能パック。",
    category: "photo",
    price: 1800,
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    downloadFile: "/downloads/city-night-pack.zip",
    isPublished: true,
    updatedAt: "2026-01-11T00:00:00.000Z"
  },
  {
    id: "minimal-ui-icon-set",
    title: "Minimal UI Icon Set",
    description: "Webとアプリ制作で使えるSVGアイコン300種。",
    category: "icon",
    price: 2400,
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80",
    downloadFile: "/downloads/minimal-icons.zip",
    isPublished: true,
    updatedAt: "2026-01-12T00:00:00.000Z"
  }
];

type LocalStackProduct = {
  productId?: string;
  name?: string;
  price?: number | string;
  description?: string;
};

function apiBaseUrl() {
  return process.env.EC_API_BASE_URL ?? "";
}

function mapLocalStackProduct(item: LocalStackProduct, index: number): Product {
  const id = item.productId && item.productId.trim() ? item.productId : `local-${index}`;

  return {
    id,
    title: item.name?.trim() || `Local Product ${index + 1}`,
    description: item.description?.trim() || "ローカル検証用のダミー商品です。",
    category: "icon",
    price: Number(item.price ?? 0) || 0,
    image: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1200&q=80",
    downloadFile: `/downloads/${id}.zip`,
    isPublished: true,
    updatedAt: new Date().toISOString()
  };
}

async function getProductsFromApi(): Promise<Product[] | null> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/products`, {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { items?: LocalStackProduct[] };
    if (!Array.isArray(data.items)) {
      return null;
    }

    return data.items.map(mapLocalStackProduct);
  } catch {
    return null;
  }
}

export async function getProducts() {
  const fromApi = await getProductsFromApi();
  if (fromApi && fromApi.length > 0) {
    return fromApi;
  }

  return PRODUCTS;
}

export async function getProductById(id: string) {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function getPublicProducts() {
  const products = await getProducts();
  return products.filter((product) => product.isPublished);
}
