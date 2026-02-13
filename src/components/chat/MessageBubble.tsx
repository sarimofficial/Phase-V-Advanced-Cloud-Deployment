/**
 * MessageBubble component - Display user/assistant messages with markdown support.
 */

'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';

  // Sanitize content to prevent XSS (only in browser)
  const sanitizedContent = useMemo(() => {
    if (typeof window !== 'undefined') {
      return DOMPurify.sanitize(content);
    }
    return content;
  }, [content]);

  // Format timestamp
  const timeString = timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl max-h-[400px] overflow-y-auto scrollbar-premium
            ${isUser
              ? 'bg-indigo-600 text-white rounded-br-sm shadow-md shadow-indigo-500/20'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-bl-sm shadow-sm border border-gray-200 dark:border-slate-600'
            }
          `}
        >
          <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'dark:prose-invert'}`}>
            <ReactMarkdown
              components={{
                // Customize markdown rendering
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                code: ({ children }) => (
                  <code className="bg-black/20 px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-black/20 p-2 rounded overflow-x-auto">
                    {children}
                  </pre>
                ),
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
              }}
            >
              {sanitizedContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* Timestamp */}
        <div
          className={`
            text-xs text-gray-500 dark:text-gray-400 mt-1 px-2
            ${isUser ? 'text-right' : 'text-left'}
          `}
        >
          {timeString}
        </div>
      </div>
    </div>
  );
}
