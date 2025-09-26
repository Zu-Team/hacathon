/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
// Fix: Create the main App component to orchestrate the application.
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {APP_DEFINITIONS_CONFIG, INITIAL_MAX_HISTORY_LENGTH} from './constants';
import {streamAppContent} from './services/geminiService';
import * as localStorageService from './services/firebaseService';
import type {
  AppDefinition,
  InteractionData,
  ToastData,
  ChatMessage,
  ActivityNotification,
} from './types';
import {GeneratedContent} from './components/GeneratedContent';
import {Window} from './components/Window';
import {Icon} from './components/Icon';
import {ParametersPanel} from './components/ParametersPanel';
import {Toast} from './components/Toast';
import {CommandBar} from './components/CommandBar';
import {Messenger} from './components/Messenger';
import VoiceControlButton, {
  VoiceStatus,
} from './components/VoiceControlButton';
import {NotificationBell} from './components/NotificationBell';
import {NotificationPanel} from './components/NotificationPanel';
import {SessionManager} from './components/SessionManager';
import {LanguageSwitcher} from './components/LanguageSwitcher';

// SpeechRecognition types - not available in standard lib.d.ts
declare global {
  interface Window {
    // Fix: `SpeechRecognition` is defined as an interface (a type), not a value,
    // so `typeof` is invalid. The correct type for a constructor is `new () => Type`.
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
  interface SpeechRecognition extends EventTarget {
    // properties
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    // methods
    abort(): void;
    start(): void;
    stop(): void;
    // events
    onaudiostart: (this: SpeechRecognition, ev: Event) => any;
    onaudioend: (this: SpeechRecognition, ev: Event) => any;
    onend: (this: SpeechRecognition, ev: Event) => any;
    onerror: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any;
    onnomatch: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
    onresult: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
    onsoundstart: (this: SpeechRecognition, ev: Event) => any;
    onsoundend: (this: SpeechRecognition, ev: Event) => any;
    onspeechstart: (this: SpeechRecognition, ev: Event) => any;
    onspeechend: (this: SpeechRecognition, ev: Event) => any;
    onstart: (this: SpeechRecognition, ev: Event) => any;
  }
  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
}

const ThemeSwitcher: React.FC<{
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}> = ({theme, setTheme}) => {
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full focus:outline-none focus:ring-2 transition-colors ${
          isDark
            ? 'text-gray-300 hover:text-white focus:ring-[#D4AF37]'
            : 'text-gray-700 hover:text-black focus:ring-blue-500'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select color theme">
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      {isOpen && (
        <div
          className={`absolute bottom-full right-0 mb-2 w-48 rounded-lg shadow-lg py-1 z-50 ${
            isDark
              ? 'bg-gray-800 border border-white/20'
              : 'bg-white border border-gray-300'
          }`}>
          <button
            onClick={() => {
              setTheme('light');
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 transition-colors ${
              isDark
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-800 hover:bg-gray-100'
            }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z"
                clipRule="evenodd"
              />
            </svg>
            <span className={!isDark ? 'font-semibold' : ''}>Light Mode</span>
            {!isDark && <span className="ml-auto text-lg">✓</span>}
          </button>
          <button
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 transition-colors ${
              isDark
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-800 hover:bg-gray-100'
            }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span className={isDark ? 'font-semibold' : ''}>Dark Mode</span>
            {isDark && <span className="ml-auto text-lg">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppDefinition | null>(null);
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [interactionHistory, setInteractionHistory] = useState<
    InteractionData[]
  >([]);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isParametersPanelOpen, setIsParametersPanelOpen] = useState(false);
  const [maxHistoryLength, setMaxHistoryLength] = useState(
    INITIAL_MAX_HISTORY_LENGTH,
  );
  const [isStatefulnessEnabled, setIsStatefulnessEnabled] = useState(
    maxHistoryLength > 0,
  );
  const [toast, setToast] = useState<ToastData | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [recognitionLang, setRecognitionLang] = useState<'ar-SA' | 'en-US'>(
    'ar-SA',
  );
  const appRef = useRef<HTMLDivElement>(null);

  // Communication state
  const [userId] = useState(
    () => `User-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<ActivityNotification[]>(
    [],
  );
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] =
    useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Session state
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [isInSession, setIsInSession] = useState(false);

  // Voice control state
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSpeechApiSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const showToast = useCallback(
    (message: string, type: 'info' | 'success' | 'error') => {
      setToast({message, type});
    },
    [],
  );

  // Effect to manage statefulness based on history length
  useEffect(() => {
    setIsStatefulnessEnabled(maxHistoryLength > 0);
  }, [maxHistoryLength]);

  // Effect to apply theme class to main container
  useEffect(() => {
    const appElement = appRef.current;
    if (appElement) {
      appElement.classList.remove('light', 'dark');
      appElement.classList.add(theme);
    }
    // Also apply to body for global access if needed (e.g., modals outside the app root)
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  // Effect for localStorage sync across tabs
  useEffect(() => {
    if (!isInSession || !sessionCode) return;

    const handleStorageChange = (event: StorageEvent) => {
      const sessionKey = `gemini-os-session-${sessionCode}`;
      if (event.key === sessionKey && event.newValue) {
        try {
          const updatedData: localStorageService.SessionData = JSON.parse(
            event.newValue,
          );
          // Update messages if new ones have arrived
          if (updatedData.messages.length !== chatMessages.length) {
            setChatMessages(updatedData.messages);
          }

          // Update notifications if new ones have arrived
          if (updatedData.activity.length !== notifications.length) {
            setNotifications(updatedData.activity);
            const latestActivity =
              updatedData.activity[updatedData.activity.length - 1];
            // Only show unread indicator for others' activities
            if (latestActivity && latestActivity.senderId !== userId) {
              if (!isNotificationsPanelOpen) {
                setHasUnreadNotifications(true);
              }
            }
          }
        } catch (e) {
          console.error('Error parsing storage update:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [
    isInSession,
    sessionCode,
    chatMessages.length,
    notifications.length,
    userId,
    isNotificationsPanelOpen,
  ]);

  // Effect to stream content when interaction history changes
  useEffect(() => {
    if (interactionHistory.length === 0) return;

    const processInteraction = async () => {
      setIsLoading(true);
      setGeneratedHtml('');

      // If statefulness is off, only use the latest interaction
      const historySlice = isStatefulnessEnabled
        ? interactionHistory.slice(0, maxHistoryLength)
        : [interactionHistory[0]];

      const effectiveHistoryLength = isStatefulnessEnabled
        ? maxHistoryLength
        : 1;

      try {
        const stream = streamAppContent(historySlice, effectiveHistoryLength);
        for await (const chunk of stream) {
          setGeneratedHtml((prev) => prev + chunk);
        }
      } catch (error) {
        console.error('Error streaming content:', error);
        setToast({
          message: 'Failed to generate content. Please try again.',
          type: 'error',
        });
        // Display an error message in the content area
        setGeneratedHtml(
          '<div class="p-4 text-red-700 bg-red-100 rounded-lg"><p class="font-bold text-lg">Error</p><p>An unexpected error occurred while generating content.</p></div>',
        );
      } finally {
        setIsLoading(false);
      }
    };

    processInteraction();
  }, [interactionHistory, maxHistoryLength, isStatefulnessEnabled]);

  const handleInteraction = useCallback(
    (interactionData: InteractionData) => {
      // If statefulness is disabled, reset history with only the new interaction
      if (!isStatefulnessEnabled) {
        setInteractionHistory([interactionData]);
      } else {
        setInteractionHistory((prevHistory) => [
          interactionData,
          ...prevHistory,
        ]);
      }
    },
    [isStatefulnessEnabled],
  );

  const postActivity = useCallback(
    (action: string, appName?: string) => {
      if (!sessionCode) return;
      let message = `Activity from ${userId}`;
      if (action === 'open_app' && appName) {
        message = `${userId} opened the ${appName} app.`;
      } else if (action === 'exit_to_desktop') {
        message = `${userId} returned to the desktop.`;
      }
      const notificationData: ActivityNotification = {
        message,
        timestamp: Date.now(),
        senderId: userId,
        id: `act-${Date.now()}-${Math.random()}`,
      };

      localStorageService.postActivity(sessionCode, notificationData);
      // Update state for the current tab immediately
      setNotifications((prev) => [...prev, notificationData]);
    },
    [sessionCode, userId],
  );

  const handleOpenApp = (app: AppDefinition) => {
    setCurrentApp(app);
    setIsAppOpen(true);
    setIsParametersPanelOpen(false); // Close parameters panel when opening an app
    postActivity('open_app', app.name);

    // For messenger, we just open the UI without calling Gemini
    if (app.id === 'messenger_app') {
      setGeneratedHtml(''); // Clear content from other apps
      setIsLoading(false);
    } else {
      // For other apps, trigger Gemini generation
      handleInteraction({
        id: app.id,
        type: 'app_open',
        elementType: 'icon',
        elementText: app.name,
        appContext: app.id,
      });
    }
  };

  const handleExitToDesktop = () => {
    setIsAppOpen(false);
    setCurrentApp(null);
    setGeneratedHtml('');
    setIsParametersPanelOpen(false);
    postActivity('exit_to_desktop');
    // Don't clear interaction history to maintain context if the user re-opens an app
    showToast('Returned to Desktop', 'info');
  };

  const handleToggleParameters = () => {
    setIsParametersPanelOpen(!isParametersPanelOpen);
  };

  const handleUpdateHistoryLength = (newLength: number) => {
    setMaxHistoryLength(newLength);
    showToast(`Max history length set to ${newLength}.`, 'success');
  };

  const handleSetStatefulness = (enabled: boolean) => {
    setIsStatefulnessEnabled(enabled);
    showToast(`Statefulness ${enabled ? 'enabled' : 'disabled'}.`, 'success');
  };

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!sessionCode) return;
      const newMessageData: ChatMessage = {
        text,
        senderId: userId,
        timestamp: Date.now(),
        id: `msg-${Date.now()}-${Math.random()}`,
      };
      localStorageService.postMessage(sessionCode, newMessageData);
      // Update state for the current tab immediately
      setChatMessages((prev) => [...prev, newMessageData]);
    },
    [sessionCode, userId],
  );

  const handleCommandSubmit = (command: string) => {
    const interaction: InteractionData = {
      id: `command_bar_submit`,
      type: 'command_bar',
      value: command,
      elementType: 'input',
      elementText: 'Command Bar',
      appContext: currentApp?.id ?? null,
    };

    if (!currentApp) {
      // Find if command matches an app name to open it
      const appToOpen = APP_DEFINITIONS_CONFIG.find((app) =>
        command.toLowerCase().includes(app.name.toLowerCase()),
      );
      if (appToOpen) {
        handleOpenApp(appToOpen);
      } else {
        showToast(`Command not recognized: '${command}'`, 'error');
      }
    } else {
      handleInteraction(interaction);
    }
  };

  const handleVoiceControlClick = () => {
    if (!isSpeechApiSupported) return;

    if (voiceStatus === 'listening') {
      recognitionRef.current?.stop();
      return;
    }

    // Prevent starting a new one while processing/error is being displayed
    if (voiceStatus === 'processing' || voiceStatus === 'error') {
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = recognitionLang;

    recognition.onstart = () => setVoiceStatus('listening');

    recognition.onend = () => {
      // This is the final event. We should always end up in 'idle' state,
      // unless we're in 'processing' which has its own timer to return to 'idle'.
      setVoiceStatus((currentStatus) =>
        currentStatus === 'processing' ? 'processing' : 'idle',
      );
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Only log critical errors. 'aborted' and 'no-speech' are common and not errors.
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
        setVoiceStatus('error');
        const errorMessage =
          recognitionLang === 'ar-SA'
            ? `خطأ في الصوت: ${event.error}`
            : `Voice error: ${event.error}`;
        showToast(errorMessage, 'error');
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setVoiceStatus('processing');
      handleCommandSubmit(transcript);
      setTimeout(() => setVoiceStatus('idle'), 1500); // Reset status after processing
    };

    recognition.start();
  };

  const handleToggleNotificationsPanel = () => {
    setIsNotificationsPanelOpen((prev) => !prev);
    // Mark as read when opening
    if (!isNotificationsPanelOpen) {
      setHasUnreadNotifications(false);
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setHasUnreadNotifications(false);
    setIsNotificationsPanelOpen(false);
  };

  const handleCreateSession = () => {
    setIsLoading(true);
    const newCode = localStorageService.createSession();
    setSessionCode(newCode);
    setIsInSession(true);
    showToast(`Session created: ${newCode}. Share this code!`, 'success');
    setIsLoading(false);
  };

  const handleJoinSession = (code: string) => {
    setIsLoading(true);
    if (localStorageService.sessionExists(code)) {
      setSessionCode(code);
      // Load initial data for this session
      const initialData = localStorageService.getInitialData(code);
      setChatMessages(initialData.messages);
      setNotifications(initialData.activity);
      setIsInSession(true);
      showToast(`Joined session: ${code}`, 'success');
    } else {
      showToast('Session code not found.', 'error');
    }
    setIsLoading(false);
  };

  const wallpapers = {
    dark: 'url(https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=1920&auto=format&fit=crop)',
    light:
      'url(https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?q=80&w=1920&auto=format&fit=crop)',
  };

  const dockClasses = {
    dark: 'bg-black/40 border-white/20',
    light: 'bg-white/40 border-black/20',
  };

  return (
    <div
      ref={appRef}
      className="w-screen h-screen font-sans flex items-center justify-center overflow-hidden bg-cover bg-center transition-all duration-500"
      style={{backgroundImage: wallpapers[theme]}}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          theme={theme}
        />
      )}

      {!isInSession ? (
        <SessionManager
          onCreateSession={handleCreateSession}
          onJoinSession={handleJoinSession}
          sessionCode={sessionCode}
          isLoading={isLoading}
          theme={theme}
        />
      ) : (
        <>
          {isNotificationsPanelOpen && (
            <NotificationPanel
              notifications={notifications}
              onClear={handleClearNotifications}
              theme={theme}
            />
          )}

          {!isAppOpen && !isParametersPanelOpen ? (
            // Desktop View
            <div className="w-full h-full grid grid-cols-5 auto-rows-min gap-x-2 gap-y-4 p-4 pt-8">
              {APP_DEFINITIONS_CONFIG.map((app) => (
                <Icon
                  key={app.id}
                  app={app}
                  onInteract={() => handleOpenApp(app)}
                  theme={theme}
                />
              ))}
            </div>
          ) : (
            // Window View
            <Window
              title={
                isParametersPanelOpen
                  ? 'Parameters'
                  : currentApp?.name || 'Application'
              }
              onClose={handleExitToDesktop}
              isAppOpen={isAppOpen}
              appId={currentApp?.id}
              onToggleParameters={handleToggleParameters}
              onExitToDesktop={handleExitToDesktop}
              isParametersPanelOpen={isParametersPanelOpen}
              theme={theme}>
              {isParametersPanelOpen ? (
                <ParametersPanel
                  currentLength={maxHistoryLength}
                  onUpdateHistoryLength={handleUpdateHistoryLength}
                  onClosePanel={() => setIsParametersPanelOpen(false)}
                  isStatefulnessEnabled={isStatefulnessEnabled}
                  onSetStatefulness={handleSetStatefulness}
                  theme={theme}
                />
              ) : currentApp?.id === 'messenger_app' ? (
                <Messenger
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  senderId={userId}
                  theme={theme}
                />
              ) : (
                <GeneratedContent
                  htmlContent={generatedHtml}
                  onInteract={handleInteraction}
                  appContext={currentApp?.id || null}
                  isLoading={isLoading}
                />
              )}
            </Window>
          )}

          {/* Persistent Menu Bar at bottom */}
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 h-14 backdrop-blur-xl border rounded-xl shadow-lg flex gap-2 items-center px-4 z-30 ${dockClasses[theme]}`}>
            <VoiceControlButton
              status={voiceStatus}
              onClick={handleVoiceControlClick}
              isApiSupported={isSpeechApiSupported}
              theme={theme}
              lang={recognitionLang}
            />
            <CommandBar
              onCommandSubmit={handleCommandSubmit}
              theme={theme}
              lang={recognitionLang}
            />
            <div
              className={`h-full border-l ${
                theme === 'dark' ? 'border-white/20' : 'border-black/20'
              } mx-2`}></div>
            <NotificationBell
              hasUnread={hasUnreadNotifications}
              onClick={handleToggleNotificationsPanel}
              theme={theme}
            />
            <LanguageSwitcher
              lang={recognitionLang}
              setLang={setRecognitionLang}
              theme={theme}
            />
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
