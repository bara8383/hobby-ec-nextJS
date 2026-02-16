import Link from 'next/link';
import { getCategoryLabel, type Product } from '@/data/products';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <article className="card" itemScope itemType="https://schema.org/Product">
      <p className="category">{getCategoryLabel(product.category)}</p>
      <h2 itemProp="name">{product.name}</h2>
      <p itemProp="description">{product.description}</p>
      <p className="instant-download">即時DL</p>
      <ul className="tag-list" aria-label="タグ">
        {product.tags.slice(0, 2).map((tag) => (
          <li key={tag}>#{tag}</li>
        ))}
      </ul>
      <p className="sample-availability">サンプル: {product.media.length > 0 ? 'あり' : 'なし'}</p>
      <p className="price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <span itemProp="priceCurrency" content="JPY" />¥
        <span itemProp="price">{product.priceJpy.toLocaleString('ja-JP')}</span>
      </p>
      <p>
        <Link href={`/products/${product.slug}`}>詳細を見る</Link>
      </p>
    </article>
  );
}
