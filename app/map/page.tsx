'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { CasAvecTemoignages } from '@/lib/dataParser';
import { parseProductionCSV } from '@/lib/dataParser';
import {
  aggregateCasesByDepartment,
  filterCases,
  getMaxCaseCount,
  type DepartmentData,
} from '@/lib/mapDataAggregator';
import MapContainer from '@/components/map/MapContainer';
import FranceMap from '@/components/map/FranceMap';
import TechnicalGrid from '@/components/map/TechnicalGrid';
import MapLegend from '@/components/map/MapLegend';
import MapControls, { type MapFilters } from '@/components/map/MapControls';
import MapTooltip from '@/components/map/MapTooltip';
import DepartmentDetailPanel from '@/components/map/DepartmentDetailPanel';
import CasDetailModal from '@/components/CasDetailModal';
import Link from 'next/link';
import '@/styles/technical-map.css';

function MapPageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<CasAvecTemoignages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedCas, setSelectedCas] = useState<CasAvecTemoignages | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [filters, setFilters] = useState<MapFilters>({
    classifications: [],
    yearRange: [1937, 2024],
  });

  // Load data from CSV file
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/data/geipan_case_ovni_production.csv');
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }

        const csvContent = await response.text();
        const parsedData = parseProductionCSV(csvContent);
        setData(parsedData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle case parameter from URL
  useEffect(() => {
    const caseId = searchParams.get('case');
    if (caseId && data.length > 0) {
      const cas = data.find(c => c.id === caseId);
      if (cas) {
        setSelectedCas(cas);
      }
    }
  }, [searchParams, data]);

  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Filter and aggregate data
  const departmentData = useMemo(() => {
    const filtered = filterCases(data, filters);
    return aggregateCasesByDepartment(filtered);
  }, [data, filters]);

  const maxCases = useMemo(() => {
    return getMaxCaseCount(departmentData);
  }, [departmentData]);

  const handleDepartmentClick = (code: string) => {
    setSelectedDepartment(code);
    setHoveredDepartment(null); // Clear hover when selecting
  };

  const handleDepartmentHover = (code: string | null) => {
    if (!selectedDepartment) {
      // Only show hover if no department is selected
      setHoveredDepartment(code);
    }
  };

  return (
    <main className="technical-map min-h-screen">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-tech-dark border-b border-tech flex items-center justify-between px-6 py-3">
        <div className="text-tech-white font-bold text-lg terminal-text">
          OVNI EXPLORER // MAP
        </div>
        <div className="flex gap-4">
          <Link href="/" className="nav-link">
            [DASHBOARD]
          </Link>
          <Link href="/map/list" className="nav-link">
            [LIST VIEW]
          </Link>
          <Link href="/map" className="nav-link nav-link-active">
            [MAP VIEW]
          </Link>
        </div>
      </nav>

      {/* Main content with top padding for fixed nav */}
      <div className="pt-16 h-screen flex">
        {/* Left sidebar - Controls */}
        <aside className="w-80 border-r border-tech overflow-y-auto bg-tech-dark">
          <MapControls filters={filters} onFiltersChange={setFilters} />
          <div className="border-t border-tech mt-6">
            <MapLegend departmentData={departmentData} maxCases={maxCases} />
          </div>

          {/* About section */}
          <div className="border-t border-tech mt-6 p-6">
            <div className="text-tech-grey text-xs font-bold mb-3 uppercase tracking-wider">
              About this visualization
            </div>
            <p className="text-tech-dim text-xs leading-relaxed mb-3">
              This map displays {Array.from(departmentData.values()).reduce((sum, dept) => sum + dept.totalCases, 0).toLocaleString()} OVNI observations reported in France and collected by GEIPAN (Groupe d&apos;Études et d&apos;Informations sur les Phénomènes Aérospatiaux Non-identifiés).
            </p>
            <p className="text-tech-dim text-xs leading-relaxed">
              Each department is shaded according to the number of reported cases. Hover over a department to see details, or click to explore individual observations.
            </p>
          </div>
        </aside>

        {/* Main map area */}
        <div className="flex-1 relative">
          <MapContainer loading={loading} error={error}>
            {!loading && !error && (
              <>
                {/* Technical grid overlay - behind the map */}
                <div className="absolute inset-0" style={{ zIndex: 0 }}>
                  <TechnicalGrid />
                </div>

                {/* Map */}
                <div className="absolute inset-0" style={{ zIndex: 1 }}>
                  <FranceMap
                    departmentData={departmentData}
                    onDepartmentClick={handleDepartmentClick}
                    onDepartmentHover={handleDepartmentHover}
                    hoveredDepartment={hoveredDepartment}
                    selectedDepartment={selectedDepartment}
                  />
                </div>

                {/* Tooltip */}
                <MapTooltip
                  departmentCode={hoveredDepartment}
                  departmentData={departmentData}
                  mousePosition={mousePosition}
                />
              </>
            )}
          </MapContainer>
        </div>

        {/* Right panel - Department details */}
        {selectedDepartment && (
          <DepartmentDetailPanel
            departmentCode={selectedDepartment}
            departmentData={departmentData}
            onClose={() => setSelectedDepartment(null)}
          />
        )}
      </div>

      {/* Case Detail Modal */}
      {selectedCas && (
        <CasDetailModal
          cas={selectedCas}
          onClose={() => setSelectedCas(null)}
        />
      )}
    </main>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-tech-dark flex items-center justify-center text-tech-white">Loading...</div>}>
      <MapPageContent />
    </Suspense>
  );
}
