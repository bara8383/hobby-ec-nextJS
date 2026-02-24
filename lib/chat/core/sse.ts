import { randomUUID } from 'crypto';
import type { ChatEvent } from '@/lib/chat/core/types';

type Subscriber = { id: string; send: (event: ChatEvent) => void };
const subscribersByUser = new Map<string, Map<string, Subscriber>>();
const MAX_CONNECTIONS_PER_USER = 2;

export function subscribe(userId: string, send: (event: ChatEvent) => void) {
  const current = subscribersByUser.get(userId) ?? new Map<string, Subscriber>();
  if (current.size >= MAX_CONNECTIONS_PER_USER) {
    const firstKey = current.keys().next().value;
    if (firstKey) current.delete(firstKey);
  }

  const sub = { id: randomUUID(), send };
  current.set(sub.id, sub);
  subscribersByUser.set(userId, current);

  return () => {
    const active = subscribersByUser.get(userId);
    if (!active) return;
    active.delete(sub.id);
    if (active.size === 0) subscribersByUser.delete(userId);
  };
}

export function publish(userId: string, event: ChatEvent) {
  const current = subscribersByUser.get(userId);
  if (!current) return;
  for (const sub of current.values()) sub.send(event);
}

// NOTE: This process-local broker cannot fan-out across multiple instances.
// For production horizontal scaling, migrate to Redis Pub/Sub, SNS/SQS, or managed event buses.
