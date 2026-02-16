export type CartLine = {
  productSlug: string;
  quantity: number;
};

const STORAGE_KEY = 'digital-creator-market-cart';

function isBrowser() {
  return typeof window !== 'undefined';
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
    return parsed.filter((line) => line.quantity > 0 && typeof line.productSlug === 'string');
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
}

export function addToCart(slug: string, quantity = 1) {
  const current = readCart();
  const index = current.findIndex((line) => line.productSlug === slug);

  if (index >= 0) {
    current[index] = {
      ...current[index],
      quantity: current[index].quantity + quantity
    };
  } else {
    current.push({ productSlug: slug, quantity });
  }

  writeCart(current);
}

export function clearCart() {
  writeCart([]);
}
