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
import { Plane, Navigation, Search, Globe } from 'lucide-react';
import { UserProfile } from "./UserProfile";
import { useUser } from '@/app/contexts/UserContext';
import CountryCard from '@/app/components/CountryCard';

interface MapProps {
  isChatVisible: boolean;
}

export default function Map({ isChatVisible }: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    // Wait for the container to be available
    const container = document.getElementById('map');
    if (!container) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 0],
      zoom: 2,
      projection: 'globe'
    });

    // Add resize handler
    const resizeMap = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };

    // Add resize observer to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      resizeMap();
    });

    resizeObserver.observe(container);

    mapRef.current = map;

    // Clear any existing geocoder
    const existingGeocoder = document.getElementById('location-search');
    if (existingGeocoder) {
      existingGeocoder.innerHTML = '';
    }

    const searchGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as any,
      marker: false,
      placeholder: 'Search for a city or country',
      types: 'country,place',
      limit: 5,
      language: 'en',
      bbox: [-180, -90, 180, 90],
      fuzzyMatch: true,
      autocomplete: true,
      minLength: 1
    });

    // Add geocoder control to its container
    const searchContainer = document.getElementById('location-search');
    if (searchContainer && !searchContainer.hasChildNodes()) {
      searchContainer.appendChild(searchGeocoder.onAdd(map));
    }

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

      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setLngLat(result.center);
      } else {
        markerRef.current = new mapboxgl.Marker()
          .setLngLat(result.center)
          .addTo(map);
      }

      // Fly to the selected location
      map.flyTo({
        center: result.center,
        zoom: result.place_type[0] === 'country' ? 5 : 10,
        essential: true
      });
    });

    map.on('load', () => {
      // Add source for country boundaries
      map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      // Add a layer for country fills (invisible but hoverable)
      map.addLayer({
        id: 'country-fills',
        type: 'fill',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': '#627BC1',
          'fill-opacity': 0
        }
      });

      // Create a popup but don't add it to the map yet
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      // Add a ref for the timeout
      let hoverTimeout: NodeJS.Timeout | null = null;

      // Handle mouse enter/move
      map.on('mousemove', 'country-fills', (e) => {
        if (e.features && e.features[0]) {
          map.getCanvas().style.cursor = 'pointer';

          // Store the necessary data outside the timeout
          const countryName = e.features[0].properties?.name_en;
          const lngLat = e.lngLat;

          // Clear any existing timeout
          if (hoverTimeout) {
            clearTimeout(hoverTimeout);
          }

          // Set new timeout using the stored data
          hoverTimeout = setTimeout(() => {
            popup
              .setLngLat(lngLat)
              .setHTML(countryName)
              .addTo(map);
          }, 1000); // 1 second delay
        }
      });

      // Handle mouse leave
      map.on('mouseleave', 'country-fills', () => {
        map.getCanvas().style.cursor = '';
        // Clear the timeout if it exists
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        popup.remove();
      });

      // Handle click on country
      map.on('click', 'country-fills', (e) => {
        if (e.features && e.features[0]) {
          const countryName = e.features[0].properties?.name_en;
          setSelectedCountry(countryName);
          setSelectedCity(null);

          // Update or create marker
          if (markerRef.current) {
            markerRef.current.setLngLat(e.lngLat);
          } else {
            markerRef.current = new mapboxgl.Marker()
              .setLngLat(e.lngLat)
              .addTo(map);
          }

          // Fly to the clicked location
          map.flyTo({
            center: e.lngLat,
            zoom: 5,
            essential: true
          });
        }
      });
    });

    return () => {
      resizeObserver.disconnect();
      if (markerRef.current) {
        markerRef.current.remove();
      }
      // Clean up geocoder
      const searchContainer = document.getElementById('location-search');
      if (searchContainer) {
        searchContainer.innerHTML = '';
      }
      map.remove();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div
        id="map"
        className={`absolute transition-all duration-300 ease-in-out ${isChatVisible && selectedCountry
          ? 'inset-x-0 top-0 h-1/2'
          : 'inset-0'
          }`}
      />

      {!isChatVisible ? (
        // Floating card layout when maximized
        <div className="flex flex-col absolute w-[350px] top-4 right-4 z-10 gap-4 max-h-[calc(100vh-2rem)]">
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
            <div className="flex items-center gap-2 w-full relative">
              <div id="location-search" className="w-full h-10 z-20 py-1" />
              <Globe className="h-5 w-5 absolute left-2 text-gray-500 pointer-events-none z-30 top-1/2 -translate-y-1/2" />
              <Navigation className="h-5 w-5 absolute right-2 text-gray-500 pointer-events-none z-30 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          {selectedCountry && (
            <div className="z-10 h-[600px] overflow-hidden">
              <CountryCard country={selectedCountry} onClose={() => setSelectedCountry(null)} />
            </div>
          )}
        </div>
      ) : (
        // Bottom layout when minimized
        <>
          <div className="absolute top-4 right-4 z-10 px-4">
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
              <div className="flex items-center gap-2 w-full relative">
                <div id="location-search" className="w-[300px] h-10 z-20 py-1" />
                <Globe className="h-5 w-5 absolute left-2 text-gray-500 pointer-events-none z-30 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
          {selectedCountry && (
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white z-10 transition-all duration-300 ease-in-out">
              <div className="p-4 h-full overflow-y-auto">
                <CountryCard country={selectedCountry} onClose={() => setSelectedCountry(null)} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
