'use client';

import { useActionState } from 'react';
import { addToCartAction, type CartActionState } from '@/app/(store)/cart/actions';

type Props = {
  productSlug: string;
};

const initialState: CartActionState = {};

export function AddToCartButton({ productSlug }: Props) {
  const [state, formAction, pending] = useActionState(addToCartAction, initialState);

  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="productSlug" value={productSlug} />
        <button type="submit" disabled={pending}>
          カートへ追加
        </button>
      </form>
      {state.message ? <p>{state.message}</p> : null}
    </>
  );
}
