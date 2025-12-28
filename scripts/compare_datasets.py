#!/usr/bin/env python3
"""
Compare automated vs manually corrected dataset
"""

import pandas as pd
import re

print("\n" + "="*100)
print("📊 COMPARISON: Automated vs Manual Cleaning")
print("="*100)

# Load both files
print("\n🔄 Loading datasets...")
df_auto = pd.read_csv('/Users/palomasanchezc/Documents/OVNI/data/geipan_case_ovni_cleaned.csv',
                      sep='|', encoding='utf-8', low_memory=False)
df_manual = pd.read_csv('/Users/palomasanchezc/Documents/OVNI/data/geipan_case_ovni_cleaned_corrected.csv',
                        sep='|', encoding='utf-8', low_memory=False)

print(f"✅ Automated version: {len(df_auto)} rows × {len(df_auto.columns)} columns")
print(f"✅ Manual version: {len(df_manual)} rows × {len(df_manual.columns)} columns")

# 1. STRUCTURE COMPARISON
print("\n" + "="*100)
print("1️⃣  STRUCTURE COMPARISON")
print("="*100)

print(f"\n📏 Row count:")
print(f"   Automated: {len(df_auto)}")
print(f"   Manual:    {len(df_manual)}")
print(f"   Difference: {len(df_manual) - len(df_auto)} rows")

print(f"\n📊 Column count:")
print(f"   Automated: {len(df_auto.columns)}")
print(f"   Manual:    {len(df_manual.columns)}")
print(f"   Difference: {len(df_manual.columns) - len(df_auto.columns)} columns")

# Check if columns match
if list(df_auto.columns) == list(df_manual.columns):
    print("✅ Column names are identical")
else:
    print("⚠️  Column names differ:")
    auto_only = set(df_auto.columns) - set(df_manual.columns)
    manual_only = set(df_manual.columns) - set(df_auto.columns)
    if auto_only:
        print(f"   Only in automated: {auto_only}")
    if manual_only:
        print(f"   Only in manual: {manual_only}")

# 2. DATA QUALITY COMPARISON
print("\n" + "="*100)
print("2️⃣  DATA QUALITY COMPARISON")
print("="*100)

# Duplicates
print(f"\n🔍 Duplicates:")
auto_dupes = df_auto.duplicated().sum()
manual_dupes = df_manual.duplicated().sum()
print(f"   Automated: {auto_dupes}")
print(f"   Manual:    {manual_dupes}")
if manual_dupes < auto_dupes:
    print(f"   ✅ Manual is better (-{auto_dupes - manual_dupes} duplicates)")
elif manual_dupes > auto_dupes:
    print(f"   ⚠️  Automated is better (-{manual_dupes - auto_dupes} duplicates)")
else:
    print("   ➡️  Same quality")

# Case ID duplicates
print(f"\n🆔 case_id duplicates:")
auto_case_dupes = df_auto['case_id'].duplicated().sum()
manual_case_dupes = df_manual['case_id'].duplicated().sum()
print(f"   Automated: {auto_case_dupes}")
print(f"   Manual:    {manual_case_dupes}")

# HTML tags check
print(f"\n🏷️  HTML tags remaining:")
def count_html_tags(df):
    total = 0
    for col in df.select_dtypes(include=['object']).columns:
        total += df[col].astype(str).str.contains(r'<br', regex=True, na=False).sum()
    return total

auto_html = count_html_tags(df_auto)
manual_html = count_html_tags(df_manual)
print(f"   Automated: {auto_html} instances")
print(f"   Manual:    {manual_html} instances")
if manual_html < auto_html:
    print(f"   ✅ Manual is better (-{auto_html - manual_html} HTML tags)")
elif manual_html > auto_html:
    print(f"   ⚠️  Automated is better (-{manual_html - auto_html} HTML tags)")
else:
    print("   ✅ Both clean")

# Missing values
print(f"\n❓ Missing values (critical columns):")
critical_cols = ['case_id', 'cas_titre_localisation', 'cas_date_observation', 'cas_classification']
for col in critical_cols:
    auto_miss = df_auto[col].isna().sum()
    manual_miss = df_manual[col].isna().sum()
    diff = manual_miss - auto_miss
    status = "✅" if diff == 0 else ("⚠️" if diff > 0 else "📈")
    print(f"   {col:30s}: Auto={auto_miss:4d} | Manual={manual_miss:4d} {status}")

