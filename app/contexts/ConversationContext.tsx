'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

interface ConversationContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resetConversation: () => void;
  currentCountry: string | null;
  setCurrentCountry: (country: string | null) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider = ({ children }: { children: React.ReactNode; }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const resetConversation = () => {
    setMessages([]);
    setIsLoading(false);
    setCurrentCountry(null);
  };

  return (
    <ConversationContext.Provider value={{
      messages,
      addMessage,
      isLoading,
      setIsLoading,
      resetConversation,
      currentCountry,
      setCurrentCountry
    }}>
      {children}
    </ConversationContext.Provider>
  );
};

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
} 