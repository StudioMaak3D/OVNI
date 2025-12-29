'use client';

import type { CasAvecTemoignages } from '@/lib/dataParser';
import { getClassificationLabel, getClassificationColor } from '@/lib/mapUtils';
import '@/styles/technical-map.css';

interface ResultsListProps {
  results: CasAvecTemoignages[];
  onSelectCas: (cas: CasAvecTemoignages) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export default function ResultsList({
  results,
  onSelectCas,
  sortBy,
  onSortChange,
}: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="bg-tech-dark border-tech p-8 text-center">
        <div className="text-tech-grey text-xs font-bold mb-2 uppercase tracking-wider">
          // NO RESULTS FOUND
        </div>
        <p className="text-tech-dim text-xs">
          &gt; MODIFY SEARCH PARAMETERS
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with sort and count */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-tech-white text-xs case-count">
          RESULTS: {results.length.toString().padStart(4, '0')} CASES FOUND
        </div>
        <div className="flex items-center gap-2">
          <label className="text-tech-grey text-xs uppercase">
            SORT BY:
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="terminal-input text-xs"
          >
            <option value="date-desc">DATE (NEWEST)</option>
            <option value="date-asc">DATE (OLDEST)</option>
            <option value="classification">CLASSIFICATION</option>
            <option value="region">REGION</option>
            <option value="temoignages">TESTIMONIES COUNT</option>
          </select>
        </div>
      </div>

      {/* Results list */}
      <div className="space-y-4">
        {results.map((cas, index) => (
          <div
            key={`${cas.id}-${index}`}
            className="bg-tech-darker border border-tech p-4 cursor-pointer transition-all hover:border-tech-bright hover:bg-opacity-70"
            onClick={() => onSelectCas(cas)}
            style={{
              backgroundColor: '#0a0a0a',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0a0a0a';
            }}
          >
            {/* Header line */}
            <div className="text-tech-grey text-xs font-mono mb-2">
              [CAS {cas.id}] • {cas.date} • {cas.region.toUpperCase()}
            </div>

            {/* Divider */}
            <div className="border-t border-tech my-2"></div>

            {/* Metadata */}
            <div className="flex items-center gap-4 mb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-tech-dim uppercase">CLASSIFICATION:</span>
                <span
                  className="classification-badge"
                  style={{
                    color: getClassificationColor(cas.classification),
                    borderColor: getClassificationColor(cas.classification)
                  }}
                >
                  [{cas.classification}]
                </span>
                <span className="text-tech-dim">
                  {getClassificationLabel(cas.classification)}
                </span>
              </div>
              {cas.temoignages.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-tech-dim uppercase">TESTIMONIES:</span>
                  <span className="text-tech-white case-count">
                    {cas.temoignages.length.toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-tech my-2"></div>

            {/* Summary */}
            {cas.resumeCourt && (
              <p className="text-tech-white text-sm leading-relaxed mb-3 text-body line-clamp-2">
                {cas.resumeCourt}
              </p>
            )}

            {/* View details button */}
            <div className="flex justify-end">
              <button
                className="terminal-button text-xs px-4 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCas(cas);
                }}
              >
                [VIEW DETAILS →]
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
