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
      <div
        className={`h-full transition-all duration-300 ease-in-out p-4 overflow-hidden relative ${isChatVisible ? 'w-2/3' : 'w-0'
          }`}
      >
        <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          {isChatVisible && <ChatBox />}
        </div>
      </div>
      <div
        className={`h-full transition-all duration-300 ease-in-out p-4 rounded-lg overflow-hidden relative ${isChatVisible ? 'w-1/3' : 'w-full'
          }`}
      >
        <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <Map isChatVisible={isChatVisible} />
        </div>
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
