import { ReactNode } from 'react';

interface InteractiveMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export default function InteractiveMessage({ role, content, isLoading = false }: InteractiveMessageProps) {
  return (
    <div
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
          }`}
      >
        {isLoading ? (
          <span className="animate-pulse">Thinking...</span>
        ) : (
          content
        )}
      </div>
    </div>
  );
} 