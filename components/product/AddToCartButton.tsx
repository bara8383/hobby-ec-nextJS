import { addToCart } from '@/lib/store/cart';

type Props = {
  productSlug: string;
};

async function addToCartAction(formData: FormData) {
  'use server';

  const productSlug = formData.get('productSlug');
  if (typeof productSlug !== 'string') {
    return;
  }

  await addToCart(productSlug);
}

export function AddToCartButton({ productSlug }: Props) {
  return (
    <form action={addToCartAction}>
      <input type="hidden" name="productSlug" value={productSlug} />
      <button type="submit">カートへ追加</button>
    </form>
  );
}
