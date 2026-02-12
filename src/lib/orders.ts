import type { Order } from "@/types";

const orderStore = new Map<string, Order>();

export async function saveOrder(order: Order) {
  orderStore.set(order.id, order);
}

export async function getOrderById(orderId: string) {
  return orderStore.get(orderId) ?? null;
}
