export type Product = {
  id: string;
  name: string;
  description: string;
  priceJpy: number;
  sku: string;
};

export const products: Product[] = [
  {
    id: 'eco-bottle',
    name: 'Eco Bottle 750ml',
    description: '真空断熱で保温保冷が続く、軽量ステンレスボトル。',
    priceJpy: 2980,
    sku: 'BOT-750'
  },
  {
    id: 'linen-tote',
    name: 'Linen Tote Bag',
    description: 'A4対応。日常使いしやすい耐久リネントート。',
    priceJpy: 3480,
    sku: 'BAG-LIN'
  },
  {
    id: 'coffee-kit',
    name: 'Starter Coffee Kit',
    description: 'ミル・ドリッパー・フィルターの3点セット。',
    priceJpy: 5980,
    sku: 'COF-ST1'
  }
];
