export type DigitalCategory = 'wallpaper' | 'photo' | 'illustration' | 'music';

export type Product = {
  id: string;
  name: string;
  description: string;
  priceJpy: number;
  sku: string;
  category: DigitalCategory;
  fileFormat: string;
  downloadSizeMB: number;
  license: string;
};

export const products: Product[] = [
  {
    id: 'tokyo-night-wallpaper-pack',
    name: 'Tokyo Night Wallpaper Pack',
    description: '4K/5K対応の夜景壁紙セット（全20枚）。PC・タブレット用。',
    priceJpy: 2400,
    sku: 'WAL-TYO-001',
    category: 'wallpaper',
    fileFormat: 'JPG/PNG',
    downloadSizeMB: 620,
    license: '個人利用ライセンス'
  },
  {
    id: 'nature-photo-bundle',
    name: 'Nature Photo Bundle',
    description: '商用利用可能な自然風景写真素材（RAW + JPEG、全80点）。',
    priceJpy: 7800,
    sku: 'PHT-NAT-080',
    category: 'photo',
    fileFormat: 'RAW/JPEG',
    downloadSizeMB: 1840,
    license: '商用利用ライセンス'
  },
  {
    id: 'flat-illustration-kit',
    name: 'Flat Illustration Kit',
    description: 'Web/LP向けのフラットイラスト素材（人物・アイコン合計120点）。',
    priceJpy: 4200,
    sku: 'ILL-FLT-120',
    category: 'illustration',
    fileFormat: 'SVG/PNG',
    downloadSizeMB: 240,
    license: '商用利用ライセンス'
  },
  {
    id: 'lofi-music-starter-pack',
    name: 'Lo-fi Music Starter Pack',
    description: '動画制作向けBGM10曲（ループ編集済み、YouTube利用可）。',
    priceJpy: 5600,
    sku: 'MUS-LOF-010',
    category: 'music',
    fileFormat: 'WAV/MP3',
    downloadSizeMB: 890,
    license: '商用利用ライセンス'
  }
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
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
      return 'デジタル音楽';
    default:
      return 'デジタル商品';
  }
}
