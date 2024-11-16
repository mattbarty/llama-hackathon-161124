'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, FeatureCollection, LineString, Point, Position } from 'geojson';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plane, Navigation } from 'lucide-react';

type Coordinates = {
  lat: number | null;
  lng: number | null;
  name: string;
};

export default function Home() {
  const runningRef = useRef(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [startCoords, setStartCoords] = useState<Coordinates>({
    lat: null,
    lng: null,
    name: 'Not selected'
  });
  const [endCoords, setEndCoords] = useState<Coordinates>({
    lat: null,
    lng: null,
    name: 'Not selected'
  });

  const createAnimation = () => {
    if (!mapRef.current) return;
    if (!startCoords.lat || !startCoords.lng || !endCoords.lat || !endCoords.lng) {
      // You might want to add a toast notification here
      console.log('Please select both starting point and destination');
      return;
    }

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
      center: [0, 0],
      zoom: 3,
      projection: 'globe'
    });

    mapRef.current = map;

    const startGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as any,
      marker: false,
      flyTo: false,
      placeholder: 'Search for starting point',
      types: 'country,place',
      limit: 3
    });

    const endGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as any,
      marker: false,
      flyTo: false,
      placeholder: 'Search for destination',
      types: 'country,place',
      limit: 5
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

      // Optional: Smooth transition to center
      map.flyTo({
        center: [0, 0],
        zoom: 1.5,
        speed: 0.8,
        curve: 1,
        essential: true
      });
    });

    return () => map.remove();
  }, []);

  const isReadyToAnimate = startCoords.lat && startCoords.lng && endCoords.lat && endCoords.lng;

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div id="map" className="absolute inset-0" />
      <Card className="absolute top-4 left-4 z-10 w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Path Generator
          </CardTitle>
          <CardDescription>
            Select two locations to create an animated flight path
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Starting Point Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Starting Point</Label>
              <div id="start-geocoder" className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {startCoords.name === 'Not selected' ? (
                  <span className="text-yellow-600 dark:text-yellow-400">Please select a starting point</span>
                ) : (
                  <>Selected: {startCoords.name}</>
                )}
              </p>
            </div>
          </div>

          {/* Destination Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Destination</Label>
              <div id="end-geocoder" className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {endCoords.name === 'Not selected' ? (
                  <span className="text-yellow-600 dark:text-yellow-400">Please select a destination</span>
                ) : (
                  <>Selected: {endCoords.name}</>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={createAnimation}
              className="w-full"
              variant="default"
              disabled={!isReadyToAnimate}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Start Animation
            </Button>
            <Button
              id="replay"
              className="w-full"
              variant="secondary"
              disabled={!isReadyToAnimate}
            >
              <Plane className="mr-2 h-4 w-4" />
              Replay Animation
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
