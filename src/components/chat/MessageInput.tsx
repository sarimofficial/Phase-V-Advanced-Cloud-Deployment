/**
 * MessageInput component - Text input with character limit and send button.
 */

'use client';

import { useState, KeyboardEvent, ChangeEvent } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const maxLength = 500;

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
  };

  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars < 50;

  return (
    <div className="px-4 py-3 border-t border-gray-200/20 dark:border-gray-700/20">
      {/* Character counter */}
      {isNearLimit && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-right">
          {remainingChars} characters remaining
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        <textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="
            flex-1 resize-none
            px-4 py-3
            bg-gray-100 dark:bg-slate-800/80
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            rounded-2xl
            border border-gray-200 dark:border-slate-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
            disabled:opacity-50 disabled:cursor-not-allowed
            max-h-24
            scrollbar-none
          "
          style={{
            height: 'auto',
            minHeight: '48px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 96)}px`;
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="
            flex items-center justify-center
            w-12 h-12
            bg-indigo-600 hover:bg-indigo-700
            text-white
            rounded-xl
            shadow-lg shadow-indigo-500/20
            transition-all duration-200
            hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
          "
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>

      {/* Helper text */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
