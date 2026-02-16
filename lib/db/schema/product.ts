export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceJpy: number;
  category: string;
  categoryId?: string;
  tags: string[];
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CategoryRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
};

export type TagRecord = {
  id: string;
  slug: string;
  name: string;
};

export type ProductTagRecord = {
  productId: string;
  tagId: string;
};

export type ProductMediaRecord = {
  id: string;
  productId: string;
  mediaType: 'image' | 'audio' | 'video';
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type ProductSpecRecord = {
  id: string;
  productId: string;
  fileFormat: string;
  durationSec?: number;
  bpm?: number;
  sampleRateHz?: number;
  resolution?: string;
};
