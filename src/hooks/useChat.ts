/**
 * useChat hook - State management for chat functionality.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ChatState } from '@/types/chat';
import { chatService } from '@/services/chatService';

interface UseChatOptions {
  userId: string;
  onError?: (error: string) => void;
}

export function useChat({ userId, onError }: UseChatOptions) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    conversationId: null,
    isLoading: false,
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConversationId = localStorage.getItem(`chat_conversation_${userId}`);
      if (savedConversationId) {
        setState((prev) => ({ ...prev, conversationId: savedConversationId }));
      }
    }
  }, [userId]);

  // Save conversation ID to localStorage when it changes
  useEffect(() => {
    if (state.conversationId && typeof window !== 'undefined') {
      localStorage.setItem(`chat_conversation_${userId}`, state.conversationId);
    }
  }, [state.conversationId, userId]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || state.isLoading) {
        return;
      }

      // Add user message to UI immediately
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        // Send message to backend
        const response = await chatService.sendMessage(
          userId,
          content.trim(),
          state.conversationId || undefined
        );

        // Add assistant response to UI
        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          conversationId: response.conversation_id,
          isLoading: false,
        }));

        // Check if any task-related tools were called
        const taskTools = ['add_task', 'complete_task', 'update_task', 'delete_task'];
        const hasTaskUpdates = response.tool_calls?.some(tc => taskTools.includes(tc.tool));

        if (hasTaskUpdates && typeof window !== 'undefined') {
          // Dispatch custom event to notify other components (like TaskList)
          window.dispatchEvent(new CustomEvent('tasks-updated'));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        if (onError) {
          onError(errorMessage);
        }
      }
    },
    [userId, state.conversationId, state.isLoading, onError]
  );

  const clearConversation = useCallback(() => {
    setState({
      messages: [],
      conversationId: null,
      isLoading: false,
      error: null,
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`chat_conversation_${userId}`);
    }
  }, [userId]);

  return {
    messages: state.messages,
    conversationId: state.conversationId,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearConversation,
    messagesEndRef,
  };
}
