import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';
import { buildDealsMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildDealsMetadata();

const couponCampaigns = [
  {
    code: 'WELCOME10',
    title: '初回購入10%OFF',
    detail: '会員登録後7日間限定。最初の購入で使えるウェルカムクーポンです。'
  },
  {
    code: 'BUNDLE15',
    title: '2点以上まとめ買い15%OFF',
    detail: '同時購入2点以上で適用。素材を複数比較して買う導線を強化します。'
  },
  {
    code: 'NIGHT5',
    title: '夜間限定5%OFF',
    detail: '20:00〜24:00限定で適用。仕事終わりのクリエイター需要を想定。'
  }
] as const;

const dealProducts = [...products].sort((a, b) => a.priceJpy - b.priceJpy).slice(0, 3);

export default function DealsPage() {
  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: 'セール・クーポン', path: '/deals' }
        ]}
      />

      <h1>セール・クーポン特集</h1>
      <p className="section-description">
        Amazon・楽天・ユニクロのECで定番の「割引理由が明確な販促導線」を取り入れ、期間限定の値引き情報とクーポンを1ページに集約しました。
      </p>

      <section className="hub-grid" aria-label="クーポン一覧">
        {couponCampaigns.map((campaign) => (
          <article key={campaign.code} className="hub-card deal-card">
            <p className="deal-code">クーポンコード: {campaign.code}</p>
            <h2>{campaign.title}</h2>
            <p>{campaign.detail}</p>
          </article>
        ))}
      </section>

      <section aria-label="セール対象商品" className="home-featured-section">
        <h2>いま買いやすい対象商品</h2>
        <p className="section-description">
          単価が比較的低く、初回購入で選ばれやすい商品を優先表示しています。商品詳細で利用条件を確認できます。
        </p>
        <div className="products-grid">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <p>
        さらに条件で絞り込む場合は <Link href="/search?sort=price_asc">価格の安い順検索</Link> も活用できます。
      </p>
    </main>
  );
}
