/**
 * TypingIndicator component - Animated dots to show assistant is typing.
 */

'use client';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="px-4 py-4 rounded-2xl bg-gray-100 dark:bg-slate-700 rounded-bl-sm border border-gray-200 dark:border-slate-600 shadow-sm">
          <div className="flex items-center gap-1.5 h-2">
            <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
