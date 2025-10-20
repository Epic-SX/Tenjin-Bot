export type Author = 'ai' | 'user';

export interface SubMessageReply {
  id: string;
  author: Author;
  text: string;
  createdAt: string;
}

export interface Message {
  id: string;
  author: Author;
  text: string;
  pinned?: boolean;
  expanded?: boolean;
  createdAt: string;
  subMessages?: string[];
  subMessageReplies?: { [key: number]: SubMessageReply[] };
  conversationId?: string; // Track which conversation this message belongs to
  hasError?: boolean; // Track if this message encountered an error
  originalQuestion?: string; // Store the original question text for retry
}

export interface QuestionItem {
  id: string;
  title: string;
  checked?: boolean;
  folder?: string;
  messageId?: string; // link into the chat by message id
}
