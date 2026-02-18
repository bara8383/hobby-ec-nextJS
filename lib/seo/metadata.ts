import type { Metadata } from 'next';
import { getCategoryLabel, type DigitalCategory, type Product } from '@/data/products';

const SITE_ORIGIN = 'https://example.com';
const SITE_NAME = 'Digital Creator Market';

type MetadataTemplateInput = {
  title: string;
  description: string;
  canonicalPath: string;
  openGraphType?: 'website' | 'article';
  imagePaths?: string[];
  robots?: Metadata['robots'];
};

function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}

function buildMetadataTemplate({
  title,
  description,
  canonicalPath,
  openGraphType = 'website',
  imagePaths,
  robots
}: MetadataTemplateInput): Metadata {
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const imageUrls = imagePaths?.map((path) => toAbsoluteUrl(path));

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type: openGraphType,
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: imageUrls
    },
    twitter: {
      card: imageUrls?.length ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrls
    },
    robots
  };
}

export function buildProductMetadata(product: Product): Metadata {
  const title = `${product.name} | ${SITE_NAME}`;
  const description = `${product.description}（カテゴリ: ${getCategoryLabel(product.category)} / 形式: ${product.fileFormat} / ライセンス: ${product.license}）`;

  return buildMetadataTemplate({
    title,
    description,
    canonicalPath: `/products/${product.slug}`,
    imagePaths: [`/og/product?slug=${encodeURIComponent(product.slug)}`]
  });
}

export function buildProductListingMetadata(canonicalPath: string): Metadata {
  return buildMetadataTemplate({
    title: '商品一覧',
    description: '壁紙・イラスト・写真・デジタル音源のダウンロード商品一覧です。',
    canonicalPath
  });
}

export function buildCategoryMetadata(category: DigitalCategory): Metadata {
  const categoryLabel = getCategoryLabel(category);

  return buildMetadataTemplate({
    title: `${categoryLabel}カテゴリ`,
    description: `${categoryLabel}カテゴリのデジタル商品一覧ページです。`,
    canonicalPath: `/categories/${category}`
  });
}

export function buildTagMetadata(tag: string): Metadata {
  const canonicalPath = `/tags/${encodeURIComponent(tag)}`;

  return buildMetadataTemplate({
    title: `タグ: ${tag}`,
    description: `${tag}に関連するデジタル商品一覧です。`,
    canonicalPath,
    robots: {
      index: false,
      follow: true
    }
  });
}

export function buildSearchMetadata(canonicalPath: string): Metadata {
  return buildMetadataTemplate({
    title: '検索結果',
    description: 'サイト内検索結果ページです。',
    canonicalPath,
    robots: {
      index: false,
      follow: true
    }
  });
}

export function buildLegalMetadata(): Metadata {
  return buildMetadataTemplate({
    title: '特定商取引法に基づく表記',
    description: 'Digital Creator Market の特定商取引法に基づく表記です。',
    canonicalPath: '/legal/tokushoho'
  });
}

export function buildMissingProductMetadata(): Metadata {
  return buildMetadataTemplate({
    title: '商品が見つかりません',
    description: '指定されたデジタル商品は存在しません。',
    canonicalPath: '/products'
  });
}
