'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface LegalData {
  visaRequirements: string;
  pathToResidency: string;
  requiredDocuments: string[];
}

interface CountryData {
  legal?: LegalData;
}

interface CountryDataContextType {
  countryData: Record<string, CountryData>;
  getLegalData: (country: string) => Promise<LegalData>;
  isLoading: boolean;
}

const CountryDataContext = createContext<CountryDataContextType | undefined>(undefined);

export function CountryDataProvider({ children }: { children: ReactNode; }) {
  const [countryData, setCountryData] = useState<Record<string, CountryData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const getLegalData = async (country: string): Promise<LegalData> => {
    // Check if we already have the data
    if (countryData[country]?.legal) {
      return countryData[country].legal!;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generateCountryData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country,
          section: 'legal'
        }),
      });

      const data = await response.json();

      // Update the context with new data
      setCountryData(prev => ({
        ...prev,
        [country]: {
          ...prev[country],
          legal: data
        }
      }));

      return data;
    } catch (error) {
      console.error('Failed to generate legal data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CountryDataContext.Provider value={{ countryData, getLegalData, isLoading }}>
      {children}
    </CountryDataContext.Provider>
  );
}

export function useCountryData() {
  const context = useContext(CountryDataContext);
  if (context === undefined) {
    throw new Error('useCountryData must be used within a CountryDataProvider');
  }
  return context;
} 