'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ProductSearchFilters } from '@/data/products';
import { Select } from '@/components/ui/Select';

type Props = {
  sort: ProductSearchFilters['sort'];
};

export function ProductSort({ sort = 'newest' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <label className="products-sort" htmlFor="products-sort-select">
      Sort
      <Select
        id="products-sort-select"
        value={sort}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set('sort', event.currentTarget.value);
          const query = params.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        }}
      >
        <option value="newest">新着順</option>
        <option value="price_asc">価格が安い順</option>
        <option value="price_desc">価格が高い順</option>
      </Select>
    </label>
  );
}
