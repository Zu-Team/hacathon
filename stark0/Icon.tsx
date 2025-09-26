/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React from 'react';
import {AppDefinition} from '../types';
import {AppIcon} from './AppIcon';

interface IconProps {
  app: AppDefinition;
  onInteract: () => void;
}

export const Icon: React.FC<IconProps> = ({app, onInteract}) => {
  return (
    <div
      className="w-28 h-32 flex flex-col items-center justify-start text-center p-2 cursor-pointer select-none rounded-lg transition-all duration-150 ease-in-out hover:bg-white/20 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
      onClick={onInteract}
      onKeyDown={(e) => e.key === 'Enter' && onInteract()}
      tabIndex={0}
      role="button"
      aria-label={`Open ${app.name}`}>
      <div className="w-16 h-16 flex items-center justify-center drop-shadow-lg mb-2">
        <AppIcon appId={app.id} />
      </div>
      <div className="text-sm text-white font-semibold break-words max-w-full leading-tight [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
        {app.name}
      </div>
    </div>
  );
};
