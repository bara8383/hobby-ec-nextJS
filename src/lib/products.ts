import type { Product } from "@/types";

const PRODUCTS: Product[] = [
  {
    id: "aurora-wallpaper-4k",
    title: "Aurora Wallpaper 4K",
    description: "高解像度のオーロラ壁紙セット（4枚）。",
    category: "wallpaper",
    price: 1200,
    image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=80",
    downloadFile: "/downloads/aurora-pack.zip"
  },
  {
    id: "city-night-photo-pack",
    title: "City Night Photo Pack",
    description: "夜景写真10枚の商用利用可能パック。",
    category: "photo",
    price: 1800,
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    downloadFile: "/downloads/city-night-pack.zip"
  },
  {
    id: "minimal-ui-icon-set",
    title: "Minimal UI Icon Set",
    description: "Webとアプリ制作で使えるSVGアイコン300種。",
    category: "icon",
    price: 2400,
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80",
    downloadFile: "/downloads/minimal-icons.zip"
  }
];

export async function getProducts() {
  return PRODUCTS;
}

export async function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}
