'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Message } from '@/types';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { getCompletion } from '../server-actions/getCompletion';
import Transcript from './Transcript';

const Chat = ({
  id,
  messages: initialMessages = [],
}: {
  id?: number | null;
  messages?: Message[];
}) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const chatIdRef = useRef<number | null>(id);

  const onSendHandler = async () => {
    const completions = await getCompletion({
      id: chatIdRef.current,
      mergeHistory: [
        ...messages,
        {
          role: 'user',
          content: message,
        },
      ],
    });

    if (!chatIdRef.current) {
      router.push(`/chats/${completions.chatId}`);
      router.refresh();
    }

    chatIdRef.current = completions.chatId;
    setMessage('');
    setMessages(completions.messages);
  };

  return (
    <div className="flex flex-col dark:bg-black">
      <Transcript messages={messages} truncate={false} />
      <div className="flex border-t-2 mt-5 pt-5">
        <Input
          className="grow text-xl"
          placeholder="Question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              onSendHandler();
            }
          }}
        />
        <Button onClick={onSendHandler} className="ml-3 text-xl">
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
