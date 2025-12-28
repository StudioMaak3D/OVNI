#!/usr/bin/env python3
"""
Script de transformation des données GEIPAN pour Hugging Face
Crée un CSV dénormalisé optimisé (1 ligne = 1 témoignage + infos du cas)
"""

import pandas as pd
import re
from pathlib import Path

# Chemins des fichiers
DATA_DIR = Path(__file__).parent.parent / "data"
INPUT_CAS = DATA_DIR / "export_cas_pub_20251127093552.csv"
INPUT_TEMOIGNAGES = DATA_DIR / "export_temoignages_pub_20251127093610.csv"
OUTPUT_CSV = DATA_DIR / "geipan_case_ovni_cleaned.csv"

# Headers pour le fichier cas (15 colonnes)
CAS_HEADERS = [
    "case_id",
    "titre_localisation",
    "date_observation",
    "departement",
    "region",
    "colonne_vide",  # Sera supprimée
    "zone_geographique",
    "resume_court",
    "reference_document",
    "description_detaillee",
    "notes_additionnelles",
    "info_additionnelle",
    "classification",
    "date_publication",
    "source"
]

def nettoyer_html(texte):
    """Remplace les balises HTML <br> par des espaces"""
    if pd.isna(texte):
        return texte
    texte = str(texte)
    # Remplace <br>, <br/>, <br />, <br<, etc. par un espace (y compris balises mal formées)
    texte = re.sub(r'<br\s*/?>|<br<', ' ', texte, flags=re.IGNORECASE)
    # Nettoie les espaces multiples
    texte = re.sub(r'\s+', ' ', texte)
    return texte.strip()

def charger_cas():
    """Charge et nettoie le fichier des cas"""
    print("📂 Chargement du fichier cas...")

    # Lecture avec pipe delimiter, skip blank line
    df_cas = pd.read_csv(
        INPUT_CAS,
        sep='|',
        header=None,
        names=CAS_HEADERS,
        skiprows=[0],  # Skip la première ligne vide
        encoding='utf-8',
        dtype=str,
        keep_default_na=False
    )

    print(f"   ✓ {len(df_cas)} cas chargés")

    # Nettoie les case_id (trim espaces)
    df_cas['case_id'] = df_cas['case_id'].str.strip()

    # Vérifie et supprime les doublons de case_id dans les cas
    duplicates_cas = df_cas['case_id'].duplicated().sum()
    if duplicates_cas > 0:
        print(f"   ⚠️  {duplicates_cas} case_id en doublon détectés, suppression...")
        df_cas = df_cas.drop_duplicates(subset=['case_id'], keep='first')
        print(f"   ✓ {len(df_cas)} cas après suppression des doublons")

    # Supprime la colonne vide (col 5)
    df_cas = df_cas.drop(columns=['colonne_vide'])

    # Nettoie les balises HTML dans les descriptions
    print("🧹 Nettoyage des balises HTML...")
    df_cas['description_detaillee'] = df_cas['description_detaillee'].apply(nettoyer_html)
    df_cas['resume_court'] = df_cas['resume_court'].apply(nettoyer_html)
    df_cas['notes_additionnelles'] = df_cas['notes_additionnelles'].apply(nettoyer_html)

    # Nettoie les espaces en début/fin
    for col in df_cas.columns:
        if df_cas[col].dtype == 'object':
            df_cas[col] = df_cas[col].str.strip()

    # Remplace les chaînes vides par NaN
    df_cas = df_cas.replace('', pd.NA)

    return df_cas

def charger_temoignages():
    """Charge et nettoie le fichier des témoignages"""
    print("📂 Chargement du fichier témoignages...")

    # Lecture avec pipe delimiter, première ligne = headers
    df_temoignages = pd.read_csv(
        INPUT_TEMOIGNAGES,
        sep='|',
        encoding='utf-8',
        dtype=str,
        keep_default_na=False
    )

    print(f"   ✓ {len(df_temoignages)} témoignages chargés")
    print(f"   ✓ {len(df_temoignages.columns)} colonnes détectées")

    # Renomme la première colonne en case_id pour le join
    df_temoignages.rename(columns={df_temoignages.columns[0]: 'case_id'}, inplace=True)

    # Nettoie les case_id (trim espaces)
    df_temoignages['case_id'] = df_temoignages['case_id'].str.strip()

    # Vérifie les doublons dans les témoignages (devrait être 0)
    duplicates_temoignages = df_temoignages.duplicated().sum()
    if duplicates_temoignages > 0:
        print(f"   ⚠️  {duplicates_temoignages} témoignage(s) en doublon complet détecté(s), suppression...")
        df_temoignages = df_temoignages.drop_duplicates()
        print(f"   ✓ {len(df_temoignages)} témoignages après suppression des doublons")

    # Supprime les colonnes avec >95% de valeurs vides
    print("🧹 Suppression des colonnes très sparse (>95% vides)...")
    threshold = len(df_temoignages) * 0.05  # Garde seulement si >5% rempli
    colonnes_avant = len(df_temoignages.columns)

    df_temoignages = df_temoignages.replace('', pd.NA)
    df_temoignages = df_temoignages.dropna(axis=1, thresh=threshold)

    colonnes_apres = len(df_temoignages.columns)
    print(f"   ✓ {colonnes_avant - colonnes_apres} colonnes supprimées ({colonnes_apres} restantes)")

    # Nettoie les espaces
    for col in df_temoignages.columns:
        if df_temoignages[col].dtype == 'object':
            df_temoignages[col] = df_temoignages[col].str.strip()

    return df_temoignages

