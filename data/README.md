---
language:
- fr
tags:
- ovni
- ufo
- geipan
- france
- observations
- unexplained-phenomena
- aerial-phenomena
- cnes
- french-data
task_categories:
- text-classification
- question-answering
- feature-extraction
size_categories:
- 1K<n<10K
license: other
pretty_name: GEIPAN UFO Cases France
dataset_info:
  features:
  - name: case_id
    dtype: string
  - name: cas_classification
    dtype: string
  - name: cas_date_observation
    dtype: string
  - name: cas_date_publication
    dtype: string
  - name: cas_departement
    dtype: string
  - name: cas_description_detaillee
    dtype: string
  - name: cas_region
    dtype: string
  - name: cas_resume_court
    dtype: string
  - name: cas_source
    dtype: string
  - name: cas_titre_localisation
    dtype: string
  - name: cas_zone_geographique
    dtype: string
  splits:
  - name: train
    num_bytes: 15728640
    num_examples: 5954
  download_size: 15000000
  dataset_size: 15728640
configs:
- config_name: default
  data_files:
  - split: train
    path: geipan_case_ovni.csv
---

# GEIPAN UFO Cases France - Official French UFO Sightings Dataset

## Description

This dataset contains **Unidentified Flying Object (UFO)** observations collected by **GEIPAN** (Groupe d'Études et d'Informations sur les Phénomènes Aérospatiaux Non identifiés), the official French government organization under CNES (French Space Agency) dedicated to investigating unidentified aerospace phenomena since 1977.

The dataset combines **observation cases** and **witness testimonies** in a denormalized format optimized for data analysis and machine learning applications.

**Note:** All data content (descriptions, locations, etc.) is in **French** as this represents official French government records.

## Dataset Card

- **Language**: French
- **Task Categories**:
  - Text Classification
  - Named Entity Recognition (NER)
  - Information Retrieval
  - Question Answering
  - Semantic Search
- **Data Type**: Tabular + Text
- **License**: Open Data (French public sector - GEIPAN/CNES, compatible with Etalab 2.0)
- **Multilingual**: No (French only)
- **Size**: 5.9K examples
- **Original Source**: GEIPAN (official French government UAP investigation unit)

## Dataset Statistics

- **5,954 testimonies** from **~3,266 unique cases**
- **Time period covered**: 1937 - 2025 (88+ years) - includes cases published up to late 2025
- **62 structured columns** (11 case columns + 51 testimony columns)
- **File size**: 15 MB
- **Format**: CSV with pipe delimiter (`|`)
- **Data structure**: Denormalized (1 row = 1 testimony with associated case information)

## Case Classifications

Cases are classified according to the GEIPAN system:

| Class | Description | Number of Cases |
|-------|-------------|-----------------|
| **A** | Phenomenon identified with certainty | 898 |
| **B** | Probable explanation identified | 1,266 |
| **C** | Insufficient information | 999 |
| **D** | Unexplained phenomenon | 70 |
| **D1** | Unexplained phenomenon with quality data | 32 |
| **NC** | Not classified | 2 |

## Data Structure

### Case Columns (prefixed with `cas_`)

- **case_id**: Unique case identifier (format: YYYY-MM-XXXXX)
- **cas_titre_localisation**: Title and location of observation
- **cas_date_observation**: Observation date (format: DD/MM/YYYY)
- **cas_departement**: French department number
- **cas_region**: French region name
- **cas_zone_geographique**: Geographic zone (administrative region)
- **cas_resume_court**: Short summary of the case
- **cas_description_detaillee**: Detailed description of the observation and investigation
- **cas_classification**: GEIPAN classification (A, B, C, D, D1, NC)
- **cas_date_publication**: Case publication date
- **cas_source**: Case source (typically "GPN" for GEIPAN)
- **cas_reference_document**: Document reference (if available)
- **cas_notes_additionnelles**: Additional notes (if available)
- **cas_info_additionnelle**: Additional information (if available)

### Testimony Columns

Testimonies contain detailed information about:
- **Context**: location, date, time, observation conditions
- **Visual characteristics**: phenomenon shape, color, apparent size
- **Behavior**: speed, trajectory, duration
- **Observer**: witness information (anonymized)

> **Note**: Some testimony columns were removed as they were >95% empty. The dataset retains the 52 most relevant testimony columns out of 73 original ones.

### Column Schema Overview

