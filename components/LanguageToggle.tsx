'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
      className="fixed top-20 right-6 z-40 px-4 py-2 border border-tech-grey text-tech-grey hover:text-tech-white hover:border-tech-white transition-all text-xs uppercase tracking-wider font-mono bg-tech-dark"
      title={language === 'FR' ? 'Switch to English' : 'Passer au français'}
    >
      {language === 'FR' ? 'EN' : 'FR'}
    </button>
  );
}
