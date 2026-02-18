import { createHash } from 'crypto';
import type { ChatEvent } from '@/lib/chat/types';

const queuePrefix = process.env.CHAT_USER_QUEUE_PREFIX ?? 'chat-user';
const memoryQueueMap = new Map<string, string>();
const memoryQueueMessages = new Map<string, ChatEvent[]>();

function toQueueName(userId: string) {
  const digest = createHash('sha256').update(userId).digest('hex').slice(0, 24);
  return `${queuePrefix}-${digest}`;
}

export async function resolveUserQueueUrl(userId: string) {
  const existing = memoryQueueMap.get(userId);
  if (existing) return existing;

  const memoryUrl = `memory://${toQueueName(userId)}`;
  memoryQueueMap.set(userId, memoryUrl);
  return memoryUrl;
}

export async function enqueueUserEvent(userId: string, event: ChatEvent) {
  const queueUrl = await resolveUserQueueUrl(userId);
  const target = memoryQueueMessages.get(queueUrl) ?? [];
  target.push(event);
  memoryQueueMessages.set(queueUrl, target);
}

export async function receiveUserEvent(userId: string) {
  const queueUrl = await resolveUserQueueUrl(userId);
  const target = memoryQueueMessages.get(queueUrl) ?? [];
  const event = target.shift() ?? null;
  memoryQueueMessages.set(queueUrl, target);

  if (!event) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return null;
  }

  return {
    event,
    receiptHandle: event.messageId,
    queueUrl
  };
}

export async function ackUserEvent(queueUrl: string, receiptHandle: string) {
  void queueUrl;
  void receiptHandle;
  return;
}
