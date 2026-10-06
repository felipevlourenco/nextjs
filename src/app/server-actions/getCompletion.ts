'use server';

import OpenAi from 'openai';

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type MergeHistory = Message[];

export async function getCompletion(mergeHistory: MergeHistory) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: mergeHistory,
  });

  const messages = [
    ...mergeHistory,
    response.choices[0].message as unknown as Message,
  ];

  return { messages };
}
