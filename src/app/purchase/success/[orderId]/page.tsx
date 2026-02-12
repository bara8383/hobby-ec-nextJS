import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";

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
