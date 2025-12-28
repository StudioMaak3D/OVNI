import Papa from 'papaparse';

// Types pour les données GEIPAN
export type Cas = {
  id: string;
  titre: string;
  date: string;
  departement: string;
  region: string;
  zoneGeographique: string;
  resumeCourt: string;
  descriptionDetaillee: string;
  classification: string;
};

export type Temoignage = {
  casId: string;
  date: string;
  heure: string;
  forme: string;
  couleur: string;
  vitesse: string;
  taille: string;
  typeObservateur: string;
  milieu: string;
  meteo: string;
  trajectoire: string;
  apparence: string;
};

export type CasAvecTemoignages = Cas & {
  temoignages: Temoignage[];
};

/**
 * Parse le fichier CSV de production consolidé (geipan_case_ovni_production.csv)
 * Ce fichier contient les données de cas et témoignages dénormalisées
 */
export function parseProductionCSV(csvContent: string): CasAvecTemoignages[] {
  const results = Papa.parse<Record<string, string>>(csvContent, {
    delimiter: '|',
    header: true,
    skipEmptyLines: true,
  });

  const casMap = new Map<string, CasAvecTemoignages>();

  for (const row of results.data) {
    const caseId = row.case_id?.trim();
    if (!caseId) continue;

    // Créer ou récupérer le cas
    if (!casMap.has(caseId)) {
      casMap.set(caseId, {
        id: caseId,
        titre: row.cas_titre_localisation?.trim() || '',
        date: row.cas_date_observation?.trim() || '',
        departement: row.cas_departement?.trim() || '',
        region: row.cas_region?.trim() || '',
        zoneGeographique: row.cas_zone_geographique?.trim() || '',
        resumeCourt: row.cas_resume_court?.trim() || '',
        descriptionDetaillee: row.cas_description_detaillee?.trim() || '',
        classification: row.cas_classification?.trim() || '',
        temoignages: [],
      });
    }

    // Ajouter le témoignage si les données existent
    const cas = casMap.get(caseId)!;

    // Ne créer un témoignage que s'il y a des données substantielles
    if (row.temoin_forme || row.temoin_couleur || row.temoin_heure) {
      cas.temoignages.push({
        casId: caseId,
        date: row.temoin_date_observation?.trim() || row.cas_date_observation?.trim() || '',
        heure: row.temoin_heure?.trim() || '',
        forme: row.temoin_forme?.trim() || '',
        couleur: row.temoin_couleur?.trim() || '',
        vitesse: row.temoin_vitesse?.trim() || '',
        taille: row.temoin_taille_angulaire?.trim() || '',
        typeObservateur: row.temoin_type?.trim() || '',
        milieu: row.temoin_environnement?.trim() || '',
        meteo: row.temoin_meteo?.trim() || '',
        trajectoire: row.temoin_trajectoire?.trim() || '',
        apparence: row.temoin_forme2?.trim() || '',
      });
    }
  }

  return Array.from(casMap.values());
}

/**
 * Parse le fichier CSV des cas GEIPAN
 * Structure: 15 colonnes séparées par |
 */
export function parseCasCSV(csvContent: string): Cas[] {
  const results = Papa.parse<string[]>(csvContent, {
    delimiter: '|',
    skipEmptyLines: true,
  });

  const cas: Cas[] = [];

  for (const row of results.data) {
    // Ignorer les lignes avec moins de 15 colonnes
    if (row.length < 15) continue;

    // Nettoyer et normaliser les données
    const cleanRow = row.map(cell => (cell || '').trim());

    cas.push({
      id: cleanRow[0],
      titre: cleanRow[1],
      date: cleanRow[2],
      departement: cleanRow[3],
      region: cleanRow[4],
      zoneGeographique: cleanRow[6],
      resumeCourt: cleanRow[7],
      descriptionDetaillee: cleanRow[9],
      classification: cleanRow[14],
    });
  }

  return cas;
}

/**
 * Parse le fichier CSV des témoignages GEIPAN
 * Structure: 73 colonnes séparées par |
 */
