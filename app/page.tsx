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
      placeholder: 'Search for starting point',
      types: 'country,place',
      limit: 5
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

      createAnimation();
    });

    return () => map.remove();
  }, []);

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
            Enter locations to create an animated flight path
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Starting Point Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Starting Point</Label>
              <div id="start-geocoder" className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Selected: {startCoords.name}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start-lat" className="text-xs">Latitude</Label>
                <Input
                  id="start-lat"
                  type="number"
                  value={startCoords.lat}
                  onChange={(e) => setStartCoords(prev => ({
                    ...prev,
                    lat: parseFloat(e.target.value)
                  }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-lng" className="text-xs">Longitude</Label>
                <Input
                  id="start-lng"
                  type="number"
                  value={startCoords.lng}
                  onChange={(e) => setStartCoords(prev => ({
                    ...prev,
                    lng: parseFloat(e.target.value)
                  }))}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          {/* Destination Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Destination</Label>
              <div id="end-geocoder" className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Selected: {endCoords.name}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="end-lat" className="text-xs">Latitude</Label>
                <Input
                  id="end-lat"
                  type="number"
                  value={endCoords.lat}
                  onChange={(e) => setEndCoords(prev => ({
                    ...prev,
                    lat: parseFloat(e.target.value)
                  }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-lng" className="text-xs">Longitude</Label>
                <Input
                  id="end-lng"
                  type="number"
                  value={endCoords.lng}
                  onChange={(e) => setEndCoords(prev => ({
                    ...prev,
                    lng: parseFloat(e.target.value)
                  }))}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={createAnimation}
              className="w-full"
              variant="default"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Start Animation
            </Button>
            <Button
              id="replay"
              className="w-full"
              variant="secondary"
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
