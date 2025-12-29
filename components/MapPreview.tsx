'use client';

import type { CasAvecTemoignages } from '@/lib/dataParser';
import { aggregateCasesByDepartment, getMaxCaseCount } from '@/lib/mapDataAggregator';
import { createLinearColorScale } from '@/lib/mapUtils';
import { useMemo } from 'react';
import Link from 'next/link';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import '@/styles/technical-map.css';

interface MapPreviewProps {
  data: CasAvecTemoignages[];
}

const geoUrl = '/geojson/france-departments.geojson';

export default function MapPreview({ data }: MapPreviewProps) {
  // Aggregate data by department
  const departmentData = useMemo(() => {
    return aggregateCasesByDepartment(data);
  }, [data]);

  const maxCases = useMemo(() => {
    return getMaxCaseCount(departmentData);
  }, [departmentData]);

  // Create color scale
  const colorScale = useMemo(() => {
    return createLinearColorScale(maxCases);
  }, [maxCases]);

  return (
    <div className="h-full flex flex-col">
      {/* Title and Button */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-tech-white uppercase tracking-wider terminal-text">
          CASE REPARTITION
        </h2>
        <Link href="/map">
          <span className="terminal-button inline-block px-6 py-2 text-xs">
            [VIEW FULL MAP →]
          </span>
        </Link>
      </div>

      <Link href="/map" className="block">
        <div className="relative bg-tech-darker overflow-hidden hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [2.5, 46.2],
              scale: 2200,
            }}
            width={800}
            height={600}
            className="w-full h-auto"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const code = geo.properties.code;
                  const deptInfo = departmentData.get(code);
                  const fillColor = deptInfo
                    ? colorScale(deptInfo.totalCases)
                    : '#111111';

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#CCCCCC"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: fillColor },
                        pressed: { outline: 'none', fill: fillColor },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </Link>
    </div>
  );
}
