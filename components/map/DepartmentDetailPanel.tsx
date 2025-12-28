'use client';

import { useState } from 'react';
import type { DepartmentData } from '@/lib/mapDataAggregator';
import type { CasAvecTemoignages } from '@/lib/dataParser';
import { getDepartmentName, getClassificationColor } from '@/lib/mapUtils';
import CasDetailModal from '@/components/CasDetailModal';
import '@/styles/technical-map.css';

interface DepartmentDetailPanelProps {
  departmentCode: string | null;
  departmentData: Map<string, DepartmentData>;
  onClose: () => void;
}

export default function DepartmentDetailPanel({
  departmentCode,
  departmentData,
  onClose,
}: DepartmentDetailPanelProps) {
  const [selectedCas, setSelectedCas] = useState<CasAvecTemoignages | null>(null);

  if (!departmentCode) return null;

  const data = departmentData.get(departmentCode);
  if (!data) return null;

  const deptName = getDepartmentName(departmentCode);

  return (
    <>
      <div className="detail-panel fixed right-0 top-16 w-full md:w-96 z-40 h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="detail-panel-header">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-tech-white font-bold text-lg mb-1">
                DÉPARTEMENT [{departmentCode}]
              </div>
              <div className="text-tech-grey text-sm">{deptName}</div>
            </div>
            <button
              onClick={onClose}
              className="terminal-button text-xs px-3 py-1"
              aria-label="Close panel"
            >
              [X]
            </button>
          </div>

          {/* Statistics */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-tech-grey">Total Observations:</span>
              <span className="text-tech-white case-count">
                {data.totalCases.toString().padStart(4, '0')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tech-grey">Testimonies:</span>
              <span className="text-tech-white case-count">
                {data.cases.reduce((sum, cas) => sum + cas.temoignages.length, 0)}
              </span>
            </div>
          </div>

          {/* Classification breakdown */}
          <div className="mt-4">
            <div className="text-tech-grey text-xs mb-2">CLASSIFICATIONS</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.byClassification).map(([classification, count]) => (
                <div
                  key={classification}
                  className="flex items-center gap-2 text-xs"
                >
                  <span className={`classification-badge classification-${classification}`}>
                    [{classification}]
                  </span>
                  <span className="text-tech-white case-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cases list */}
        <div className="px-6 pb-6">
          <div className="text-tech-grey text-xs mb-3 uppercase">
            Observations ({data.cases.length})
          </div>
          <div className="space-y-3">
            {data.cases
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((cas) => (
                <button
                  key={cas.id}
                  onClick={() => setSelectedCas(cas)}
                  className="w-full text-left border border-tech p-3 hover:border-tech-bright hover:bg-white hover:bg-opacity-5 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-tech-white text-sm font-bold truncate flex-1">
                      {cas.titre}
                    </div>
                    <span
                      className={`classification-badge classification-${cas.classification} flex-shrink-0`}
                    >
                      [{cas.classification}]
                    </span>
                  </div>
                  <div className="text-tech-dim text-xs mb-1">{cas.date}</div>
                  {cas.resumeCourt && (
                    <div className="text-tech-grey text-xs line-clamp-2">
                      {cas.resumeCourt}
                    </div>
                  )}
                  <div className="text-tech-dim text-xs mt-2">
                    {cas.temoignages.length} témoignage
                    {cas.temoignages.length > 1 ? 's' : ''}
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Case detail modal */}
      {selectedCas && (
        <CasDetailModal
          cas={selectedCas}
          onClose={() => setSelectedCas(null)}
        />
      )}
    </>
  );
}
