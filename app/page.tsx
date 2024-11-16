'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, FeatureCollection, LineString, Point, Position } from 'geojson';

export default function Home() {
  const runningRef = useRef(false);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-96, 37.8],
      zoom: 3,
      pitch: 40,
    });

    // San Francisco
    const origin: Position = [-122.414, 37.776];
    // Washington DC
    const destination: Position = [-77.032, 38.913];

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

    map.on('load', () => {
      // Create bounds using LngLat objects
      const bounds = new mapboxgl.LngLatBounds(
        new mapboxgl.LngLat(origin[0], origin[1]),
        new mapboxgl.LngLat(destination[0], destination[1])
      );

      map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 0
      });

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

      // Start the animation
      animate();

      // Add event listener for replay button
      const replayButton = document.getElementById('replay');
      if (replayButton) {
        replayButton.addEventListener('click', () => {
          if (!runningRef.current) {
            const pointFeature = point.features[0];
            if (!pointFeature) return;

            pointFeature.geometry.coordinates = origin;
            const pointSource = map.getSource('point') as mapboxgl.GeoJSONSource;
            pointSource.setData(point);
            counter = 0;
            animate();
          }
        });
      }
    });

    return () => map.remove();
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div id="map" className="absolute inset-0" />
      <div className="absolute top-4 left-4 z-10">
        <button
          id="replay"
          className="px-5 py-2.5 bg-[#3386c0] hover:bg-[#4ea0da] disabled:bg-[#f5f5f5] disabled:text-[#c3c3c3] text-white font-semibold text-sm rounded-md"
        >
          Replay
        </button>
      </div>
    </main>
  );
}
