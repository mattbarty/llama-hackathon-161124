'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import InteractiveMessage from './InteractiveMessage';
import { useConversation } from '../contexts/ConversationContext';
import { CitiesData, WorkData, LegalData, QualityData, CultureData } from '../contexts/CountryDataContext';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';
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

interface SuggestedQuestion {
  text: string;
}

export default function ChatBox({ country, countryData }: ChatBoxProps) {
  const {
    messages,
    addMessage,
    isLoading,
    setIsLoading,
    resetConversation,
    currentCountry,
    setCurrentCountry
  } = useConversation();
  const [input, setInput] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Function to fetch suggested questions
  const fetchSuggestedQuestions = async (lastResponse: string) => {
    try {
      const response = await fetch('/api/callGroq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Based on the previous response and available country data, suggest 3 relevant follow-up questions. Return ONLY a JSON array of questions, no other text. Format: ["question1", "question2", "question3"]'
            },
            {
              role: 'user',
              content: `Previous response: "${lastResponse}". Suggest 3 relevant follow-up questions about ${country}.`
            }
          ],
          language: language
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Parse the response as JSON
      const questions = JSON.parse(data.message);
      setSuggestedQuestions(questions.map((text: string) => ({ text })));
    } catch (error) {
      console.error('Failed to fetch suggested questions:', error);
      setSuggestedQuestions([]);
    }
  };

  // Update suggested questions when assistant responds
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      fetchSuggestedQuestions(lastMessage.content);
    }
  }, [messages]);

  // Handle suggested question click
  const handleSuggestedQuestion = async (question: string) => {
    if (isLoading) return;

    // Clear suggested questions
    setSuggestedQuestions([]);

    // Submit the question
    const userMessage = { role: 'user' as const, content: question };
    addMessage(userMessage);
    setIsLoading(true);

    try {
      const response = await fetch('/api/callGroq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage),
          language: language
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

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

  // Initialize conversation with generated response
  useEffect(() => {
    const initializeChat = async () => {
      if (country && countryData && messages.length === 0 && !isLoading) {
        setIsLoading(true);
        setCurrentCountry(country);

        // Create detailed system prompt
        const systemPrompt = {
          role: 'system',
          content: `You are a knowledgeable assistant specializing in providing information about ${country}.
          You are tasked with answering questions about ${country} and its data - Unless necessary, do not provide information about the countries cities.
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
1. Keep responses concise and to the point
2. Wait for specific questions before providing detailed information
3. Use markdown formatting for better readability
4. Be friendly and welcoming
5. Only answer what is specifically asked`
        };

        try {
          // Add the system prompt first
          addMessage(systemPrompt as Message);

          const response = await fetch('/api/callGroq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
                systemPrompt,
                {
                  role: 'user',
                  content: `Give a brief, friendly welcome message for ${country}. Keep it to 2-3 sentences maximum.`
                }
              ],
              language: language
            }),
          });

          const data = await response.json();
          if (data.error) throw new Error(data.error);

          addMessage({
            role: 'assistant',
            content: data.message
          });
        } catch (error) {
          console.error('Failed to initialize chat:', error);
          // Fallback welcome message
          addMessage({
            role: 'assistant',
            content: `**Welcome!** 👋 I'm here to help you learn about ${country}. What would you like to know?`
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeChat();
  }, [country, countryData, messages.length, addMessage, language, isLoading]);

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
          messages: messages.concat(userMessage),
          language: language
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
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Chatting about:</span>
          <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-[14px]">
            {country || currentCountry}
          </span>
        </div>
        <button
          onClick={resetConversation}
          className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100"
        >
          Reset Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          // Only skip system messages, show all other messages
          if (message.role === 'system') return null;
          if (index === 2 && message.role === 'assistant') return null;
          console.log(message, index);

          return (
            <div
              key={index}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${message.role === 'assistant'
                  ? 'bg-white border border-gray-200 prose prose-sm max-w-none'
                  : 'bg-blue-500 text-white'
                  }`}
              >
                {message.role === 'assistant' ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      <div className="flex flex-col justify-center bg-white border-t pt-2">
        {suggestedQuestions.length > 0 && (
          <>
            <p className="px-2 text-sm text-gray-500 italic">Suggested questions - click to ask</p>
            <div className="flex flex-wrap gap-1 px-4 py-2 ">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question.text)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-[6px] transition-colors duration-200 text-left"
                >
                  &quot; {question.text} &quot;
                </button>
              ))}
            </div>
          </>
        )}
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
};