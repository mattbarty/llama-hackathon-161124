'use client';

import Map from './components/Map';
import ChatBox from './components/ChatBox';
import { useUser } from './contexts/UserContext';
import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const user = useUser();
  const [isChatVisible, setIsChatVisible] = useState(true);

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* Chat Section */}
      <div
        className={`h-full transition-all duration-300 ease-in-out ${isChatVisible ? 'w-1/2' : 'w-0'
          }`}
      >
        {isChatVisible && <ChatBox />}
      </div>

      {/* Map Section */}
      <div
        className={`h-full transition-all duration-300 ease-in-out relative ${isChatVisible ? 'w-1/2' : 'w-full'
          }`}
      >
        <Map />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 z-10"
          onClick={() => setIsChatVisible(!isChatVisible)}
        >
          {isChatVisible ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
      </div>
    </main>
  );
}
