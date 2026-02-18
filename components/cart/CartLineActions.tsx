'use client';

import { useActionState } from 'react';
import { removeFromCartAction, type CartActionState, updateCartQuantityAction } from '@/app/(store)/cart/actions';

type Props = {
  productSlug: string;
  quantity: number;
};

const initialState: CartActionState = {};

export function CartLineActions({ productSlug, quantity }: Props) {
  const [updateState, updateFormAction, updatePending] = useActionState(updateCartQuantityAction, initialState);
  const [removeState, removeFormAction, removePending] = useActionState(removeFromCartAction, initialState);

  return (
    <div className="cart-item-actions">
      <form action={updateFormAction}>
        <input type="hidden" name="productSlug" value={productSlug} />
        <label>
          数量
          <input type="number" name="quantity" min={1} max={99} defaultValue={quantity} />
        </label>
        <button type="submit" disabled={updatePending}>
          数量更新
        </button>
      </form>
      {updateState.message ? <p>{updateState.message}</p> : null}

      <form action={removeFormAction}>
        <input type="hidden" name="productSlug" value={productSlug} />
        <button type="submit" disabled={removePending}>
          削除
        </button>
      </form>
      {removeState.message ? <p>{removeState.message}</p> : null}
    </div>
  );
}
