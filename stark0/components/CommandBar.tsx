/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, {useState} from 'react';

interface CommandBarProps {
  onCommandSubmit: (command: string) => void;
  theme: 'light' | 'dark';
  lang: 'ar-SA' | 'en-US';
}

export const CommandBar: React.FC<CommandBarProps> = ({
  onCommandSubmit,
  theme,
  lang,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onCommandSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  const inputClasses =
    theme === 'dark'
      ? 'bg-black/40 border-gray-500/80 text-gray-200 placeholder-gray-400 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-black/50'
      : 'bg-white/50 border-gray-400/80 text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/60';

  const placeholderText =
    lang === 'ar-SA' ? 'اكتب أمراً...' : 'Type a command...';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-grow flex items-center ml-4 mr-4">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholderText}
        className={`w-full border rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 transition-all ${inputClasses}`}
        aria-label="Command input"
      />
    </form>
  );
};
