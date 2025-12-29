# GEIPAN UFO Data Explorer

Une application web interactive pour explorer et visualiser les données d'observations d'OVNI du GEIPAN (Groupe d'Études et d'Informations sur les Phénomènes Aérospatiaux Non identifiés).

## Fonctionnalités

- **Carte interactive de France** : Visualisation géographique des observations par département
- **Statistiques en temps réel** : Analyse des cas par classification (A, B, C, D)
- **Vue liste détaillée** : Exploration des cas avec recherche et filtres avancés
- **Modèle 3D** : Visualisation 3D de vaisseaux basés sur les descriptions de témoignages
- **Génération IA** : Aperçu des reconstructions visuelles basées sur les témoignages

## Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Three.js / React Three Fiber** - Rendu 3D
- **React Simple Maps** - Visualisations cartographiques
- **PapaParse** - Parsing CSV
- **pnpm** - Gestionnaire de paquets

## Installation

```bash
# Cloner le repository
git clone <repository-url>
cd OVNI

# Installer les dépendances avec pnpm
pnpm install
```

## Développement

```bash
# Lancer le serveur de développement
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Build pour production

```bash
# Créer un build optimisé
pnpm build

# Lancer le serveur de production
pnpm start
```

## Structure du projet

```
/app              # Next.js App Router pages et API routes
/components       # Composants React réutilisables
/lib              # Utilitaires et logique de parsing de données
/public           # Fichiers statiques (données CSV, modèles 3D, GeoJSON)
/styles           # Styles CSS globaux
```

## Source des données

Les données proviennent du GEIPAN (organisme officiel du CNES) et incluent :
- ~3,277 cas d'observations
- ~5,948 témoignages détaillés
- Classifications scientifiques (A: identifié, B: probable, C: insuffisant, D: inexpliqué)

## License

MIT
