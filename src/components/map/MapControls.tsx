'use client';

import React from 'react';
import { useMap } from 'react-leaflet';
import { useSimulationStore } from '@/store/simulationStore';

export function MapControls() {
  const map = useMap();
  const { currentLocation } = useSimulationStore();

  const handleRecenter = () => {
    map.setView([currentLocation.center.lat, currentLocation.center.lng], currentLocation.zoom, {
      animate: true,
    });
  };

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute top-3 right-3 flex flex-col gap-1 z-[1000]">
      <button
        onClick={handleRecenter}
        className="p-1.5 bg-surface/90 hover:bg-surface border border-outline-variant rounded-md shadow-sm text-on-surface-variant hover:text-primary transition-colors backdrop-blur-sm"
        title="Recenter Map"
      >
        <span className="material-symbols-outlined text-[18px]">my_location</span>
      </button>
      <button
        onClick={handleZoomIn}
        className="p-1.5 bg-surface/90 hover:bg-surface border border-outline-variant rounded-md shadow-sm text-on-surface-variant hover:text-primary transition-colors backdrop-blur-sm"
        title="Zoom In"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
      </button>
      <button
        onClick={handleZoomOut}
        className="p-1.5 bg-surface/90 hover:bg-surface border border-outline-variant rounded-md shadow-sm text-on-surface-variant hover:text-primary transition-colors backdrop-blur-sm"
        title="Zoom Out"
      >
        <span className="material-symbols-outlined text-[18px]">remove</span>
      </button>
    </div>
  );
}
