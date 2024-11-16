import { ReactNode } from 'react';
import { countries } from '../lib/countries';

interface InteractiveMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export default function InteractiveMessage({ role, content, isLoading = false }: InteractiveMessageProps) {
  const highlightCountries = (text: string) => {
    // Create a regex pattern that matches whole words only
    const countryPattern = new RegExp(`\\b(${countries.join('|')})\\b`, 'g');

    // Split the text into parts, preserving the matched countries
    const parts = text.split(countryPattern);

    return parts.map((part, index) => {
      // Check if this part is a country
      if (countries.includes(part)) {
        return <span key={index} className="text-sky-500">{part}</span>;
      }
      return part;
    });
  };

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
          highlightCountries(content)
        )}
      </div>
    </div>
  );
} 