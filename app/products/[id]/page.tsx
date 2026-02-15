import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryLabel, getProductById, products } from '@/data/products';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: '商品が見つかりません',
      description: '指定されたデジタル商品は存在しません。'
    };
  }

  return {
    title: product.name,
    description: `${product.description}（形式: ${product.fileFormat} / ライセンス: ${product.license}）`,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      url: `/products/${product.id}`
    },
    alternates: {
      canonical: `/products/${product.id}`
    }
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    category: getCategoryLabel(product.category),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'JPY',
      price: product.priceJpy,
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <main>
      <p>
        <Link href="/">← 一覧へ戻る</Link>
      </p>
      <article className="card detail" itemScope itemType="https://schema.org/Product">
        <p className="category">{getCategoryLabel(product.category)}</p>
        <h1 itemProp="name">{product.name}</h1>
        <p itemProp="description">{product.description}</p>
        <ul className="specs" aria-label="商品仕様">
          <li>ファイル形式: {product.fileFormat}</li>
          <li>ダウンロード容量: {product.downloadSizeMB.toLocaleString('ja-JP')} MB</li>
          <li>ライセンス: {product.license}</li>
          <li>納品方法: 決済後すぐにダウンロードリンクを発行</li>
        </ul>
        <p className="price">¥{product.priceJpy.toLocaleString('ja-JP')}</p>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
