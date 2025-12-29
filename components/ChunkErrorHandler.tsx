'use client';

import { useEffect } from 'react';

const RELOAD_KEY = 'chunk_error_reload_count';
const MAX_RELOADS = 1;

export default function ChunkErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Check if the error is a ChunkLoadError
      if (event.message.includes('ChunkLoadError') || event.message.includes('Loading chunk')) {
        // Check if we've already reloaded to prevent infinite loops
        const reloadCount = parseInt(sessionStorage.getItem(RELOAD_KEY) || '0', 10);

        if (reloadCount < MAX_RELOADS) {
          console.warn('ChunkLoadError detected, reloading page once...');
          sessionStorage.setItem(RELOAD_KEY, String(reloadCount + 1));
          window.location.reload();
        } else {
          console.error('ChunkLoadError persists after reload. Please clear cache and refresh manually.');
          sessionStorage.removeItem(RELOAD_KEY);
        }
      }
    };

    // Reset counter on successful load
    sessionStorage.removeItem(RELOAD_KEY);

    // Listen for unhandled errors
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
