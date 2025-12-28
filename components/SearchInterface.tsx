'use client';

import { useState } from 'react';

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

  const [showFilters, setShowFilters] = useState(false);

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        {/* Barre de recherche principale */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher par titre, description, localisation..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Bouton pour afficher/masquer les filtres */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Réinitialiser
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Classification */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Classification
              </label>
              <div className="space-y-2">
                {['A', 'B', 'C', 'D'].map((classification) => (
                  <label key={classification} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.classification.includes(classification)}
                      onChange={() => handleClassificationToggle(classification)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Classe {classification}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Région */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Région
              </label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Toutes les régions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Département */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Département
              </label>
              <select
                value={filters.departement}
                onChange={(e) => setFilters({ ...filters, departement: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Tous les départements</option>
                {departements.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Forme */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Forme du phénomène
              </label>
              <select
                value={filters.forme}
                onChange={(e) => setFilters({ ...filters, forme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Toutes les formes</option>
                {formes.map((forme) => (
                  <option key={forme} value={forme}>
                    {forme}
                  </option>
                ))}
              </select>
            </div>

            {/* Couleur */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Couleur
              </label>
              <select
                value={filters.couleur}
                onChange={(e) => setFilters({ ...filters, couleur: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Toutes les couleurs</option>
                {couleurs.map((couleur) => (
                  <option key={couleur} value={couleur}>
                    {couleur}
                  </option>
                ))}
              </select>
            </div>

            {/* Période */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Période
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Année début"
                  value={filters.anneeDebut}
                  onChange={(e) => setFilters({ ...filters, anneeDebut: e.target.value })}
                  className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  min="1900"
                  max="2100"
                />
                <input
                  type="number"
                  placeholder="Année fin"
                  value={filters.anneeFin}
                  onChange={(e) => setFilters({ ...filters, anneeFin: e.target.value })}
                  className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  min="1900"
                  max="2100"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
