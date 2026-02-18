'use client';

import { useActionState } from 'react';
import { clearCartAction, type CartActionState } from '@/app/(store)/cart/actions';

const initialState: CartActionState = {};

export function ClearCartButton() {
  const [state, formAction, pending] = useActionState(clearCartAction, initialState);

  return (
    <>
      <form action={formAction}>
        <button type="submit" disabled={pending}>
          カートを空にする
        </button>
      </form>
      {state.message ? <p>{state.message}</p> : null}
    </>
  );
}
