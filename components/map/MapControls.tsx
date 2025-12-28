'use client';

import { useState } from 'react';
import { getClassificationLabel } from '@/lib/mapUtils';
import '@/styles/technical-map.css';

export interface MapFilters {
  classifications: string[];
  yearRange: [number, number];
}

interface MapControlsProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
}

const CLASSIFICATIONS = ['A', 'B', 'C', 'D', 'D1'];
const MIN_YEAR = 1937;
const MAX_YEAR = 2024;

export default function MapControls({ filters, onFiltersChange }: MapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleClassification = (classification: string) => {
    const newClassifications = filters.classifications.includes(classification)
      ? filters.classifications.filter((c) => c !== classification)
      : [...filters.classifications, classification];

    onFiltersChange({
      ...filters,
      classifications: newClassifications,
    });
  };

  const handleYearChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.yearRange];
    newRange[index] = value;

    // Ensure min <= max
    if (newRange[0] > newRange[1]) {
      if (index === 0) {
        newRange[1] = newRange[0];
      } else {
        newRange[0] = newRange[1];
      }
    }

    onFiltersChange({
      ...filters,
      yearRange: newRange,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      classifications: [],
      yearRange: [MIN_YEAR, MAX_YEAR],
    });
  };

  const hasActiveFilters =
    filters.classifications.length > 0 ||
    filters.yearRange[0] !== MIN_YEAR ||
    filters.yearRange[1] !== MAX_YEAR;

  return (
    <div className="control-panel">
      <div className="flex items-center justify-between mb-2">
        <div className="control-panel-header mb-0">FILTERS</div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="terminal-button text-xs px-2 py-1"
        >
          {isExpanded ? '[-]' : '[+]'}
        </button>
      </div>
      <p className="text-tech-dim text-xs mb-4 leading-relaxed">
        Filter observations by classification type and year range
      </p>

      {isExpanded && (
        <div className="space-y-6">
          {/* Classification filters */}
          <div>
            <div className="text-tech-grey text-xs mb-3">CLASSIFICATION</div>
            <div className="space-y-2">
              {CLASSIFICATIONS.map((classification) => (
                <label
                  key={classification}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white hover:bg-opacity-5 p-1 transition"
                >
                  <input
                    type="checkbox"
                    className="terminal-checkbox"
                    checked={filters.classifications.includes(classification)}
                    onChange={() => toggleClassification(classification)}
                  />
                  <span className={`classification-badge classification-${classification} text-xs`}>
                    [{classification}]
                  </span>
                  <span className="text-tech-dim text-xs">
                    {getClassificationLabel(classification)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Year range filter */}
          <div>
            <div className="text-tech-grey text-xs mb-2">
              YEAR RANGE: {filters.yearRange[0]} - {filters.yearRange[1]}
            </div>
            <div className="relative pt-2 pb-4">
              {/* Min slider */}
              <input
                type="range"
                min={MIN_YEAR}
                max={MAX_YEAR}
                value={filters.yearRange[0]}
                onChange={(e) => handleYearChange(0, parseInt(e.target.value))}
                className="absolute w-full accent-white pointer-events-auto"
                style={{ zIndex: filters.yearRange[0] > MAX_YEAR - 10 ? 2 : 1 }}
              />
              {/* Max slider */}
              <input
                type="range"
                min={MIN_YEAR}
                max={MAX_YEAR}
                value={filters.yearRange[1]}
                onChange={(e) => handleYearChange(1, parseInt(e.target.value))}
                className="absolute w-full accent-white pointer-events-auto"
                style={{ zIndex: filters.yearRange[1] < MIN_YEAR + 10 ? 2 : 1 }}
              />
              {/* Visual range indicator */}
              <div className="relative w-full h-1 bg-tech-dim rounded mt-2">
                <div
                  className="absolute h-1 bg-white rounded"
                  style={{
                    left: `${((filters.yearRange[0] - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
                    right: `${100 - ((filters.yearRange[1] - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="terminal-button w-full text-xs"
            >
              [RESET FILTERS]
            </button>
          )}
        </div>
      )}

      {/* Filter summary when collapsed */}
      {!isExpanded && hasActiveFilters && (
        <div className="text-tech-dim text-xs">
          {filters.classifications.length > 0 && (
            <div>Classifications: {filters.classifications.join(', ')}</div>
          )}
          {(filters.yearRange[0] !== MIN_YEAR || filters.yearRange[1] !== MAX_YEAR) && (
            <div>
              Years: {filters.yearRange[0]} - {filters.yearRange[1]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
