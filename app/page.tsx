'use client';

import { useState, useEffect } from 'react';
import type { CasAvecTemoignages } from '@/lib/dataParser';
import { parseProductionCSV } from '@/lib/dataParser';
import { BASE_PATH } from '@/lib/config';
import DashboardStats, { useStats } from '@/components/DashboardStats';
import MapPreview from '@/components/MapPreview';
import GeneratedSpaceship from '@/components/GeneratedSpaceship';
import Spaceship3D from '@/components/Spaceship3D';
import AboutModal from '@/components/AboutModal';
import AIInfoButton from '@/components/AIInfoButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDepartmentName } from '@/lib/mapUtils';
import '@/styles/technical-map.css';

export default function Dashboard() {
  const [data, setData] = useState<CasAvecTemoignages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoSectionLang, setVideoSectionLang] = useState<'FR' | 'EN'>('FR');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const pathname = usePathname();
  const stats = useStats(data);

  // Translation helper for video section
  const tv = (fr: string, en: string) => videoSectionLang === 'EN' ? en : fr;

  // Load data from CSV file
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${BASE_PATH}/data/geipan_case_ovni_production.csv`);
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

  return (
    <main className="technical-map min-h-screen">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-tech-dark border-b border-tech flex items-center justify-between px-6 py-3">
        <div className="text-tech-white font-bold text-lg terminal-text">
          OVNI EXPLORER
        </div>
        <div className="flex gap-4">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'nav-link-active' : ''}`}
          >
            [DASHBOARD]
          </Link>
          <Link
            href="/map/list"
            className={`nav-link ${pathname === '/map/list' ? 'nav-link-active' : ''}`}
          >
            [LIST VIEW]
          </Link>
          <Link
            href="/map"
            className={`nav-link ${pathname === '/map' ? 'nav-link-active' : ''}`}
          >
            [MAP VIEW]
          </Link>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="nav-link"
          >
            [ABOUT]
          </button>
        </div>
      </nav>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Main content with top padding for fixed nav */}
      <div className="pt-16 min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="terminal-spinner mx-auto mb-4"></div>
              <p className="text-tech-grey text-xs uppercase tracking-wider">
                LOADING DATA...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-tech-dark border-2 border-red-500 p-6">
              <div className="text-red-500 text-xs font-bold mb-2 uppercase tracking-wider">
                {'//'} ERROR
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
        ) : (
          <div className="max-w-7xl mx-auto p-8">
            {/* Header */}
            <div className="pt-16 mb-32 text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-tech-white mb-10 uppercase tracking-wider terminal-text">
                OVNI EXPLORER
              </h1>
              <p className="text-tech-grey text-xl leading-relaxed">
                Explore and visualize French OVNI (UFO) observations from GEIPAN (Groupe d&apos;Études et d&apos;Informations sur les Phénomènes Aérospatiaux Non-identifiés).
                Navigate through decades of witness testimonies, analyze sighting patterns, and generate AI reconstructions from detailed descriptions.
              </p>
            </div>

            {/* Hero Stats - Large Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-40">
              {/* Total Cases */}
              <div className="control-panel bg-tech-dark border-tech text-center">
                <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">CASES</div>
                <div className="text-tech-white text-4xl md:text-5xl case-count font-bold mb-1">
                  {stats.totalCases.toLocaleString()}
                </div>
              </div>

              {/* Total Testimonies */}
              <div className="control-panel bg-tech-dark border-tech text-center">
                <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">TESTIMONIES</div>
                <div className="text-tech-white text-4xl md:text-5xl case-count font-bold mb-1">
                  {stats.totalTestimonies.toLocaleString()}
                </div>
              </div>

              {/* Time Span */}
              <div className="control-panel bg-tech-dark border-tech text-center">
                <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">TIME SPAN</div>
                <div className="text-tech-white text-4xl md:text-5xl case-count font-bold mb-1">
                  {stats.yearSpan}
                </div>
                <div className="text-tech-grey text-xs">YEARS</div>
              </div>

              {/* Period */}
              <div className="control-panel bg-tech-dark border-tech text-center">
                <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">PERIOD</div>
                <div className="text-tech-white text-xl md:text-2xl case-count font-bold">
                  {stats.minYear}
                </div>
                <div className="text-tech-grey text-xs mb-1">→</div>
                <div className="text-tech-white text-xl md:text-2xl case-count font-bold">
                  {stats.maxYear}
                </div>
              </div>
            </div>

            {/* Map Preview - Full Width */}
            <div className="mb-32">
              <MapPreview data={data} />
            </div>

            {/* Explore Cases Title */}
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-tech-white uppercase tracking-wider terminal-text">
                EXPLORE CASES
              </h2>
            </div>

            {/* Two columns: Classifications + Generated Spaceship */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-48 items-stretch">
              {/* Classification Statistics + Top Department */}
              <div className="space-y-6 h-full flex flex-col">
                <DashboardStats data={data} />

                {/* Top Department */}
                {stats.topDept && (
                  <div className="control-panel bg-tech-dark border-tech">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-tech-dim text-xs mb-1 uppercase tracking-wider">
                          TOP DEPARTMENT
                        </div>
                        <div className="text-tech-white text-xl font-bold uppercase">
                          {stats.topDept.code} - {getDepartmentName(stats.topDept.code)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-tech-dim text-xs mb-1 uppercase tracking-wider">
                          CASES
                        </div>
                        <div className="text-tech-white text-3xl case-count font-bold">
                          {stats.topDept.totalCases.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Generated Spaceship */}
              <div className="h-full">
                <GeneratedSpaceship caseId="1951-08-00003" data={data} />
              </div>
            </div>

            {/* 3D Spaceship Viewer */}
            <div className="my-48 -mx-8 mb-64">
              <Spaceship3D caseData={{
                cas_numero: '1954-09-09112',
                titre: 'Prémanon (39) - 27 septembre 1954',
                description_complete: "Le 27 septembre 1954 à 20h30, trois enfants (de 12, 9 et 8 ans) observent à proximité de leur maison un engin étrange de couleur aluminium de forme rectangulaire fendu partiellement en son milieu dans le sens de la hauteur.",
                caracteristiques: {
                  couleur: 'aluminium',
                  forme: 'rectangulaire',
                  dimensions: 'environ 2 mètres de haut sur 1 mètre de large',
                  details: [
                    'Fendu partiellement en son milieu (dans le sens de la hauteur)',
                    'Deux supports coudés de chaque côté à sa base (sortes de "pieds" extérieurs)'
                  ]
                },
                comportement: [
                  "Un enfant lance une pierre puis une fléchette contre l'engin",
                  "L'engin s'avance lentement et renverse l'enfant",
                  "L'enfant effrayé rentre chez lui",
                  "Deux sœurs verront également l'engin et iront se cacher",
                  "Aucun témoin ne verra l'engin disparaître"
                ],
                phenomenes: [
                  "Les sœurs ont vu une lueur rouge se balancer au ras du sol près de l'habitation"
                ],
                traces: [
                  "Large couronne dans l'herbe couchée, orientée dans le sens des aiguilles d'une montre",
                  "Quatre trous dans cette couronne",
                  "Traces non identifiées comme du piétinement"
                ]
              }} />
            </div>

            {/* Case 1951-06-00002 with Video */}
            <div className="mt-64 mb-48">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Case Information */}
                <div className="space-y-5 text-tech-white font-mono">
                  {/* Language Toggle */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setVideoSectionLang(videoSectionLang === 'FR' ? 'EN' : 'FR')}
                      className="text-xs px-3 py-1 border border-tech text-tech-grey hover:text-tech-white hover:border-tech-bright transition-all uppercase tracking-wider"
                    >
                      [{videoSectionLang === 'FR' ? 'EN' : 'FR'}]
                    </button>
                  </div>

                  {/* Case ID */}
                  <div className="mb-6">
                    <div className="text-tech-dim text-sm mb-2 uppercase tracking-wider">
                      {tv('// CASE ID', '// CASE ID')}
                    </div>
                    <div className="text-tech-white text-xl font-bold">
                      1951-06-00002
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <div className="text-tech-white text-sm leading-relaxed">
                      {tv(
                        "Le 15 juin 1951 à 11h30, deux pilotes militaires décollent de la base d'Orange-Caritat. Durant le vol, ils observent un phénomène aérospatial non identifié.",
                        "On June 15, 1951 at 11:30 AM, two military pilots take off from the Orange-Caritat airbase. During the flight, they observe an unidentified aerospace phenomenon."
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">
                      {tv('// DÉTAILS', '// DETAILS')}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex">
                        <span className="text-tech-dim w-28">{tv('Date:', 'Date:')}</span>
                        <span className="text-tech-white flex-1">
                          {tv('15 juin 1951, 11h30', 'June 15, 1951, 11:30 AM')}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-tech-dim w-28">{tv('Lieu:', 'Location:')}</span>
                        <span className="text-tech-white flex-1">
                          {tv('Orange-Caritat (84)', 'Orange-Caritat (84), France')}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-tech-dim w-28">{tv('Témoins:', 'Witnesses:')}</span>
                        <span className="text-tech-white flex-1">
                          {tv('Deux pilotes militaires', 'Two military pilots')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video */}
                <div>
                  <video
                    className="w-full h-auto rounded"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                  >
                    <source src={`${BASE_PATH}/demo-1951-case.mp4`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* AI Info Button - Below Video, Bottom Left */}
                  <div className="mt-3">
                    <AIInfoButton type="video" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
