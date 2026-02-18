import { NextResponse } from 'next/server';
import { UnauthorizedError, requireUserId } from '@/lib/chat/auth';
import {
  ensureSupportConversationForUser,
  getConversation,
  isParticipant,
  listConversationMessages
} from '@/lib/chat/repository';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const userId = await requireUserId(request);
    const { searchParams } = new URL(request.url);

    const conversationId = searchParams.get('conversationId')?.trim() ?? '';
    const cursor = searchParams.get('cursor');
    const limitRaw = Number(searchParams.get('limit') ?? '20');
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 20;

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    const conversation =
      (await getConversation(conversationId)) ?? (await ensureSupportConversationForUser(userId, conversationId));

    if (!isParticipant(conversation, userId)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const result = await listConversationMessages({
      conversationId,
      cursor,
      limit
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    throw error;
  }
}
