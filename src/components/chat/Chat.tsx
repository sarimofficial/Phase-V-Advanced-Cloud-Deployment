/**
 * Chat component - Integrated chat interface with all sub-components.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import ChatButton from './ChatButton';
import ChatPanel from './ChatPanel';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useChat } from '@/hooks/useChat';

interface ChatProps {
  userId: string;
}

function Chat({ userId }: ChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    messagesEndRef,
  } = useChat({
    userId,
    onError: (errorMessage) => {
      console.error('Chat error:', errorMessage);
    },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Forward scroll from header to messages container
  const handleHeaderWheel = (e: React.WheelEvent) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop += e.deltaY;
    }
  };

  const SUGGESTED_ACTIONS = [
    { label: "➕ Add grocery task", text: "Add a task to buy groceries" },
    { label: "📋 Show all tasks", text: "Show me all my tasks" },
    { label: "🕒 What's pending?", text: "What's pending?" },
    { label: "✅ Mark task 3 complete", text: "Mark task 3 as complete" },
    { label: "🗑️ Delete meeting task", text: "Delete the meeting task" },
  ];

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)} />

      <ChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onHeaderWheel={handleHeaderWheel}
      >
        {/* Messages area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-premium"
        >
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center flex-1 h-full min-h-0 text-center px-4 py-8 overflow-y-auto">
              <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-3xl mb-6 shadow-sm">
                <p className="text-3xl mb-3">🤖</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  AI Task Manager
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px]">
                  I can help you manage your todos with natural language!
                </p>
              </div>

              <div className="w-full max-w-xs space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Try saying
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED_ACTIONS.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(action.text)}
                      className="text-left px-4 py-2.5 text-sm bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all group w-full"
                    >
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-medium">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input area */}
        <MessageInput
          onSend={sendMessage}
          disabled={isLoading}
          placeholder="Type your message..."
        />
      </ChatPanel>
    </>
  );
}

export default Chat;
