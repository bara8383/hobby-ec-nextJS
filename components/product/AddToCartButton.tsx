'use client';

import { useActionState } from 'react';
import { addToCartAction, type CartActionState } from '@/app/(store)/cart/actions';
import { Button } from '@/components/ui/Button';

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
        <Button type="submit" disabled={pending}>
          カートへ追加
        </Button>
      </form>
      {state.message ? <p className="ui-form-message">{state.message}</p> : null}
    </>
  );
}
