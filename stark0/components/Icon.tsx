/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React from 'react';
import {AppDefinition} from '../types';

interface IconProps {
  app: AppDefinition;
  onInteract: () => void;
  theme: 'light' | 'dark';
}

export const Icon: React.FC<IconProps> = ({app, onInteract, theme}) => {
  const iconClasses =
    theme === 'dark'
      ? 'hover:bg-black/30 focus:bg-black/40 focus:ring-[#D4AF37]/80'
      : 'hover:bg-white/40 focus:bg-white/50 focus:ring-blue-500/80';
  const textClasses =
    theme === 'dark'
      ? 'text-gray-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]'
      : 'text-gray-900 [text-shadow:0_1px_2px_rgba(255,255,255,0.5)]';

  return (
    <div
      className={`w-28 h-32 flex flex-col items-center justify-start text-center p-2 cursor-pointer select-none rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 ${iconClasses}`}
      onClick={onInteract}
      onKeyDown={(e) => e.key === 'Enter' && onInteract()}
      tabIndex={0}
      role="button"
      aria-label={`Open ${app.name}`}>
      <div className="w-16 h-16 flex items-center justify-center drop-shadow-lg mb-2 text-5xl">
        {app.icon}
      </div>
      <div
        className={`text-sm font-medium break-words max-w-full leading-tight ${textClasses}`}>
        {app.name}
      </div>
    </div>
  );
};
