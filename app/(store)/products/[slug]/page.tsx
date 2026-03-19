import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryLabel, getProductBySlug, products, type Product } from '@/data/products';
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

type ProductGuideSection = {
  title: string;
  items: string[];
};

function buildAudienceText(product: Product) {
  switch (product.category) {
    case 'wallpaper':
      return 'PCやタブレットの画面を高解像度で整えたい方に向いています。';
    case 'photo':
      return 'Web制作・広告・資料で自然風景写真を使いたい方に向いています。';
    case 'illustration':
      return 'LPやサービスサイトで使いやすいイラストをまとめて導入したい方に向いています。';
    case 'music':
      return '動画制作や配信で使えるBGMをまとめて用意したい方に向いています。';
    default:
      return '用途が明確なデジタル素材を探している方に向いています。';
  }
}

function buildUseCaseText(product: Product) {
  return `主な利用シーン: ${product.tags.join(' / ')}。`;
}

function buildProductGuideSections(product: Product): ProductGuideSection[] {
  return [
    {
      title: 'この商品は何か',
      items: [product.description, `${getCategoryLabel(product.category)}カテゴリの商品です。`]
    },
    {
      title: '誰向けか',
      items: [buildAudienceText(product)]
    },
    {
      title: '利用シーン',
      items: [buildUseCaseText(product)]
    },
    {
      title: '形式',
      items: [
        `ファイル形式は ${product.fileFormat} です。`,
        `ダウンロード容量は ${product.downloadSizeMB.toLocaleString('ja-JP')}MB です。`
      ]
    },
    {
      title: 'ライセンス',
      items: [`適用ライセンスは ${product.license} です。`]
    },
    {
      title: '入手方法',
      items: ['決済完了後に、有効期限付きのダウンロードURLを発行します。']
    },
    {
      title: '注意事項',
      items: ['購入前にファイル形式、容量、ライセンス条件をご確認ください。']
    }
  ];
}

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
  const productGuideSections = buildProductGuideSections(product);
  const chatHref = isGuest(user)
    ? `/login?next=${encodeURIComponent(`/products/${product.slug}`)}`
    : `/chat?new=1&productId=${encodeURIComponent(product.id)}`;

  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: '商品一覧', path: '/products' },
          {
            name: getCategoryLabel(product.category),
            path: `/categories/${product.category}`
          },
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
        </Card>

        <section aria-label="商品要約">
          {productGuideSections.map((section) => (
            <Card key={section.title}>
              <h2>{section.title}</h2>
              <ul className="specs" aria-label={section.title}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </section>
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
