import { allTags, PRODUCT_CATEGORIES, type ProductSearchFilters } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type Props = {
  filters: ProductSearchFilters;
};

export function ProductFilters({ filters }: Props) {
  return (
    <form className="filters" action="/products" method="get" aria-label="商品絞り込み">
      <Input name="q" placeholder="キーワード" defaultValue={filters.query ?? ''} />

      <Select name="category" defaultValue={filters.category ?? ''}>
        <option value="">全カテゴリ</option>
        {PRODUCT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>

      <Select name="tag" defaultValue={filters.tag ?? ''}>
        <option value="">全タグ</option>
        {allTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </Select>

      <Input name="priceMin" type="number" min={0} placeholder="最小価格" defaultValue={filters.priceMin ?? ''} />
      <Input name="priceMax" type="number" min={0} placeholder="最大価格" defaultValue={filters.priceMax ?? ''} />

      <Select name="sort" defaultValue={filters.sort ?? 'newest'}>
        <option value="newest">新着順</option>
        <option value="price_asc">価格が安い順</option>
        <option value="price_desc">価格が高い順</option>
      </Select>

      <Button type="submit">適用</Button>
    </form>
  );
}
