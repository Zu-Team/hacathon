/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, {useState, useEffect, useRef} from 'react';
import type {ChatMessage} from '../types';

interface MessengerProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  senderId: string;
  theme: 'light' | 'dark';
}

export const Messenger: React.FC<MessengerProps> = ({
  messages,
  onSendMessage,
  senderId,
  theme,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const isDark = theme === 'dark';
  const scrollbarClasses = isDark
    ? '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full'
    : '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full';

  return (
    <div className="h-full flex flex-col">
      <div
        className={`flex-grow p-4 overflow-y-auto space-y-4 ${scrollbarClasses}`}>
        {messages.map((msg) => {
          const isOwnMessage = msg.senderId === senderId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isOwnMessage ? 'items-end' : 'items-start'
              }`}>
              <span
                className={`text-xs mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {isOwnMessage ? 'You' : msg.senderId}
              </span>
              <div
                className={`px-4 py-2 rounded-2xl max-w-sm break-words ${
                  isOwnMessage
                    ? `rounded-br-none ${
                        isDark ? 'bg-purple-700' : 'bg-blue-600'
                      } text-white`
                    : `rounded-bl-none ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      } ${isDark ? 'text-gray-200' : 'text-gray-800'}`
                }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`flex items-center p-3 border-t ${
          isDark ? 'border-white/10' : 'border-gray-200/90'
        }`}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className={`w-full border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 transition-all ${
            isDark
              ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-[#D4AF37] focus:border-[#D4AF37]'
              : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
          }`}
          aria-label="Chat message input"
        />
        <button
          type="submit"
          className={`ml-3 px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
            isDark
              ? 'bg-[#c5a238] hover:bg-[#D4AF37] active:bg-[#b59430] text-black'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
          }`}
          aria-label="Send message">
          Send
        </button>
      </form>
    </div>
  );
};
