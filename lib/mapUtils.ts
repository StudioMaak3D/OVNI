import { scaleQuantize, scaleLinear } from 'd3-scale';

/**
 * Classification color mapping for accent colors (pastel modern tones)
 */
export const CLASSIFICATION_COLORS = {
  A: '#86efac', // Pastel green - Identified
  B: '#fde047', // Pastel yellow - Probable explanation
  C: '#c4b5fd', // Pastel purple - Insufficient information
  D: '#fca5a5', // Pastel red - Unexplained
  D1: '#fb923c', // Pastel orange - Unexplained with quality data
  NC: '#a1a1aa', // Grey - Not classified
} as const;

/**
 * Monochrome grey scale for choropleth heatmap
 * From dark to light based on case density
 */
export const GREY_SCALE = [
  '#111111', // Near black - 0-few cases
  '#222222',
  '#333333',
  '#444444',
  '#555555',
  '#666666',
  '#777777',
  '#888888',
  '#999999',
  '#AAAAAA',
  '#BBBBBB',
  '#CCCCCC', // Light grey - many cases
] as const;

/**
 * Creates a quantized color scale for department choropleth
 * Maps case count to grey scale colors
 */
export function createChoroplethColorScale(maxCases: number) {
  return scaleQuantize<string>()
    .domain([0, maxCases])
    .range([...GREY_SCALE]);
}

/**
 * Creates a linear color scale for smoother gradients
 * Alternative to quantize for more granular color transitions
 */
export function createLinearColorScale(maxCases: number) {
  return scaleLinear<string>()
    .domain([0, maxCases / 4, maxCases / 2, (maxCases * 3) / 4, maxCases])
    .range(['#111111', '#444444', '#777777', '#AAAAAA', '#CCCCCC'])
    .clamp(true);
}

/**
 * Gets the color for a specific classification
 */
export function getClassificationColor(classification: string): string {
  return CLASSIFICATION_COLORS[classification as keyof typeof CLASSIFICATION_COLORS] || CLASSIFICATION_COLORS.NC;
}

/**
 * Gets a readable name for classification codes
 */
export function getClassificationLabel(classification: string): string {
  const labels: Record<string, string> = {
    A: 'Identified',
    B: 'Probable',
    C: 'Insufficient Data',
    D: 'Unexplained',
    D1: 'Unexplained (High Quality)',
    NC: 'Not Classified',
  };
  return labels[classification] || classification;
}

/**
 * Department code to name mapping for major French departments
 * This can be expanded or loaded from a separate data source
 */
export const DEPARTMENT_NAMES: Record<string, string> = {
  '01': 'Ain',
  '02': 'Aisne',
  '03': 'Allier',
  '04': 'Alpes-de-Haute-Provence',
  '05': 'Hautes-Alpes',
  '06': 'Alpes-Maritimes',
  '07': 'Ardèche',
  '08': 'Ardennes',
  '09': 'Ariège',
  '10': 'Aube',
  '11': 'Aude',
  '12': 'Aveyron',
  '13': 'Bouches-du-Rhône',
  '14': 'Calvados',
  '15': 'Cantal',
  '16': 'Charente',
  '17': 'Charente-Maritime',
  '18': 'Cher',
  '19': 'Corrèze',
  '21': 'Côte-d\'Or',
  '22': 'Côtes-d\'Armor',
  '23': 'Creuse',
  '24': 'Dordogne',
  '25': 'Doubs',
  '26': 'Drôme',
  '27': 'Eure',
  '28': 'Eure-et-Loir',
  '29': 'Finistère',
  '2A': 'Corse-du-Sud',
  '2B': 'Haute-Corse',
  '30': 'Gard',
  '31': 'Haute-Garonne',
  '32': 'Gers',
  '33': 'Gironde',
  '34': 'Hérault',
  '35': 'Ille-et-Vilaine',
  '36': 'Indre',
  '37': 'Indre-et-Loire',
  '38': 'Isère',
  '39': 'Jura',
  '40': 'Landes',
  '41': 'Loir-et-Cher',
  '42': 'Loire',
  '43': 'Haute-Loire',
  '44': 'Loire-Atlantique',
  '45': 'Loiret',
  '46': 'Lot',
  '47': 'Lot-et-Garonne',
  '48': 'Lozère',
  '49': 'Maine-et-Loire',
  '50': 'Manche',
  '51': 'Marne',
  '52': 'Haute-Marne',
  '53': 'Mayenne',
  '54': 'Meurthe-et-Moselle',
  '55': 'Meuse',
  '56': 'Morbihan',
  '57': 'Moselle',
  '58': 'Nièvre',
  '59': 'Nord',
  '60': 'Oise',
  '61': 'Orne',
  '62': 'Pas-de-Calais',
  '63': 'Puy-de-Dôme',
  '64': 'Pyrénées-Atlantiques',
  '65': 'Hautes-Pyrénées',
  '66': 'Pyrénées-Orientales',
  '67': 'Bas-Rhin',
  '68': 'Haut-Rhin',
  '69': 'Rhône',
  '70': 'Haute-Saône',
  '71': 'Saône-et-Loire',
  '72': 'Sarthe',
  '73': 'Savoie',
  '74': 'Haute-Savoie',
  '75': 'Paris',
  '76': 'Seine-Maritime',
  '77': 'Seine-et-Marne',
  '78': 'Yvelines',
  '79': 'Deux-Sèvres',
  '80': 'Somme',
  '81': 'Tarn',
  '82': 'Tarn-et-Garonne',
  '83': 'Var',
  '84': 'Vaucluse',
  '85': 'Vendée',
  '86': 'Vienne',
  '87': 'Haute-Vienne',
  '88': 'Vosges',
  '89': 'Yonne',
  '90': 'Territoire de Belfort',
  '91': 'Essonne',
  '92': 'Hauts-de-Seine',
  '93': 'Seine-Saint-Denis',
  '94': 'Val-de-Marne',
  '95': 'Val-d\'Oise',
  '971': 'Guadeloupe',
  '972': 'Martinique',
  '973': 'Guyane',
  '974': 'La Réunion',
  '976': 'Mayotte',
};

/**
 * Gets department name from code, with fallback
 */
export function getDepartmentName(code: string): string {
  return DEPARTMENT_NAMES[code] || `Département ${code}`;
}
