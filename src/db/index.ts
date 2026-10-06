import { textOf } from "@/lib/utils";
import { Chat, ChatWithMessages } from "@/types";
import type { UIMessage } from "ai";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

// The messages table stores plain text; the AI SDK UI uses `parts`.
type MessageRow = { id: number; role: string; content: string };

const toUIMessage = (row: MessageRow) =>
  ({
    id: String(row.id),
    role: row.role,
    parts: [{ type: "text", text: row.content }],
  }) as UIMessage;

export async function createChat({
  userEmail,
  name,
  messages,
}: {
  userEmail: string;
  name: string;
  messages: UIMessage[];
}) {
  const [{ id: chatId }] =
    await sql`INSERT INTO chats (user_email, name) VALUES (${userEmail}, ${name}) RETURNING id`;

  for (const msg of messages) {
    await sql`INSERT INTO messages (chat_id, role, content) VALUES (${chatId}, ${msg.role}, ${textOf(msg)})`;
  }

  return chatId;
}

export async function getChat(
  chatId: number,
): Promise<ChatWithMessages | null> {
  const chats = await sql`SELECT * FROM chats WHERE id = ${chatId}`;

  if (!chats[0]) {
    return null;
  }

  const messages = await sql<
    MessageRow[]
  >`SELECT * FROM messages WHERE chat_id = ${chatId} ORDER BY id`;

  return {
    ...chats[0],
    messages: messages.map((msg) => toUIMessage(msg)),
  } as ChatWithMessages;
}

export async function getChats(userEmail: string): Promise<Chat[]> {
  const chats = await sql<
    Chat[]
  >`SELECT * FROM chats WHERE user_email = ${userEmail}`;

  return chats;
}

export async function getChatsWithMessages(
  userEmail: string,
): Promise<ChatWithMessages[]> {
  const chats = await sql`SELECT * FROM chats WHERE user_email = ${userEmail}`;

  for (const chat of chats) {
    const messages = await sql<
      MessageRow[]
    >`SELECT * FROM messages WHERE chat_id = ${chat.id} ORDER BY id`;

    chat.messages = messages.map((msg) => toUIMessage(msg));
  }

  return chats as unknown as ChatWithMessages[];
}

export async function getMessages(chatId: number) {
  const messages = await sql`SELECT * FROM messages WHERE chat_id = ${chatId}`;

  return messages.map((msg) => ({
    ...msg,
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));
}

export async function updateChat({
  chatId,
  messages,
}: {
  chatId: number;
  messages: UIMessage[];
}) {
  await sql`DELETE FROM messages WHERE chat_id = ${chatId}`;

  for (const msg of messages) {
    await sql`INSERT INTO messages (chat_id, role, content) VALUES (${chatId}, ${msg.role}, ${textOf(msg)})`;
  }
}
