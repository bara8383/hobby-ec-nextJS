import { randomUUID } from 'crypto';
import type { ChatEvent } from '@/lib/chat/realtime-types';

type Subscriber = {
  id: string;
  send: (event: ChatEvent) => void;
};

// In-memory broker keeps implementation minimal for learning purposes.
// For multi-instance scaling, replace with Redis Pub/Sub or managed event bus.
const userSubscribers = new Map<string, Map<string, Subscriber>>();

export function subscribeUserEvents(userId: string, send: (event: ChatEvent) => void) {
  const subscriber: Subscriber = { id: randomUUID(), send };
  const current = userSubscribers.get(userId) ?? new Map<string, Subscriber>();
  current.set(subscriber.id, subscriber);
  userSubscribers.set(userId, current);

  return () => {
    const active = userSubscribers.get(userId);
    if (!active) {
      return;
    }

    active.delete(subscriber.id);
    if (active.size === 0) {
      userSubscribers.delete(userId);
    }
  };
}

export function publishUserEvent(userId: string, event: ChatEvent) {
  const subscribers = userSubscribers.get(userId);
  if (!subscribers) {
    return;
  }

  for (const subscriber of subscribers.values()) {
    subscriber.send(event);
  }
}
