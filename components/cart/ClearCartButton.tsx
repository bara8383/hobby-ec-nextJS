'use client';

import { useActionState } from 'react';
import { clearCartAction, type CartActionState } from '@/app/(store)/cart/actions';
import { Button } from '@/components/ui/Button';

const initialState: CartActionState = {};

export function ClearCartButton() {
  const [state, formAction, pending] = useActionState(clearCartAction, initialState);

  return (
    <>
      <form action={formAction}>
        <Button type="submit" variant="destructive" disabled={pending}>
          カートを空にする
        </Button>
      </form>
      {state.message ? <p className="ui-form-message">{state.message}</p> : null}
    </>
  );
}
