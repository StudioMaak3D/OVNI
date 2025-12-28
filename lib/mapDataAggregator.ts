import type { CasAvecTemoignages } from './dataParser';

export type DepartmentData = {
  code: string;
  name: string;
  totalCases: number;
  byClassification: Record<string, number>;
  cases: CasAvecTemoignages[];
};

/**
 * Normalizes department codes for consistent matching with GeoJSON
 * Examples: "6" → "06", "2A" → "2A", "75" → "75"
 */
export function normalizeDepartmentCode(code: string): string {
  const trimmed = code.trim().toUpperCase();

  // Handle Corsica special cases: 2A (Corse-du-Sud), 2B (Haute-Corse)
  if (trimmed === '2A' || trimmed === '2B') {
    return trimmed;
  }

  // Handle overseas departments (3-digit codes like "972", "973", etc.)
  if (trimmed.length === 3 && /^\d{3}$/.test(trimmed)) {
    return trimmed;
  }

  // Pad single-digit departments with leading zero: "6" → "06"
  if (/^\d+$/.test(trimmed)) {
    return trimmed.padStart(2, '0');
  }

  return trimmed;
}

/**
 * Aggregates cases by French department code
 * Returns a Map where key is normalized department code and value contains aggregated data
 */
export function aggregateCasesByDepartment(
  cases: CasAvecTemoignages[]
): Map<string, DepartmentData> {
  const aggregation = new Map<string, DepartmentData>();

  for (const cas of cases) {
    const code = normalizeDepartmentCode(cas.departement);

    // Skip if no valid department code
    if (!code) continue;

    if (!aggregation.has(code)) {
      aggregation.set(code, {
        code,
        name: cas.region || 'Unknown',
        totalCases: 0,
        byClassification: {},
        cases: [],
      });
    }

    const dept = aggregation.get(code)!;
    dept.totalCases++;

    // Count by classification
    const classification = cas.classification || 'NC';
    dept.byClassification[classification] =
      (dept.byClassification[classification] || 0) + 1;

    dept.cases.push(cas);
  }

  return aggregation;
}

/**
 * Filters cases based on classification and year range before aggregation
 */
export function filterCases(
  cases: CasAvecTemoignages[],
  filters: {
    classifications?: string[];
    yearRange?: [number, number];
  }
): CasAvecTemoignages[] {
  let filtered = cases;

  // Filter by classification
  if (filters.classifications && filters.classifications.length > 0) {
    filtered = filtered.filter(cas =>
      filters.classifications!.includes(cas.classification)
    );
  }

  // Filter by year range
  if (filters.yearRange) {
    const [minYear, maxYear] = filters.yearRange;
    filtered = filtered.filter(cas => {
      // Parse date in format DD/MM/YYYY or YYYY-MM-DD
      let year: number;
      if (cas.date.includes('/')) {
        // Format: DD/MM/YYYY
        const parts = cas.date.split('/');
        year = parseInt(parts[2]);
      } else if (cas.date.includes('-')) {
        // Format: YYYY-MM-DD
        year = parseInt(cas.date.split('-')[0]);
      } else {
        return true; // If can't parse, include it
      }
      return year >= minYear && year <= maxYear;
    });
  }

  return filtered;
}

/**
 * Gets the maximum case count among all departments (useful for color scaling)
 */
export function getMaxCaseCount(departmentData: Map<string, DepartmentData>): number {
  let max = 0;
  for (const dept of departmentData.values()) {
    if (dept.totalCases > max) {
      max = dept.totalCases;
    }
  }
  return max || 1; // Return at least 1 to avoid division by zero
}

/**
 * Gets statistics about the aggregated data
 */
export function getDepartmentStats(departmentData: Map<string, DepartmentData>) {
  const totalDepartments = departmentData.size;
  let totalCases = 0;
  let maxCases = 0;
  let maxDeptCode = '';

  for (const [code, dept] of departmentData.entries()) {
    totalCases += dept.totalCases;
    if (dept.totalCases > maxCases) {
      maxCases = dept.totalCases;
      maxDeptCode = code;
    }
  }

  return {
    totalDepartments,
    totalCases,
    maxCases,
    maxDeptCode,
    avgCasesPerDept: totalCases / totalDepartments,
  };
}
