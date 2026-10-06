export interface Chat {
  id: number;
  name: string;
  user_email: string;
  timestamp: Date;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface StorageMessage extends Message {
  id: number;
  chat_id: number;
}

export interface ChatWithMessages extends Chat {
  messages: StorageMessage[];
}
