/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, {useEffect} from 'react';

interface ToastProps {
  message: string;
  type: 'info' | 'success' | 'error';
  onClose: () => void;
  theme: 'light' | 'dark';
}

const typeClasses = {
  dark: {
    info: 'bg-gray-800/90 border border-blue-400/50 text-blue-200',
    success: 'bg-gray-800/90 border border-green-400/50 text-green-200',
    error: 'bg-gray-800/90 border border-red-400/50 text-red-200',
  },
  light: {
    info: 'bg-blue-100 border border-blue-300 text-blue-800',
    success: 'bg-green-100 border border-green-300 text-green-800',
    error: 'bg-red-100 border border-red-300 text-red-800',
  },
};

const typeIcons = {
  info: 'ℹ️',
  success: '✅',
  error: '❌',
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  theme,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-dismiss after 4 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const buttonColorClass =
    theme === 'dark' ? 'text-white' : 'text-gray-700';

  return (
    <div
      className={`fixed bottom-24 right-5 z-50 flex items-center p-4 pr-10 rounded-lg shadow-lg text-base ${typeClasses[theme][type]} animate-fade-in-up backdrop-blur-sm`}
      role="alert"
      aria-live="assertive">
      <span className="mr-3 text-xl">{typeIcons[type]}</span>
      <p>{message}</p>
      <button
        onClick={onClose}
        className={`absolute top-1 right-1 p-1 text-2xl leading-none hover:opacity-75 ${buttonColorClass}`}
        aria-label="Close">
        &times;
      </button>
    </div>
  );
};

// Add keyframes for animation in a global style or here if not possible elsewhere
// Since we can't edit index.html directly from here, a style tag can be a workaround.
const styles = `
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}
`;

// Inject styles into the head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
