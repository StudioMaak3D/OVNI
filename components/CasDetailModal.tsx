'use client';

import { CasAvecTemoignages, formatDescriptionsForPrompt } from '@/lib/dataParser';
import { getClassificationLabel, getClassificationColor } from '@/lib/mapUtils';
import { useState } from 'react';
import '@/styles/technical-map.css';

interface CasDetailModalProps {
  cas: CasAvecTemoignages | null;
  onClose: () => void;
}

export default function CasDetailModal({ cas, onClose }: CasDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!cas) return null;

  const handleCopyDescriptions = async () => {
    const prompt = formatDescriptionsForPrompt(cas);
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-tech-dark border-2 border-tech-bright shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto terminal-text"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-tech-dark border-b border-tech p-6 flex justify-between items-start z-10">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-tech-white mb-2 uppercase tracking-wider">
              {cas.titre}
            </h2>
            <p className="text-xs text-tech-grey font-mono">
              [CAS {cas.id}] • {cas.date} • {cas.region}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-tech-grey hover:text-tech-white text-2xl transition-colors ml-4"
          >
            [X]
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div>
            <h3 className="text-xs font-bold text-tech-grey mb-3 uppercase tracking-wider">
              {'//'} INFORMATIONS GÉNÉRALES
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-tech-dim">DATE:</span>
                <span className="ml-2 text-tech-white font-mono">{cas.date}</span>
              </div>
              <div>
                <span className="text-tech-dim">CLASSIFICATION:</span>
                <span
                  className="ml-2 classification-badge text-xs"
                  style={{
                    color: getClassificationColor(cas.classification),
                    borderColor: getClassificationColor(cas.classification)
                  }}
                >
                  [{cas.classification}] {getClassificationLabel(cas.classification)}
                </span>
              </div>
              <div>
                <span className="text-tech-dim">RÉGION:</span>
                <span className="ml-2 text-tech-white font-mono">{cas.region}</span>
              </div>
              <div>
                <span className="text-tech-dim">DÉPARTEMENT:</span>
                <span className="ml-2 text-tech-white font-mono">{cas.departement}</span>
              </div>
            </div>
          </div>

          {/* Résumé */}
          {cas.resumeCourt && (
            <div>
              <h3 className="text-xs font-bold text-tech-grey mb-3 uppercase tracking-wider border-t border-tech pt-4">
                {'//'} RÉSUMÉ
              </h3>
              <p className="text-sm text-tech-white leading-relaxed text-body">{cas.resumeCourt}</p>
            </div>
          )}

          {/* Descriptions visuelles */}
          {cas.temoignages.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3 border-t border-tech pt-4">
                <h3 className="text-xs font-bold text-tech-grey uppercase tracking-wider">
                  {'//'} DESCRIPTIONS VISUELLES ({cas.temoignages.length} TÉMOIGNAGE
                  {cas.temoignages.length > 1 ? 'S' : ''})
                </h3>
                <button
                  onClick={handleCopyDescriptions}
                  className="terminal-button text-xs px-3 py-1"
                >
                  {copied ? '[✓ COPIÉ]' : '[COPIER LES DESCRIPTIONS]'}
                </button>
              </div>

              <div className="space-y-4">
                {cas.temoignages.map((temoignage, index) => (
                  <div
                    key={index}
                    className="bg-tech-darker border border-tech p-4"
                  >
                    <h4 className="font-bold text-tech-white mb-3 text-xs uppercase tracking-wider">
                      &gt; TÉMOIGNAGE {String(index + 1).padStart(2, '0')}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {temoignage.forme && (
                        <div>
                          <span className="text-tech-dim font-medium uppercase">
                            FORME:
                          </span>
                          <p className="text-tech-white mt-1 text-body text-sm">{temoignage.forme}</p>
                        </div>
                      )}
                      {temoignage.couleur && (
                        <div>
                          <span className="text-tech-dim font-medium uppercase">
                            COULEUR:
                          </span>
                          <p className="text-tech-white mt-1 text-body text-sm">{temoignage.couleur}</p>
                        </div>
                      )}
                      {temoignage.taille && (
                        <div>
                          <span className="text-tech-dim font-medium uppercase">
                            TAILLE:
                          </span>
                          <p className="text-tech-white mt-1 text-body text-sm">{temoignage.taille}</p>
                        </div>
                      )}
                      {temoignage.vitesse && (
                        <div>
                          <span className="text-tech-dim font-medium uppercase">
                            VITESSE:
                          </span>
                          <p className="text-tech-white mt-1 text-body text-sm">{temoignage.vitesse}</p>
                        </div>
                      )}
                      {temoignage.heure && (
                        <div>
                          <span className="text-tech-dim font-medium uppercase">
                            HEURE:
                          </span>
                          <p className="text-tech-white mt-1 text-body text-sm">{temoignage.heure}</p>
                        </div>
                      )}
                      {temoignage.trajectoire && (
                        <div>
                          <span className="text-tech-dim font-medium uppercase">
                            TRAJECTOIRE:
                          </span>
                          <p className="text-tech-white mt-1 text-body text-sm">{temoignage.trajectoire}</p>
                        </div>
                      )}
                      {temoignage.apparence && (
                        <div>
                          <span className="text-tech-dim font-medium uppercase">
                            APPARENCE:
                          </span>
                          <p className="text-tech-white mt-1 text-body text-sm">{temoignage.apparence}</p>
                        </div>
                      )}
                      {temoignage.meteo && (
                        <div>
                          <span className="text-tech-dim font-medium uppercase">
                            MÉTÉO:
                          </span>
                          <p className="text-tech-white mt-1 text-body text-sm">{temoignage.meteo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description détaillée */}
          {cas.descriptionDetaillee && (
            <div>
              <h3 className="text-xs font-bold text-tech-grey mb-3 uppercase tracking-wider border-t border-tech pt-4">
                {'//'} DESCRIPTION DÉTAILLÉE
              </h3>
              <div
                className="text-sm text-tech-white leading-relaxed prose-sm max-w-none text-body"
                dangerouslySetInnerHTML={{ __html: cas.descriptionDetaillee }}
                style={{
                  color: '#FFFFFF'
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-tech-darker border-t border-tech p-6 flex justify-end">
          <button
            onClick={onClose}
            className="terminal-button px-6 py-2 text-xs"
          >
            [FERMER]
          </button>
        </div>
      </div>
    </div>
  );
}
