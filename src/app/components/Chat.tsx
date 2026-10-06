'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useRef, useState } from 'react';
import { newChat } from '../server-actions/newChat';
import Transcript from './Transcript';

// Send only the newest message (+ chatId from sendMessage); the server loads the history.
const transport = new DefaultChatTransport({
  api: '/api/chat',
  prepareSendMessagesRequest: ({ messages, body }) => ({
    body: { ...body, message: messages[messages.length - 1] },
  }),
});

const Chat = ({
  id,
  messages: initialMessages = [],
}: {
  id?: number | null;
  messages?: UIMessage[];
}) => {
  const chatIdRef = useRef(id);
  const [message, setMessage] = useState('');

  const { messages, sendMessage, status } = useChat({
    id: id ? String(id) : undefined,
    messages: initialMessages,
    transport,
  });

  const onSendHandler = async () => {
    const text = message.trim();

    if (!text || status !== 'ready') return;

    setMessage('');

    if (!chatIdRef.current) {
      chatIdRef.current = await newChat(text);
      // // Update the URL without remounting, so the stream keeps going.
      window.history.replaceState(null, '', `/chats/${chatIdRef.current}`);
    }

    sendMessage({ text }, { body: { chatId: chatIdRef.current } });
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
        <Button
          onClick={onSendHandler}
          disabled={status !== 'ready'}
          className="ml-3 text-xl"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
