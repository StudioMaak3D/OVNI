'use client';

import type { CasAvecTemoignages } from '@/lib/dataParser';
import { aggregateCasesByDepartment } from '@/lib/mapDataAggregator';
import { getClassificationLabel, getClassificationColor, getDepartmentName } from '@/lib/mapUtils';
import { useMemo } from 'react';
import '@/styles/technical-map.css';

interface DashboardStatsProps {
  data: CasAvecTemoignages[];
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    // Total cases and testimonies
    const totalCases = data.length;
    const totalTestimonies = data.reduce((sum, cas) => sum + cas.temoignages.length, 0);

    // Classification breakdown
    const classifications: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, D1: 0, NC: 0 };
    data.forEach(cas => {
      const key = cas.classification || 'NC';
      classifications[key] = (classifications[key] || 0) + 1;
    });

    // Year range
    const years = data.map(cas => {
      const parts = cas.date.split('/');
      return parseInt(parts[2]); // DD/MM/YYYY format
    }).filter(y => !isNaN(y));

    const minYear = years.length > 0 ? Math.min(...years) : 0;
    const maxYear = years.length > 0 ? Math.max(...years) : 0;
    const yearSpan = maxYear - minYear;

    // Top department
    const deptData = aggregateCasesByDepartment(data);
    const topDept = Array.from(deptData.values())
      .sort((a, b) => b.totalCases - a.totalCases)[0];

    return {
      totalCases,
      totalTestimonies,
      classifications,
      minYear,
      maxYear,
      yearSpan,
      topDept,
    };
  }, [data]);

  // Calculate max for bar chart scaling
  const maxClassificationCount = Math.max(
    ...Object.values(stats.classifications).filter((v, i) =>
      Object.keys(stats.classifications)[i] !== 'NC'
    )
  );

  return (
    <>
      {/* Classification Bar Chart */}
      <div className="control-panel bg-tech-dark border-tech">
        <div className="space-y-3">
          {Object.entries(stats.classifications)
            .filter(([key]) => key !== 'NC' || stats.classifications[key] > 0)
            .map(([classification, count]) => {
              const percentage = stats.totalCases > 0
                ? ((count / stats.totalCases) * 100).toFixed(1)
                : '0.0';
              const barWidth = maxClassificationCount > 0
                ? (count / maxClassificationCount) * 100
                : 0;

              return (
                <div key={classification}>
                  {/* Label and count */}
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="classification-badge"
                        style={{
                          color: getClassificationColor(classification),
                          borderColor: getClassificationColor(classification)
                        }}
                      >
                        [{classification}]
                      </span>
                      <span className="text-tech-dim">
                        {getClassificationLabel(classification)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-tech-white case-count">
                        {count.toString().padStart(4, '0')}
                      </span>
                      <span className="text-tech-grey w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-tech-darker border border-tech overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: getClassificationColor(classification),
                        opacity: 0.6
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

    </>
  );
}

// Export stats for use in parent component
export function useStats(data: CasAvecTemoignages[]) {
  return useMemo(() => {
    const totalCases = data.length;
    const totalTestimonies = data.reduce((sum, cas) => sum + cas.temoignages.length, 0);

    const years = data.map(cas => {
      const parts = cas.date.split('/');
      return parseInt(parts[2]);
    }).filter(y => !isNaN(y));

    const minYear = years.length > 0 ? Math.min(...years) : 0;
    const maxYear = years.length > 0 ? Math.max(...years) : 0;
    const yearSpan = maxYear - minYear;

    const deptData = aggregateCasesByDepartment(data);
    const topDept = Array.from(deptData.values())
      .sort((a, b) => b.totalCases - a.totalCases)[0];

    return {
      totalCases,
      totalTestimonies,
      minYear,
      maxYear,
      yearSpan,
      topDept,
    };
  }, [data]);
}
