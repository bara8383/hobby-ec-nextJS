import type { Metadata } from 'next';
import { getCategoryLabel, type DigitalCategory, type Product } from '@/data/products';

export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN?.replace(/\/$/, '') ?? 'http://localhost:3000';
export const SITE_NAME = 'Digital Creator Market';
export const DEFAULT_OG_IMAGE_PATH = '/og/default';

const isProduction = process.env.NODE_ENV === 'production';

type MetadataTemplateInput = {
  title: string;
  description: string;
  canonicalPath: string;
  openGraphType?: 'website' | 'article';
  imagePaths?: string[];
  robots?: Metadata['robots'];
  keywords?: string[];
};

export function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}

export function buildIndexableRobots(): Metadata['robots'] {
  return {
    index: isProduction,
    follow: isProduction,
    googleBot: {
      index: isProduction,
      follow: isProduction
    }
  };
}

export function buildNoIndexRobots(follow = true): Metadata['robots'] {
  return {
    index: false,
    follow,
    googleBot: {
      index: false,
      follow
    }
  };
}

function buildMetadataTemplate({
  title,
  description,
  canonicalPath,
  openGraphType = 'website',
  imagePaths = [DEFAULT_OG_IMAGE_PATH],
  robots = buildIndexableRobots(),
  keywords
}: MetadataTemplateInput): Metadata {
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const imageUrls = imagePaths.map((path) => toAbsoluteUrl(path));

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type: openGraphType,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'ja_JP',
      title,
      description,
      images: imageUrls
    },
    twitter: {
      card: imageUrls.length ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrls
    },
    robots
  };
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`
    },
    description:
      '壁紙・写真・イラスト・デジタル音源を用途・ライセンス・形式から比較し、すぐに購入できるデジタル商品ECサイトです。',
    keywords: ['デジタル商品', '壁紙', '写真素材', 'イラスト素材', 'BGM', 'ECサイト'],
    alternates: {
      canonical: '/'
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'ja_JP',
      url: SITE_ORIGIN,
      title: SITE_NAME,
      description:
        '壁紙・写真・イラスト・デジタル音源を用途別に比較し、ライセンス条件を確認して購入できるデジタル商品ECサイトです。',
      images: [toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH)]
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description:
        '壁紙・写真・イラスト・デジタル音源を用途別に比較し、ライセンス条件を確認して購入できるデジタル商品ECサイトです。',
      images: [toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH)]
    },
    robots: buildIndexableRobots()
  };
}

export function buildProductMetadata(product: Product): Metadata {
  const categoryLabel = getCategoryLabel(product.category);
  const description = `${product.description} 形式: ${product.fileFormat}。ライセンス: ${product.license}。ダウンロード容量: ${product.downloadSizeMB.toLocaleString('ja-JP')}MB。`;

  return buildMetadataTemplate({
    title: product.name,
    description,
    canonicalPath: `/products/${product.slug}`,
    openGraphType: 'article',
    imagePaths: [`/og/product?slug=${encodeURIComponent(product.slug)}`],
    keywords: [categoryLabel, product.fileFormat, product.license, ...product.tags]
  });
}

export function buildProductListingMetadata(input: {
  canonicalPath: string;
  isIndexable?: boolean;
  title?: string;
  description?: string;
}): Metadata {
  const { canonicalPath, isIndexable = canonicalPath === '/products', title, description } = input;

  return buildMetadataTemplate({
    title: title ?? '商品一覧',
    description:
      description ?? '壁紙・イラスト・写真・デジタル音源のダウンロード商品を、用途・価格・タグから比較できる一覧ページです。',
    canonicalPath,
    robots: isIndexable ? buildIndexableRobots() : buildNoIndexRobots()
  });
}

export function buildCategoryMetadata(category: DigitalCategory): Metadata {
  const categoryLabel = getCategoryLabel(category);

  return buildMetadataTemplate({
    title: `${categoryLabel}一覧`,
    description: `${categoryLabel}カテゴリの商品を用途・形式・ライセンスで比較できる一覧ページです。`,
    canonicalPath: `/categories/${category}`,
    keywords: [categoryLabel, 'カテゴリ', 'デジタル商品']
  });
}

export function buildTagMetadata(tag: string): Metadata {
  return buildMetadataTemplate({
    title: `${tag}タグの商品一覧`,
    description: `${tag}に関連するデジタル商品をまとめて比較できるタグページです。`,
    canonicalPath: `/tags/${encodeURIComponent(tag)}`,
    keywords: [tag, 'タグ', 'デジタル商品']
  });
}

export function buildSearchMetadata(): Metadata {
  return buildMetadataTemplate({
    title: '検索結果',
    description: 'サイト内検索結果ページです。',
    canonicalPath: '/search',
    robots: buildNoIndexRobots()
  });
}

export function buildLegalPageMetadata(input: {
  title: string;
  description: string;
  canonicalPath: string;
}): Metadata {
  return buildMetadataTemplate({
    ...input,
    keywords: ['法律', '規約', 'サポート']
  });
}

export function buildCategoryHubMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'カテゴリ一覧',
    description: '壁紙・写真・イラスト・デジタル音源のカテゴリ別に商品を探せる一覧ページです。',
    canonicalPath: '/categories'
  });
}

export function buildDealsMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'セール・クーポン特集',
    description: '価格訴求の高い商品やクーポン関連導線をまとめた特集ページです。',
    canonicalPath: '/deals'
  });
}

export function buildRankingMetadata(): Metadata {
  return buildMetadataTemplate({
    title: '人気ランキング',
    description: '売れ筋や注目度の高いデジタル商品のランキングページです。',
    canonicalPath: '/ranking'
  });
}

export function buildTagHubMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'タグ一覧',
    description: '利用シーンやテイスト別のタグから関連商品を探せる一覧ページです。',
    canonicalPath: '/tags'
  });
}

export function buildFaqMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'よくある質問',
    description: '購入前後によくある質問を、支払い・ライセンス・ダウンロード単位で整理したFAQページです。',
    canonicalPath: '/faq'
  });
}

export function buildHelpMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'ヘルプセンター',
    description: '購入方法、ライセンス、ダウンロード、問い合わせ導線を短く整理したヘルプページです。',
    canonicalPath: '/help'
  });
}

export function buildContactMetadata(): Metadata {
  return buildMetadataTemplate({
    title: 'お問い合わせ',
    description: '注文、商品仕様、ライセンス、アカウントに関する問い合わせ窓口ページです。',
    canonicalPath: '/contact',
    robots: buildNoIndexRobots()
  });
}

export function buildMissingProductMetadata(): Metadata {
  return buildMetadataTemplate({
    title: '商品が見つかりません',
    description: '指定されたデジタル商品は見つかりませんでした。商品一覧から再度お探しください。',
    canonicalPath: '/products',
    robots: buildNoIndexRobots()
  });
}
