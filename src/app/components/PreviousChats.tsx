import { Separator } from '@/components/ui/separator';
import { getChatsWithMessages } from '@/db';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Transcript from './Transcript';

export default async function PreviousChats() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const session = await getServerSession();

  if (!session?.user?.email) {
    return notFound();
  }

  const chats = await getChatsWithMessages(session?.user?.email);

  return (
    <div>
      {chats.length > 0 ? (
        <>
          <div className="text-2xl font-bold">Previous chat sessions</div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {chats.map((chat) => (
              <div key={chat.id} className="m1 border-2 rounded-xl">
                <Link
                  href={`/chats/${chat.id}`}
                  className="text-lg line-clamp-1 px-5 py-2 text-white bg-blue-800 rounded-t-lg"
                >
                  {chat.name}
                </Link>
                <div className="p-3">
                  <Transcript messages={chat.messages.slice(0, 2)} />
                </div>
              </div>
            ))}
          </div>
          <Separator className="mt-5" />
        </>
      ) : (
        <div className="flex justify-center">
          <div className="text-gray-500 italic text-2xl">
            No previous chats.
          </div>
        </div>
      )}
    </div>
  );
}
