'use client';

export default function ChatBox() {
  return (
    <div className="h-full w-full bg-white p-4">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="h-[calc(100%-2rem)] bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500">Chat placeholder. Messages will appear here...</p>
      </div>
    </div>
  );
} 