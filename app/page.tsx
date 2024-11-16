'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plane, Navigation } from 'lucide-react';
import { UserProfile } from "./components/UserProfile";
import { useUser } from './contexts/UserContext';

export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 0],
      zoom: 2,
      projection: 'globe'
    });

    mapRef.current = map;

    const searchGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as any,
      marker: true,
      placeholder: 'Search for a location',
      types: 'country,place',
      limit: 5
    });

    // Handle selection of a location
    searchGeocoder.on('result', (event) => {
      const result = event.result;
      if (result.place_type[0] === 'country') {
        setSelectedCountry(result.text);
        setSelectedCity(null);
      } else if (result.place_type[0] === 'place') {
        setSelectedCity(result.text);
        setSelectedCountry(result.context?.find((c: any) => c.id.startsWith('country'))?.text || null);
      }

      // Fly to the selected location
      map.flyTo({
        center: result.center,
        zoom: result.place_type[0] === 'country' ? 5 : 10,
        essential: true
      });
    });

    map.on('load', () => {
      // Add geocoder control to its container
      document.getElementById('location-search')?.appendChild(searchGeocoder.onAdd(map));
    });

    return () => map.remove();
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div id="map" className="absolute inset-0" />
      <UserProfile />
      <Card className="absolute top-4 left-4 z-10 w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Location Search
          </CardTitle>
          <CardDescription>
            Search for a city or country to focus the map
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div id="location-search" />
          {selectedCountry && (
            <div className="text-sm">
              <Label>Selected Country:</Label>
              <div className="mt-1">{selectedCountry}</div>
            </div>
          )}
          {selectedCity && (
            <div className="text-sm">
              <Label>Selected City:</Label>
              <div className="mt-1">{selectedCity}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
