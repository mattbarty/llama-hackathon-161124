'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
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

const Map = forwardRef(({ isChatVisible }: MapProps, ref) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const user = useUser();

  // Function to initialize or reinitialize the geocoder
  const initializeGeocoder = (map: mapboxgl.Map) => {
    // Clear any existing geocoder
    if (geocoderRef.current) {
      geocoderRef.current.onRemove();
      geocoderRef.current = null;
    }

    const searchContainer = document.getElementById('location-search');
    if (!searchContainer) return;

    searchContainer.innerHTML = '';

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

    geocoderRef.current = searchGeocoder;

    // Add geocoder control to its container
    if (!searchContainer.hasChildNodes()) {
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
  };

  // Effect for map initialization
  useEffect(() => {
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

    mapRef.current = map;

    // Initialize geocoder after map is loaded
    map.on('load', () => {
      initializeGeocoder(map);

      // Add click event handler for country selection
      map.on('click', async (e) => {
        const { lng, lat } = e.lngLat;

        try {
          // Reverse geocode the clicked coordinates
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=country&access_token=${mapboxgl.accessToken}`
          );

          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const country = data.features[0];
            setSelectedCountry(country.text);

            // Update marker
            if (markerRef.current) {
              markerRef.current.setLngLat(country.center);
            } else {
              markerRef.current = new mapboxgl.Marker()
                .setLngLat(country.center)
                .addTo(map);
            }

            // Fly to country
            map.flyTo({
              center: country.center,
              zoom: 5,
              essential: true
            });
          }
        } catch (error) {
          console.error('Error getting country from coordinates:', error);
        }
      });
    });

    // Add resize handler
    const resizeMap = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };

    // Add resize observer
    const resizeObserver = new ResizeObserver(() => {
      resizeMap();
    });

    resizeObserver.observe(container);

    // Cleanup function
    return () => {
      resizeObserver.disconnect();

      // Remove click handler
      if (mapRef.current) {
        mapRef.current.off('click', 'click', () => { });
      }

      // First remove the marker if it exists
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      // Then remove the geocoder if it exists
      if (geocoderRef.current) {
        const searchContainer = document.getElementById('location-search');
        if (searchContainer) {
          searchContainer.innerHTML = '';
        }
        geocoderRef.current = null;
      }

      // Finally remove the map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Effect to handle search container visibility
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const searchContainer = document.getElementById('location-search');
      if (searchContainer && mapRef.current && !searchContainer.hasChildNodes()) {
        initializeGeocoder(mapRef.current);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isChatVisible]);

  useImperativeHandle(ref, () => ({
    focusOnCountry: (countryName: string) => {
      setSelectedCountry(countryName);

      const map = mapRef.current;
      if (map) {
        const searchGeocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl as any,
          marker: false,
          types: 'country',
          limit: 1
        });

        // Add the geocoder to the map temporarily
        const container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);
        container.appendChild(searchGeocoder.onAdd(map));

        // Set up the result handler before querying
        searchGeocoder.on('result', (event) => {
          const result = event.result;

          map.flyTo({
            center: result.center,
            zoom: 5,
            essential: true
          });

          if (markerRef.current) {
            markerRef.current.setLngLat(result.center);
          } else {
            markerRef.current = new mapboxgl.Marker()
              .setLngLat(result.center)
              .addTo(map);
          }

          // Clean up
          container.remove();
        });

        // Handle errors
        searchGeocoder.on('error', () => {
          console.error('Failed to geocode country:', countryName);
          container.remove();
        });

        // Now perform the query
        searchGeocoder.query(countryName);
      }
    }
  }));

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
});

export default Map;
