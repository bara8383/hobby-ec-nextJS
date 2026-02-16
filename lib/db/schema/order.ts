export type OrderItemRecord = {
  id: string;
  orderId: string;
  productSlug: string;
  quantity: number;
  unitPriceJpy: number;
};

export type OrderRecord = {
  id: string;
  userId: string;
  status: 'paid' | 'pending';
  totalJpy: number;
  createdAt: string;
};
