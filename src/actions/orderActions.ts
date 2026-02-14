"use server";

import { redirect } from "next/navigation";
import { clearCart, getCart } from "@/lib/cart";
import { getProducts } from "@/lib/products";
import { saveOrder } from "@/lib/orders";

async function createRemoteOrder(productId: string, quantity: number) {
  const baseUrl = process.env.EC_API_BASE_URL;
  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId, quantity }),
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { orderId?: string };
    if (!data.orderId) {
      return null;
    }

    return data.orderId;
  } catch {
    return null;
  }
}

export async function createOrder() {
  const [cart, products] = await Promise.all([getCart(), getProducts()]);

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  const orderId =
    (await createRemoteOrder(cart.items[0].productId, cart.items[0].quantity)) ?? `ORD-${Date.now()}`;

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
