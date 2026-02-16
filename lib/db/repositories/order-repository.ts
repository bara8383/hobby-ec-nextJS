import { randomUUID } from 'crypto';
import { getProductBySlug } from '@/data/products';
import type { OrderItemRecord, OrderRecord } from '@/lib/db/schema/order';

const orders: OrderRecord[] = [];
const orderItems: OrderItemRecord[] = [];

type CreateOrderLineInput = {
  productSlug: string;
  quantity: number;
  unitPriceJpy: number;
};

export function createPaidOrder(userId: string, lines: CreateOrderLineInput[]) {
  const id = randomUUID();
  const totalJpy = lines.reduce((sum, line) => sum + line.unitPriceJpy * line.quantity, 0);

  const order: OrderRecord = {
    id,
    userId,
    status: 'paid',
    subtotalJpy: totalJpy,
    taxJpy: 0,
    totalJpy,
    orderedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.push(order);

  lines.forEach((line) => {
    const product = getProductBySlug(line.productSlug);

    orderItems.push({
      id: randomUUID(),
      orderId: id,
      productId: product?.id,
      productSlug: line.productSlug,
      productSlugSnapshot: line.productSlug,
      productNameSnapshot: product?.name ?? line.productSlug,
      quantity: line.quantity,
      unitPriceJpy: line.unitPriceJpy
    });
  });

  return { order, items: orderItems.filter((item) => item.orderId === id) };
}

export function listOrders() {
  return [...orders];
}

export function listOrderItemsByOrderId(orderId: string) {
  return orderItems.filter((item) => item.orderId === orderId);
}

export function listPurchasedItemsByUser(userId: string) {
  const userOrders = orders.filter((order) => order.userId === userId).map((order) => order.id);
  return orderItems.filter((item) => userOrders.includes(item.orderId));
}

export function getOrderItemForUser(orderItemId: string, userId: string) {
  const item = orderItems.find((entry) => entry.id === orderItemId);
  if (!item) {
    return undefined;
  }

  const order = orders.find((entry) => entry.id === item.orderId && entry.userId === userId);
  if (!order) {
    return undefined;
  }

  return item;
}
