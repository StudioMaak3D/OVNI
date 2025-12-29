'use client';

import { useState, useEffect } from 'react';
import '@/styles/technical-map.css';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [language, setLanguage] = useState<'FR' | 'EN'>('FR');

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const t = (fr: string, en: string) => language === 'EN' ? en : fr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="control-panel bg-tech-dark border-tech max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-tech-dark">
          <div className="text-tech-white text-lg font-bold uppercase tracking-wider font-mono">
            {t('À PROPOS', 'ABOUT')}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
              className="text-xs px-3 py-1 border border-tech text-tech-grey hover:text-tech-white hover:border-tech-bright transition-all uppercase tracking-wider font-mono"
            >
              [{language === 'FR' ? 'EN' : 'FR'}]
            </button>
            <button
              onClick={onClose}
              className="text-tech-grey hover:text-tech-white text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-tech-white font-sans">
          {/* Project Section */}
          <div>
            <h2 className="text-tech-dim text-sm mb-3 uppercase tracking-wider font-mono">
              {t('// LE PROJET', '// THE PROJECT')}
            </h2>
            <p className="text-tech-grey text-base leading-relaxed">
              {t(
                "Ce projet présente une visualisation interactive des données d'observations d'OVNI collectées par le GEIPAN. L'objectif est de rendre accessible au public ces témoignages historiques à travers une interface technique moderne.",
                "This project presents an interactive visualization of UFO sighting data collected by GEIPAN. The goal is to make these historical testimonies accessible to the public through a modern technical interface."
              )}
            </p>
          </div>

          {/* GEIPAN Section */}
          <div>
            <h2 className="text-tech-dim text-sm mb-3 uppercase tracking-wider font-mono">
              {t('// QU\'EST-CE QUE LE GEIPAN ?', '// WHAT IS GEIPAN?')}
            </h2>
            <p className="text-tech-grey text-base leading-relaxed mb-3">
              {t(
                "Le GEIPAN (Groupe d'Études et d'Informations sur les Phénomènes Aérospatiaux Non-identifiés) est un service officiel du CNES (Centre National d'Études Spatiales), l'agence spatiale française.",
                "GEIPAN (Study and Information Group on Unidentified Aerospace Phenomena) is an official service of CNES (National Center for Space Studies), the French space agency."
              )}
            </p>
            <p className="text-tech-grey text-base leading-relaxed">
              {t(
                "Créé en 1977, le GEIPAN collecte, analyse et archive les témoignages d'observations de phénomènes aérospatiaux non identifiés rapportés en France. Il est l'un des seuls organismes officiels au monde dédié à l'étude scientifique des PAN (Phénomènes Aérospatiaux Non-identifiés).",
                "Created in 1977, GEIPAN collects, analyzes and archives testimonies of unidentified aerospace phenomena sightings reported in France. It is one of the only official organizations in the world dedicated to the scientific study of UAP (Unidentified Aerospace Phenomena)."
              )}
            </p>
          </div>

          {/* Data Source Section */}
          <div>
            <h2 className="text-tech-dim text-sm mb-3 uppercase tracking-wider font-mono">
              {t('// SOURCE DES DONNÉES', '// DATA SOURCE')}
            </h2>
            <p className="text-tech-grey text-base leading-relaxed mb-4">
              {t(
                "Toutes les données présentées proviennent des archives publiques du GEIPAN, comprenant plus de 3000 cas d'observations documentés depuis 1937. Chaque cas inclut des témoignages détaillés, des classifications et des analyses officielles.",
                "All data presented comes from GEIPAN's public archives, comprising over 3000 documented sighting cases since 1937. Each case includes detailed testimonies, classifications and official analyses."
              )}
            </p>
            <div className="space-y-2">
              <div>
                <span className="text-tech-dim text-sm font-mono">{t('Dataset :', 'Dataset:')}</span>
                <a
                  href="https://huggingface.co/datasets/pepouze5/geipan_case_ovni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-tech-white hover:text-tech-bright underline text-sm transition-colors"
                >
                  Hugging Face - GEIPAN Cases →
                </a>
              </div>
              <div>
                <span className="text-tech-dim text-sm font-mono">{t('Site officiel :', 'Official website:')}</span>
                <a
                  href="https://www.cnes-geipan.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-tech-white hover:text-tech-bright underline text-sm transition-colors"
                >
                  GEIPAN-CNES →
                </a>
              </div>
            </div>
          </div>

          {/* AI Content Section */}
          <div>
            <h2 className="text-tech-white text-sm mb-3 uppercase tracking-wider font-bold font-mono">
              {t('// CONTENU VISUEL GÉNÉRÉ PAR IA', '// AI-GENERATED VISUAL CONTENT')}
            </h2>
            <p className="text-tech-grey text-base leading-relaxed mb-3">
              {t(
                "IMPORTANT : Tout le contenu visuel présenté sur ce site (modèles 3D, illustrations, images et vidéos) a été généré par intelligence artificielle à partir des descriptions textuelles contenues dans les témoignages originaux.",
                "IMPORTANT: All visual content presented on this site (3D models, illustrations, images and videos) has been generated by artificial intelligence from textual descriptions contained in the original testimonies."
              )}
            </p>
            <p className="text-tech-grey text-base leading-relaxed">
              {t(
                "Ces représentations visuelles sont des interprétations artistiques basées sur les témoignages et ne constituent pas des preuves photographiques ou documentaires réelles. Elles servent à illustrer et à donner vie aux descriptions des témoins.",
                "These visual representations are artistic interpretations based on testimonies and do not constitute actual photographic or documentary evidence. They serve to illustrate and bring to life the witnesses' descriptions."
              )}
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-tech-dim text-sm mb-3 uppercase tracking-wider font-mono">
              {t('// CONTACT', '// CONTACT')}
            </h2>
            <p className="text-tech-grey text-base leading-relaxed">
              <a
                href="mailto:contact@studiomaak.fr"
                className="text-tech-white hover:text-tech-bright underline transition-colors"
              >
                contact@studiomaak.fr
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-tech-dim text-xs pt-4 font-mono">
            {t(
              'Données publiques du GEIPAN-CNES • Visualisations générées par IA',
              'GEIPAN-CNES public data • AI-generated visualizations'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
