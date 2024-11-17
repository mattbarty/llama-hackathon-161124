'use client';

import Map from './components/Map';
import ChatBox from './components/ChatBox';
import { useUser } from './contexts/UserContext';
import { useState, useRef } from 'react';
import { Maximize2, Minimize2, PanelLeftOpen, GripVertical, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapProvider } from './contexts/MapContext';
import { ConversationProvider } from './contexts/ConversationContext';
import { CountryDataProvider } from './contexts/CountryDataContext';
import CountryCard from './components/CountryCard';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Header } from './components/Header';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { InitialOverlay } from './components/InitialOverlay';

export default function Home() {
  const user = useUser();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const mapRef = useRef<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleFocusCountry = (countryName: string) => {
    if (mapRef.current) {
      mapRef.current.focusOnCountry(countryName);
      setSelectedCountry(countryName);
    }
  };

  return (
    <ThemeProvider>
      <InitialOverlay />
      <Header />
      <main className="flex h-screen w-screen overflow-hidden items-center justify-center pt-16">
        <ConversationProvider>
          <CountryDataProvider>
            <MapProvider onFocusCountry={handleFocusCountry}>
              <div className="flex w-[calc(70%-2rem)] min-w-[800px] mx-auto min-h-[600px] h-[calc(85%)] gap-2 p-2 bg-white rounded-lg border-2 border-gray-200">
                {/* Chat */}
                <div className={`h-full transition-all duration-300 ease-in-out overflow-hidden relative ${isChatVisible ? 'w-3/5' : 'w-0'
                  }`}>
                  <div className="h-full w-full rounded-lg overflow-hidden shadow-sm">
                    {isChatVisible && <ChatBox />}
                  </div>
                </div>

                {/* Map and Country Info */}
                <div className={`h-full transition-all duration-300 ease-in-out overflow-hidden relative ${isChatVisible ? 'w-2/5' : 'w-full'
                  }`}>
                  {isChatVisible ? (
                    <ResizablePanelGroup
                      direction="vertical"
                      className="h-full rounded-lg border-2 border-gray-200"
                    >
                      <ResizablePanel
                        defaultSize={selectedCountry ? 25 : 100}
                        minSize={30}
                      >
                        <div className="h-full w-full relative">
                          <Map
                            ref={mapRef}
                            isChatVisible={isChatVisible}
                            onCountrySelect={setSelectedCountry}
                            selectedCountry={selectedCountry}
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-4 left-4 z-10"
                            onClick={() => setIsChatVisible(!isChatVisible)}
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </ResizablePanel>

                      {selectedCountry && (
                        <>
                          <ResizableHandle className="bg-gray-200 hover:bg-gray-300">
                            <GripVertical className="h-4 w-4 text-gray-500" />
                          </ResizableHandle>

                          <ResizablePanel
                            defaultSize={40}
                            minSize={20}
                          >
                            <div className="h-full w-full overflow-auto bg-white p-4">
                              <CountryCard
                                country={selectedCountry}
                                onClose={() => setSelectedCountry(null)}
                              />
                            </div>
                          </ResizablePanel>
                        </>
                      )}
                    </ResizablePanelGroup>
                  ) : (
                    <div className="h-full w-full relative z-10">
                      <Map
                        ref={mapRef}
                        isChatVisible={isChatVisible}
                        onCountrySelect={setSelectedCountry}
                        selectedCountry={selectedCountry}
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-4 left-4 z-10"
                        onClick={() => setIsChatVisible(!isChatVisible)}
                      >
                        <PanelLeftOpen className="h-4 w-4" />
                      </Button>
                      {selectedCountry && (
                        <div className="absolute right-4 top-4 w-[375px] bg-white rounded-lg border-2 border-gray-200 z-10 h-[600px] p-2">
                          <CountryCard
                            country={selectedCountry}
                            onClose={() => setSelectedCountry(null)}
                          />
                          <button
                            className="flex items-center gap-2 justify-center px-4 py-2 rounded-lg w-full translate-y-4 bg-sky-500 text-white hover:bg-sky-600"
                            onClick={() => setIsChatVisible(!isChatVisible)}
                          >
                            <MessageCircle className="h-4 w-4" fill="white" />
                            Chat with {selectedCountry}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </MapProvider>
          </CountryDataProvider>
        </ConversationProvider>
      </main>
    </ThemeProvider>
  );
}
