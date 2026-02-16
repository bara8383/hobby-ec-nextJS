import { allTags, PRODUCT_CATEGORIES, type ProductSearchFilters } from '@/data/products';

type Props = {
  filters: ProductSearchFilters;
};

export function ProductFilters({ filters }: Props) {
  return (
    <form className="filters" action="/products" method="get" aria-label="商品絞り込み">
      <input name="q" placeholder="キーワード" defaultValue={filters.query ?? ''} />

      <select name="category" defaultValue={filters.category ?? ''}>
        <option value="">全カテゴリ</option>
        {PRODUCT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select name="tag" defaultValue={filters.tag ?? ''}>
        <option value="">全タグ</option>
        {allTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <input name="priceMin" type="number" min={0} placeholder="最小価格" defaultValue={filters.priceMin ?? ''} />
      <input name="priceMax" type="number" min={0} placeholder="最大価格" defaultValue={filters.priceMax ?? ''} />

      <select name="sort" defaultValue={filters.sort ?? 'newest'}>
        <option value="newest">新着順</option>
        <option value="price_asc">価格が安い順</option>
        <option value="price_desc">価格が高い順</option>
      </select>

      <button type="submit">適用</button>
    </form>
  );
}
