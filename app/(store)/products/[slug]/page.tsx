import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryLabel, getProductBySlug, products } from '@/data/products';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { buildProductJsonLd } from '@/lib/seo/jsonld';
import { buildProductMetadata } from '@/lib/seo/metadata';

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
    return {
      title: '商品が見つかりません',
      description: '指定されたデジタル商品は存在しません。'
    };
  }

  const ogImageUrl = `/og/product?slug=${encodeURIComponent(product.slug)}`;

  return buildProductMetadata(product, ogImageUrl);
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
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link> / <Link href="/products">商品一覧</Link> / <span>{product.name}</span>
      </nav>
      <article className="card detail" itemScope itemType="https://schema.org/Product">
        <p className="category">{getCategoryLabel(product.category)}</p>
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

        <div className="cta-row">
          <AddToCartButton productSlug={product.slug} />
          <Link href="/cart">カートを見る</Link>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
