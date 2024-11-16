'use client';

import { createContext, useContext, ReactNode } from 'react';

interface MapContextType {
  focusCountry: (countryName: string) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children, onFocusCountry }: {
  children: ReactNode;
  onFocusCountry: (countryName: string) => void;
}) {
  return (
    <MapContext.Provider value={{ focusCountry: onFocusCountry }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
} 