'use client';

import { ReactNode } from 'react';
import '@/styles/technical-map.css';

interface MapContainerProps {
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
}

export default function MapContainer({ children, loading, error }: MapContainerProps) {
  if (loading) {
    return (
      <div className="map-container flex items-center justify-center">
        <div className="text-center">
          <div className="terminal-spinner mx-auto mb-4"></div>
          <div className="terminal-text text-tech-white">
            LOADING MAP DATA<span className="blinking-cursor"></span>
          </div>
          <div className="text-tech-dim text-xs mt-2">
            Initializing visualization systems...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container flex items-center justify-center">
        <div className="text-center border border-red-500 p-8 max-w-md">
          <div className="terminal-text text-red-500 text-lg mb-4">
            [ERROR]
          </div>
          <div className="text-tech-white text-sm mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="terminal-button"
          >
            [RELOAD]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container relative">
      {children}
    </div>
  );
}
