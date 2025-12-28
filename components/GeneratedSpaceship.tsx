'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { CasAvecTemoignages } from '@/lib/dataParser';

interface GeneratedSpaceshipProps {
  caseId: string;
  data?: CasAvecTemoignages[];
}

export default function GeneratedSpaceship({ caseId, data }: GeneratedSpaceshipProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Find case details if data is provided
  const caseData = data?.find(c => c.cas_numero === caseId);

  const imagePath = `/vaisseaux/${caseId}.png`;

  return (
    <div className="control-panel bg-tech-dark border-tech overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-3">
        <div className="text-tech-dim text-xs uppercase tracking-wider">
          GENERATED SPACESHIP
        </div>
        <div className="text-tech-grey text-xs uppercase tracking-wider">
          AI RENDER
        </div>
      </div>

      {/* Image Container */}
      <div className="relative w-full flex-1 bg-black rounded overflow-hidden mb-4">
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-tech-grey text-xs mb-2">IMAGE NOT FOUND</div>
              <div className="text-tech-dim text-xs">{imagePath}</div>
            </div>
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="terminal-spinner"></div>
              </div>
            )}
            <Image
              src={imagePath}
              alt={`Generated spaceship for case ${caseId}`}
              fill
              className="object-contain"
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
              unoptimized
            />
          </>
        )}
      </div>

      {/* Case Info */}
      <div className="space-y-2">
        <div>
          <div className="text-tech-dim text-xs mb-1 uppercase tracking-wider">
            CASE ID
          </div>
          <div className="text-tech-white text-sm font-mono">
            {caseId}
          </div>
        </div>

        {caseData && (
          <>
            <div>
              <div className="text-tech-dim text-xs mb-1 uppercase tracking-wider">
                LOCATION
              </div>
              <div className="text-tech-white text-sm">
                {caseData.titre}
              </div>
            </div>

            <div>
              <div className="text-tech-dim text-xs mb-1 uppercase tracking-wider">
                DATE
              </div>
              <div className="text-tech-white text-sm">
                {new Date(caseData.date_observation).toLocaleDateString('fr-FR')}
              </div>
            </div>

            {caseData.temoignages && caseData.temoignages.length > 0 && (
              <div>
                <div className="text-tech-dim text-xs mb-1 uppercase tracking-wider">
                  DESCRIPTION
                </div>
                <div className="text-tech-grey text-xs max-h-20 overflow-y-auto">
                  {caseData.temoignages[0].forme_phenomene ||
                   caseData.temoignages[0].couleur ||
                   'No visual description available'}
                </div>
              </div>
            )}

            {caseData.classification && (
              <div className="pt-2 border-t border-tech">
                <div className="inline-block px-2 py-1 text-xs uppercase tracking-wider border border-tech">
                  <span className="text-tech-dim">CLASS:</span>{' '}
                  <span className={`font-bold ${
                    caseData.classification === 'D' ? 'text-red-400' :
                    caseData.classification === 'C' ? 'text-yellow-400' :
                    caseData.classification === 'B' ? 'text-blue-400' :
                    'text-green-400'
                  }`}>
                    {caseData.classification}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
