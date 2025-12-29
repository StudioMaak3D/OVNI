'use client';

import { useEffect, useState } from 'react';
import '@/styles/technical-map.css';

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-tech-dark flex items-center justify-center p-6">
      <div className="max-w-md">
        <div className="control-panel bg-tech-dark border-tech p-8 text-center">
          <div className="text-tech-grey text-xs font-bold mb-4 uppercase tracking-wider">
            {'//'} DESKTOP ONLY
          </div>

          <h2 className="text-tech-white text-xl font-bold mb-4 terminal-text">
            OVNI EXPLORER
          </h2>

          <p className="text-tech-dim text-sm mb-6 leading-relaxed">
            Cette application nécessite un écran plus large pour une expérience optimale.
          </p>

          <div className="border-t border-tech pt-6">
            <p className="text-tech-grey text-xs">
              &gt; Veuillez utiliser un ordinateur ou une tablette
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
