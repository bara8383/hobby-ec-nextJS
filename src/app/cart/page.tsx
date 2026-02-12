import Link from "next/link";
import { getCart } from "@/lib/cart";
import { getProducts } from "@/lib/products";

export default async function CartPage() {
  const [cart, products] = await Promise.all([getCart(), getProducts()]);

  const displayItems = cart.items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return null;
      }

      return {
        id: product.id,
        title: product.title,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    })
    .filter((item): item is { id: string; title: string; quantity: number; subtotal: number } => item !== null);

  const total = displayItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">カート</h1>
      {displayItems.length === 0 ? (
        <p>
          カートに商品がありません。<Link href="/products">商品一覧へ</Link>
        </p>
      ) : (
        <>
          <ul className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            {displayItems.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>¥{item.subtotal.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <p className="text-right text-lg font-bold">合計: ¥{total.toLocaleString()}</p>
          <div className="text-right">
            <Link className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/checkout">
              チェックアウトへ
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