def joindre_donnees(df_cas, df_temoignages):
    """Joint les cas et témoignages (1 ligne = 1 témoignage)"""
    print("🔗 Jointure cas + témoignages...")

    # Statistiques avant jointure
    nb_temoignages_input = len(df_temoignages)
    nb_cas_input = len(df_cas)
    print(f"   • {nb_temoignages_input:,} témoignages à joindre")
    print(f"   • {nb_cas_input:,} cas disponibles")

    # Préfixe les colonnes des cas pour éviter les conflits
    colonnes_cas = [col if col == 'case_id' else f'cas_{col}' for col in df_cas.columns]
    df_cas.columns = colonnes_cas

    # Vérifie s'il y a des doublons de case_id dans cas
    duplicates_cas_id = df_cas['case_id'].duplicated().sum()
    if duplicates_cas_id > 0:
        print(f"   ⚠️  ATTENTION: {duplicates_cas_id} case_id en doublon dans le fichier cas!")

    # Left join depuis témoignages (tous les témoignages gardés)
    df_joined = df_temoignages.merge(
        df_cas,
        on='case_id',
        how='left'
    )

    print(f"   ✓ {len(df_joined):,} lignes après jointure")

    # Si on a plus de lignes que de témoignages, c'est qu'il y a un problème
    if len(df_joined) > nb_temoignages_input:
        diff = len(df_joined) - nb_temoignages_input
        print(f"   ⚠️  +{diff} lignes créées par la jointure (doublons de case_id dans fichier cas)")

    # Supprime les doublons exacts
    nb_avant = len(df_joined)
    df_joined = df_joined.drop_duplicates()
    nb_apres = len(df_joined)

    if nb_avant > nb_apres:
        print(f"   ✓ {nb_avant - nb_apres} doublons exacts supprimés")

    print(f"   ✓ {len(df_joined):,} lignes dans le dataset final")

    # Réorganise les colonnes : infos cas d'abord, puis témoignage
    colonnes_cas_prefixees = [col for col in df_joined.columns if col.startswith('cas_')]
    colonnes_temoignages = [col for col in df_joined.columns if not col.startswith('cas_') and col != 'case_id']

    colonnes_ordre = ['case_id'] + colonnes_cas_prefixees + colonnes_temoignages
    df_joined = df_joined[colonnes_ordre]

    return df_joined

def sauvegarder_csv(df, output_path):
    """Sauvegarde le DataFrame en CSV optimisé"""
    print(f"💾 Sauvegarde du CSV final...")

    # Sauvegarde avec pipe delimiter (cohérent avec l'original)
    df.to_csv(
        output_path,
        sep='|',
        index=False,
        encoding='utf-8',
        na_rep=''  # Valeurs manquantes = chaîne vide
    )

    # Stats du fichier
    file_size = output_path.stat().st_size / (1024 * 1024)  # MB
    print(f"   ✓ Fichier créé : {output_path.name}")
    print(f"   ✓ Taille : {file_size:.2f} MB")
    print(f"   ✓ {len(df)} lignes × {len(df.columns)} colonnes")

def afficher_stats(df):
    """Affiche des statistiques sur le dataset"""
    print("\n📊 Statistiques du dataset final :")
    print(f"   • Total lignes : {len(df):,}")
    print(f"   • Total colonnes : {len(df.columns)}")
    print(f"   • Cas uniques : {df['case_id'].nunique():,}")
    print(f"   • Témoignages par cas (moyenne) : {len(df) / df['case_id'].nunique():.2f}")

    # Distribution des classifications
    if 'cas_classification' in df.columns:
        print(f"\n   Classification des cas :")
        classif_counts = df.groupby('cas_classification')['case_id'].nunique()
        for classif, count in classif_counts.items():
            if classif:
                print(f"      - {classif} : {count:,} cas")

def main():
    print("=" * 60)
    print("🛸 GEIPAN Dataset Preparation pour Hugging Face")
    print("=" * 60)
    print()

    # 1. Charger les données
    df_cas = charger_cas()
    df_temoignages = charger_temoignages()

    print()

    # 2. Joindre les données
    df_final = joindre_donnees(df_cas, df_temoignages)

    print()

    # 3. Afficher les stats
    afficher_stats(df_final)

    print()

    # 4. Sauvegarder
    sauvegarder_csv(df_final, OUTPUT_CSV)

    print()
    print("=" * 60)
    print("✅ Transformation terminée avec succès !")
    print(f"📁 Fichier de sortie : {OUTPUT_CSV}")
    print("=" * 60)

if __name__ == "__main__":
    main()
