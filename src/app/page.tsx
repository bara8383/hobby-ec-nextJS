import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 p-8 text-white">
        <h1 className="text-4xl font-bold">クリエイター向けデジタル素材EC</h1>
        <p className="mt-3 max-w-3xl text-slate-200">
          壁紙・写真・アイコンをワンストップで購入できる、Next.js App Router学習用のECテンプレートです。
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900"
        >
          商品を見る
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">人気素材</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
