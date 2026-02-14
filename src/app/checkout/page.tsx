import { createOrder } from "@/actions/orderActions";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "チェックアウト",
  description: "デジタル商品の注文を確定します。",
  path: "/checkout",
  image: "https://example.com/og/checkout.jpg",
  index: false,
  follow: false
});

export default function CheckoutPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">チェックアウト</h1>
      <p className="text-slate-600">デジタル商品のため、購入後すぐにダウンロードリンクが表示されます。</p>
      <form action={createOrder}>
        <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700" type="submit">
          注文を確定する
        </button>
      </form>
    </section>
  );
}
