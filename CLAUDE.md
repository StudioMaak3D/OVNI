# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js/React application for exploring GEIPAN (French UFO observation) data. The primary goal is to extract and visualize visual descriptions from UFO sighting reports for use in AI prompt generation.

## Data Structure

The repository contains two CSV files with pipe-delimited (`|`) data:

### 1. `export_cas_pub_20251127093552.csv` (~3,277 cases)
- 15 columns, first line is blank (no headers)
- Key columns:
  - [0]: Case ID (e.g., "1937-01-01656") - **JOIN KEY**
  - [1]: Title/Location
  - [2]: Observation date
  - [3]: Department (département)
  - [4]: Region (région)
  - [6]: Geographic zone
  - [7]: Short summary
  - [9]: Detailed description
  - [14]: Classification (A, B, C, D)

### 2. `export_temoignages_pub_20251127093610.csv` (~5,948 testimonies)
- 73 columns, pipe-delimited
- Key columns:
  - [0]: Case ID - **JOIN KEY** (one case can have multiple testimonies)
  - [5]: Date
  - [16]: Start time
  - [27]: Phenomenon shape (e.g., "3D - 2 axes de symétrie - Sphérique, Boule")
  - [28]: Color (e.g., "Blanc", "Rouge")
  - [30]: Speed (e.g., "Lente", "Rapide")
  - [51-52]: Shape and size descriptions
  - [57]: End color

**Important**: The testimonies file contains the rich visual details needed for AI prompt generation. Multiple testimonies can be associated with a single case via the Case ID.

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Package Manager**: pnpm (must use pnpm, not npm or yarn)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (optional)
- **Data Handling**: Client-side parsing (PapaParse or native)

## Project Structure (To Be Created)

```
/app           - Next.js App Router pages
/components    - React components
/lib           - Utilities and data parsing logic
/data          - CSV files location
```

## Common Commands

Since this is a new project, these commands will be relevant once the Next.js app is initialized:

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Linting
pnpm lint
```

## Architecture & Implementation Plan

### Phase 1: Core Features (Current Scope)

#### 1. Data Parsing Layer (`/lib/dataParser.ts`)
- Parse both CSV files handling pipe delimiters
- Handle blank lines, malformed rows, and data cleanup (trim, normalization)
- Join cases with testimonies using Case ID
- TypeScript types:
  - `Cas`: Case data structure
  - `Temoignage`: Testimony data structure
  - `CasAvecTemoignages`: Joined data structure (case with array of testimonies)

#### 2. Search Interface
- Main search input (searches across title, description, location)
- Filter sidebar:
  - Classification (A, B, C, D)
  - Region (région)
  - Department (département)
  - Phenomenon shape (forme)
  - Color (couleur)
  - Year range (période)

#### 3. Results Display
- Paginated or infinite scroll results list
- Each result card shows:
  - Title + date + location
  - Classification badge
  - Short summary (2-3 lines)
  - Testimony count badge
  - "View details" button

#### 4. Detail Modal/Panel
- Complete case information
- **Visual Descriptions Section** (primary focus):
  - All testimonies for the case
  - Structured display of: shape, color, speed, size, time, etc.
  - **"Copy descriptions" button**: formats all visual details optimally for use as AI prompts

#### 5. Sorting Options
- Date (ascending/descending)
- Classification
- Region
- Number of testimonies

### Key Design Considerations

1. **Performance**: Load and parse CSV data on first access with loading indicator
2. **Visual Description Focus**: The core value is extracting visual descriptions from testimonies - UI should emphasize this
3. **Prompt Generation**: Design the description aggregation/formatting with AI prompt usage in mind
4. **Mobile Responsive**: Collapsible filters on mobile

## Development Approach

- **Incremental Implementation**: Build step-by-step, validating each phase before proceeding
- **Data-First**: Test CSV parsing and joins before building UI components
- **Visual Description Priority**: All features should support the goal of extracting visual descriptions for prompt generation
- **No Over-Engineering**: Focus only on Phase 1 features; Phase 2 (maps, analytics, semantic search) is explicitly out of scope

## Special Notes

- Both CSV files have French content and use French geographic/administrative terms
- Case classifications: A (identified), B (probable explanation), C (insufficient information), D (unexplained)
- The PLAN.md file contains detailed task breakdown - refer to it for implementation steps
- When implementing, extract ALL visual descriptive fields from testimonies, not just the obvious ones
