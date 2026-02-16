export type OrderItemRecord = {
  id: string;
  orderId: string;
  productSlug: string;
  productSlugSnapshot?: string;
  productNameSnapshot?: string;
  productId?: string;
  quantity: number;
  unitPriceJpy: number;
};

export type OrderRecord = {
  id: string;
  userId: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  subtotalJpy?: number;
  taxJpy?: number;
  totalJpy: number;
  paymentProvider?: string;
  paymentIntentId?: string;
  orderedAt?: string;
  createdAt: string;
  updatedAt?: string;
};

export type DownloadGrantRecord = {
  id: string;
  orderItemId: string;
  userId: string;
  downloadTokenHash: string;
  expiresAt: string;
  maxDownloadCount: number;
  downloadedCount: number;
  lastDownloadedAt?: string;
};
