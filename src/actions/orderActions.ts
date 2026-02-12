"use server";

import { redirect } from "next/navigation";
import { clearCart, getCart } from "@/lib/cart";
import { getProducts } from "@/lib/products";
import { saveOrder } from "@/lib/orders";

export async function createOrder() {
  const [cart, products] = await Promise.all([getCart(), getProducts()]);

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  const orderId = `ORD-${Date.now()}`;
  const orderItems = cart.items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return null;
      }
      return {
        title: product.title,
        downloadFile: product.downloadFile
      };
    })
    .filter((item): item is { title: string; downloadFile: string } => item !== null);

  await saveOrder({ id: orderId, items: orderItems });
  await clearCart();

  redirect(`/purchase/success/${orderId}`);
}
