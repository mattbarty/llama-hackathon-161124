'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, FeatureCollection, LineString, Point, Position } from 'geojson';

type Coordinates = {
  lat: number;
  lng: number;
  name: string;
};

export default function Home() {
  const runningRef = useRef(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [startCoords, setStartCoords] = useState<Coordinates>({
    lat: 37.776,
    lng: -122.414,
    name: 'San Francisco'
  });
  const [endCoords, setEndCoords] = useState<Coordinates>({
    lat: 38.913,
    lng: -77.032,
    name: 'Washington DC'
  });

  const createAnimation = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Convert to Position type
    const origin: Position = [startCoords.lng, startCoords.lat];
    const destination: Position = [endCoords.lng, endCoords.lat];

    const route: FeatureCollection<LineString> = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [origin, destination]
        }
      }]
    };

    const point: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {
          bearing: 0
        },
        geometry: {
          type: 'Point',
          coordinates: origin
        }
      }]
    };

    const routeFeature = route.features[0];
    if (!routeFeature) throw new Error('Route feature is undefined');

    const lineDistance = turf.length(routeFeature);
    const arc: Position[] = [];
    const steps = 500;

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(routeFeature, i);
      arc.push(segment.geometry.coordinates);
    }

    routeFeature.geometry.coordinates = arc;
    let counter = 0;

    // Create bounds using LngLatLike format
    const bounds = new mapboxgl.LngLatBounds(
      [origin[0], origin[1]],
      [destination[0], destination[1]]
    );

    // Center the map on the route
    map.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      duration: 1000
    });

    // Remove existing layers and sources if they exist
    if (map.getLayer('point')) map.removeLayer('point');
    if (map.getLayer('route')) map.removeLayer('route');
    if (map.getSource('point')) map.removeSource('point');
    if (map.getSource('route')) map.removeSource('route');

    map.addSource('route', {
      type: 'geojson',
      data: route
    });

    map.addSource('point', {
      type: 'geojson',
      data: point
    });

    map.addLayer({
      id: 'route',
      source: 'route',
      type: 'line',
      paint: {
        'line-width': 2,
        'line-color': '#007cbf'
      }
    });

    map.addLayer({
      id: 'point',
      source: 'point',
      type: 'symbol',
      layout: {
        'icon-image': 'airport',
        'icon-size': 1.5,
        'icon-rotate': ['get', 'bearing'],
        'icon-rotation-alignment': 'map',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      }
    });

    function animate() {
      runningRef.current = true;
      const replayButton = document.getElementById('replay') as HTMLButtonElement;
      if (replayButton) replayButton.disabled = true;

      const routeCoords = routeFeature.geometry.coordinates;
      const pointFeature = point.features[0];

      if (!pointFeature) throw new Error('Point feature is undefined');

      const start = routeCoords[counter >= steps ? counter - 1 : counter];
      const end = routeCoords[counter >= steps ? counter : counter + 1];

      if (!start || !end) {
        runningRef.current = false;
        if (replayButton) replayButton.disabled = false;
        return;
      }

      pointFeature.geometry.coordinates = routeCoords[counter];

      if (pointFeature.properties) {
        pointFeature.properties.bearing = turf.bearing(
          turf.point(start),
          turf.point(end)
        );
      }

      const pointSource = map.getSource('point') as mapboxgl.GeoJSONSource;
      pointSource.setData(point);

      if (counter < steps) {
        requestAnimationFrame(animate);
      }

      counter = counter + 1;
    }

    animate();
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-96, 35],
      zoom: 3.2,
      pitch: 40,
    });

    mapRef.current = map;

    const startGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as any,
      marker: false,
      flyTo: false,
      placeholder: 'Search for starting point'
    });

    const endGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as any,
      marker: false,
      flyTo: false,
      placeholder: 'Search for destination'
    });

    startGeocoder.on('result', (e) => {
      const coords = e.result.geometry.coordinates;
      setStartCoords({
        lng: coords[0],
        lat: coords[1],
        name: e.result.place_name
      });
    });

    endGeocoder.on('result', (e) => {
      const coords = e.result.geometry.coordinates;
      setEndCoords({
        lng: coords[0],
        lat: coords[1],
        name: e.result.place_name
      });
    });

    map.on('load', () => {
      // Add geocoder controls to their containers
      document.getElementById('start-geocoder')?.appendChild(startGeocoder.onAdd(map));
      document.getElementById('end-geocoder')?.appendChild(endGeocoder.onAdd(map));

      createAnimation();
    });

    return () => map.remove();
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div id="map" className="absolute inset-0" />
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Starting Point</h3>
            <div id="start-geocoder" className="mb-2" />
            <div className="text-sm text-gray-600">
              Selected: {startCoords.name}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="number"
                value={startCoords.lat}
                onChange={(e) => setStartCoords(prev => ({
                  ...prev,
                  lat: parseFloat(e.target.value)
                }))}
                placeholder="Latitude"
                className="border p-1 rounded text-sm"
              />
              <input
                type="number"
                value={startCoords.lng}
                onChange={(e) => setStartCoords(prev => ({
                  ...prev,
                  lng: parseFloat(e.target.value)
                }))}
                placeholder="Longitude"
                className="border p-1 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Destination</h3>
            <div id="end-geocoder" className="mb-2" />
            <div className="text-sm text-gray-600">
              Selected: {endCoords.name}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="number"
                value={endCoords.lat}
                onChange={(e) => setEndCoords(prev => ({
                  ...prev,
                  lat: parseFloat(e.target.value)
                }))}
                placeholder="Latitude"
                className="border p-1 rounded text-sm"
              />
              <input
                type="number"
                value={endCoords.lng}
                onChange={(e) => setEndCoords(prev => ({
                  ...prev,
                  lng: parseFloat(e.target.value)
                }))}
                placeholder="Longitude"
                className="border p-1 rounded text-sm"
              />
            </div>
          </div>
          <button
            onClick={createAnimation}
            className="w-full px-4 py-2 bg-[#3386c0] hover:bg-[#4ea0da] text-white font-semibold rounded-md"
          >
            Start Animation
          </button>
          <button
            id="replay"
            className="w-full px-4 py-2 bg-[#3386c0] hover:bg-[#4ea0da] disabled:bg-[#f5f5f5] disabled:text-[#c3c3c3] text-white font-semibold rounded-md"
          >
            Replay
          </button>
        </div>
      </div>
    </main>
  );
}
