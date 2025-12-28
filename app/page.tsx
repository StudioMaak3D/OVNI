'use client';

import { useState, useEffect, useMemo } from 'react';
import { CasAvecTemoignages } from '@/lib/dataParser';
import SearchInterface, { SearchFilters } from '@/components/SearchInterface';
import ResultsList from '@/components/ResultsList';
import CasDetailModal from '@/components/CasDetailModal';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState<CasAvecTemoignages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedCas, setSelectedCas] = useState<CasAvecTemoignages | null>(null);

  // Charger les données au montage
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Erreur lors du chargement des données');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Extraire les valeurs uniques pour les filtres
  const filterOptions = useMemo(() => {
    const regions = new Set<string>();
    const departements = new Set<string>();
    const formes = new Set<string>();
    const couleurs = new Set<string>();

    data.forEach((cas) => {
      if (cas.region) regions.add(cas.region);
      if (cas.departement) departements.add(cas.departement);
      cas.temoignages.forEach((t) => {
        if (t.forme && t.forme !== 'Non précisé') formes.add(t.forme);
        if (t.couleur && t.couleur !== 'Non précisé') couleurs.add(t.couleur);
      });
    });

    return {
      regions: Array.from(regions).sort(),
      departements: Array.from(departements).sort(),
      formes: Array.from(formes).sort(),
      couleurs: Array.from(couleurs).sort(),
    };
  }, [data]);

  // Filtrer les résultats
  const filteredResults = useMemo(() => {
    let results = [...data];

    // Filtre de recherche textuelle
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (cas) =>
          cas.titre.toLowerCase().includes(query) ||
          cas.resumeCourt.toLowerCase().includes(query) ||
          cas.descriptionDetaillee.toLowerCase().includes(query) ||
          cas.region.toLowerCase().includes(query)
      );
    }

    // Filtre par classification
    if (filters.classification.length > 0) {
      results = results.filter((cas) =>
        filters.classification.includes(cas.classification)
      );
    }

    // Filtre par région
    if (filters.region) {
      results = results.filter((cas) => cas.region === filters.region);
    }

    // Filtre par département
    if (filters.departement) {
      results = results.filter((cas) => cas.departement === filters.departement);
    }

    // Filtre par forme
    if (filters.forme) {
      results = results.filter((cas) =>
        cas.temoignages.some((t) => t.forme === filters.forme)
      );
    }

    // Filtre par couleur
    if (filters.couleur) {
      results = results.filter((cas) =>
        cas.temoignages.some((t) => t.couleur === filters.couleur)
      );
    }

    // Filtre par période
    if (filters.anneeDebut || filters.anneeFin) {
      results = results.filter((cas) => {
        const year = parseInt(cas.date.split('/')[2]);
        const debut = filters.anneeDebut ? parseInt(filters.anneeDebut) : 0;
        const fin = filters.anneeFin ? parseInt(filters.anneeFin) : 9999;
        return year >= debut && year <= fin;
      });
    }

    return results;
  }, [data, filters]);

  // Trier les résultats
  const sortedResults = useMemo(() => {
    const results = [...filteredResults];

    switch (sortBy) {
      case 'date-desc':
        return results.sort((a, b) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        });
      case 'date-asc':
        return results.sort((a, b) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          return dateA.getTime() - dateB.getTime();
        });
      case 'classification':
        return results.sort((a, b) =>
          a.classification.localeCompare(b.classification)
        );
      case 'region':
        return results.sort((a, b) => a.region.localeCompare(b.region));
      case 'temoignages':
        return results.sort(
          (a, b) => b.temoignages.length - a.temoignages.length
        );
      default:
        return results;
    }
  }, [filteredResults, sortBy]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Chargement des données GEIPAN...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
            <p className="font-bold">Erreur</p>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            GEIPAN
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
            >
              LIST VIEW
            </Link>
            <Link
              href="/map"
              className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              MAP VIEW
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-900 dark:text-white">
          Recherche d&apos;observations
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Explorez {data.length} cas d&apos;observations d&apos;OVNIs en France
        </p>

        <SearchInterface
          onSearch={setFilters}
          regions={filterOptions.regions}
          departements={filterOptions.departements}
          formes={filterOptions.formes}
          couleurs={filterOptions.couleurs}
        />

        <ResultsList
          results={sortedResults}
          onSelectCas={setSelectedCas}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <CasDetailModal cas={selectedCas} onClose={() => setSelectedCas(null)} />
      </div>
    </main>
  );
}
