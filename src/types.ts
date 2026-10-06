import type { UIMessage } from "ai";

export interface Chat {
  id: number;
  name: string;
  user_email: string;
  timestamp: Date;
}

export interface ChatWithMessages extends Chat {
  messages: UIMessage[];
}
