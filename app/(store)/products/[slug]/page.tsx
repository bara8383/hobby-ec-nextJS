import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { getCategoryLabel, getProductBySlug, getRelatedProducts, products } from '@/data/products';
import { getCurrentUser } from '@/lib/auth/demo-session';
import { isGuest } from '@/lib/auth/permissions';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildProductJsonLd } from '@/lib/seo/jsonld';
import { buildMissingProductMetadata, buildProductMetadata } from '@/lib/seo/metadata';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return buildMissingProductMetadata();
  }

  return buildProductMetadata(product);
}

export default async function ProductDetailPage({ params }: Props) {
  const user = await getCurrentUser();
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = buildProductJsonLd(product);
  const relatedProducts = getRelatedProducts(product, 3);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '購入後はどこからダウンロードできますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'マイページの「購入ライブラリ」から期限付きダウンロードURLを発行できます。'
        }
      },
      {
        '@type': 'Question',
        name: '商用利用は可能ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `この商品のライセンスは「${product.license}」です。詳細は利用規約ページをご確認ください。`
        }
      }
    ]
  };

  const chatHref = isGuest(user)
    ? `/login?next=${encodeURIComponent(`/products/${product.slug}`)}`
    : `/chat?new=1&productId=${encodeURIComponent(product.id)}`;

  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: '商品一覧', path: '/products' },
          { name: product.name, path: `/products/${product.slug}` }
        ]}
      />
      <Section className="detail-layout">
        <Card className="detail" itemScope itemType="https://schema.org/Product">
          <Badge variant="accent">{getCategoryLabel(product.category)}</Badge>
          <h1 itemProp="name">{product.name}</h1>
          <p itemProp="description">{product.description}</p>
          <ul className="specs" aria-label="商品仕様">
            <li>ファイル形式: {product.fileFormat}</li>
            <li>ダウンロード容量: {product.downloadSizeMB.toLocaleString('ja-JP')} MB</li>
            <li>ライセンス: {product.license}</li>
            {product.specs.map((spec) => (
              <li key={spec.key}>
                {spec.label}: {spec.value}
              </li>
            ))}
            <li>タグ: {product.tags.join(' / ')}</li>
            <li>納品方法: 決済後に有効期限付きダウンロードURLを発行</li>
          </ul>

          <section className="seller-summary" aria-label="出品者情報">
            <h2>出品者情報</h2>
            <p>
              <strong>{product.sellerName}</strong>
            </p>
            <ul>
              <li>評価: ★{product.sellerRating.toFixed(1)}</li>
              <li>販売実績: {product.sellerSalesCount.toLocaleString('ja-JP')}件</li>
              <li>平均返信時間: 約{product.sellerResponseHours}時間</li>
              <li>お気に入り登録: {product.favoriteCount.toLocaleString('ja-JP')}件</li>
            </ul>
          </section>

          <p className="price">¥{product.priceJpy.toLocaleString('ja-JP')}</p>

          <div className="cta-row" aria-label="購入アクション">
            <AddToCartButton productSlug={product.slug} />
            <ButtonLink href="/cart" variant="secondary">
              カートを見る
            </ButtonLink>
            <ButtonLink href={chatHref} variant="ghost">
              この商品について相談
            </ButtonLink>
          </div>
          <div className="detail-links" aria-label="関連ページ">
            <ButtonLink href="/faq" variant="ghost">
              購入前によくある質問
            </ButtonLink>
            <ButtonLink href="/legal/terms" variant="ghost">
              利用規約
            </ButtonLink>
          </div>
        </Card>

        <Card>
          <h2>関連商品</h2>
          <p className="muted">同カテゴリの人気商品を中心に表示しています。</p>
          <div className="related-grid">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </Card>

        <Card>
          <h2>購入前の確認事項</h2>
          <h3>ダウンロード期限</h3>
          <p>決済日から30日以内であれば、何度でも再ダウンロードが可能です。</p>
          <h3>利用範囲</h3>
          <p>
            ライセンスの詳細は
            <ButtonLink href="/legal/terms" variant="ghost" className="inline-link">
              利用規約
            </ButtonLink>
            を必ずご確認ください。
          </p>
        </Card>
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
