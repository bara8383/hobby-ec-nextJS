import JsonLd from "@/components/JsonLd";
export const dynamic = "force-static";
export const revalidate = 1800;

import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { createItemListJsonLd } from "@/lib/structuredData";

export const metadata = createMetadata({
  title: "商品一覧",
  description: "壁紙・写真・アイコンのデジタル素材一覧",
  path: "/products",
  image: "https://example.com/og/products.jpg"
});

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">商品一覧</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <JsonLd data={createItemListJsonLd(products)} />
    </section>
  );
}
