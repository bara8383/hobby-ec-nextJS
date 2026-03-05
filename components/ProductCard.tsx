import Image from 'next/image';
import { type Product } from '@/data/products';
import { ButtonLink } from '@/components/ui/Button';
import { FavoriteButton } from '@/components/product/FavoriteButton';

type Props = {
  product: Product;
};

function createPlaceholderImage(product: Product) {
  const title = encodeURIComponent(product.name);
  const category = encodeURIComponent(product.category.toUpperCase());

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#5e7a67'/>
          <stop offset='100%' stop-color='#97b39f'/>
        </linearGradient>
      </defs>
      <rect width='640' height='480' fill='url(#g)'/>
      <rect x='40' y='40' width='560' height='400' rx='16' fill='rgba(255,255,255,0.12)' stroke='rgba(255,255,255,0.28)'/>
      <text x='56' y='88' fill='white' font-size='26' font-family='Arial, sans-serif' font-weight='700'>${category}</text>
      <text x='56' y='150' fill='white' font-size='32' font-family='Arial, sans-serif' font-weight='700'>${title}</text>
      <text x='56' y='430' fill='white' font-size='24' font-family='Arial, sans-serif'>Preview Image (test)</text>
    </svg>`
  )}`;
}

export function ProductCard({ product }: Props) {
  return (
    <article className="product-card" itemScope itemType="https://schema.org/Product">
      <div className="product-card-image-wrap" aria-label={product.media[0]?.alt ?? `${product.name}のプレビュー`}>
        <Image
          src={createPlaceholderImage(product)}
          alt={`${product.name}のテスト用プレビュー画像`}
          className="product-card-image"
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 720px) 50vw, 100vw"
          unoptimized
        />
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
