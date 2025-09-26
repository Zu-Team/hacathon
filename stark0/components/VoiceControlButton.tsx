/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React from 'react';

export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'error';

interface VoiceControlButtonProps {
  status: VoiceStatus;
  onClick: () => void;
  isApiSupported: boolean;
  theme: 'light' | 'dark';
  lang: 'ar-SA' | 'en-US';
}

const translations = {
  'ar-SA': {
    listening: 'يستمع...',
    processing: 'جاري المعالجة...',
    error: 'خطأ',
    idle: 'صوت',
    unsupported: 'التحكم الصوتي غير مدعوم في متصفحك.',
    ariaLabel: 'تفعيل التحكم الصوتي',
  },
  'en-US': {
    listening: 'Listening...',
    processing: 'Processing...',
    error: 'Error',
    idle: 'Voice',
    unsupported: 'Voice control is not supported in your browser.',
    ariaLabel: 'Activate voice control',
  },
};

export const VoiceControlButton: React.FC<VoiceControlButtonProps> = ({
  status,
  onClick,
  isApiSupported,
  theme,
  lang,
}) => {
  const t = translations[lang];

  if (!isApiSupported) {
    return (
      <div
        className="menu-item opacity-50 cursor-not-allowed flex items-center gap-1 text-gray-500"
        title={t.unsupported}>
        <span>🎙️</span>
        <span>{t.idle}</span>
      </div>
    );
  }

  const getStatusContent = () => {
    switch (status) {
      case 'listening':
        return (
          <div className="flex items-center text-red-400">
            <span className="animate-pulse">🔴</span>
            <span className="ml-1">{t.listening}</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-400 mr-2"></div>
            <span>{t.processing}</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-400">
            <span className="font-bold">⚠️</span>
            <span className="ml-1">{t.error}</span>
          </div>
        );
      case 'idle':
      default:
        return <>{t.idle}</>;
    }
  };

  const textClasses =
    theme === 'dark'
      ? 'text-gray-300 hover:text-white'
      : 'text-gray-700 hover:text-black';

  return (
    <span
      className={`menu-item cursor-pointer ${textClasses}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      tabIndex={0}
      role="button"
      aria-label={t.ariaLabel}>
      <div className="flex items-center gap-2">
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true">
          <path
            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C13.8262 22 15.5413 21.5194 17.0029 20.6592L21.5 22.5L19.6592 18.0029C21.5194 16.5413 22 14.8262 22 12C22 6.47715 17.5228 2 12 2Z"
            fill="#6A3EFE"
          />
          <rect x="10" y="7" width="4" height="6" rx="2" fill="white" />
          <line
            x1="12"
            y1="13"
            x2="12"
            y2="15"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="10"
            y1="15"
            x2="14"
            y2="15"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        {getStatusContent()}
      </div>
    </span>
  );
};

export default VoiceControlButton;
