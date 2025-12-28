'use client';

import { CasAvecTemoignages } from '@/lib/dataParser';

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
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Aucun résultat trouvé. Essayez de modifier vos critères de recherche.
      </div>
    );
  }

  const getClassificationBadgeColor = (classification: string) => {
    switch (classification.toUpperCase()) {
      case 'A':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'B':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'C':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'D':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div>
      {/* Barre de tri et nombre de résultats */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {results.length} résultat{results.length > 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Trier par:
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="date-desc">Date (récent)</option>
            <option value="date-asc">Date (ancien)</option>
            <option value="classification">Classification</option>
            <option value="region">Région</option>
            <option value="temoignages">Nb. témoignages</option>
          </select>
        </div>
      </div>

      {/* Liste des résultats */}
      <div className="space-y-4">
        {results.map((cas, index) => (
          <div
            key={`${cas.id}-${index}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelectCas(cas)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {cas.titre}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cas.date} • {cas.region} {cas.departement && `(${cas.departement})`}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getClassificationBadgeColor(
                    cas.classification
                  )}`}
                >
                  Classe {cas.classification}
                </span>
                {cas.temoignages.length > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {cas.temoignages.length} témoignage{cas.temoignages.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {cas.resumeCourt && (
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {cas.resumeCourt}
              </p>
            )}

            <button
              className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCas(cas);
              }}
            >
              Voir les détails →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