```
Total: 62 columns (alphabetically organized)
├── case_id (unique identifier)
├── 10 case columns (prefix: cas_*)
│   ├── cas_classification (A/B/C/D/D1/NC)
│   ├── cas_date_observation
│   ├── cas_date_publication
│   ├── cas_departement
│   ├── cas_description_detaillee (rich text)
│   ├── cas_region
│   ├── cas_resume_court
│   ├── cas_source
│   ├── cas_titre_localisation
│   └── cas_zone_geographique
└── 51 testimony columns (prefix: temoin_*)
    ├── Visual descriptors (forme, couleur, taille_angulaire, vitesse)
    ├── Temporal data (date_observation, heure, duree)
    ├── Contextual information (meteo, environnement, lieu_observation)
    ├── Observer metadata (age, sexe, profession, reaction)
    └── Typed unknown fields (date_field_*, numeric_field_*, field_*)
```

**Note on column naming**: Some testimony columns have generic names like `temoin_field_X` or `temoin_numeric_field_X` because the original GEIPAN CSV files lack headers. These are preserved for data completeness and are typed by data type for easier analysis.

## Data Cleaning & Preprocessing

This dataset has been cleaned and optimized from the original GEIPAN source files:

✅ **HTML tags** (`<br>` and malformed tags) converted to spaces
✅ **Empty columns** (100% empty) removed
✅ **Very sparse columns** (>95% empty) removed (24 columns removed total)
✅ **Extra whitespace** cleaned (trimmed case_id and text fields)
✅ **Duplicates** removed (3 duplicate case_id found in original cases file)
✅ **Column headers** added with descriptive French names
✅ **Columns alphabetically organized** (case columns first, then testimony columns)
✅ **Unknown fields typed** (date_field_*, numeric_field_*, field_* for unidentified columns)
✅ **Case-testimony join** performed (denormalized: 1 row = 1 testimony with case info)
✅ **100% testimony preservation** (5,954 original testimonies = 5,954 final rows)

## File Format

- **Delimiter**: Pipe (`|`)
- **Encoding**: UTF-8
- **Headers**: First line
- **Missing values**: Empty strings

## Usage

### Loading with pandas

```python
import pandas as pd

df = pd.read_csv('geipan_case_ovni.csv', sep='|', encoding='utf-8')

# Display basic statistics
print(f"Number of testimonies: {len(df)}")
print(f"Unique cases: {df['case_id'].nunique()}")

# Filter by classification
unexplained_cases = df[df['cas_classification'] == 'D']
print(f"Unexplained cases (class D): {unexplained_cases['case_id'].nunique()}")
```

### Loading with Hugging Face Datasets

```python
from datasets import load_dataset

# Load from local file
dataset = load_dataset('csv', data_files='geipan_case_ovni.csv', delimiter='|')

# Or load from Hugging Face Hub (once uploaded)
dataset = load_dataset('pepouze_5/geipan_case_ovni')
```

## Use Cases

This dataset can be used for:

- 📊 **Statistical analysis** of UFO sightings in France
- 🗺️ **Geographic visualization** of cases by region/department
- 📈 **Temporal analysis** of observations (trends, seasonality)
- 🤖 **AI prompt generation** from visual descriptions
- 📝 **Information extraction** (NER, classification)
- 🔍 **Semantic search** in testimonies
- 📉 **Correlation analysis** between phenomenon characteristics and classification
- 🌍 **Cross-country comparison** with other UFO databases
- 📚 **Natural Language Processing** on French text data

## Featured Project

### 🚀 OVNI Explorer - Interactive Visualization Platform

A comprehensive web application showcasing the full potential of this dataset through advanced data visualization and AI-powered features.

