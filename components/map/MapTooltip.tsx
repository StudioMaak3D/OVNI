'use client';

import { useEffect, useState } from 'react';
import type { DepartmentData } from '@/lib/mapDataAggregator';
import { getDepartmentName, getClassificationLabel } from '@/lib/mapUtils';
import '@/styles/technical-map.css';

interface MapTooltipProps {
  departmentCode: string | null;
  departmentData: Map<string, DepartmentData>;
  mousePosition: { x: number; y: number };
}

export default function MapTooltip({
  departmentCode,
  departmentData,
  mousePosition,
}: MapTooltipProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Smart positioning: avoid tooltip going off screen
    const tooltipWidth = 300; // approximate width
    const tooltipHeight = 250; // approximate height
    const offset = 20;
    const margin = 20; // safety margin from edges

    let x = mousePosition.x + offset;
    let y = mousePosition.y + offset;

    // If too far right, show on left of cursor
    if (x + tooltipWidth + margin > window.innerWidth) {
      x = mousePosition.x - tooltipWidth - offset;
    }

    // If still too far left after adjustment, clamp it
    if (x < margin) {
      x = margin;
    }

    // If too far down, show above cursor
    if (y + tooltipHeight + margin > window.innerHeight) {
      y = mousePosition.y - tooltipHeight - offset;
    }

    // If still too far up after adjustment, clamp it
    if (y < margin) {
      y = margin;
    }

    setPosition({ x, y });
  }, [mousePosition]);

  if (!departmentCode) return null;

  const data = departmentData.get(departmentCode);
  if (!data) return null;

  const deptName = getDepartmentName(departmentCode);

  return (
    <div
      className="map-tooltip"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="text-tech-white font-bold mb-2">
        &gt; DÉPARTEMENT_{departmentCode.padEnd(3, '_')}
      </div>
      <div className="text-tech-grey text-xs mb-3">{deptName}</div>

      <div className="space-y-1">
        <div className="text-tech-white">
          <span className="text-tech-grey">OBSERVATIONS:</span>{' '}
          <span className="case-count">
            {data.totalCases.toString().padStart(4, '0')}
          </span>
        </div>

        {Object.keys(data.byClassification).length > 0 && (
          <>
            <div className="text-tech-grey text-xs mt-2 mb-1">
              CLASSIFICATION_BREAKDOWN:
            </div>
            <div className="ml-4 space-y-0.5 text-xs">
              {Object.entries(data.byClassification)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([classification, count]) => (
                  <div key={classification} className="flex items-center gap-2">
                    <span className={`classification-badge classification-${classification}`}>
                      [{classification}]
                    </span>
                    <span className="text-tech-white case-count">
                      {count.toString().padStart(3, '0')}
                    </span>
                    <span className="text-tech-dim text-xs">
                      {getClassificationLabel(classification)}
                    </span>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      <div className="text-xs text-tech-grey mt-3 animate-pulse">
        &gt; CLICK_FOR_DETAILS_
      </div>
    </div>
  );
}
