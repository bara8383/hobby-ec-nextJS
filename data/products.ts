export const PRODUCT_CATEGORIES = ['wallpaper', 'illustration', 'photo', 'music'] as const;

export type DigitalCategory = (typeof PRODUCT_CATEGORIES)[number];

export type ProductSpec = {
  key: 'resolution' | 'bpm' | 'duration_sec' | 'sample_rate' | 'file_count';
  label: string;
  value: string;
};

export type ProductMedia = {
  type: 'image' | 'audio';
  url: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceJpy: number;
  sku: string;
  category: DigitalCategory;
  fileFormat: string;
  downloadSizeMB: number;
  license: string;
  tags: string[];
  specs: ProductSpec[];
  media: ProductMedia[];
  publishedAt: string;
};

export const products: Product[] = [
  {
    id: 'prod-001',
    slug: 'tokyo-night-wallpaper-pack',
    name: 'Tokyo Night Wallpaper Pack',
    description: '4K/5K対応の夜景壁紙セット（全20枚）。PC・タブレット用。',
    priceJpy: 2400,
    sku: 'WAL-TYO-001',
    category: 'wallpaper',
    fileFormat: 'JPG/PNG',
    downloadSizeMB: 620,
    license: '個人利用ライセンス',
    tags: ['4k', '都市夜景', 'デスクトップ'],
    specs: [
      { key: 'resolution', label: '解像度', value: '3840x2160 / 5120x2880' },
      { key: 'file_count', label: '収録枚数', value: '20' }
    ],
    media: [{ type: 'image', url: '/samples/tokyo-night.jpg', alt: '東京夜景の壁紙サンプル' }],
    publishedAt: '2026-01-20T09:00:00+09:00'
  },
  {
    id: 'prod-002',
    slug: 'nature-photo-bundle',
    name: 'Nature Photo Bundle',
    description: '商用利用可能な自然風景写真素材（RAW + JPEG、全80点）。',
    priceJpy: 7800,
    sku: 'PHT-NAT-080',
    category: 'photo',
    fileFormat: 'RAW/JPEG',
    downloadSizeMB: 1840,
    license: '商用利用ライセンス',
    tags: ['自然', '風景', '商用可'],
    specs: [
      { key: 'resolution', label: '最大解像度', value: '7952x5304' },
      { key: 'file_count', label: '収録点数', value: '80' }
    ],
    media: [{ type: 'image', url: '/samples/nature-photo.jpg', alt: '自然風景写真のサンプル' }],
    publishedAt: '2026-01-18T09:00:00+09:00'
  },
  {
    id: 'prod-003',
    slug: 'flat-illustration-kit',
    name: 'Flat Illustration Kit',
    description: 'Web/LP向けのフラットイラスト素材（人物・アイコン合計120点）。',
    priceJpy: 4200,
    sku: 'ILL-FLT-120',
    category: 'illustration',
    fileFormat: 'SVG/PNG',
    downloadSizeMB: 240,
    license: '商用利用ライセンス',
    tags: ['フラット', 'web制作', 'lp'],
    specs: [
      { key: 'file_count', label: '素材点数', value: '120' },
      { key: 'resolution', label: 'PNG最大解像度', value: '4096x4096' }
    ],
    media: [{ type: 'image', url: '/samples/flat-illustration.jpg', alt: 'フラットイラストのサンプル' }],
    publishedAt: '2026-01-15T09:00:00+09:00'
  },
  {
    id: 'prod-004',
    slug: 'lofi-music-starter-pack',
    name: 'Lo-fi Music Starter Pack',
    description: '動画制作向けBGM10曲（ループ編集済み、YouTube利用可）。',
    priceJpy: 5600,
    sku: 'MUS-LOF-010',
    category: 'music',
    fileFormat: 'WAV/MP3',
    downloadSizeMB: 890,
    license: '商用利用ライセンス',
    tags: ['lofi', 'youtube', 'bgm'],
    specs: [
      { key: 'bpm', label: 'BPM', value: '78-92' },
      { key: 'duration_sec', label: '収録尺', value: '90-180秒' },
      { key: 'sample_rate', label: 'サンプリング周波数', value: '48kHz / 24bit' }
    ],
    media: [{ type: 'audio', url: '/samples/lofi-preview.mp3', alt: 'Lo-fi BGM試聴サンプル' }],
    publishedAt: '2026-01-10T09:00:00+09:00'
  }
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: DigitalCategory) {
  return products.filter((product) => product.category === category);
}

export function getProductsByTag(tag: string) {
  return products.filter((product) => product.tags.includes(tag));
}

export function getCategoryLabel(category: DigitalCategory) {
  switch (category) {
    case 'wallpaper':
      return '壁紙';
    case 'photo':
      return '写真素材';
    case 'illustration':
      return 'イラスト素材';
    case 'music':
      return 'デジタル音源';
    default:
      return 'デジタル商品';
  }
}

export function isDigitalCategory(value: string): value is DigitalCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

export const allTags = Array.from(new Set(products.flatMap((product) => product.tags))).sort();
