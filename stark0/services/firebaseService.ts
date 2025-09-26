/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import type {ChatMessage, ActivityNotification} from '../types';

// This service simulates a backend using localStorage for multi-tab communication.
const SESSION_PREFIX = 'gemini-os-session-';

export interface SessionData {
  messages: ChatMessage[];
  activity: ActivityNotification[];
}

const generateSessionCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createSession = (): string => {
  const sessionCode = generateSessionCode();
  const sessionKey = `${SESSION_PREFIX}${sessionCode}`;
  const initialData: SessionData = {
    messages: [],
    activity: [],
  };
  // Fix: Removed the setTimeout to make session creation synchronous.
  // This resolves a race condition where a session could not be joined
  // immediately after being created because it hadn't been saved to storage yet.
  localStorage.setItem(sessionKey, JSON.stringify(initialData));
  return sessionCode;
};

export const sessionExists = (sessionCode: string): boolean => {
  return localStorage.getItem(`${SESSION_PREFIX}${sessionCode}`) !== null;
};

const getSessionData = (sessionCode: string): SessionData | null => {
  const sessionData = localStorage.getItem(`${SESSION_PREFIX}${sessionCode}`);
  if (!sessionData) return null;
  try {
    return JSON.parse(sessionData);
  } catch (e) {
    console.error('Failed to parse session data:', e);
    return null;
  }
};

export const postMessage = (
  sessionCode: string,
  message: ChatMessage,
): void => {
  const sessionKey = `${SESSION_PREFIX}${sessionCode}`;
  const data = getSessionData(sessionCode);
  if (data) {
    const updatedMessages = [...data.messages, message];
    localStorage.setItem(
      sessionKey,
      JSON.stringify({...data, messages: updatedMessages}),
    );
  }
};

export const postActivity = (
  sessionCode: string,
  activity: ActivityNotification,
): void => {
  const sessionKey = `${SESSION_PREFIX}${sessionCode}`;
  const data = getSessionData(sessionCode);
  if (data) {
    const updatedActivity = [...data.activity, activity];
    localStorage.setItem(
      sessionKey,
      JSON.stringify({...data, activity: updatedActivity}),
    );
  }
};

// Initial data load when a session is joined
export const getInitialData = (sessionCode: string): SessionData => {
  const data = getSessionData(sessionCode);
  return data || {messages: [], activity: []};
};
