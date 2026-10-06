import { Separator } from '@/components/ui/separator';
import { getServerSession } from 'next-auth';
import Chat from './components/Chat';

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
          <Separator className="my-5" />
          <Chat />
        </>
      ) : (
        <strong>You need to login!</strong>
      )}
    </div>
  );
}
