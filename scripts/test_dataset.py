#!/usr/bin/env python3
"""
Script de validation du dataset GEIPAN nettoyé
Vérifie la qualité des données, la jointure, et l'intégrité
"""

import pandas as pd
from pathlib import Path

# Chemins
DATA_DIR = Path(__file__).parent.parent / "data"
CLEANED_CSV = DATA_DIR / "geipan_case_ovni_cleaned.csv"
ORIGINAL_CAS = DATA_DIR / "export_cas_pub_20251127093552.csv"
ORIGINAL_TEMOIGNAGES = DATA_DIR / "export_temoignages_pub_20251127093610.csv"

def test_fichier_existe():
    """Vérifie que le fichier nettoyé existe"""
    print("=" * 70)
    print("TEST 1 : Existence du fichier")
    print("=" * 70)

    if CLEANED_CSV.exists():
        file_size = CLEANED_CSV.stat().st_size / (1024 * 1024)
        print(f"✅ Fichier trouvé : {CLEANED_CSV.name}")
        print(f"   Taille : {file_size:.2f} MB")
        return True
    else:
        print(f"❌ Fichier non trouvé : {CLEANED_CSV}")
        return False

def test_chargement():
    """Teste le chargement du CSV"""
    print("\n" + "=" * 70)
    print("TEST 2 : Chargement du CSV")
    print("=" * 70)

    try:
        df = pd.read_csv(CLEANED_CSV, sep='|', encoding='utf-8')
        print(f"✅ CSV chargé avec succès")
        print(f"   Dimensions : {len(df):,} lignes × {len(df.columns)} colonnes")
        return df
    except Exception as e:
        print(f"❌ Erreur de chargement : {e}")
        return None

def test_structure(df):
    """Vérifie la structure du dataset"""
    print("\n" + "=" * 70)
    print("TEST 3 : Structure des colonnes")
    print("=" * 70)

    # Colonnes obligatoires
    colonnes_requises = ['case_id', 'cas_titre_localisation', 'cas_classification',
                         'cas_date_observation', 'cas_region', 'cas_departement']

    manquantes = [col for col in colonnes_requises if col not in df.columns]

    if manquantes:
        print(f"❌ Colonnes manquantes : {manquantes}")
        return False
    else:
        print(f"✅ Toutes les colonnes requises présentes")

    # Affiche les 20 premières colonnes
    print(f"\n   Premières colonnes :")
    for i, col in enumerate(df.columns[:20], 1):
        print(f"      {i:2d}. {col}")

    if len(df.columns) > 20:
        print(f"      ... et {len(df.columns) - 20} autres colonnes")

    return True

def test_jointure(df):
    """Vérifie la qualité de la jointure"""
    print("\n" + "=" * 70)
    print("TEST 4 : Qualité de la jointure")
    print("=" * 70)

    # Charge les fichiers originaux
    df_cas_orig = pd.read_csv(ORIGINAL_CAS, sep='|', header=None, skiprows=[0], dtype=str)
    df_temoignages_orig = pd.read_csv(ORIGINAL_TEMOIGNAGES, sep='|', dtype=str)

    cas_orig_count = len(df_cas_orig)
    temoignages_orig_count = len(df_temoignages_orig)

    print(f"📊 Fichiers originaux :")
    print(f"   • {cas_orig_count:,} cas")
    print(f"   • {temoignages_orig_count:,} témoignages")

    print(f"\n📊 Dataset nettoyé :")
    print(f"   • {len(df):,} lignes totales")
    print(f"   • {df['case_id'].nunique():,} cas uniques")

    # Vérifie que tous les témoignages sont présents
    if len(df) < temoignages_orig_count:
        print(f"⚠️  Attention : {temoignages_orig_count - len(df)} témoignages manquants")
    elif len(df) == temoignages_orig_count:
        print(f"✅ Tous les témoignages présents")
    else:
        print(f"⚠️  Plus de lignes que de témoignages originaux (+{len(df) - temoignages_orig_count})")

    # Vérifie que toutes les lignes ont des infos de cas
    lignes_sans_cas = df[df['cas_titre_localisation'].isna() | (df['cas_titre_localisation'] == '')]

    if len(lignes_sans_cas) > 0:
        print(f"❌ {len(lignes_sans_cas)} lignes sans informations de cas (jointure échouée)")
        return False
    else:
        print(f"✅ Toutes les lignes ont des informations de cas")

    # Distribution des témoignages par cas
    temoignages_par_cas = df.groupby('case_id').size()
    print(f"\n📊 Distribution témoignages/cas :")
    print(f"   • Minimum : {temoignages_par_cas.min()} témoignage(s)")
    print(f"   • Moyenne : {temoignages_par_cas.mean():.2f} témoignages")
    print(f"   • Maximum : {temoignages_par_cas.max()} témoignages")
    print(f"   • Médiane : {temoignages_par_cas.median():.0f} témoignage(s)")

    return True

