'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useMemo } from 'react';
import type { DepartmentData } from '@/lib/mapDataAggregator';
import { createChoroplethColorScale } from '@/lib/mapUtils';
import { BASE_PATH } from '@/lib/config';

const geoUrl = `${BASE_PATH}/geojson/france-departments.geojson`;

interface FranceMapProps {
  departmentData: Map<string, DepartmentData>;
  onDepartmentClick?: (code: string) => void;
  onDepartmentHover?: (code: string | null) => void;
  hoveredDepartment?: string | null;
  selectedDepartment?: string | null;
  leftPanelVisible?: boolean;
  isLargeScreen?: boolean;
}

export default function FranceMap({
  departmentData,
  onDepartmentClick,
  onDepartmentHover,
  hoveredDepartment,
  selectedDepartment,
  leftPanelVisible = true,
  isLargeScreen = false,
}: FranceMapProps) {
  // Calculate color scale based on max cases
  const colorScale = useMemo(() => {
    const maxCases = Math.max(
      ...Array.from(departmentData.values()).map((d) => d.totalCases),
      1
    );
    return createChoroplethColorScale(maxCases);
  }, [departmentData]);

  // Calculate map center based on screen size and panel visibility
  const mapCenter: [number, number] = useMemo(() => {
    // On large screens (iMac), always use default center
    if (isLargeScreen) {
      return [2.5, 46.2];
    }

    // On smaller screens (laptop), shift left when left panel is hidden
    if (!leftPanelVisible) {
      return [5.0, 46.2]; // Shift map to appear more on the left
    }

    // Default center
    return [2.5, 46.2];
  }, [leftPanelVisible, isLargeScreen]);

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        center: mapCenter,
        scale: 1900,
      }}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const code = geo.properties.code;
            const data = departmentData.get(code);
            const isHovered = hoveredDepartment === code;
            const isSelected = selectedDepartment === code;

            // Determine fill color
            let fillColor = '#000000'; // Default black for no data
            if (data) {
              fillColor = colorScale(data.totalCases);
            }

            // Override for hover and selection states
            if (isSelected) {
              fillColor = '#FFFFFF';
            } else if (isHovered) {
              fillColor = '#DDDDDD';
            }

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fillColor}
                stroke={isSelected || isHovered ? '#FFFFFF' : '#666666'}
                strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.5}
                onMouseEnter={() => onDepartmentHover?.(code)}
                onMouseLeave={() => onDepartmentHover?.(null)}
                onClick={() => onDepartmentClick?.(code)}
                style={{
                  default: { outline: 'none' },
                  hover: {
                    outline: 'none',
                    cursor: 'pointer',
                  },
                  pressed: { outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