export function parseTemoignagesCSV(csvContent: string): Temoignage[] {
  const results = Papa.parse<string[]>(csvContent, {
    delimiter: '|',
    skipEmptyLines: true,
  });

  const temoignages: Temoignage[] = [];

  for (const row of results.data) {
    // Ignorer les lignes avec un nombre insuffisant de colonnes
    if (row.length < 30) continue;

    // Nettoyer et normaliser les données
    const cleanRow = row.map(cell => (cell || '').trim());

    temoignages.push({
      casId: cleanRow[0],
      date: cleanRow[5],
      heure: cleanRow[16],
      forme: cleanRow[27],
      couleur: cleanRow[28],
      vitesse: cleanRow[30],
      taille: cleanRow[29] || '', // Taille angulaire
      typeObservateur: cleanRow[4] || '', // Type d'observation (Terrestre, Aéronautique)
      milieu: cleanRow[14] || '', // Milieu d'observation
      meteo: cleanRow[15] || '', // Conditions météo
      trajectoire: cleanRow[23] || '', // Type de trajectoire
      apparence: cleanRow[26] || '', // Apparence générale
    });
  }

  return temoignages;
}

/**
 * Joint les cas avec leurs témoignages associés
 */
export function joinCasWithTemoignages(
  cas: Cas[],
  temoignages: Temoignage[]
): CasAvecTemoignages[] {
  // Dédupliquer les cas par ID (garder le premier)
  const casUniques = new Map<string, Cas>();
  for (const c of cas) {
    if (!casUniques.has(c.id)) {
      casUniques.set(c.id, c);
    }
  }

  // Créer un index des témoignages par casId pour optimiser la recherche
  const temoignagesParCas = new Map<string, Temoignage[]>();

  for (const temoignage of temoignages) {
    const existing = temoignagesParCas.get(temoignage.casId) || [];
    existing.push(temoignage);
    temoignagesParCas.set(temoignage.casId, existing);
  }

  // Joindre les données
  const casAvecTemoignages: CasAvecTemoignages[] = Array.from(casUniques.values()).map(c => ({
    ...c,
    temoignages: temoignagesParCas.get(c.id) || [],
  }));

  return casAvecTemoignages;
}

/**
 * Charge et parse les deux fichiers CSV
 */
export async function loadAllData(
  casFilePath: string,
  temoignagesFilePath: string
): Promise<CasAvecTemoignages[]> {
  try {
    // Charger les fichiers
    const [casResponse, temoignagesResponse] = await Promise.all([
      fetch(casFilePath),
      fetch(temoignagesFilePath),
    ]);

    const [casContent, temoignagesContent] = await Promise.all([
      casResponse.text(),
      temoignagesResponse.text(),
    ]);

    // Parser les données
    const cas = parseCasCSV(casContent);
    const temoignages = parseTemoignagesCSV(temoignagesContent);

    // Joindre les données
    return joinCasWithTemoignages(cas, temoignages);
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    throw error;
  }
}

/**
 * Formatte les descriptions visuelles d'un cas pour utilisation en prompt IA
 */
export function formatDescriptionsForPrompt(cas: CasAvecTemoignages): string {
  let prompt = `Cas ${cas.id} - ${cas.titre}\n`;
  prompt += `Date: ${cas.date}\n`;
  prompt += `Localisation: ${cas.region}, ${cas.departement}\n`;
  prompt += `Classification: ${cas.classification}\n\n`;

  if (cas.resumeCourt) {
    prompt += `Résumé: ${cas.resumeCourt}\n\n`;
  }

  if (cas.temoignages.length > 0) {
    prompt += `Descriptions visuelles (${cas.temoignages.length} témoignage(s)):\n\n`;

    cas.temoignages.forEach((t, index) => {
      prompt += `Témoignage ${index + 1}:\n`;
      if (t.forme) prompt += `- Forme: ${t.forme}\n`;
      if (t.couleur) prompt += `- Couleur: ${t.couleur}\n`;
      if (t.taille) prompt += `- Taille: ${t.taille}\n`;
      if (t.vitesse) prompt += `- Vitesse: ${t.vitesse}\n`;
      if (t.heure) prompt += `- Heure: ${t.heure}\n`;
      if (t.trajectoire) prompt += `- Trajectoire: ${t.trajectoire}\n`;
      if (t.apparence) prompt += `- Apparence: ${t.apparence}\n`;
      if (t.meteo) prompt += `- Météo: ${t.meteo}\n`;
      prompt += '\n';
    });
  }

  if (cas.descriptionDetaillee) {
    prompt += `Description détaillée:\n${cas.descriptionDetaillee}\n`;
  }

  return prompt;
}
