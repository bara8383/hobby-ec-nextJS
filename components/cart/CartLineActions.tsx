'use client';

import { useActionState } from 'react';
import { removeFromCartAction, type CartActionState, updateCartQuantityAction } from '@/app/(store)/cart/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
      <form action={updateFormAction} className="cart-quantity-form">
        <input type="hidden" name="productSlug" value={productSlug} />
        <label>
          数量
          <Input type="number" name="quantity" min={1} max={99} defaultValue={quantity} />
        </label>
        <Button type="submit" variant="secondary" disabled={updatePending}>
          数量更新
        </Button>
      </form>
      {updateState.message ? <p className="ui-form-message">{updateState.message}</p> : null}

      <form action={removeFormAction}>
        <input type="hidden" name="productSlug" value={productSlug} />
        <Button type="submit" variant="ghost" disabled={removePending}>
          削除
        </Button>
      </form>
      {removeState.message ? <p className="ui-form-message">{removeState.message}</p> : null}
    </div>
  );
}
