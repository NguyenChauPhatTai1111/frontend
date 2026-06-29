import ChatInput from '../messenger/ChatInput';
import MessageBubble from '../messenger/MessageBubble';

const messages = [
  {
    id: 1,
    me: false,
    text: 'Xin chào!',
  },
  {
    id: 2,
    me: true,
    text: 'Hello',
  },
  {
    id: 3,
    me: false,
    text: 'Bạn khỏe không?',
  },
  {
    id: 4,
    me: true,
    text: 'Khỏe nhé 😄',
  },
];

export default function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b px-6 py-4 flex items-center">
        <img
          src="https://i.pravatar.cc/150?img=5"
          className="w-10 h-10 rounded-full"
        />

        <div className="ml-3">
          <div className="font-semibold">Nguyễn Văn A</div>

          <div className="text-green-500 text-sm">Active now</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5 space-y-2 bg-[#f5f5f5]">
        {messages.map((message) => (
          <MessageBubble key={message.id} me={message.me} text={message.text} />
        ))}
      </div>

      <ChatInput />
    </div>
  );
}
