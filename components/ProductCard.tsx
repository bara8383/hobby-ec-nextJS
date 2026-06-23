import Image from 'next/image';
import { type Product } from '@/data/products';
import { ButtonLink } from '@/components/ui/Button';
import { FavoriteButton } from '@/components/product/FavoriteButton';

type Props = {
  product: Product;
};

const categoryArtwork: Record<Product['category'], { label: string; from: string; to: string; accent: string; motif: string }> = {
  wallpaper: {
    label: '4K WALLPAPER',
    from: '#243345',
    to: '#7d6658',
    accent: '#f2c078',
    motif: "<circle cx='470' cy='128' r='54' fill='rgba(242,192,120,0.86)'/><path d='M0 330 C120 250 190 285 305 220 C420 155 506 222 640 170 L640 480 L0 480 Z' fill='rgba(255,255,255,0.18)'/><path d='M0 380 C140 315 250 360 390 280 C500 220 560 260 640 230 L640 480 L0 480 Z' fill='rgba(23,31,42,0.28)'/>"
  },
  illustration: {
    label: 'SVG ILLUSTRATION',
    from: '#7f9f92',
    to: '#ead7b5',
    accent: '#40584d',
    motif: "<rect x='92' y='112' width='176' height='176' rx='42' fill='rgba(255,255,255,0.34)'/><circle cx='388' cy='192' r='74' fill='rgba(64,88,77,0.32)'/><path d='M372 312 L498 150 L584 312 Z' fill='rgba(255,255,255,0.28)'/><path d='M104 320 C164 270 228 370 286 318 C332 276 374 282 420 322' stroke='rgba(64,88,77,0.55)' stroke-width='18' fill='none' stroke-linecap='round'/>"
  },
  photo: {
    label: 'COMMERCIAL PHOTO',
    from: '#5e7a67',
    to: '#c6b58f',
    accent: '#f7f0df',
    motif: "<rect x='70' y='78' width='230' height='160' rx='22' fill='rgba(255,255,255,0.28)' transform='rotate(-6 185 158)'/><rect x='258' y='150' width='260' height='184' rx='24' fill='rgba(255,255,255,0.24)' transform='rotate(7 388 242)'/><circle cx='162' cy='144' r='34' fill='rgba(247,240,223,0.9)'/><path d='M84 218 L150 164 L204 206 L244 178 L302 238 Z' fill='rgba(52,58,53,0.34)'/>"
  },
  music: {
    label: 'LOOP READY AUDIO',
    from: '#4b5563',
    to: '#8aa399',
    accent: '#d9c7aa',
    motif: "<path d='M82 260 C122 180 162 340 202 260 S282 180 322 260 S402 340 442 260 S522 180 562 260' stroke='rgba(255,255,255,0.72)' stroke-width='18' fill='none' stroke-linecap='round'/><rect x='118' y='118' width='74' height='192' rx='37' fill='rgba(217,199,170,0.4)'/><rect x='276' y='82' width='74' height='260' rx='37' fill='rgba(255,255,255,0.24)'/><rect x='434' y='140' width='74' height='160' rx='37' fill='rgba(217,199,170,0.34)'/>"
  }
};

function createPlaceholderImage(product: Product) {
  const artwork = categoryArtwork[product.category];
  const title = product.name.replace(/&/g, '&amp;');

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${artwork.from}'/>
          <stop offset='100%' stop-color='${artwork.to}'/>
        </linearGradient>
      </defs>
      <rect width='640' height='480' fill='url(#g)'/>
      <rect x='36' y='36' width='568' height='408' rx='28' fill='rgba(255,255,255,0.10)' stroke='rgba(255,255,255,0.28)'/>
      ${artwork.motif}
      <rect x='56' y='54' width='228' height='40' rx='20' fill='rgba(255,255,255,0.78)'/>
      <text x='76' y='80' fill='${artwork.accent}' font-size='18' font-family='Arial, sans-serif' font-weight='700' letter-spacing='2'>${artwork.label}</text>
      <text x='56' y='410' fill='white' font-size='30' font-family='Arial, sans-serif' font-weight='700'>${title}</text>
    </svg>`
  )}`;
}

function getProductHighlights(product: Product) {
  return [product.license.replace('ライセンス', ''), product.fileFormat, product.specs[0]?.value].filter(Boolean).slice(0, 3);
}

export function ProductCard({ product }: Props) {
  return (
    <article className="product-card" itemScope itemType="https://schema.org/Product">
      <div className="product-card-image-wrap" aria-label={product.media[0]?.alt ?? `${product.name}のプレビュー`}>
        <Image
          src={createPlaceholderImage(product)}
          alt={product.media[0]?.alt ?? `${product.name}のプレビュー画像`}
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

      <ul className="product-card-highlights" aria-label={`${product.name}の主な仕様`}>
        {getProductHighlights(product).map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

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
