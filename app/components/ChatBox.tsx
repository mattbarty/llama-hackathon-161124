'use client';

'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import InteractiveMessage from './InteractiveMessage';
import { useConversation } from '../contexts/ConversationContext';
import { CitiesData, WorkData, LegalData, QualityData, CultureData } from '../contexts/CountryDataContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBoxProps {
  country: string | null;
  countryData: {
    legal: any;
    quality: any;
    work: any;
    culture: any;
    cities: any;
  } | null;
}

export default function ChatBox({ country, countryData }: ChatBoxProps) {
  const { messages, addMessage, isLoading, setIsLoading } = useConversation();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation when component mounts
  useEffect(() => {
    if (country && countryData && messages.length === 0) {
      // Create detailed system prompt
      const systemPrompt = {
        role: 'system',
        content: `You are a knowledgeable assistant specializing in providing information about ${country}. 
Use the following detailed information to answer questions accurately:

CITIES AND LIVING:
${JSON.stringify(countryData.cities, null, 2)}

LEGAL AND IMMIGRATION:
${JSON.stringify(countryData.legal, null, 2)}

QUALITY OF LIFE:
${JSON.stringify(countryData.quality, null, 2)}

WORK AND BUSINESS:
${JSON.stringify(countryData.work, null, 2)}

CULTURE AND SOCIETY:
${JSON.stringify(countryData.culture, null, 2)}

Guidelines:
1. Base your responses on the provided information
2. If information is not available in the provided data, clearly indicate this
3. Keep responses concise but informative
4. Focus on accuracy and relevance to the user's questions
5. Use a friendly, helpful tone
6. Structure complex responses for readability`
      };

      addMessage(systemPrompt as Message);
    }
  }, [country, countryData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending conversation to LLM:', messages.concat(userMessage));

      const response = await fetch('/api/callGroq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage)
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      addMessage({
        role: 'assistant',
        content: data.message
      });
    } catch (error) {
      console.error('Failed to get response:', error);
      addMessage({
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          // Skip system messages in display
          if (message.role === 'system') return null;

          return (
            <div
              key={index}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${message.role === 'assistant'
                  ? 'bg-white border border-gray-200'
                  : 'bg-blue-500 text-white'
                  }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask anything about ${country || 'this country'}...`}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Send'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 