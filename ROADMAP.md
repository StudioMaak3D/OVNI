# Feuille de Route : Intégration RAG Supabase dans Next.js

## 🎯 Objectif

Ajouter une nouvelle page `/recherche-rag` dans le projet Next.js existant pour exploiter les 7,879 embeddings stockés dans Supabase. Cette page doit rester **complètement séparée** de l'interface de recherche classique existante.

---

## ⚠️ RÈGLES IMPORTANTES

### 1. Isolation complète
- ❌ **NE PAS** modifier les pages existantes (`/page.tsx`, `/recherche`, etc.)
- ❌ **NE PAS** toucher aux composants existants
- ✅ Créer une **nouvelle page** : `/app/recherche-rag/page.tsx`
- ✅ Créer de **nouveaux composants** dans `/components/rag/`
- ✅ Créer de **nouvelles fonctions** dans `/lib/rag/`

### 2. Navigation
- Ajouter un lien dans le header/menu : "🔍 Recherche Sémantique (Beta)"
- Lien vers `/recherche-rag`
- Badge "Beta" ou "Nouveau" pour indiquer que c'est expérimental

### 3. Styling
- Utiliser le même système de design que l'app existante (Tailwind)
- Mais page complètement indépendante au niveau layout

---

## 📋 Phase 1 : Configuration de base

### Étape 1.1 : Installation des dépendances

**Packages nécessaires** :
```bash
npm install @supabase/supabase-js
# Hugging Face Inference SDK (optionnel, peut utiliser fetch)
npm install @huggingface/inference
```

### Étape 1.2 : Variables d'environnement

**Créer/modifier `.env.local`** :
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
HUGGINGFACE_API_KEY=hf_xxxxx
```

**Note** : La clé Hugging Face doit rester côté serveur (pas NEXT_PUBLIC_)

### Étape 1.3 : Client Supabase

**Créer `/lib/rag/supabase-client.ts`** :
- Créer une instance du client Supabase
- Utiliser les variables d'environnement
- Export du client pour réutilisation

**Type TypeScript à créer** :
```typescript
type TemoignageEmbedding = {
  id: number;
  cas_id: string;
  temoignage_id: string;
  forme: string | null;
  couleur: string | null;
  vitesse: string | null;
  luminosite: string | null;
  taille: string | null;
  description_complete: string;
  cas_titre: string;
  cas_date: string;
  cas_lieu: string;
  cas_departement: string;
  cas_region: string;
  cluster_id: number | null;
};

