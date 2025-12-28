'use client';

import { useState, useEffect, useMemo } from 'react';
import { CasAvecTemoignages } from '@/lib/dataParser';
import SearchInterface, { SearchFilters } from '@/components/SearchInterface';
import ResultsList from '@/components/ResultsList';
import CasDetailModal from '@/components/CasDetailModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/technical-map.css';

export default function ListView() {
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
  const pathname = usePathname();

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
      <main className="technical-map min-h-screen">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-tech-dark border-b border-tech flex items-center justify-between px-6 py-3">
          <div className="text-tech-white font-bold text-lg terminal-text">
            GEIPAN // LIST VIEW
          </div>
          <div className="flex gap-4">
            <Link href="/" className="nav-link">[DASHBOARD]</Link>
            <Link href="/map/list" className="nav-link nav-link-active">[LIST VIEW]</Link>
            <Link href="/map" className="nav-link">[MAP VIEW]</Link>
          </div>
        </nav>
        <div className="pt-16 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="terminal-spinner mx-auto mb-4"></div>
            <p className="text-tech-grey text-xs uppercase tracking-wider">
              LOADING DATA...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="technical-map min-h-screen">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-tech-dark border-b border-tech flex items-center justify-between px-6 py-3">
          <div className="text-tech-white font-bold text-lg terminal-text">
            GEIPAN // LIST VIEW
          </div>
          <div className="flex gap-4">
            <Link href="/" className="nav-link">[DASHBOARD]</Link>
            <Link href="/map/list" className="nav-link nav-link-active">[LIST VIEW]</Link>
            <Link href="/map" className="nav-link">[MAP VIEW]</Link>
          </div>
        </nav>
        <div className="pt-16 max-w-4xl mx-auto p-8">
          <div className="bg-tech-dark border-2 border-red-500 p-6">
            <div className="text-red-500 text-xs font-bold mb-2 uppercase tracking-wider">
              // ERROR
            </div>
            <p className="text-tech-white text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="terminal-button text-xs px-4 py-2"
            >
              [RETRY]
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="technical-map min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-tech-dark border-b border-tech flex items-center justify-between px-6 py-3">
        <div className="text-tech-white font-bold text-lg terminal-text">
          GEIPAN // LIST VIEW
        </div>
        <div className="flex gap-4">
          <Link href="/" className="nav-link">
            [DASHBOARD]
          </Link>
          <Link href="/map/list" className="nav-link nav-link-active">
            [LIST VIEW]
          </Link>
          <Link href="/map" className="nav-link">
            [MAP VIEW]
          </Link>
        </div>
      </nav>

      <div className="pt-16 max-w-7xl mx-auto p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-tech-white mb-3 uppercase tracking-wider terminal-text">
            CASE DATABASE
          </h1>
          <p className="text-tech-grey text-sm">
            Search and filter {data.length.toLocaleString()} UFO observations across France
          </p>
        </div>

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
