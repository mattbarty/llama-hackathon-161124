'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

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
  getLegalData: (country: string) => Promise<LegalData>;
  getQualityData: (country: string) => Promise<QualityData>;
  getWorkData: (country: string) => Promise<WorkData>;
  getCultureData: (country: string) => Promise<CultureData>;
  getCitiesData: (country: string) => Promise<CitiesData>;
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

  const getLegalData = async (country: string): Promise<LegalData> => {
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

  const getQualityData = async (country: string): Promise<QualityData> => {
    if (countryData[country]?.quality) {
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
          section: 'quality'
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

  const getWorkData = async (country: string): Promise<WorkData> => {
    if (countryData[country]?.work) {
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
          section: 'work'
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

  const getCultureData = async (country: string): Promise<CultureData> => {
    if (countryData[country]?.culture) {
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
          section: 'culture'
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

  const getCitiesData = async (country: string): Promise<CitiesData> => {
    if (countryData[country]?.cities) {
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
          section: 'cities'
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
    setIsLoading(true);
    try {
      const [legal, quality, work, culture, cities] = await Promise.all([
        getLegalData(country),
        getQualityData(country),
        getWorkData(country),
        getCultureData(country),
        getCitiesData(country)
      ]);

      setCountryData(prev => ({
        ...prev,
        [country]: {
          legal,
          quality,
          work,
          culture,
          cities
        }
      }));

      return {
        legal,
        quality,
        work,
        culture,
        cities
      };
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