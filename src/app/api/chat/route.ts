import { getChat, updateChat } from "@/db";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { chatId, message }: { chatId: number; message: UIMessage } =
    await req.json();

  const session = await getServerSession();
  const chat = await getChat(chatId);

  if (!chat || chat.user_email !== session?.user?.email) {
    return new Response("Not found", { status: 404 });
  }

  const messages = [...chat.messages, message];

  const result = streamText({
    model: openai("gpt-3.5-turbo"),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      onEnd: ({ messages }) => updateChat({ chatId, messages }),
    }),
  });
}
