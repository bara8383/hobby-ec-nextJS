import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ orderId: string }> }): Promise<Metadata> {
  const { orderId } = await params;

  return createMetadata({
    title: `購入完了 ${orderId}`,
    description: "購入したデジタル素材のダウンロードリンクを確認できます。",
    path: `/purchase/success/${orderId}`,
    image: "https://example.com/og/purchase-success.jpg",
    index: false,
    follow: false
  });
}

export default async function PurchaseSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">購入完了</h1>
      <p className="text-sm text-slate-500">注文番号: {order.id}</p>
      <ul className="list-disc space-y-2 pl-5">
        {order.items.map((item) => (
          <li key={`${item.title}-${item.downloadFile}`}>
            {item.title}: <a href={item.downloadFile}>ダウンロード</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
