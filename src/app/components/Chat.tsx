'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { getCompletion, type Message } from '../server-actions/getCompletion';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const onSendHandler = async () => {
    const completions = await getCompletion([
      ...messages,
      {
        role: 'user',
        content: message,
      },
    ]);

    setMessage('');
    setMessages(completions.messages);
  };

  return (
    <div className="flex flex-col dark:bg-black">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-5 flex flex-col
                 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
        >
          <div
            className={`p-2 rounded-md ${msg.role === 'user' ? 'bg-blue-800' : 'bg-gray-800'}`}
          >
            <span className="pr-5 pl-5">{msg.content}</span>
          </div>
        </div>
      ))}
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
