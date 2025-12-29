'use client';

import { useState } from 'react';

interface AIInfoButtonProps {
  type: 'image' | '3d' | 'video';
  tooltipPosition?: 'top' | 'right';
}

export default function AIInfoButton({ type, tooltipPosition = 'top' }: AIInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getMessage = () => {
    switch (type) {
      case 'image':
        return "Cette image a été générée avec un modèle d'IA générative d'après les témoignages collectés.";
      case '3d':
        return "Ce modèle 3D a été généré avec un modèle d'IA générative d'après les témoignages collectés.";
      case 'video':
        return "Cette vidéo a été générée avec un modèle d'IA générative d'après les témoignages collectés.";
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-6 h-6 rounded-full border border-tech-grey text-tech-grey hover:border-tech-white hover:text-tech-white transition-colors flex items-center justify-center text-xs font-bold"
        aria-label="Information"
      >
        ?
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Tooltip */}
          <div className={`absolute z-50 w-64 ${
            tooltipPosition === 'right'
              ? 'left-full top-0 ml-2'
              : 'bottom-full left-0 mb-2'
          }`}>
            <div className="bg-tech-dark border border-tech p-3 shadow-lg">
              <div className="text-tech-white text-xs leading-relaxed">
                {getMessage()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
