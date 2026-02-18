import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryLabel, getProductBySlug, products } from '@/data/products';
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
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = buildProductJsonLd(product);

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
          <p className="price">¥{product.priceJpy.toLocaleString('ja-JP')}</p>

          <div className="cta-row" aria-label="購入アクション">
            <AddToCartButton productSlug={product.slug} />
            <ButtonLink href="/cart" variant="secondary">
              カートを見る
            </ButtonLink>
          </div>
        </Card>
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