**Live Demo**: [https://studiomaak3d.github.io/OVNI/](https://studiomaak3d.github.io/OVNI/)

**Key Features**:
- **Interactive France Map**: Choropleth visualization of 5,954 UFO cases across French departments with real-time filtering by classification, time period, and region
- **AI-Generated 3D Reconstructions**: Witness testimonies transformed into photorealistic 3D spacecraft models using AI image generation
- **Advanced Search Interface**: Full-text search with multi-criteria filtering (shape, color, date, location, classification)
- **Visual Description Extraction**: Automated extraction and formatting of visual characteristics from testimonies, optimized for AI prompt generation
- **Statistical Dashboard**: Real-time analytics with classification distribution, temporal trends, and geographic insights
- **Case Detail Viewer**: Complete case files with structured testimony data, investigation reports, and cross-referenced observations

**Technologies**: Next.js, React, Three.js, D3.js, TypeScript, Tailwind CSS

**Perfect for**: Demonstrating practical applications of the dataset in data visualization, AI integration, and interactive web experiences.

## Data Source

Official data from **GEIPAN** (CNES):
- 🔗 [Official GEIPAN website](https://www.cnes-geipan.fr/)
- 📅 Export date: November 27, 2025
- ⚖️ License: Open Data (French public sector - compatible with Etalab 2.0)

## Transformation Methodology

The transformation script (`prepare_dataset.py`):

1. Loads 2 source CSV files (cases + testimonies)
2. Cleans HTML tags and extra whitespace
3. Removes empty or very sparse columns (>95% empty)
4. Joins cases and testimonies via `case_id`
5. Reorganizes columns (case info first, then testimonies)
6. Exports to optimized CSV

## Important Notes & Disclaimers

- ⚠️ **Testimonies** represent subjective witness statements
- ⚠️ **Classifications** are based on information available at the time of investigation
- ⚠️ Some cases date back several decades (risk of memory alteration)
- ⚠️ **"Unexplained" cases** (D/D1) do not necessarily mean extraterrestrial, but simply that the investigation could not identify the phenomenon with certainty
- ⚠️ All textual content is in **French** (original language of the official records)

### Data Structure Note: Witness Numbering

⚠️ **Witness Numbering Inconsistency**: The original GEIPAN source data has inconsistent witness numbering for some mass sighting events. Some cases have multiple distinct witnesses all numbered `temoin_numero = 1` instead of sequential numbering (1, 2, 3, etc.).

**Impact**:
- The combination `case_id + temoin_numero` is **not always unique** (affects ~1,157 testimonies, ~19%)
- For accurate witness counting, use total row count instead of unique `temoin_numero` values
- Each row still represents a distinct, real testimony with different observation data

**Example**: Case `1990-11-01225` (atmospheric re-entry event) has 567 witnesses, but many share the same `temoin_numero` value while having different ages, colors observed, times, and locations.

**Note**: This is a limitation of the **original GEIPAN source data**, not a data quality issue in this dataset. All testimonies are preserved as-is to maintain data authenticity.

## Citation

If you use this dataset, please cite:

```bibtex
@dataset{geipan_ufo_france_2025,
  title={GEIPAN UFO Cases France - Official French UFO Sightings Dataset},
  author={GEIPAN (CNES)},
  year={2025},
  publisher={Hugging Face},
  howpublished={\url{https://huggingface.co/datasets/pepouze_5/geipan_case_ovni}},
  note={Original data from GEIPAN (French National UAP Investigation Unit).
        Transformed and published by Paloma S.}
}
```

**Plain text citation:**
```
GEIPAN (CNES). (2025). GEIPAN UFO Cases France - Official French UFO Sightings Dataset.
Transformed and published on Hugging Face by Paloma S.
Original source: https://www.cnes-geipan.fr/
```

## License

The source data is **public data** from GEIPAN/CNES (official French government organization).

**License type**: Open Data (French public sector)
**Comparable to**: Etalab 2.0 Open License (French government open data license)
**Source**: GEIPAN - CNES (French National Centre for Space Studies)
**Link**: https://www.cnes-geipan.fr/

### License Summary

This dataset is derived from official French government public data (GEIPAN/CNES) which is freely available under open data principles. The transformed dataset maintains this open nature and can be freely used for:

- ✅ Scientific research
- ✅ Data analysis and statistics
- ✅ Educational projects
- ✅ Commercial applications
- ✅ AI/ML model training
- ✅ Visualization and mapping projects

**Requirements**:
- Attribution to GEIPAN/CNES as the original data source
- Mention of any transformations applied to the data

**Restrictions**: None (open data)

**Legal Disclaimer**: While GEIPAN data is public and freely available, users are responsible for ensuring compliance with local data protection and reuse regulations in their jurisdiction. This dataset contains anonymized witness information in accordance with French data protection standards.

## Top 5 Regions by Number of Cases

1. Haute-Garonne (94 cases)
2. Bouches-du-Rhône (88 cases)
3. Gironde (88 cases)
4. Nord (86 cases)
5. Alpes-Maritimes (73 cases)

## Temporal Distribution

- 1950s: 40 cases
- 1960s: 12 cases
- 1970s: 365 cases
- 1980s: 379 cases
- 1990s: 319 cases
- 2000s: 489 cases
- 2010s: 1,350 cases (peak)
- 2020s: 308 cases

## Notable Cases

The dataset includes several mass sighting events:
- **November 5, 1990**: Atmospheric re-entry with **567 testimonies** (national event)
- **November 11, 1980**: Atmospheric re-entry with **111 testimonies**
- **August 1, 1996**: Atmospheric re-entry with **64 testimonies**

## Contact & Contributions

To report errors or suggest improvements, please open an issue on the repository.

---

**Last updated**: December 2025
**Dataset version**: 1.0
**Language**: French (content) / English (documentation)
