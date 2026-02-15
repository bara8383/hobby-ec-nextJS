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
      <ul className="specs" aria-label="商品仕様">
        <li>形式: {product.fileFormat}</li>
        <li>容量: {product.downloadSizeMB.toLocaleString('ja-JP')} MB</li>
        <li>ライセンス: {product.license}</li>
      </ul>
      <p className="price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <span itemProp="priceCurrency" content="JPY" />¥
        <span itemProp="price">{product.priceJpy.toLocaleString('ja-JP')}</span>
      </p>
      <small>SKU: {product.sku}</small>
      <p>
        <Link href={`/products/${product.id}`}>商品詳細を見る</Link>
      </p>
    </article>
  );
}
