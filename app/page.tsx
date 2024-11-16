'use client';

import Map from './components/Map';
import ChatBox from './components/ChatBox';
import { useUser } from './contexts/UserContext';
import { useState, useRef } from 'react';
import { Maximize2, Minimize2, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapProvider } from './contexts/MapContext';
import { ConversationProvider } from './contexts/ConversationContext';
import { CountryDataProvider } from './contexts/CountryDataContext';

export default function Home() {
  const user = useUser();
  const [isChatVisible, setIsChatVisible] = useState(true);
  const mapRef = useRef<any>(null);

  const handleFocusCountry = (countryName: string) => {
    if (mapRef.current) {
      mapRef.current.focusOnCountry(countryName);
    }
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden items-center justify-center">
      <ConversationProvider>
        <CountryDataProvider>
          <MapProvider onFocusCountry={handleFocusCountry}>
            <div className="flex w-[calc(70%-2rem)] min-w-[800px] mx-auto min-h-[600px] h-[calc(75%-2rem)] gap-2 p-2 bg-white rounded-lg border-2 border-gray-200">
              {/* Chat */}
              <div
                className={`h-full transition-all duration-300 ease-in-out overflow-hidden relative ${isChatVisible ? 'w-3/5' : 'w-0'
                  }`}
              >
                <div className="h-full w-full rounded-lg overflow-hidden shadow-sm">
                  {isChatVisible && <ChatBox />}
                </div>
              </div>
              {/* Map */}
              <div
                className={`h-full transition-all duration-300 ease-in-out rounded-lg overflow-hidden border-2 border-gray-200 relative ${isChatVisible ? 'w-2/5' : 'w-full bg-gray-700'
                  }`}
              >
                <div className="h-full w-full rounded-lg overflow-hidden shadow-sm">
                  <Map ref={mapRef} isChatVisible={isChatVisible} />
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 left-4 z-10"
                  onClick={() => setIsChatVisible(!isChatVisible)}
                >
                  {isChatVisible ? <Maximize2 className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </MapProvider>
        </CountryDataProvider>
      </ConversationProvider>
    </main>
  );
}
