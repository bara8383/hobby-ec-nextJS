"use server";

import { revalidatePath } from "next/cache";
import { getCart, setCart } from "@/lib/cart";

export async function addToCart(productId: string) {
  const cart = await getCart();
  const existing = cart.items.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  await setCart(cart);
  revalidatePath("/cart");
}
