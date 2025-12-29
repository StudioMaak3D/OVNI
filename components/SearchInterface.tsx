'use client';

import { useState } from 'react';
import { getClassificationLabel, getClassificationColor } from '@/lib/mapUtils';
import '@/styles/technical-map.css';

export type SearchFilters = {
  query: string;
  classification: string[];
  region: string;
  departement: string;
  forme: string;
  couleur: string;
  anneeDebut: string;
  anneeFin: string;
};

interface SearchInterfaceProps {
  onSearch: (filters: SearchFilters) => void;
  regions: string[];
  departements: string[];
  formes: string[];
  couleurs: string[];
}

export default function SearchInterface({
  onSearch,
  regions,
  departements,
  formes,
  couleurs,
}: SearchInterfaceProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    classification: [],
    region: '',
    departement: '',
    forme: '',
    couleur: '',
    anneeDebut: '',
    anneeFin: '',
  });

  const [showFilters, setShowFilters] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClassificationToggle = (classification: string) => {
    setFilters(prev => ({
      ...prev,
      classification: prev.classification.includes(classification)
        ? prev.classification.filter(c => c !== classification)
        : [...prev.classification, classification],
    }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      classification: [],
      region: '',
      departement: '',
      forme: '',
      couleur: '',
      anneeDebut: '',
      anneeFin: '',
    });
    onSearch({
      query: '',
      classification: [],
      region: '',
      departement: '',
      forme: '',
      couleur: '',
      anneeDebut: '',
      anneeFin: '',
    });
  };

  const hasActiveFilters =
    filters.classification.length > 0 ||
    filters.region !== '' ||
    filters.departement !== '' ||
    filters.forme !== '' ||
    filters.couleur !== '' ||
    filters.anneeDebut !== '' ||
    filters.anneeFin !== '';

  return (
    <div className="mb-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="text-tech-white text-lg font-bold uppercase tracking-wider">
            {'//'} SEARCH
          </div>
        </div>

        {/* Main search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="SEARCH: TITLE, DESCRIPTION, LOCATION..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="terminal-input w-full text-sm max-w-xl mx-auto block"
          />
        </div>

        {/* Filter buttons - centered under input */}
        <div className="flex gap-3 mb-6 items-center justify-center">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="terminal-button-small text-xs px-2 py-1"
          >
            {showFilters ? '[HIDE FILTERS]' : '[FILTERS]'}
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="terminal-button-small text-xs px-2 py-1"
            >
              [RESET]
            </button>
          )}
        </div>

        {/* Search button - centered below */}
        <div className="flex justify-center mb-8">
          <button
            type="submit"
            className="terminal-button-white text-sm px-8 py-3"
          >
            [SEARCH]
          </button>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-tech">
            {/* Classification */}
            <div>
              <label className="text-tech-white text-sm font-bold uppercase tracking-wider block mb-3">
                CLASSIFICATION:
              </label>
              <div className="space-y-2">
                {['A', 'B', 'C', 'D', 'D1'].map((classification) => (
                  <label
                    key={classification}
                    className="flex items-center gap-2 cursor-pointer hover:bg-white hover:bg-opacity-5 p-1 transition"
                  >
                    <input
                      type="checkbox"
                      checked={filters.classification.includes(classification)}
                      onChange={() => handleClassificationToggle(classification)}
                      className="terminal-checkbox"
                    />
                    <span
                      className="classification-badge text-sm"
                      style={{
                        color: getClassificationColor(classification),
                        borderColor: getClassificationColor(classification)
                      }}
                    >
                      [{classification}]
                    </span>
                    <span className="text-tech-grey text-sm">
                      {getClassificationLabel(classification)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="text-tech-white text-sm font-bold uppercase tracking-wider block mb-3">
                RÉGION:
              </label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="terminal-input w-full text-sm"
              >
                <option value="">TOUTES LES RÉGIONS</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Departement */}
            <div>
              <label className="text-tech-white text-sm font-bold uppercase tracking-wider block mb-3">
                DÉPARTEMENT:
              </label>
              <select
                value={filters.departement}
                onChange={(e) => setFilters({ ...filters, departement: e.target.value })}
                className="terminal-input w-full text-sm"
              >
                <option value="">TOUS LES DÉPARTEMENTS</option>
                {departements.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Forme */}
            <div>
              <label className="text-tech-white text-sm font-bold uppercase tracking-wider block mb-3">
                FORME:
              </label>
              <select
                value={filters.forme}
                onChange={(e) => setFilters({ ...filters, forme: e.target.value })}
                className="terminal-input w-full text-sm"
              >
                <option value="">TOUTES LES FORMES</option>
                {formes.map((forme) => (
                  <option key={forme} value={forme}>
                    {forme}
                  </option>
                ))}
              </select>
            </div>

            {/* Couleur */}
            <div>
              <label className="text-tech-white text-sm font-bold uppercase tracking-wider block mb-3">
                COULEUR:
              </label>
              <select
                value={filters.couleur}
                onChange={(e) => setFilters({ ...filters, couleur: e.target.value })}
                className="terminal-input w-full text-sm"
              >
                <option value="">TOUTES LES COULEURS</option>
                {couleurs.map((couleur) => (
                  <option key={couleur} value={couleur}>
                    {couleur}
                  </option>
                ))}
              </select>
            </div>

            {/* Year range */}
            <div>
              <label className="text-tech-white text-sm font-bold uppercase tracking-wider block mb-3">
                YEAR RANGE:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-tech-grey text-sm mb-1">FROM:</div>
                  <input
                    type="number"
                    placeholder="1937"
                    value={filters.anneeDebut}
                    onChange={(e) => setFilters({ ...filters, anneeDebut: e.target.value })}
                    className="terminal-input w-full text-sm"
                    min="1900"
                    max="2100"
                  />
                </div>
                <div>
                  <div className="text-tech-grey text-sm mb-1">TO:</div>
                  <input
                    type="number"
                    placeholder="2024"
                    value={filters.anneeFin}
                    onChange={(e) => setFilters({ ...filters, anneeFin: e.target.value })}
                    className="terminal-input w-full text-sm"
                    min="1900"
                    max="2100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter summary when collapsed */}
        {!showFilters && hasActiveFilters && (
          <div className="text-tech-grey text-sm pt-4 border-t border-tech">
            <div className="font-bold mb-2 text-tech-white">ACTIVE FILTERS:</div>
            {filters.classification.length > 0 && (
              <div>Classification: {filters.classification.join(', ')}</div>
            )}
            {filters.region && <div>Région: {filters.region}</div>}
            {filters.departement && <div>Département: {filters.departement}</div>}
            {filters.forme && <div>Forme: {filters.forme}</div>}
            {filters.couleur && <div>Couleur: {filters.couleur}</div>}
            {(filters.anneeDebut || filters.anneeFin) && (
              <div>
                Years: {filters.anneeDebut || '...'} - {filters.anneeFin || '...'}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
