'use client';

import Map from './components/Map';
import ChatBox from './components/ChatBox';
import { useUser } from './contexts/UserContext';

export default function Home() {
  const user = useUser();

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="w-1/2 h-full border-r">
        <ChatBox />
      </div>
      <div className="w-1/2 h-full">
        <Map />
      </div>
    </main>
  );
}
