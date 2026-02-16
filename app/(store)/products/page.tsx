import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import { searchProducts, type ProductSearchFilters } from '@/data/products';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(params: Record<string, string | string[] | undefined>): ProductSearchFilters {
  const priceMinRaw = readValue(params.priceMin);
  const priceMaxRaw = readValue(params.priceMax);

  return {
    query: readValue(params.q),
    category: readValue(params.category),
    tag: readValue(params.tag),
    sort: (readValue(params.sort) as ProductSearchFilters['sort']) ?? 'newest',
    priceMin: priceMinRaw ? Number(priceMinRaw) : undefined,
    priceMax: priceMaxRaw ? Number(priceMaxRaw) : undefined
  };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const query = new URLSearchParams();

  ['q', 'category', 'tag', 'priceMin', 'priceMax', 'sort'].forEach((key) => {
    const value = readValue(params[key]);
    if (value) {
      query.set(key, value);
    }
  });

  const canonical = query.toString() ? `/products?${query.toString()}` : '/products';

  return {
    title: '商品一覧',
    description: '壁紙・イラスト・写真・デジタル音源のダウンロード商品一覧です。',
    alternates: {
      canonical
    }
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const items = searchProducts(filters);

  return (
    <main>
      <h1>商品一覧</h1>
      <p>カテゴリ・タグ・価格帯で絞り込みながら、用途に合うデジタル商品を探せます。</p>
      <ProductFilters filters={filters} />

      {items.length === 0 ? (
        <p>条件に一致する商品がありません。フィルタ条件を調整してください。</p>
      ) : (
        <section className="grid" aria-label="商品一覧">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
