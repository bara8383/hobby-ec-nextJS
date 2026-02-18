'use server';

import { revalidatePath } from 'next/cache';
import { addToCart, clearCart as removeAllCartItems, removeCartLine, setCartLineQuantity } from '@/lib/store/cart';

export type CartActionState = {
  message?: string;
};

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

function parseProductSlug(formData: FormData) {
  const productSlug = formData.get('productSlug');
  if (typeof productSlug !== 'string' || productSlug.length === 0) {
    throw new Error('商品の特定に失敗しました。');
  }

  return productSlug;
}

function parseQuantity(formData: FormData) {
  const value = formData.get('quantity');
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < MIN_QUANTITY || parsed > MAX_QUANTITY) {
    throw new Error(`数量は${MIN_QUANTITY}〜${MAX_QUANTITY}の整数で指定してください。`);
  }

  return parsed;
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'カートの更新に失敗しました。時間をおいて再度お試しください。';
}

export async function addToCartAction(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  void prevState;

  try {
    const productSlug = parseProductSlug(formData);

    await addToCart(productSlug);
    revalidatePath('/cart');
    revalidatePath('/checkout');

    return { message: '商品をカートに追加しました。' };
  } catch (error) {
    return { message: toErrorMessage(error) };
  }
}

export async function updateCartQuantityAction(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  void prevState;

  try {
    const productSlug = parseProductSlug(formData);
    const quantity = parseQuantity(formData);

    await setCartLineQuantity(productSlug, quantity);
    revalidatePath('/cart');
    revalidatePath('/checkout');

    return { message: '数量を更新しました。' };
  } catch (error) {
    return { message: toErrorMessage(error) };
  }
}

export async function removeFromCartAction(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  void prevState;

  try {
    const productSlug = parseProductSlug(formData);

    await removeCartLine(productSlug);
    revalidatePath('/cart');
    revalidatePath('/checkout');

    return { message: '商品をカートから削除しました。' };
  } catch (error) {
    return { message: toErrorMessage(error) };
  }
}

export async function clearCartAction(prevState: CartActionState): Promise<CartActionState> {
  void prevState;

  try {
    await removeAllCartItems();
    revalidatePath('/cart');
    revalidatePath('/checkout');

    return { message: 'カートを空にしました。' };
  } catch (error) {
    return { message: toErrorMessage(error) };
  }
}
