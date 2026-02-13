import Image from "next/image";
export const dynamic = "force-static";
export const revalidate = 1800;

import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import JsonLd from "@/components/JsonLd";
import { getProductById } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { createProductJsonLd } from "@/lib/structuredData";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return createMetadata({
      title: "商品が見つかりません",
      description: "指定された商品は存在しません。",
      path: `/products/${id}`,
      image: "https://example.com/og/not-found.jpg"
    });
  }

  return createMetadata({
    title: product.title,
    description: product.description,
    path: `/products/${product.id}`,
    image: product.image
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <article className="space-y-4">
      <Image src={product.image} alt={product.title} width={1200} height={675} className="h-80 w-full rounded-xl object-cover" />
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p>{product.description}</p>
      <p className="text-2xl font-semibold">¥{product.price.toLocaleString()}</p>
      <AddToCartButton product={product} />

      <JsonLd data={createProductJsonLd(product)} />
    </article>
  );
}
