/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React from 'react';

interface NotificationBellProps {
  hasUnread: boolean;
  onClick: () => void;
  theme: 'light' | 'dark';
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  hasUnread,
  onClick,
  theme,
}) => {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-full focus:outline-none focus:ring-2 transition-colors ${
        isDark
          ? 'text-gray-300 hover:text-white focus:ring-[#D4AF37]'
          : 'text-gray-700 hover:text-black focus:ring-blue-500'
      }`}
      aria-label="Toggle notifications">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
      {hasUnread && (
        <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </button>
  );
};
