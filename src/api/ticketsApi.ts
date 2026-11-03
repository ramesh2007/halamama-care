// ─── Email Tickets & Messages API ───────────────────────────────────────────
// Fetches the email ticket list, reads full thread correspondence, and sends replies.
// Toggles between mock data and the live Care ticketing backend via API_CONFIG.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import { MOCK_TICKETS, MOCK_EMAIL_MESSAGES } from '../mocks';
import type { EmailTicket, EmailMessage } from '../types/care';

export async function getTickets(): Promise<EmailTicket[]> {
  if (shouldUseMock('tickets')) {
    return MOCK_TICKETS;
  }

  try {
    const { data } = await apiClient.get<EmailTicket[]>('/care/tickets');
    return data;
  } catch (err) {
    console.warn('[ticketsApi] Failed to fetch live tickets, falling back to mock', err);
    return MOCK_TICKETS;
  }
}

export async function getTicketMessages(ticketId: string): Promise<EmailMessage[]> {
  if (shouldUseMock('tickets')) {
    return MOCK_EMAIL_MESSAGES[ticketId] || [];
  }

  try {
    const { data } = await apiClient.get<EmailMessage[]>(`/care/tickets/${ticketId}/messages`);
    return data;
  } catch (err) {
    console.warn(`[ticketsApi] Failed to fetch messages for ticket ${ticketId}, falling back to mock`, err);
    return MOCK_EMAIL_MESSAGES[ticketId] || [];
  }
}

export async function sendTicketReply(
  ticketId: string,
  replyPayload: {
    recipients: string[];
    cc?: string[];
    subject: string;
    body_text: string;
    body_html?: string;
    attachments?: { name: string; size: number }[];
  },
): Promise<EmailMessage> {
  const newMsg: EmailMessage = {
    id: `em-${Date.now()}`,
    ticket_id: ticketId,
    sender_name: 'Care Agent',
    sender_email: 'care@halamama.qa',
    recipients: replyPayload.recipients,
    cc: replyPayload.cc || [],
    subject: replyPayload.subject,
    body_text: replyPayload.body_text,
    body_html: replyPayload.body_html || `<p>${replyPayload.body_text}</p>`,
    attachments: replyPayload.attachments || [],
    direction: 'outbound',
    created_at: new Date().toISOString(),
  };

  if (shouldUseMock('tickets')) {
    if (!MOCK_EMAIL_MESSAGES[ticketId]) {
      MOCK_EMAIL_MESSAGES[ticketId] = [];
    }
    MOCK_EMAIL_MESSAGES[ticketId].push(newMsg);
    return newMsg;
  }

  try {
    const { data } = await apiClient.post<EmailMessage>(
      `/care/tickets/${ticketId}/reply`,
      replyPayload,
    );
    return data;
  } catch {
    return newMsg;
  }
}

export async function createTicket(payload: Partial<EmailTicket>): Promise<EmailTicket> {
  const newTicket: EmailTicket = {
    id: `tck-${Math.floor(1000 + Math.random() * 9000)}`,
    ticket_id: `#TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    sender_name: payload.sender_name || 'Customer',
    sender_email: payload.sender_email || 'customer@email.qa',
    subject: payload.subject || 'Support Ticket',
    customer_link: payload.customer_link || payload.sender_name || 'Customer',
    priority: payload.priority || 'medium',
    status: payload.status || 'open',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (shouldUseMock('tickets')) {
    MOCK_TICKETS.unshift(newTicket);
    return newTicket;
  }

  try {
    const { data } = await apiClient.post<EmailTicket>('/care/tickets', payload);
    return data;
  } catch {
    return newTicket;
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: EmailTicket['status'],
): Promise<EmailTicket | null> {
  if (shouldUseMock('tickets')) {
    const found = MOCK_TICKETS.find((t) => t.id === ticketId);
    if (found) {
      found.status = status;
      found.updated_at = new Date().toISOString();
      return { ...found };
    }
    return null;
  }

  try {
    const { data } = await apiClient.patch<EmailTicket>(`/care/tickets/${ticketId}/status`, { status });
    return data;
  } catch {
    const found = MOCK_TICKETS.find((t) => t.id === ticketId);
    if (found) {
      found.status = status;
      return { ...found };
    }
    return null;
  }
}

