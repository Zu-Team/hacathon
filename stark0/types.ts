/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface InteractionData {
  id: string;
  type: string;
  value?: string;
  elementType: string;
  elementText: string;
  appContext: string | null;
}

export interface ToastData {
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
}

export interface BroadcastMessage {
  type: 'activity' | 'chat';
  payload: any;
  senderId: string;
}

export interface ActivityNotification {
  id: string;
  message: string;
  timestamp: number;
  senderId: string;
}