type SearchResult = TemoignageEmbedding & {
  similarity: number;
};
```

---

## 📋 Phase 2 : Système d'embeddings

### Étape 2.1 : API Route pour les embeddings

**Créer `/app/api/rag/embed/route.ts`** (API Route Next.js) :

**Fonction** :
- Recevoir une requête POST avec `{ text: string }`
- Appeler l'API Hugging Face Inference
- Endpoint : `https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`
- Headers : `Authorization: Bearer ${process.env.HUGGINGFACE_API_KEY}`
- Retourner l'embedding (array de 384 dimensions)

**Gestion des erreurs** :
- Cold start HF API (peut prendre 20s la première fois)
- Retry automatique si modèle en chargement
- Message utilisateur : "Modèle en chargement, veuillez patienter..."

**Format de réponse** :
```typescript
{
  embedding: number[]; // 384 dimensions
  model: string;
}
```

### Étape 2.2 : Hook client pour embeddings

**Créer `/lib/rag/use-embedding.ts`** (hook React) :

**Fonctionnalités** :
- Hook `useEmbedding(text: string)`
- Appelle `/api/rag/embed` via fetch
- Gère loading, error, retry
- Cache les résultats (même texte = même embedding)

**État du hook** :
```typescript
{
  embedding: number[] | null;
  isLoading: boolean;
  error: Error | null;
  generate: () => Promise<void>;
}
```

---

## 📋 Phase 3 : Fonction de recherche Supabase

### Étape 3.1 : Service de recherche

**Créer `/lib/rag/search-service.ts`** :

**Fonction principale** : `searchSemantic()`

**Paramètres** :
```typescript
{
  queryEmbedding: number[];
  matchThreshold?: number;  // Default: 0.5
  matchCount?: number;      // Default: 20
  filters?: {
    cluster_id?: number;
    cas_region?: string[];
    cas_departement?: string[];
    forme?: string;
    couleur?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}
```

**Logique** :
1. Appeler la fonction SQL `match_temoignages` de Supabase
2. Appliquer les filtres supplémentaires avec `.eq()`, `.in()`, `.gte()`, etc.
3. Retourner les résultats avec score de similarité

**Type de retour** :
```typescript
{
  results: SearchResult[];
  total: number;
  executionTime: number; // en ms
}
```

### Étape 3.2 : Service de récupération par cluster

**Créer fonction** : `getByCluster(clusterId: number, limit?: number)`

**Logique** :
- Simple requête `.eq('cluster_id', clusterId)`
- Ordonner par date ou par similarité au centroïde
- Limiter les résultats

---

## 📋 Phase 4 : Interface de recherche

### Étape 4.1 : Page principale

**Créer `/app/recherche-rag/page.tsx`** :

**Layout** :
```
┌─────────────────────────────────────────────┐
│  Header "Recherche Sémantique GEIPAN"      │
│  Explications sur le fonctionnement         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  <SearchBar />                              │
│  Exemples de recherche suggérés            │
└─────────────────────────────────────────────┘

┌──────────────┬──────────────────────────────┐
│  <Filters /> │  <ResultsList />             │
│  (Sidebar)   │  (Main content)              │
│              │                              │
│  - Clusters  │  [Résultat 1]               │
│  - Régions   │  Score: 0.85                │
│  - Dates     │  Description...             │
│  - Formes    │                              │
│  - Couleurs  │  [Résultat 2]               │
│              │  Score: 0.78                │
│              │  Description...             │
└──────────────┴──────────────────────────────┘
```

**État de la page** :
```typescript
const [query, setQuery] = useState('');
const [filters, setFilters] = useState({});
const [results, setResults] = useState([]);
const [isSearching, setIsSearching] = useState(false);
```

### Étape 4.2 : Composant SearchBar

**Créer `/components/rag/SearchBar.tsx`** :

**Fonctionnalités** :
- Input avec placeholder : "Ex: disque orange lumineux rapide"
- Bouton "Rechercher"
- Exemples cliquables en dessous :
  - "Sphères blanches lumineuses"
  - "Objets triangulaires avec lumières"
  - "Cigares métalliques"
  - "Disques avec changement de direction"
- Indicateur de chargement pendant génération embedding

**Comportement** :
```
User tape query
  ↓
Click "Rechercher"
  ↓
Génère embedding via useEmbedding
  ↓
Appelle searchSemantic()
  ↓
Affiche résultats
```

### Étape 4.3 : Composant Filters

**Créer `/components/rag/Filters.tsx`** :

**Sections de filtres** :

1. **Par type (Clusters)** :
   - Liste des 20 clusters
   - Avec noms descriptifs (à hardcoder pour commencer)
   - Checkbox ou radio pour sélection
   - Compteur de cas par cluster

2. **Par caractéristiques** :
   - Forme (dropdown multi-select)
   - Couleur (chips multi-select)
   - Vitesse (dropdown)

3. **Par localisation** :
   - Région (dropdown multi-select)
   - Département (autocomplete)

4. **Par période** :
   - Date début / Date fin (date pickers)
   - Ou presets : "Années 50", "Années 90", "Après 2000"

**UI** :
- Sidebar collapsible sur mobile
- Compteur "X filtres actifs"
- Bouton "Réinitialiser les filtres"

### Étape 4.4 : Composant ResultsList

**Créer `/components/rag/ResultsList.tsx`** :

**Affichage** :
- Si `isSearching` : Skeleton loaders
- Si `results.length === 0` : Message "Aucun résultat" avec suggestions
- Si `results.length > 0` : Liste des résultats

**Pour chaque résultat** :
```
┌─────────────────────────────────────────┐
│ [Badge Cluster] [Score: 0.85]          │
│                                         │
│ 📍 TOULOUSE (31) - Occitanie            │
│ 📅 15/06/1954                           │
│                                         │
│ Forme: Disque lenticulaire             │
│ Couleur: Orange, lumineux              │
│ Vitesse: Rapide                        │
│                                         │
│ Description:                            │
│ Forme: 3D - 1 axe de symétrie...      │
│ [Lire la suite]                        │
│                                         │
│ [👁️ Voir détails] [💾 Sauvegarder]    │
└─────────────────────────────────────────┘
```

**Interactions** :
- Click sur carte → ouvre modal de détails
- Bouton "Sauvegarder" → ajoute au répertoire perso (fonctionnalité existante)
- Pagination ou scroll infini

### Étape 4.5 : Composant ResultDetail (Modal)

**Créer `/components/rag/ResultDetail.tsx`** :

**Contenu** :
- Toutes les informations complètes
- Description longue
- Métadonnées du cas GEIPAN
- **Bouton "Cas similaires"** : Re-recherche avec cet embedding comme base
- **Bouton "Copier description pour prompt"** : Copy to clipboard
- **Lien vers cas GEIPAN original** (si disponible)

---

## 📋 Phase 5 : Fonctionnalités avancées

### Étape 5.1 : Navigation par clusters

**Créer `/app/recherche-rag/clusters/page.tsx`** :

**Vue d'ensemble** :
- Grille de cartes pour les 20 clusters
- Chaque carte montre :
  - Nom du cluster
  - Nombre de cas
  - Caractéristiques dominantes (forme, couleur)
  - Image d'illustration (optionnel)
- Click → redirige vers `/recherche-rag?cluster=5`

**Noms des clusters à utiliser** (basés sur l'analyse) :
```typescript
const CLUSTER_NAMES = {
  0: "Formes Non Catégorisées",
  1: "Observations Narratives Diverses",
  2: "Masses Sombres",
  3: "Lumières Blanches Rapides",
  4: "Phénomènes Orangés",
  5: "Sphères Lumineuses Classiques",
  6: "Sphères Multicolores",
  7: "Observations Narratives Détaillées",
  8: "Lumières Multiples Silencieuses",
  9: "Cas Historiques (1950s)",
  10: "Points Lumineux Stationnaires",
  11: "Rentrées Atmosphériques",
  12: "Points Lumineux",
  13: "Observations Rapides",
  14: "Observations Diverses Anciennes",
  15: "Boules Orangées (Lanternes)",
  16: "Lumières Fortes Multicolores",
  17: "Formes Indéfinies Lumineuses",
  18: "Observations Aéronautiques",
  19: "Formes Variables"
};
```

### Étape 5.2 : Page détail cluster

**Créer `/app/recherche-rag/clusters/[id]/page.tsx`** :

**Contenu** :
- En-tête avec nom et description du cluster
- Stats : nombre de cas, période couverte, régions principales
- Top 3 formes/couleurs/vitesses
- Liste complète des cas du cluster (paginée)
- Graphique temporel (optionnel) : évolution du nombre de cas par année

### Étape 5.3 : Recherche "Trouver similaires"

**Ajouter dans ResultDetail** :

**Bouton "Trouver des cas similaires"** :
- Récupère l'embedding du cas actuel depuis Supabase
- Lance une nouvelle recherche avec cet embedding
- Affiche les 10 cas les plus proches
- Exclut le cas actuel des résultats

---

## 📋 Phase 6 : UX & Polish

### Étape 6.1 : Exemples et onboarding

**Sur la page `/recherche-rag`** :

**Section "Comment ça marche ?"** (collapsible) :
```
🔍 Recherche sémantique intelligente

Cette recherche utilise l'IA pour comprendre le sens de votre
requête, pas seulement les mots exacts.

Exemples :
- "objet métallique brillant" trouvera aussi "disque argenté"
- "lumière qui change de direction" trouvera des comportements similaires

Essayez :
→ Décrivez ce que vous cherchez avec vos propres mots
→ Combinez apparence et comportement
→ Utilisez les filtres pour affiner
```

**Cartes d'exemples cliquables** :
- "Soucoupes classiques années 50"
- "Triangles noirs silencieux"
- "Lumières orangées récentes"
- "Objets à grande vitesse"

### Étape 6.2 : Feedback utilisateur

**Indicateurs visuels** :
- Score de similarité affiché clairement
- Badge de qualité : "Très pertinent" (>0.8), "Pertinent" (>0.6), "Possible" (>0.5)
- Temps de recherche affiché : "Résultats en 1.2s"

**Messages d'erreur clairs** :
- "Le modèle IA se réveille... (20s)"
- "Aucun résultat trouvé. Essayez avec moins de filtres"
- "Erreur de connexion. Vérifiez votre connexion"

### Étape 6.3 : Performance

**Optimisations à implémenter** :
- Cache des embeddings générés (LocalStorage ou React Query)
- Debounce sur la recherche (500ms)
- Loading states granulaires (embedding → search → results)
- Pagination côté serveur (ne pas charger 1000 résultats d'un coup)

---

## 📋 Phase 7 : Testing & Validation

### Étape 7.1 : Tests fonctionnels

**À tester manuellement** :
1. Recherche simple : "disque orange" → vérifie résultats pertinents
2. Recherche avec filtres : "sphère" + Région "Occitanie" → vérifie filtrage
3. Navigation par cluster → vérifie tous les liens fonctionnent
4. Modal détails → vérifie toutes les infos s'affichent
5. Cold start HF API → vérifie le message d'attente

### Étape 7.2 : Edge cases

**Gérer** :
- Query vide → message "Entrez une description"
- Aucun résultat → suggestions de recherches alternatives
- Erreur API HF → retry + fallback message
- Erreur Supabase → message + contact support

---

## 📊 Métriques de succès

**Comment savoir si c'est réussi ?**

✅ **Fonctionnel** :
- Recherche retourne résultats en <3s (après warm-up)
- Filtres fonctionnent correctement
- Aucune erreur console

✅ **UX** :
- Interface intuitive (utilisable sans doc)
- Messages clairs (pas de jargon technique)
- Mobile responsive

✅ **Qualité** :
- Résultats pertinents (top 3 au moins en rapport avec query)
- Score de similarité cohérent
- Pas de doublons

---

## 🚀 Ordre d'implémentation recommandé

### Sprint 1 : Base (2-3h)
1. Setup Supabase client
2. API route embeddings
3. Page basique `/recherche-rag`
4. SearchBar simple
5. Affichage résultats basique

**Test** : "disque orange" doit retourner des résultats

### Sprint 2 : Filtres (1-2h)
1. Composant Filters
2. Intégration filtres dans searchSemantic()
3. UI pour activer/désactiver filtres

**Test** : Filtrer par région doit fonctionner

### Sprint 3 : Navigation clusters (1-2h)
1. Page liste clusters
2. Page détail cluster
3. Hardcoder les noms de clusters

**Test** : Cliquer sur un cluster → voir ses cas

### Sprint 4 : Polish (1-2h)
1. Modal détails
2. Messages d'erreur
3. Loading states
4. Mobile responsive

**Test** : Expérience fluide de bout en bout

---

## ⚠️ Points d'attention

### Performance
- HF Inference API peut être lent (1-20s selon cold start)
- Mettre un bon indicateur de chargement
- Considérer caching côté client

### Sécurité
- Clé HF doit rester côté serveur (API route)
- Clé Supabase anon est OK côté client (RLS désactivé pour l'instant)

### Data Quality
- Certains résultats peuvent être étranges (biais du clustering)
- Ajouter disclaimer : "Résultats générés par IA"
- Permettre feedback utilisateur (optionnel)

---

## 📦 Livrables attendus

1. ✅ Page `/recherche-rag` fonctionnelle
2. ✅ Recherche sémantique opérationnelle
3. ✅ Filtres par cluster, région, forme, couleur
4. ✅ Navigation par clusters
5. ✅ Modal de détails avec "Cas similaires"
6. ✅ Responsive mobile
7. ✅ Messages d'erreur clairs
8. ✅ Code bien organisé dans `/lib/rag/` et `/components/rag/`

---

## 🎯 Critères de validation

**Avant de considérer terminé** :
- [ ] User peut chercher "sphère orange" et obtenir résultats
- [ ] Filtres réduisent correctement les résultats
- [ ] Navigation clusters fonctionne
- [ ] Modal détails affiche toutes les infos
- [ ] Aucune erreur console
- [ ] Temps de réponse acceptable (<5s)
- [ ] Mobile utilisable
- [ ] Code séparé de l'ancienne interface

---

**Rappel** : Ne pas toucher aux pages/composants existants. Tout doit être dans `/app/recherche-rag/`, `/components/rag/`, et `/lib/rag/`.