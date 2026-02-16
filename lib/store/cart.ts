export type CartLine = {
  productSlug: string;
  quantity: number;
};

const STORAGE_KEY = 'digital-creator-market-cart';

function isBrowser() {
  return typeof window !== 'undefined';
}

function sanitizeLines(lines: CartLine[]) {
  return lines.filter((line) => line.quantity > 0 && typeof line.productSlug === 'string');
}

export function readCart(): CartLine[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
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

export function writeCart(lines: CartLine[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeLines(lines)));
}

export function addToCart(slug: string) {
  const current = readCart();
  const exists = current.some((line) => line.productSlug === slug);

  if (!exists) {
    current.push({ productSlug: slug, quantity: 1 });
    writeCart(current);
  }
}

export function removeCartLine(slug: string) {
  const current = readCart().filter((line) => line.productSlug !== slug);
  writeCart(current);
}

export function clearCart() {
  writeCart([]);
}
