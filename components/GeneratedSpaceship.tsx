'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { CasAvecTemoignages } from '@/lib/dataParser';
import { getClassificationColor } from '@/lib/mapUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { BASE_PATH } from '@/lib/config';
import AIInfoButton from '@/components/AIInfoButton';

interface GeneratedSpaceshipProps {
  caseId: string;
  data?: CasAvecTemoignages[];
}

export default function GeneratedSpaceship({ caseId, data }: GeneratedSpaceshipProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useLanguage();

  // Find case details if data is provided
  const caseData = data?.find(c => c.id === caseId);

  const imagePath = `${BASE_PATH}/vaisseaux/${caseId}.png`;

  return (
    <div className="relative h-full">
      <Link href={`/map?case=${caseId}`} className="block h-full cursor-pointer">
        <div className="control-panel bg-tech-dark border-tech overflow-hidden h-full flex flex-col hover:border-tech-bright transition-colors">
          <div className="flex items-center justify-between mb-3 pb-3">
          {caseData ? (
            <>
              <div>
                <div className="text-tech-dim text-xs uppercase tracking-wider mb-1">
                  {t('LIEU', 'LOCATION')}
                </div>
                <div className="text-tech-white text-xs">
                  {caseData.titre.split(' - ')[0]}
                </div>
              </div>
              <div className="text-right">
                <div className="text-tech-dim text-xs uppercase tracking-wider mb-1">
                  {t('CATÉGORIE', 'CATEGORY')}
                </div>
                <div
                  className="text-xs font-bold"
                  style={{ color: getClassificationColor(caseData.classification || 'NC') }}
                >
                  {caseData.classification || 'N/A'}
                </div>
              </div>
            </>
          ) : (
            <div className="text-tech-dim text-xs uppercase tracking-wider">
              {t('CAS', 'CASE')} {caseId}
            </div>
          )}
        </div>

      {/* Image Container */}
      <div className="relative w-full min-h-[200px] flex-[3] bg-black rounded overflow-hidden mb-3">
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-tech-grey text-xs mb-2">{t('IMAGE NON TROUVÉE', 'IMAGE NOT FOUND')}</div>
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

          {/* Case Number */}
          <div className="pt-2">
            <div className="text-tech-dim text-xs uppercase tracking-wider mb-1">
              {t('CAS ID', 'CASE ID')}
            </div>
            <div className="text-tech-grey text-xs font-mono">
              {caseId}
            </div>
          </div>
        </div>
      </Link>

      {/* AI Info Button - Outside Link, bottom right */}
      <div className="absolute bottom-3 right-3 z-10">
        <AIInfoButton type="image" />
      </div>
    </div>
  );
}
