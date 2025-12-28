'use client';

import { useState } from 'react';
import type { DepartmentData } from '@/lib/mapDataAggregator';
import { CLASSIFICATION_COLORS, getClassificationLabel } from '@/lib/mapUtils';
import '@/styles/technical-map.css';

interface MapLegendProps {
  departmentData: Map<string, DepartmentData>;
  maxCases: number;
}

export default function MapLegend({ departmentData, maxCases }: MapLegendProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Calculate total classification counts
  const classificationTotals: Record<string, number> = {};
  for (const dept of departmentData.values()) {
    for (const [classification, count] of Object.entries(dept.byClassification)) {
      classificationTotals[classification] = (classificationTotals[classification] || 0) + count;
    }
  }

  return (
    <div className="map-legend">
      <div className="flex items-center justify-between mb-2">
        <div className="control-panel-header text-xs mb-0">LEGEND</div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="terminal-button text-xs px-2 py-1"
        >
          {isExpanded ? '[-]' : '[+]'}
        </button>
      </div>
      <p className="text-tech-dim text-xs mb-4 leading-relaxed">
        Case density and classification breakdown
      </p>

      {isExpanded && (
        <>
          {/* Choropleth scale */}
          <div className="mb-4">
        <div className="text-tech-grey text-xs mb-2">CASE DENSITY</div>
        <div className="legend-gradient mb-1"></div>
        <div className="flex justify-between text-tech-dim text-xs">
          <span>0</span>
          <span>{maxCases}</span>
        </div>
      </div>

      {/* Classification breakdown */}
      <div>
        <div className="text-tech-grey text-xs mb-2">CLASSIFICATIONS</div>
        <div className="space-y-2">
          {Object.entries(CLASSIFICATION_COLORS).map(([classification, color]) => {
            const count = classificationTotals[classification] || 0;
            if (count === 0 && classification !== 'A' && classification !== 'B' && classification !== 'C' && classification !== 'D') {
              return null; // Skip classifications with 0 count except main ones
            }
            return (
              <div key={classification} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 border"
                  style={{ backgroundColor: color, borderColor: color }}
                />
                <span className={`classification-badge classification-${classification} text-xs`}>
                  [{classification}]
                </span>
                <span className="text-tech-white case-count">
                  {count.toString().padStart(4, '0')}
                </span>
                <span className="text-tech-dim text-xs flex-1 truncate">
                  {getClassificationLabel(classification)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total statistics */}
      <div className="mt-4 pt-4 border-t border-tech">
        <div className="text-tech-grey text-xs mb-1">TOTAL OBSERVATIONS</div>
        <div className="text-tech-white text-lg case-count">
          {Array.from(departmentData.values())
            .reduce((sum, dept) => sum + dept.totalCases, 0)
            .toString()
            .padStart(5, '0')}
        </div>
        <div className="text-tech-dim text-xs mt-1">
          Across {departmentData.size} departments
        </div>
      </div>
        </>
      )}
    </div>
  );
}
