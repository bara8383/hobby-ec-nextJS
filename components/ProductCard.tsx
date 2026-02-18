import { type Product } from '@/data/products';
import { ButtonLink } from '@/components/ui/Button';
import { FavoriteButton } from '@/components/product/FavoriteButton';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <article className="product-card" itemScope itemType="https://schema.org/Product">
      <div className="product-card-image-wrap" aria-label={product.media[0]?.alt ?? `${product.name}のプレビュー`}>
        <div className="product-card-image-fallback" aria-hidden="true" />
        <FavoriteButton productName={product.name} />
      </div>

      <h2 className="product-card-title" itemProp="name">
        {product.name}
      </h2>

      <p className="product-card-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <span itemProp="priceCurrency" content="JPY" />
        ¥<span itemProp="price">{product.priceJpy.toLocaleString('ja-JP')}</span>
      </p>

      <ButtonLink href={`/products/${product.slug}`} className="product-card-cta">
        詳細を見る
      </ButtonLink>
    </article>
  );
}
