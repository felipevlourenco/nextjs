import Chat from '@/app/components/Chat';
import { getChat } from '@/db';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';

// export const dynamic = 'force-dynamic';

const ChatDetail = async ({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) => {
  const { chatId } = await params;
  const chat = await getChat(+chatId);

  if (!chat) {
    return notFound();
  }

  const session = await getServerSession();

  if (!session || session.user?.email !== chat.user_email) {
    return redirect('/');
  }

  return (
    <main className="pt-5">
      <Chat id={+chatId} messages={chat?.messages} />
    </main>
  );
};

export default ChatDetail;
