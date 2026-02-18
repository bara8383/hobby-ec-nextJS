import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { allTags, getCategoryLabel, PRODUCT_CATEGORIES, products } from '@/data/products';

const PRICE_SHORTCUTS = [
  { label: '〜¥3,000', min: 0, max: 3000 },
  { label: '¥3,001〜¥6,000', min: 3001, max: 6000 },
  { label: '¥6,001〜', min: 6001 }
];

const sortedByNewest = [...products].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
const featuredProducts = [...products].sort((a, b) => b.priceJpy - a.priceJpy).slice(0, 3);

export default function HomePage() {
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
        <p className="hero-label">Calm Digital Market</p>
        <h1>静かに選べる、やさしいデジタル素材ストア</h1>
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
          {PRODUCT_CATEGORIES.map((category) => (
            <Link key={category} className="category-card" href={`/categories/${category}`}>
              <strong>{getCategoryLabel(category)}</strong>
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

      <section aria-label="新着商品">
        <h2>新着商品</h2>
        <p className="section-description">公開日の新しい順で、最新の制作素材をチェックできます。</p>
        <section className="grid" aria-label="新着商品一覧">
          {sortedByNewest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </section>

      <section aria-label="注目商品">
        <h2>注目ピックアップ</h2>
        <p className="section-description">高単価で情報量の多い商品を中心に、制作現場で再利用しやすい素材を選定しています。</p>
        <section className="grid" aria-label="注目商品一覧">
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
