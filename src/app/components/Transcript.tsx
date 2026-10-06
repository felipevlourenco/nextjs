import { Message } from '@/types';

const truncateText = (str: string, length: number) =>
  str.length > length ? str.slice(0, length) + '...' : str;

const Transcript = ({
  messages,
  truncate = true,
}: {
  messages: Message[];
  truncate?: boolean;
}) => {
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
            <span className="pr-5 pl-5">
              {truncate ? truncateText(msg.content, 200) : msg.content}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Transcript;
