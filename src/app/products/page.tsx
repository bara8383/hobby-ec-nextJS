import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { createMetadata, toAbsoluteUrl } from "@/lib/seo";

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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: toAbsoluteUrl(`/products/${product.id}`),
            name: product.title
          }))
        }}
      />
    </section>
  );
}
