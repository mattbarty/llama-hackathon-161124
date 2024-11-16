'use client';

import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGJhcnR5IiwiYSI6ImNtM2tiajZyNjBhemEyaXF6cGQ0Z2o4MXMifQ.l_8Hg3jdzM55dq85FwoEgw';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      projection: 'globe',
      zoom: 1,
      center: [30, 15]
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('style.load', () => {
      map.setFog({});
    });

    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;

    let userInteracting = false;
    const spinEnabled = true;

    function spinGlobe() {
      const zoom = map.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.getCenter();
        center.lng -= distancePerSecond;
        map.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    map.on('mousedown', () => {
      userInteracting = true;
    });

    map.on('dragstart', () => {
      userInteracting = true;
    });

    map.on('moveend', () => {
      spinGlobe();
    });

    spinGlobe();

    // Cleanup function
    return () => map.remove();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
      <div id="map" className="w-full h-screen" />
    </main>
  );
};

export default Map;
