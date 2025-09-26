/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
// Fix: Added content for the Window component, which was previously a placeholder.
import React from 'react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void; // This prop remains, though its direct trigger (the X button) is removed.
  isAppOpen: boolean;
  appId?: string | null;
  onToggleParameters: () => void;
  onExitToDesktop: () => void;
  isParametersPanelOpen?: boolean;
  theme: 'light' | 'dark';
}

const MenuItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  theme: 'light' | 'dark';
}> = ({children, onClick, className, theme}) => (
  <span
    className={`menu-item cursor-pointer rounded px-2 py-1 transition-colors ${
      theme === 'dark' ? 'hover:text-[#D4AF37]' : 'hover:text-blue-600'
    } ${className}`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick?.();
    }}
    tabIndex={0}
    role="button">
    {children}
  </span>
);

export const Window: React.FC<WindowProps> = ({
  title,
  children,
  onClose,
  isAppOpen,
  onToggleParameters,
  onExitToDesktop,
  isParametersPanelOpen,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`w-[800px] h-[600px] border rounded-xl shadow-2xl flex flex-col relative overflow-hidden font-sans backdrop-blur-xl ${
        isDark
          ? 'bg-black/50 border-white/20'
          : 'bg-white/60 border-gray-300/80'
      }`}>
      {/* Title Bar */}
      <div
        className={`relative py-2 px-4 font-semibold text-base flex justify-start items-center select-none cursor-default rounded-t-xl flex-shrink-0 ${
          isDark ? 'bg-black/20 text-gray-300' : 'bg-gray-200/50 text-gray-800'
        }`}>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-gray-600' : 'bg-gray-400'
            }`}></div>
          <div
            className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-gray-600' : 'bg-gray-400'
            }`}></div>
          <div
            className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-gray-600' : 'bg-gray-400'
            }`}></div>
        </div>
        <span className="title-bar-text absolute left-1/2 -translate-x-1/2">
          {title}
        </span>
      </div>

      {/* Menu Bar */}
      <div
        className={`py-2 px-3 border-b select-none flex gap-4 flex-shrink-0 text-sm items-center ${
          isDark
            ? 'bg-black/30 border-white/10 text-gray-300'
            : 'bg-gray-100/70 border-gray-200/90 text-gray-700'
        }`}>
        {!isParametersPanelOpen && (
          <MenuItem onClick={onToggleParameters} theme={theme}>
            <u>P</u>arameters
          </MenuItem>
        )}
        {isAppOpen && (
          <MenuItem
            onClick={onExitToDesktop}
            className="ml-auto"
            theme={theme}>
            Exit to Desktop
          </MenuItem>
        )}
      </div>

      {/* Content */}
      <div
        className={`flex-grow overflow-y-auto ${
          isDark ? 'bg-black/20' : 'bg-white/30'
        }`}>
        {children}
      </div>
    </div>
  );
};
