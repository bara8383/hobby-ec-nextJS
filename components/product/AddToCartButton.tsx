'use client';

import { useState } from 'react';
import { addToCart } from '@/lib/store/cart';

type Props = {
  productSlug: string;
};

export function AddToCartButton({ productSlug }: Props) {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addToCart(productSlug, 1);
        setAdded(true);
      }}
    >
      {added ? 'カートに追加済み' : 'カートへ追加'}
    </button>
  );
}
