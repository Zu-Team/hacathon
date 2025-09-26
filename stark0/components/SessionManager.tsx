/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, {useState} from 'react';

interface SessionManagerProps {
  onCreateSession: () => void;
  onJoinSession: (code: string) => void;
  sessionCode: string | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  onCreateSession,
  onJoinSession,
  sessionCode,
  isLoading,
  theme,
}) => {
  const [joinCode, setJoinCode] = useState('');

  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force uppercase as the user types to ensure the state is always canonical.
    setJoinCode(e.target.value.toUpperCase());
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sanitize by removing hyphens and trimming. Uppercase is already handled.
    const formattedCode = joinCode.replace(/-/g, '').trim();
    if (formattedCode.length === 6) {
      onJoinSession(formattedCode);
    }
  };

  const isDark = theme === 'dark';
  const cardClasses = isDark
    ? 'bg-black/50 border-white/20'
    : 'bg-white/60 border-gray-300/80';
  const textClasses = isDark ? 'text-gray-200' : 'text-gray-800';
  const subTextClasses = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputClasses = isDark
    ? 'bg-gray-900/70 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-[#D4AF37] focus:border-[#D4AF37]'
    : 'bg-white/80 border-gray-400 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500';
  const buttonClasses = isDark
    ? 'bg-[#c5a238] hover:bg-[#D4AF37] text-black'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  const formattedSessionCode = sessionCode
    ? `${sessionCode.slice(0, 3)}-${sessionCode.slice(3)}`
    : '';

  const copyToClipboard = () => {
    if (sessionCode) {
      navigator.clipboard.writeText(sessionCode);
      // You could add a toast notification here for better UX
    }
  };

  // Used for validation to enable/disable the join button
  const sanitizedJoinCodeForValidation = joinCode.replace(/-/g, '').trim();

  return (
    <div
      className={`w-[500px] p-8 rounded-xl shadow-2xl backdrop-blur-xl flex flex-col items-center animate-fade-in ${cardClasses}`}>
      <h1 className={`text-3xl font-bold mb-2 ${textClasses}`}>
        Gemini OS Sync
      </h1>
      <p className={`text-center mb-8 ${subTextClasses}`}>
        Connect with other tabs by creating a new session or joining an existing
        one.
      </p>
      <div className="w-full space-y-6">
        {/* Create Session */}
        <div>
          <h2 className={`text-xl font-semibold mb-3 ${textClasses}`}>
            Create a New Session
          </h2>
          {sessionCode ? (
            <div className="text-center p-4 rounded-lg bg-black/20">
              <p className={`text-sm ${subTextClasses} mb-2`}>
                Share this code with another tab:
              </p>
              <div className="flex items-center justify-center gap-4">
                <p
                  className={`text-3xl font-bold tracking-widest ${textClasses}`}>
                  {formattedSessionCode}
                </p>
                <button
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                  className="p-2 rounded-md hover:bg-white/20 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" />
                  </svg>
                </button>
              </div>
              <p className={`text-xs mt-3 ${subTextClasses}`}>
                Waiting for others to join...
              </p>
            </div>
          ) : (
            <button
              onClick={onCreateSession}
              disabled={isLoading}
              className={`w-full llm-button m-0 ${buttonClasses}`}>
              {isLoading ? 'Creating...' : 'Create Session'}
            </button>
          )}
        </div>

        <div className="flex items-center w-full">
          <div
            className={`flex-grow border-t ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            }`}></div>
          <span className={`px-4 text-sm font-semibold ${subTextClasses}`}>
            OR
          </span>
          <div
            className={`flex-grow border-t ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            }`}></div>
        </div>

        {/* Join Session */}
        <div>
          <h2 className={`text-xl font-semibold mb-3 ${textClasses}`}>
            Join a Session
          </h2>
          <form onSubmit={handleJoinSubmit} className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={handleJoinCodeChange}
              placeholder="e.g. A1B-2C3"
              maxLength={7}
              className={`flex-grow llm-input m-0 uppercase tracking-widest text-center ${inputClasses}`}
              aria-label="Session code input"
              disabled={isLoading || !!sessionCode}
            />
            <button
              type="submit"
              disabled={
                isLoading ||
                !!sessionCode ||
                sanitizedJoinCodeForValidation.length !== 6
              }
              className={`llm-button m-0 ${buttonClasses}`}>
              {isLoading ? 'Joining...' : 'Join'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};