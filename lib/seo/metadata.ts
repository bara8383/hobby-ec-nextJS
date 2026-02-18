import type { Metadata } from 'next';
import { getCategoryLabel, type DigitalCategory, type Product } from '@/data/products';

export const SITE_ORIGIN = 'https://example.com';
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
  });
}

export function buildSearchMetadata(canonicalPath: string): Metadata {
  return buildMetadataTemplate({
    title: '検索結果',
    description: 'サイト内検索結果ページです。',
    canonicalPath,
  });
}

export function buildLegalMetadata(): Metadata {
  return buildMetadataTemplate({
    title: '特定商取引法に基づく表記',
    description: 'Digital Creator Market の特定商取引法に基づく表記です。',
    canonicalPath: '/legal/tokushoho'
  });
}

export function buildLegalPageMetadata(input: {
  title: string;
  description: string;
  canonicalPath: string;
}): Metadata {
  return buildMetadataTemplate(input);
}

export function buildCategoryHubMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'カテゴリ一覧',
    description: '壁紙・写真・イラスト・音源など用途別カテゴリから商品を探せる一覧ページです。',
    canonicalPath: '/categories'
  });
}

export function buildTagHubMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'タグ一覧',
    description: '人気タグからデジタル商品を横断的に探せるハブページです。',
    canonicalPath: '/tags'
  });
}

export function buildFaqMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'よくある質問（FAQ）',
    description: '購入前後のよくある質問と回答をまとめたサポートページです。',
    canonicalPath: '/faq'
  });
}

export function buildHelpMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'ヘルプセンター',
    description: '注文・配送・支払い・返品・アカウントに関するサポート導線を集約しています。',
    canonicalPath: '/help'
  });
}

export function buildContactMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'お問い合わせ',
    description: '注文・商品・アカウントに関するお問い合わせを受け付けています。',
    canonicalPath: '/contact'
  });
}

export function buildMissingProductMetadata(): Metadata {
  return buildMetadataTemplate({
    title: '商品が見つかりません',
    description: '指定されたデジタル商品は存在しません。',
    canonicalPath: '/products'
  });
}
