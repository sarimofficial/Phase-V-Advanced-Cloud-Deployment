/**
 * ChatPanel component - Glassmorphic chat panel with slide-in animation.
 */

'use client';

import { ReactNode } from 'react';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  onHeaderWheel?: (e: React.WheelEvent) => void;
}

export default function ChatPanel({ isOpen, onClose, children, onHeaderWheel }: ChatPanelProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Chat panel */}
      <div
        className={`
          fixed z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          
          /* Desktop Styles */
          bottom-24 right-6
          w-[min(420px,calc(100vw-3rem))]
          h-[min(650px,calc(100vh-8rem))]
          bg-white/80 dark:bg-slate-900/80
          backdrop-blur-2xl
          rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)]
          border border-white/40 dark:border-white/10
          flex flex-col

          /* Animation State */
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}

          /* Mobile Styles */
          max-md:bottom-0 max-md:right-0 max-md:left-0 max-md:top-0
          max-md:w-full max-md:h-full max-md:rounded-none
          max-md:border-0
        `}
      >
        {/* Header */}
        <div
          onWheel={onHeaderWheel}
          className="flex items-center justify-between px-6 py-4 border-b border-gray-200/20 dark:border-gray-700/20"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </>
  );
}
