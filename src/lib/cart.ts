import { cookies } from "next/headers";
import type { Cart } from "@/types";

const CART_COOKIE_KEY = "ec_cart";

function normalizeCart(input: unknown): Cart {
  if (!input || typeof input !== "object" || !("items" in input)) {
    return { items: [] };
  }

  const maybeItems = (input as { items?: unknown }).items;
  if (!Array.isArray(maybeItems)) {
    return { items: [] };
  }

  return {
    items: maybeItems
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const productId = (item as { productId?: unknown }).productId;
        const quantity = (item as { quantity?: unknown }).quantity;

        if (typeof productId !== "string" || typeof quantity !== "number") {
          return null;
        }

        return { productId, quantity: Math.max(1, Math.floor(quantity)) };
      })
      .filter((item): item is { productId: string; quantity: number } => item !== null)
  };
}

export async function getCart(): Promise<Cart> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE_KEY)?.value;

  if (!raw) {
    return { items: [] };
  }

  try {
    return normalizeCart(JSON.parse(raw));
  } catch {
    return { items: [] };
  }
}

export async function setCart(cart: Cart) {
  const store = await cookies();
  store.set(CART_COOKIE_KEY, JSON.stringify(cart), {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
}

export async function clearCart() {
  const store = await cookies();
  store.delete(CART_COOKIE_KEY);
}
