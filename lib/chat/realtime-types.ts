export type Conversation = {
  id: string;
  userAId: string;
  userBId: string;
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export type ConversationRead = {
  conversationId: string;
  userId: string;
  lastReadMessageId: string;
  updatedAt: string;
};

export type ChatEvent =
  | {
      type: 'message.created';
      conversationId: string;
      message: Pick<Message, 'id' | 'senderId' | 'text' | 'createdAt'>;
    }
  | {
      type: 'conversation.read_updated';
      conversationId: string;
      userId: string;
      lastReadMessageId: string;
      updatedAt: string;
    };
