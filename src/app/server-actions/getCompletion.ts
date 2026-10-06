'use server';

import { createChat, updateChat } from '@/db';
import { Message } from '@/types';
import { getServerSession } from 'next-auth';
import OpenAi from 'openai';

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export type MergeHistory = Message[];

export async function getCompletion({
  id,
  mergeHistory,
}: {
  id?: number | null;
  mergeHistory: MergeHistory;
}) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: mergeHistory,
  });

  const messages = [
    ...mergeHistory,
    response.choices[0].message as unknown as Message,
  ];

  const session = await getServerSession();
  let chatId = id;

  if (!chatId) {
    chatId = await createChat({
      userEmail: session?.user?.email ?? '',
      name: session?.user?.name ?? '',
      messages,
    });
  } else {
    await updateChat({ chatId, messages });
  }

  return { messages, chatId };
}
