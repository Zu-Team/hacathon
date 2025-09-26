/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, {useState, useEffect, useRef} from 'react';

interface LanguageSwitcherProps {
  lang: 'ar-SA' | 'en-US';
  setLang: (lang: 'ar-SA' | 'en-US') => void;
  theme: 'light' | 'dark';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  lang,
  setLang,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = theme === 'dark';
  const isArabic = lang === 'ar-SA';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full focus:outline-none focus:ring-2 transition-colors flex items-center gap-1 ${
          isDark
            ? 'text-gray-300 hover:text-white focus:ring-[#D4AF37]'
            : 'text-gray-700 hover:text-black focus:ring-blue-500'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select language">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.944A5.962 5.962 0 0110 6c1.506 0 2.862.558 3.93 1.465l.448-.894A6.963 6.963 0 0010 5c-2.022 0-3.83.78-5.168 2.056l.5 1.888zM10 15a6.963 6.963 0 005.168-2.056l-.5-1.888A5.962 5.962 0 0110 14c-1.506 0-2.862-.558-3.93-1.465l-.448.894A6.963 6.963 0 0010 15z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-semibold text-xs">{isArabic ? 'AR' : 'EN'}</span>
      </button>
      {isOpen && (
        <div
          className={`absolute bottom-full right-0 mb-2 w-36 rounded-lg shadow-lg py-1 z-50 ${
            isDark
              ? 'bg-gray-800 border border-white/20'
              : 'bg-white border border-gray-300'
          }`}>
          <button
            onClick={() => {
              setLang('ar-SA');
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
              isDark
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-800 hover:bg-gray-100'
            }`}>
            <span className={isArabic ? 'font-semibold' : ''}>العربية</span>
            {isArabic && <span className="text-lg">✓</span>}
          </button>
          <button
            onClick={() => {
              setLang('en-US');
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
              isDark
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-800 hover:bg-gray-100'
            }`}>
            <span className={!isArabic ? 'font-semibold' : ''}>English</span>
            {!isArabic && <span className="text-lg">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
};
