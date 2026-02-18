'use client';

import { useState } from 'react';

type Props = {
  productName: string;
};

export function FavoriteButton({ productName }: Props) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      className={`favorite-button${active ? ' is-active' : ''}`}
      aria-label={active ? `${productName}をお気に入りから外す` : `${productName}をお気に入りに追加`}
      aria-pressed={active}
      onClick={() => setActive((prev) => !prev)}
    >
      ♥
    </button>
  );
}
