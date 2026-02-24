import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeFilterSidebar } from '@/components/home/HomeFilterSidebar';
import { HeroBackgroundSlideshow } from '@/components/home/HeroBackgroundSlideshow';
import { ProductCard } from '@/components/ProductCard';
import { HomeKeywordSearchBar } from '@/components/search/HomeKeywordSearchBar';
import { allTags, getCategoryLabel, PRODUCT_CATEGORIES, products, searchProducts, type Product } from '@/data/products';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PRICE_SHORTCUTS = [
  { label: '〜¥3,000', min: 0, max: 3000 },
  { label: '¥3,001〜¥6,000', min: 3001, max: 6000 },
  { label: '¥6,001〜', min: 6001 }
];

const featuredProducts = [...products].sort((a, b) => b.priceJpy - a.priceJpy).slice(0, 3);

const createHeroPlaceholder = (gradient: string, accent: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'><defs><linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${gradient.split(',')[0]}'/><stop offset='55%' stop-color='${gradient.split(',')[1]}'/><stop offset='100%' stop-color='${gradient.split(',')[2]}'/></linearGradient><linearGradient id='ac' x1='1' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='${accent}' stop-opacity='0.42'/><stop offset='100%' stop-color='#ffffff' stop-opacity='0.12'/></linearGradient></defs><rect width='1920' height='1080' fill='url(#bg)'/><rect width='1920' height='1080' fill='url(#ac)'/></svg>`)}`;

const HERO_IMAGES = [
  { src: createHeroPlaceholder('#e5ddd0,#d2dacd,#ece5da', '#9ba88f'), alt: '' },
  { src: createHeroPlaceholder('#d8dfd3,#c9c2b8,#e7ddd0', '#b09b83'), alt: '' },
  { src: createHeroPlaceholder('#ddd2c6,#c5d0c4,#e6ddd3', '#8d9ead'), alt: '' }
];

function readValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readNumber(value: string | string[] | undefined) {
  const rawValue = readValue(value);

  if (!rawValue) {
    return undefined;
  }

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const q = readValue(params.q)?.trim();

  if (!q) {
    return {};
  }

  return {
    robots: {
      index: false,
      follow: true
    }
  };
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const q = readValue(params.q)?.trim() ?? '';
  const category = readValue(params.category)?.trim() ?? '';
  const tag = readValue(params.tag)?.trim() ?? '';
  const priceMin = readNumber(params.priceMin);
  const priceMax = readNumber(params.priceMax);
  const sortValue = readValue(params.sort)?.trim();
  const sort = sortValue === 'price_asc' || sortValue === 'price_desc' || sortValue === 'newest' ? sortValue : 'newest';

  let items: Product[] = [];
  let errorMessage = '';

  try {
    items = searchProducts({
      query: q,
      category,
      tag,
      priceMin,
      priceMax,
      sort
    });
  } catch {
    errorMessage = '検索結果の取得に失敗しました。時間をおいて再度お試しください。';
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Digital Creator Market',
        url: 'https://example.com'
      },
      {
        '@type': 'WebSite',
        name: 'Digital Creator Market',
        url: 'https://example.com'
      }
    ]
  };

  return (
    <main>
      <section className="hero">
        <HeroBackgroundSlideshow images={HERO_IMAGES} intervalMs={10000} fadeMs={1000} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-label">Calm Digital Market</p>
          <h1>静かに選べる、やさしいデジタル素材ストア</h1>
          <HomeKeywordSearchBar initialQuery={q} />
          <p>
            余白を大切にした設計で、壁紙・写真・イラスト・デジタル音源を心地よく探せるECです。制作目的に合わせて比較しやすく、購入前の不安はリアルタイムチャットで解消できます。
          </p>
          <div className="hero-cta-row" aria-label="主要導線">
            <Link className="button-link" href="/products">
              商品一覧を見る
            </Link>
            <Link className="button-link button-link-secondary" href="/search">
              条件で探す
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="ホーム商品一覧">
        <h2>ホーム商品一覧</h2>
        <p className="section-description">カテゴリ・タグ・価格帯・並び順を左のサイドバーで調整できます。URL共有でも同じ結果を再現できます。</p>
        <div className="products-page">
          <HomeFilterSidebar category={category} tag={tag} priceMin={priceMin} priceMax={priceMax} sort={sort} />
          <div className="products-content">
            {errorMessage ? (
              <p className="empty-state" role="alert">
                {errorMessage}
              </p>
            ) : items.length === 0 ? (
              <p className="empty-state">条件に一致する商品がありません。フィルター条件を変更してください。</p>
            ) : (
              <section className="products-grid" aria-label="ホーム商品検索結果">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </section>
            )}
          </div>
        </div>
      </section>

      <section className="value-badges" aria-label="価値訴求">
        <p>即時ダウンロード対応</p>
        <p>商用利用可能ライセンスあり</p>
        <p>購入前チャット相談OK</p>
      </section>

      <section aria-label="カテゴリ導線">
        <h2>カテゴリからゆっくり探す</h2>
        <p className="section-description">制作ジャンルごとに視線移動が少ない導線で、落ち着いて比較できます。</p>
        <div className="category-grid">
          {PRODUCT_CATEGORIES.map((categoryOption) => (
            <Link key={categoryOption} className="category-card" href={`/categories/${categoryOption}`}>
              <strong>{getCategoryLabel(categoryOption)}</strong>
              <span>カテゴリ詳細へ進む</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="価格帯導線">
        <h2>価格帯ショートカット</h2>
        <p className="section-description">予算に合わせて、必要な素材を短時間で見つけられます。</p>
        <div className="quick-links">
          {PRICE_SHORTCUTS.map((shortcut) => (
            <Link
              key={shortcut.label}
              href={`/search?priceMin=${shortcut.min}${shortcut.max ? `&priceMax=${shortcut.max}` : ''}`}
            >
              {shortcut.label}
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="注目商品">
        <h2>注目ピックアップ</h2>
        <p className="section-description">高単価で情報量の多い商品を中心に、制作現場で再利用しやすい素材を選定しています。</p>
        <section className="products-grid" aria-label="注目商品一覧">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </section>

      <section aria-label="タグ導線">
        <h2>人気タグ</h2>
        <p className="section-description">利用シーンをイメージしやすいタグで横断的に探せます。</p>
        <div className="quick-links">
          {allTags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}>
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      <section className="chat-cta-band" aria-label="購入前相談導線">
        <h2>購入前に迷ったら、チャットで気軽に相談</h2>
        <p>利用範囲・納品形式・商用可否の確認をその場でサポートします。</p>
        <Link className="button-link" href="/chat">
          チャットページへ
        </Link>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
