// ─── React Query Hooks: Tickets ─────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTickets,
  getTicketMessages,
  sendTicketReply,
  createTicket,
  updateTicketStatus,
} from '../../api/ticketsApi';

export function useTickets() {
  return useQuery({
    queryKey: ['tickets', 'list'],
    queryFn: getTickets,
    staleTime: 30 * 1000,
  });
}

export function useTicketMessages(ticketId: string | null | undefined) {
  return useQuery({
    queryKey: ['tickets', 'messages', ticketId],
    queryFn: () => (ticketId ? getTicketMessages(ticketId) : Promise.resolve([])),
    enabled: Boolean(ticketId),
    staleTime: 15 * 1000,
  });
}

export function useSendTicketReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      payload,
    }: {
      ticketId: string;
      payload: Parameters<typeof sendTicketReply>[1];
    }) => sendTicketReply(ticketId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tickets', 'messages', variables.ticketId],
      });
      queryClient.invalidateQueries({
        queryKey: ['tickets', 'list'],
      });
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tickets', 'list'],
      });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: Parameters<typeof updateTicketStatus>[1];
    }) => updateTicketStatus(ticketId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tickets', 'list'],
      });
    },
  });
}

