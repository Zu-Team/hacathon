/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React from 'react';
import type {ActivityNotification} from '../types';

interface NotificationPanelProps {
  notifications: ActivityNotification[];
  onClear: () => void;
  theme: 'light' | 'dark';
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onClear,
  theme,
}) => {
  const isDark = theme === 'dark';

  const scrollbarClasses = isDark
    ? '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full'
    : '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full';

  return (
    <div
      className={`absolute bottom-20 left-1/2 w-80 max-h-96 overflow-y-auto rounded-lg shadow-xl backdrop-blur-xl border z-40 animate-fade-in-up-fast ${
        isDark
          ? 'bg-gray-800/80 border-white/20 text-gray-200'
          : 'bg-white/80 border-gray-300 text-gray-800'
      } ${scrollbarClasses}`}>
      <div className="p-3 flex justify-between items-center border-b sticky top-0 bg-inherit">
        <h3 className="font-semibold text-base">Activity Log</h3>
        {notifications.length > 0 && (
          <button
            onClick={onClear}
            className={`text-xs font-medium rounded px-2 py-1 transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}>
            Clear All
          </button>
        )}
      </div>
      <div className="p-2">
        {notifications.length === 0 ? (
          <p className="text-sm text-center py-4 opacity-70">
            No new activity.
          </p>
        ) : (
          <ul className="space-y-1">
            {notifications
              .slice()
              .reverse()
              .map(
                (
                  n, // Show newest first
                ) => (
                  <li
                    key={n.id}
                    className="text-sm p-2 rounded transition-colors">
                    <p>{n.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      {new Date(n.timestamp).toLocaleTimeString()}
                    </p>
                  </li>
                ),
              )}
          </ul>
        )}
      </div>
    </div>
  );
};
