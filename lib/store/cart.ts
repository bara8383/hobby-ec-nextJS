import { cookies } from 'next/headers';

export type CartLine = {
  productSlug: string;
  quantity: number;
};

const CART_COOKIE_KEY = 'digital-creator-market-cart';

function sanitizeLines(lines: CartLine[]) {
  return lines.filter((line) => line.quantity > 0 && typeof line.productSlug === 'string');
}

export async function readCart(): Promise<CartLine[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE_KEY)?.value;

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CartLine[];
    return sanitizeLines(parsed);
  } catch {
    return [];
  }
}

export async function writeCart(lines: CartLine[]) {
  const cookieStore = await cookies();
  const sanitized = sanitizeLines(lines);

  cookieStore.set(CART_COOKIE_KEY, JSON.stringify(sanitized), {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  });
}

export async function addToCart(slug: string) {
  const current = await readCart();
  const existing = current.find((line) => line.productSlug === slug);

  if (existing) {
    existing.quantity += 1;
    await writeCart(current);
    return;
  }

  current.push({ productSlug: slug, quantity: 1 });
  await writeCart(current);
}

export async function setCartLineQuantity(slug: string, quantity: number) {
  const current = await readCart();
  const target = current.find((line) => line.productSlug === slug);

  if (!target) {
    throw new Error('対象の商品がカートに存在しません。');
  }

  target.quantity = quantity;
  await writeCart(current);
}

export async function removeCartLine(slug: string) {
  const current = (await readCart()).filter((line) => line.productSlug !== slug);
  await writeCart(current);
}

export async function clearCart() {
  await writeCart([]);
}
