import { Separator } from '@/components/ui/separator';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
import Chat from './components/Chat';
import PreviousChats from './components/PreviousChats';

export default async function Home() {
  const session = await getServerSession();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
        Home Page
      </h1>
      <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
        This is the home page of the application.
      </p>
      {session?.user?.email ? (
        <>
          <Suspense fallback={<div>Loading previous chats...</div>}>
            <PreviousChats />
          </Suspense>
          <h4 className="mt-5 text-2xl font-bold">New Chat Session</h4>
          <Separator className="my-5" />
          <Chat />
        </>
      ) : (
        <strong>You need to login!</strong>
      )}
    </div>
  );
}
