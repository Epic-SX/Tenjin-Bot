export type Author = 'ai' | 'user';

export interface Message {
  id: string;
  author: Author;
  text: string;
  pinned?: boolean;
  expanded?: boolean;
  createdAt: string;
}

export interface QuestionItem {
  id: string;
  title: string;
  checked?: boolean;
  folder?: string;
  messageId?: string; // link into the chat by message id
}
