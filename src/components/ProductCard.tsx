import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Image src={product.image} alt={product.title} width={640} height={360} className="h-48 w-full object-cover" />
      <div className="space-y-2 p-4">
        <h2 className="text-lg font-semibold">
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </h2>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <p className="text-base font-bold">¥{product.price.toLocaleString()}</p>
      </div>
    </article>
  );
}
