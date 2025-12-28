'use client';

import { CasAvecTemoignages, formatDescriptionsForPrompt } from '@/lib/dataParser';
import { useState } from 'react';

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

  const getClassificationLabel = (classification: string) => {
    const labels: Record<string, string> = {
      A: 'Identifié',
      B: 'Probable explication',
      C: 'Information insuffisante',
      D: 'Non expliqué',
    };
    return labels[classification.toUpperCase()] || classification;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {cas.titre}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cas {cas.id} • {cas.date} • {cas.region}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Informations générales
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{cas.date}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Classification:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {cas.classification} - {getClassificationLabel(cas.classification)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Région:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{cas.region}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Département:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{cas.departement}</span>
              </div>
            </div>
          </div>

          {/* Résumé */}
          {cas.resumeCourt && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Résumé
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{cas.resumeCourt}</p>
            </div>
          )}

          {/* Descriptions visuelles */}
          {cas.temoignages.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Descriptions visuelles ({cas.temoignages.length} témoignage
                  {cas.temoignages.length > 1 ? 's' : ''})
                </h3>
                <button
                  onClick={handleCopyDescriptions}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copied ? '✓ Copié !' : '📋 Copier les descriptions'}
                </button>
              </div>

              <div className="space-y-4">
                {cas.temoignages.map((temoignage, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Témoignage {index + 1}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {temoignage.forme && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Forme:
                          </span>
                          <p className="text-gray-900 dark:text-white">{temoignage.forme}</p>
                        </div>
                      )}
                      {temoignage.couleur && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Couleur:
                          </span>
                          <p className="text-gray-900 dark:text-white">{temoignage.couleur}</p>
                        </div>
                      )}
                      {temoignage.taille && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Taille:
                          </span>
                          <p className="text-gray-900 dark:text-white">{temoignage.taille}</p>
                        </div>
                      )}
                      {temoignage.vitesse && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Vitesse:
                          </span>
                          <p className="text-gray-900 dark:text-white">{temoignage.vitesse}</p>
                        </div>
                      )}
                      {temoignage.heure && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Heure:
                          </span>
                          <p className="text-gray-900 dark:text-white">{temoignage.heure}</p>
                        </div>
                      )}
                      {temoignage.trajectoire && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Trajectoire:
                          </span>
                          <p className="text-gray-900 dark:text-white">{temoignage.trajectoire}</p>
                        </div>
                      )}
                      {temoignage.apparence && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Apparence:
                          </span>
                          <p className="text-gray-900 dark:text-white">{temoignage.apparence}</p>
                        </div>
                      )}
                      {temoignage.meteo && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Météo:
                          </span>
                          <p className="text-gray-900 dark:text-white">{temoignage.meteo}</p>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Description détaillée
              </h3>
              <div
                className="text-sm text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: cas.descriptionDetaillee }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