# 3. CONTENT DIFFERENCES
print("\n" + "="*100)
print("3️⃣  CONTENT DIFFERENCES")
print("="*100)

# Check if dataframes are identical
if df_auto.equals(df_manual):
    print("\n✅ Datasets are IDENTICAL - No differences found")
else:
    print("\n⚠️  Datasets have differences")

    # Find differing cells
    print("\n🔍 Analyzing cell-by-cell differences...")
    differences = []

    # Only compare if same shape
    if df_auto.shape == df_manual.shape:
        for col in df_auto.columns:
            # Convert to string for comparison to handle NaN
            auto_col = df_auto[col].fillna('').astype(str)
            manual_col = df_manual[col].fillna('').astype(str)

            diff_mask = auto_col != manual_col
            diff_count = diff_mask.sum()

            if diff_count > 0:
                differences.append({
                    'column': col,
                    'diff_count': diff_count,
                    'pct': (diff_count / len(df_auto)) * 100
                })

        if differences:
            print(f"\n📊 Found differences in {len(differences)} columns:")
            differences_sorted = sorted(differences, key=lambda x: x['diff_count'], reverse=True)

            for i, diff in enumerate(differences_sorted[:10], 1):
                print(f"\n   {i}. {diff['column']}")
                print(f"      Changed cells: {diff['diff_count']} ({diff['pct']:.2f}%)")

                # Show examples
                col = diff['column']
                diff_mask = (df_auto[col].fillna('').astype(str) !=
                           df_manual[col].fillna('').astype(str))
                diff_indices = df_auto[diff_mask].head(3).index

                for idx in diff_indices:
                    auto_val = str(df_auto.loc[idx, col])[:60]
                    manual_val = str(df_manual.loc[idx, col])[:60]
                    print(f"      Row {idx}:")
                    print(f"         Auto:   {auto_val}...")
                    print(f"         Manual: {manual_val}...")

            if len(differences_sorted) > 10:
                print(f"\n   ... and {len(differences_sorted) - 10} more columns with differences")

# 4. FILE SIZE COMPARISON
print("\n" + "="*100)
print("4️⃣  FILE SIZE COMPARISON")
print("="*100)

import os
auto_size = os.path.getsize('/Users/palomasanchezc/Documents/OVNI/data/geipan_case_ovni_cleaned.csv')
manual_size = os.path.getsize('/Users/palomasanchezc/Documents/OVNI/data/geipan_case_ovni_cleaned_corrected.csv')

print(f"\n📦 File sizes:")
print(f"   Automated: {auto_size:,} bytes ({auto_size/1024/1024:.2f} MB)")
print(f"   Manual:    {manual_size:,} bytes ({manual_size/1024/1024:.2f} MB)")
print(f"   Difference: {abs(manual_size - auto_size):,} bytes ({abs(manual_size - auto_size)/1024/1024:.2f} MB)")

# 5. FINAL VERDICT
print("\n" + "="*100)
print("5️⃣  FINAL VERDICT")
print("="*100)

score_auto = 0
score_manual = 0

# Scoring
if manual_dupes < auto_dupes:
    score_manual += 1
elif auto_dupes < manual_dupes:
    score_auto += 1

if manual_html < auto_html:
    score_manual += 1
elif auto_html < manual_html:
    score_auto += 1

if len(df_manual) > len(df_auto):
    score_manual += 1
elif len(df_auto) > len(df_manual):
    score_auto += 1

print(f"\n🏆 Quality Score:")
print(f"   Automated: {score_auto}/3")
print(f"   Manual:    {score_manual}/3")

if score_manual > score_auto:
    print(f"\n✅ WINNER: Manual version is better!")
    print("   Recommendation: Use the manually corrected version for Hugging Face upload")
elif score_auto > score_manual:
    print(f"\n✅ WINNER: Automated version is better!")
    print("   Recommendation: Use the automated version for Hugging Face upload")
else:
    print(f"\n➡️  TIE: Both versions have similar quality")
    print("   Recommendation: Review specific differences above to decide")

print("\n" + "="*100)