def test_nettoyage_html(df):
    """Vérifie que les balises HTML ont été nettoyées"""
    print("\n" + "=" * 70)
    print("TEST 5 : Nettoyage des balises HTML")
    print("=" * 70)

    colonnes_texte = ['cas_description_detaillee', 'cas_resume_court', 'cas_notes_additionnelles']

    total_br = 0
    for col in colonnes_texte:
        if col in df.columns:
            br_count = df[col].astype(str).str.contains('<br', case=False, na=False).sum()
            total_br += br_count
            if br_count > 0:
                print(f"⚠️  {br_count} balises <br> trouvées dans '{col}'")

    if total_br == 0:
        print(f"✅ Aucune balise HTML <br> trouvée")
        return True
    else:
        print(f"❌ {total_br} balises HTML <br> restantes au total")
        return False

def test_colonnes_vides(df):
    """Vérifie qu'il n'y a pas de colonnes 100% vides"""
    print("\n" + "=" * 70)
    print("TEST 6 : Colonnes vides")
    print("=" * 70)

    colonnes_vides = []
    for col in df.columns:
        if df[col].isna().all() or (df[col].astype(str).str.strip() == '').all():
            colonnes_vides.append(col)

    if colonnes_vides:
        print(f"⚠️  {len(colonnes_vides)} colonne(s) entièrement vide(s) :")
        for col in colonnes_vides:
            print(f"      - {col}")
        return False
    else:
        print(f"✅ Aucune colonne entièrement vide")
        return True

def test_classifications(df):
    """Vérifie les classifications"""
    print("\n" + "=" * 70)
    print("TEST 7 : Classifications")
    print("=" * 70)

    if 'cas_classification' not in df.columns:
        print(f"❌ Colonne 'cas_classification' manquante")
        return False

    classif_counts = df.groupby('cas_classification')['case_id'].nunique().sort_index()

    print(f"📊 Répartition des cas par classification :")
    for classif, count in classif_counts.items():
        if pd.notna(classif) and classif != '':
            print(f"   • {classif:4s} : {count:4,} cas")

    # Vérifie les classifications valides
    classif_valides = {'A', 'B', 'C', 'D', 'D1', 'D2', 'NC'}
    classif_invalides = set(classif_counts.index) - classif_valides - {float('nan'), ''}

    if classif_invalides:
        print(f"⚠️  Classifications non standards : {classif_invalides}")
    else:
        print(f"✅ Toutes les classifications sont valides")

    return True

def test_echantillons(df):
    """Affiche quelques exemples de données"""
    print("\n" + "=" * 70)
    print("TEST 8 : Exemples de données")
    print("=" * 70)

    # Prend 3 cas au hasard
    cas_sample = df.groupby('case_id').first().sample(n=min(3, len(df)))

    for idx, (case_id, row) in enumerate(cas_sample.iterrows(), 1):
        nb_temoignages = len(df[df['case_id'] == case_id])
        print(f"\n📝 Exemple {idx} : {case_id}")
        print(f"   • Titre : {row['cas_titre_localisation'][:60]}...")
        print(f"   • Date : {row['cas_date_observation']}")
        print(f"   • Région : {row['cas_region']}")
        print(f"   • Classification : {row['cas_classification']}")
        print(f"   • Témoignages : {nb_temoignages}")
        if 'cas_resume_court' in row and pd.notna(row['cas_resume_court']):
            resume = str(row['cas_resume_court'])[:100]
            print(f"   • Résumé : {resume}...")

