// ─── React Query Hooks: WhatsApp Conversations & Live Care ─────────────────
// Manages conversations list, live message polling with sound alerts,
// outbound WhatsApp reply mutations, and new conversation creation.

import { useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getThreads,
  getThreadMessages,
  sendChatMessage,
  startConversation,
  updateThreadStatus,
  reassignThread,
  type ThreadFilterParams,
  type StartConversationPayload,
} from '../../api/threadsApi';
import { useCareStore } from '../../store/useCareStore';
import { useSoundAlert } from '../useSoundAlert';
import { CURRENT_AGENT } from '../../mocks';

/**
 * Hook to fetch and poll WhatsApp conversations for the sidebar.
 * Polls every 5 seconds to capture new inbound conversations and message previews.
 */
export function useThreads(params?: ThreadFilterParams) {
  const setThreads = useCareStore((s) => s.setThreads);

  const query = useQuery({
    queryKey: ['conversations', 'list', params],
    queryFn: async () => {
      const data = await getThreads(params);
      setThreads(data);

      // Auto-select first thread if none is selected yet or selected id is not in list
      const currentSelected = useCareStore.getState().selectedThreadId;
      const exists = data.some((t) => String(t.id) === String(currentSelected));

      if ((!currentSelected || !exists) && data.length > 0) {
        useCareStore.getState().setSelectedThreadId(String(data[0].id));
      }
      return data;
    },
    refetchInterval: 5000, // Poll every 5s for WhatsApp sidebar updates
    staleTime: 3000,
  });

  return query;
}

/**
 * Hook to fetch and poll messages for the active WhatsApp conversation.
 * Polls every 3 seconds and plays an audio alert when a new customer message arrives.
 */
export function useThreadMessages(threadId: string | null | undefined) {
  const setMessages = useCareStore((s) => s.setMessages);
  const { playSound } = useSoundAlert();
  const prevCountRef = useRef<number>(0);

  const tid = threadId ? String(threadId) : null;

  // Reset count tracking on thread switch
  useEffect(() => {
    prevCountRef.current = 0;
  }, [tid]);

  const query = useQuery({
    queryKey: ['conversations', 'messages', tid],
    queryFn: async () => {
      if (!tid) return [];
      const messages = await getThreadMessages(tid);

      // Trigger sound alert if a new inbound message arrived from the customer
      if (messages.length > prevCountRef.current && prevCountRef.current > 0) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.sender_type === 'customer') {
          playSound('/sounds/notification.wav');
        }
      }
      prevCountRef.current = messages.length;

      setMessages(tid, messages);
      return messages;
    },
    enabled: Boolean(tid),
    refetchInterval: 3000, // Real-time polling for incoming WhatsApp messages
    staleTime: 2000,
  });

  return query;
}

/**
 * Mutation for sending a WhatsApp reply from the agent.
 * Implements optimistic message insertion and delivery receipt tracking.
 */
export function useSendConversationReply() {
  const queryClient = useQueryClient();
  const addMessage = useCareStore((s) => s.addMessage);
  const updateMessageStatus = useCareStore((s) => s.updateMessageStatus);
  const updateThread = useCareStore((s) => s.updateThread);

  return useMutation({
    mutationFn: async ({
      threadId,
      message,
    }: {
      threadId: string;
      message: string;
    }) => {
      const tid = String(threadId);
      const tempId = `msg-${Date.now()}`;
      const now = new Date().toISOString();

      // Optimistically add message to UI
      addMessage(tid, {
        id: tempId,
        thread_id: tid,
        sender_type: 'agent',
        sender_name: CURRENT_AGENT.name,
        text: message,
        created_at: now,
        delivery_status: 'sent',
      });

      updateThread(tid, {
        last_message_preview: message,
        last_message_at: now,
      });

      try {
        const delivered = await sendChatMessage(tid, {
          text: message,
          sender_type: 'agent',
          sender_name: CURRENT_AGENT.name,
        });

        updateMessageStatus(tid, tempId, 'delivered', delivered.id);
        return delivered;
      } catch (err) {
        updateMessageStatus(tid, tempId, 'failed');
        throw err;
      }
    },
    onSuccess: (_, variables) => {
      const tid = String(variables.threadId);
      queryClient.invalidateQueries({
        queryKey: ['conversations', 'messages', tid],
      });
      queryClient.invalidateQueries({
        queryKey: ['conversations', 'list'],
      });
    },
  });
}

/**
 * Mutation for starting a new WhatsApp conversation to a phone number.
 */
export function useStartConversation() {
  const queryClient = useQueryClient();
  const setSelectedThreadId = useCareStore((s) => s.setSelectedThreadId);
  const addMessage = useCareStore((s) => s.addMessage);
  const setThreads = useCareStore((s) => s.setThreads);
  const threads = useCareStore((s) => s.threads);

  return useMutation({
    mutationFn: (payload: StartConversationPayload) => startConversation(payload),
    onSuccess: ({ conversation, message }) => {
      // Prepend newly created conversation and select it
      setThreads([conversation, ...threads.filter((t) => String(t.id) !== String(conversation.id))]);
      setSelectedThreadId(String(conversation.id));

      if (message) {
        addMessage(String(conversation.id), message);
      }

      queryClient.invalidateQueries({ queryKey: ['conversations', 'list'] });
    },
  });
}

/**
 * Mutation for updating thread status (e.g. In Progress -> Resolved)
 */
export function useUpdateThreadStatus() {
  const queryClient = useQueryClient();
  const updateThread = useCareStore((s) => s.updateThread);

  return useMutation({
    mutationFn: ({
      threadId,
      status,
    }: {
      threadId: string;
      status: Parameters<typeof updateThreadStatus>[1];
    }) => updateThreadStatus(threadId, status),
    onSuccess: (_, variables) => {
      const tid = String(variables.threadId);
      updateThread(tid, { status: variables.status });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'list'] });
    },
  });
}

/**
 * Mutation for reassigning thread to agent or department
 */
export function useReassignThread() {
  const queryClient = useQueryClient();
  const updateThread = useCareStore((s) => s.updateThread);

  return useMutation({
    mutationFn: ({
      threadId,
      agentId,
      agentName,
    }: {
      threadId: string;
      agentId: string;
      agentName: string;
    }) => reassignThread(threadId, agentId, agentName),
    onSuccess: (_, variables) => {
      const tid = String(variables.threadId);
      updateThread(tid, {
        assigned_agent_id: variables.agentId,
        assigned_agent_name: variables.agentName,
      });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'list'] });
    },
  });
}
