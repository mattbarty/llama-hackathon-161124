'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useLanguage } from './LanguageContext';

export interface LegalData {
  visaRequirements: string;
  pathToResidency: string;
  requiredDocuments: string[];
}

export interface QualityData {
  healthcare: {
    system: string;
    quality: string;
    cost: string;
  };
  safety: {
    index: string;
    details: string;
  };
  environment: {
    airQuality: string;
    climate: string;
    sustainability: string;
  };
  education: {
    system: string;
    universities: string;
    internationalSchools: string;
  };
}

export interface WorkData {
  jobMarket: {
    overview: string;
    inDemandSectors: string[];
    averageSalaries: string;
    unemployment: string;
  };
  businessEnvironment: {
    startupScene: string;
    majorEmployers: string[];
    regulations: string;
  };
  workCulture: {
    workLifeBalance: string;
    officeHours: string;
    practices: string[];
  };
  foreignWorkers: {
    opportunities: string;
    workPermits: string;
    challenges: string[];
  };
}

export interface CultureData {
  language: {
    official: string[];
    usefulPhrases: string[];
    businessEnglish: string;
  };
  society: {
    values: string[];
    customs: string[];
    etiquette: string[];
  };
  expats: {
    integration: string;
    communities: string[];
    commonChallenges: string[];
  };
  lifestyle: {
    overview: string;
    socialLife: string;
    familyLife: string;
  };
}

export interface CityData {
  name: string;
  isCapital?: boolean;
  population: string;
  description: string;
  costOfLiving: string;
  internetSpeed: string;
  climate: string;
  neighborhoods: string[];
}

export interface CitiesData {
  capital: CityData;
  majorCities: CityData[];
}

interface CountryData {
  legal?: LegalData;
  quality?: QualityData;
  work?: WorkData;
  culture?: CultureData;
  cities?: CitiesData;
}

interface CountryDataContextType {
  countryData: Record<string, CountryData>;
  getLegalData: (country: string, forceRefresh?: boolean) => Promise<LegalData>;
  getQualityData: (country: string, forceRefresh?: boolean) => Promise<QualityData>;
  getWorkData: (country: string, forceRefresh?: boolean) => Promise<WorkData>;
  getCultureData: (country: string, forceRefresh?: boolean) => Promise<CultureData>;
  getCitiesData: (country: string, forceRefresh?: boolean) => Promise<CitiesData>;
  getAllCountryData: (country: string) => Promise<{
    legal: LegalData;
    quality: QualityData;
    work: WorkData;
    culture: CultureData;
    cities: CitiesData;
  }>;
  isLoading: boolean;
}

const CountryDataContext = createContext<CountryDataContextType | undefined>(undefined);

export function CountryDataProvider({ children }: { children: ReactNode; }) {
  const [countryData, setCountryData] = useState<Record<string, CountryData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const getLegalData = async (country: string, forceRefresh?: boolean): Promise<LegalData> => {
    if (!forceRefresh && countryData[country]?.legal) {
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
          section: 'legal',
          language: language
        }),
      });

      const data = await response.json();

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

  const getQualityData = async (country: string, forceRefresh?: boolean): Promise<QualityData> => {
    if (!forceRefresh && countryData[country]?.quality) {
      return countryData[country].quality!;
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
          section: 'quality',
          language: language
        }),
      });

      const data = await response.json();

      setCountryData(prev => ({
        ...prev,
        [country]: {
          ...prev[country],
          quality: data
        }
      }));

      return data;
    } catch (error) {
      console.error('Failed to generate quality data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkData = async (country: string, forceRefresh?: boolean): Promise<WorkData> => {
    if (!forceRefresh && countryData[country]?.work) {
      return countryData[country].work!;
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
          section: 'work',
          language: language
        }),
      });

      const data = await response.json();

      setCountryData(prev => ({
        ...prev,
        [country]: {
          ...prev[country],
          work: data
        }
      }));

      return data;
    } catch (error) {
      console.error('Failed to generate work data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCultureData = async (country: string, forceRefresh?: boolean): Promise<CultureData> => {
    if (!forceRefresh && countryData[country]?.culture) {
      return countryData[country].culture!;
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
          section: 'culture',
          language: language
        }),
      });

      const data = await response.json();

      setCountryData(prev => ({
        ...prev,
        [country]: {
          ...prev[country],
          culture: data
        }
      }));

      return data;
    } catch (error) {
      console.error('Failed to generate culture data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCitiesData = async (country: string, forceRefresh?: boolean): Promise<CitiesData> => {
    if (!forceRefresh && countryData[country]?.cities) {
      return countryData[country].cities!;
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
          section: 'cities',
          language: language
        }),
      });

      const data = await response.json();

      setCountryData(prev => ({
        ...prev,
        [country]: {
          ...prev[country],
          cities: data
        }
      }));

      return data;
    } catch (error) {
      console.error('Failed to generate cities data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCountryData = async (country: string) => {
    const sections = ['legal', 'quality', 'work', 'culture', 'cities'];
    const data: any = {};

    try {
      const promises = sections.map(async (section) => {
        const response = await fetch('/api/generateCountryData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country,
            section,
            language: language
          }),
        });

        const result = await response.json();
        data[section] = result;
      });

      await Promise.all(promises);

      setCountryData(prev => ({
        ...prev,
        [country]: data
      }));

      return data;
    } catch (error) {
      console.error('Failed to load all country data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CountryDataContext.Provider value={{
      countryData,
      getLegalData,
      getQualityData,
      getWorkData,
      getCultureData,
      getCitiesData,
      getAllCountryData,
      isLoading
    }}>
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