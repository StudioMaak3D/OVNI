import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parseCasCSV, parseTemoignagesCSV, joinCasWithTemoignages, formatDescriptionsForPrompt } from '@/lib/dataParser';

export async function GET() {
  try {
    // Charger les fichiers CSV depuis le répertoire data
    const casFilePath = join(process.cwd(), 'data', 'export_cas_pub_20251127093552.csv');
    const temoignagesFilePath = join(process.cwd(), 'data', 'export_temoignages_pub_20251127093610.csv');

    const [casContent, temoignagesContent] = await Promise.all([
      readFile(casFilePath, 'utf-8'),
      readFile(temoignagesFilePath, 'utf-8'),
    ]);

    // Parser les données
    const cas = parseCasCSV(casContent);
    const temoignages = parseTemoignagesCSV(temoignagesContent);

    // Joindre les données
    const casAvecTemoignages = joinCasWithTemoignages(cas, temoignages);

    // Statistiques
    const stats = {
      totalCas: cas.length,
      totalTemoignages: temoignages.length,
      casAvecTemoignages: casAvecTemoignages.filter(c => c.temoignages.length > 0).length,
      casSansTemoignages: casAvecTemoignages.filter(c => c.temoignages.length === 0).length,
    };

    // Exemple de cas avec témoignages
    const exempleAvecTemoignages = casAvecTemoignages
      .filter(c => c.temoignages.length > 0)
      .slice(0, 3);

    // Format prompt pour un exemple
    const exemplePrompt = exempleAvecTemoignages.length > 0
      ? formatDescriptionsForPrompt(exempleAvecTemoignages[0])
      : '';

    return NextResponse.json({
      success: true,
      stats,
      exemples: exempleAvecTemoignages.map(c => ({
        id: c.id,
        titre: c.titre,
        date: c.date,
        classification: c.classification,
        nombreTemoignages: c.temoignages.length,
        temoignages: c.temoignages,
      })),
      exemplePrompt,
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