def test_donnees_geographiques(df):
    """Vérifie les données géographiques"""
    print("\n" + "=" * 70)
    print("TEST 9 : Données géographiques")
    print("=" * 70)

    # Régions
    if 'cas_region' in df.columns:
        nb_regions = df['cas_region'].nunique()
        print(f"✅ {nb_regions} régions uniques")

        top_regions = df.groupby('cas_region')['case_id'].nunique().sort_values(ascending=False).head(5)
        print(f"\n   Top 5 régions par nombre de cas :")
        for region, count in top_regions.items():
            if pd.notna(region) and region != '':
                print(f"      • {region:30s} : {count:3,} cas")

    # Départements
    if 'cas_departement' in df.columns:
        nb_depts = df['cas_departement'].nunique()
        print(f"\n✅ {nb_depts} départements uniques")

def test_dates(df):
    """Vérifie les dates"""
    print("\n" + "=" * 70)
    print("TEST 10 : Données temporelles")
    print("=" * 70)

    if 'cas_date_observation' not in df.columns:
        print(f"❌ Colonne de date manquante")
        return False

    # Parse les dates
    try:
        df['date_parsed'] = pd.to_datetime(df['cas_date_observation'], format='%d/%m/%Y', errors='coerce')

        date_min = df['date_parsed'].min()
        date_max = df['date_parsed'].max()

        print(f"✅ Période couverte :")
        print(f"   • Plus ancienne : {date_min.strftime('%d/%m/%Y')}")
        print(f"   • Plus récente : {date_max.strftime('%d/%m/%Y')}")
        print(f"   • Durée : {(date_max - date_min).days / 365.25:.1f} années")

        # Distribution par décennie
        df['decade'] = (df['date_parsed'].dt.year // 10) * 10
        decade_counts = df.groupby('decade')['case_id'].nunique().sort_index()

        print(f"\n   Cas par décennie :")
        for decade, count in decade_counts.tail(8).items():
            if pd.notna(decade):
                print(f"      • {int(decade)}s : {count:3,} cas")

        return True
    except Exception as e:
        print(f"⚠️  Erreur de parsing des dates : {e}")
        return False

def main():
    print("\n")
    print("🧪 " + "=" * 66 + " 🧪")
    print("   VALIDATION DU DATASET GEIPAN NETTOYÉ")
    print("🧪 " + "=" * 66 + " 🧪")
    print()

    tests_results = []

    # Test 1
    if not test_fichier_existe():
        print("\n❌ Tests arrêtés : fichier non trouvé")
        return

    # Test 2
    df = test_chargement()
    if df is None:
        print("\n❌ Tests arrêtés : impossible de charger le fichier")
        return

    # Tests 3-10
    tests_results.append(("Structure", test_structure(df)))
    tests_results.append(("Jointure", test_jointure(df)))
    tests_results.append(("Nettoyage HTML", test_nettoyage_html(df)))
    tests_results.append(("Colonnes vides", test_colonnes_vides(df)))
    tests_results.append(("Classifications", test_classifications(df)))
    test_echantillons(df)
    test_donnees_geographiques(df)
    tests_results.append(("Dates", test_dates(df)))

    # Résumé
    print("\n" + "=" * 70)
    print("📊 RÉSUMÉ DES TESTS")
    print("=" * 70)

    passed = sum(1 for _, result in tests_results if result)
    total = len(tests_results)

    for test_name, result in tests_results:
        status = "✅" if result else "❌"
        print(f"{status} {test_name}")

    print()
    print(f"Score : {passed}/{total} tests réussis ({passed/total*100:.0f}%)")

    if passed == total:
        print("\n🎉 Tous les tests sont passés ! Le dataset est prêt pour Hugging Face.")
    else:
        print(f"\n⚠️  {total - passed} test(s) échoué(s). Vérifiez les erreurs ci-dessus.")

    print("\n" + "=" * 70 + "\n")

if __name__ == "__main__":
    main()
