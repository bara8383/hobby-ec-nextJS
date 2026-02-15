import type { Product } from '@/data/products';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <article className="card" itemScope itemType="https://schema.org/Product">
      <h2 itemProp="name">{product.name}</h2>
      <p itemProp="description">{product.description}</p>
      <p className="price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <span itemProp="priceCurrency" content="JPY" />¥
        <span itemProp="price">{product.priceJpy.toLocaleString('ja-JP')}</span>
      </p>
      <small>SKU: {product.sku}</small>
    </article>
  );
}
