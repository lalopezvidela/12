import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  onSelectLanguage: (lang: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelectLanguage }) => {
  const buttonStyle = "w-full px-6 py-3 border-2 border-pink-500 text-pink-500 font-bold rounded-lg neon-lang-btn hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-500 transition-colors text-lg";
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-black">
      <style>{`
        .neon-lang-btn {
          box-shadow: 0 0 12px 2px #ec4899, 0 0 24px 4px #fff2;
          border-color: #ec4899;
          transition: box-shadow 0.3s, border-color 0.3s;
        }
        .neon-lang-btn:hover, .neon-lang-btn:focus {
          box-shadow: 0 0 24px 6px #ec4899, 0 0 48px 12px #fff4;
          border-color: #fff;
        }
      `}</style>
        <div className="space-y-5 w-full max-w-xs">
            <button onClick={() => onSelectLanguage('en')} className={buttonStyle}>English</button>
            <button onClick={() => onSelectLanguage('es')} className={buttonStyle}>Español</button>
            <button onClick={() => onSelectLanguage('pt')} className={buttonStyle}>Português</button>
        </div>
    </div>
  );
};

export default LanguageSelector;