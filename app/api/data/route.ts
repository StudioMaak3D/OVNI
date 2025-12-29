import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parseProductionCSV, type CasAvecTemoignages } from '@/lib/dataParser';

// Cache les données en mémoire pour éviter de reparser à chaque requête
let cachedData: CasAvecTemoignages[] | null = null;

export async function GET() {
  try {
    // Utiliser le cache si disponible
    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
      });
    }

    // Charger le fichier CSV de production consolidé
    const productionFilePath = join(process.cwd(), 'public', 'data', 'geipan_case_ovni_production.csv');
    const csvContent = await readFile(productionFilePath, 'utf-8');

    // Parser les données
    const casAvecTemoignages = parseProductionCSV(csvContent);

    // Mettre en cache
    cachedData = casAvecTemoignages;

    return NextResponse.json({
      success: true,
      data: casAvecTemoignages,
      cached: false,
    });
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
