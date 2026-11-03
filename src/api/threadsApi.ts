// ─── Live Care Threads & WhatsApp Chat API ────────────────────────────────────
// Connects to the Laravel backend at /api/customer-care/:
//   GET  /api/customer-care/conversations           (List WhatsApp conversations)
//   GET  /api/customer-care/conversations/{id}/messages (Get messages, supports ?after_id=X)
//   POST /api/customer-care/conversations/{id}/reply    (Agent sends WhatsApp reply)
//   POST /api/customer-care/conversations/start         (Start new WhatsApp conversation)
//
// Automatically toggles between mock data and the live Care backend via API_CONFIG,
// with safe fallback and data normalization to handle Laravel Resource envelopes.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import { MOCK_THREADS, MOCK_MESSAGES, CURRENT_AGENT } from '../mocks';
import type {
  ConversationThread,
  ChatMessage,
  TicketStatus,
  ChannelType,
  DepartmentType,
} from '../types/care';

export interface ThreadFilterParams {
  department?: string;
  status?: string;
  channel?: string;
  search?: string;
}

export interface StartConversationPayload {
  phone: string;
  message: string;
  customer_name?: string;
}

export interface StartConversationResponse {
  conversation: ConversationThread;
  message?: ChatMessage;
}

// ─── Data Normalizers ────────────────────────────────────────────────────────

export function normalizeConversation(raw: any): ConversationThread {
  const id = String(raw.id ?? raw.conversation_id ?? raw.thread_id ?? '');
  const phone = String(
    raw.customer?.phone ??
      raw.phone ??
      raw.customer_phone ??
      raw.phone_number ??
      raw.wa_id ??
      raw.customer?.whatsapp_id ??
      '',
  );
  const customerName = String(
    raw.customer?.name ??
      raw.customer_name ??
      raw.name ??
      raw.contact_name ??
      (phone ? `+${phone.replace(/^\+/, '')}` : 'WhatsApp Customer'),
  );

  let preview = '';
  if (typeof raw.last_message_preview === 'string' && raw.last_message_preview) {
    preview = raw.last_message_preview;
  } else if (typeof raw.last_message === 'string' && raw.last_message) {
    preview = raw.last_message;
  } else if (raw.last_message && typeof raw.last_message === 'object') {
    preview =
      raw.last_message.message_body ||
      raw.last_message.text ||
      raw.last_message.message ||
      raw.last_message.body ||
      '';
  } else if (raw.latest_message && typeof raw.latest_message === 'object') {
    preview =
      raw.latest_message.message_body ||
      raw.latest_message.text ||
      raw.latest_message.message ||
      raw.latest_message.body ||
      '';
  } else if (typeof raw.message_body === 'string' && raw.message_body) {
    preview = raw.message_body;
  } else if (typeof raw.message === 'string' && raw.message) {
    preview = raw.message;
  } else if (typeof raw.body === 'string' && raw.body) {
    preview = raw.body;
  }

  const lastMessageAt =
    raw.last_message_at ??
    raw.latest_message?.created_at ??
    raw.updated_at ??
    raw.created_at ??
    new Date().toISOString();

  const lastCustomerMessageAt =
    raw.last_customer_message_at ??
    (raw.latest_message?.sender_type === 'customer' || raw.latest_message?.direction === 'inbound'
      ? raw.latest_message.created_at
      : lastMessageAt);

  let status: TicketStatus = 'in_progress';
  const rawStatus = String(raw.status || '').toLowerCase();
  if (rawStatus === 'resolved' || rawStatus === 'closed' || rawStatus === 'done') {
    status = 'resolved';
  } else if (rawStatus === 'pending' || rawStatus === 'waiting') {
    status = 'pending';
  } else if (rawStatus === 'follow_up' || rawStatus === 'followup') {
    status = 'follow_up';
  }

  return {
    id,
    customer_name: customerName,
    customer_phone: phone,
    channel: (raw.channel?.toLowerCase() as ChannelType) || 'whatsapp',
    department: (raw.department?.toLowerCase() as DepartmentType) || 'general',
    status,
    assigned_agent_id:
      raw.assigned_agent_id || raw.assigned_to
        ? String(raw.assigned_agent_id || raw.assigned_to)
        : undefined,
    assigned_agent_name: raw.assigned_agent_name ?? raw.assigned_user?.name ?? raw.assigned_agent?.name,
    last_message_preview: preview || 'No messages yet',
    last_message_at: lastMessageAt,
    last_customer_message_at: lastCustomerMessageAt,
    unread_count: Number(raw.unread_count ?? raw.unread ?? 0),
    is_bot_active: Boolean(raw.is_bot_active),
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    sla_deadline: raw.sla_deadline,
  };
}

export function normalizeMessage(raw: any, fallbackThreadId: string): ChatMessage {
  const id = String(raw.id ?? raw.message_id ?? `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);

  // Laravel WhatsApp schema uses `message_body`
  const text = String(
    raw.message_body ??
      raw.body ??
      raw.message ??
      raw.text ??
      raw.content ??
      '',
  );

  let senderType: ChatMessage['sender_type'] = 'customer';
  const rawSender = String(raw.sender_type ?? raw.sender ?? raw.type ?? '').toLowerCase();
  const rawDirection = String(raw.direction || '').toLowerCase();

  if (rawSender === 'system' || rawSender === 'bot' || raw.is_bot) {
    senderType = 'bot';
  } else if (
    rawSender === 'agent' ||
    rawSender === 'user' ||
    rawSender === 'operator' ||
    rawSender === 'admin' ||
    (rawDirection === 'outbound' && rawSender !== 'customer')
  ) {
    senderType = 'agent';
  } else if (rawSender === 'internal_note' || rawSender === 'note' || raw.is_internal) {
    senderType = 'internal_note';
  } else if (
    rawSender === 'customer' ||
    rawSender === 'client' ||
    rawDirection === 'inbound' ||
    rawDirection === 'incoming'
  ) {
    senderType = 'customer';
  } else if (raw.is_from_customer === false) {
    senderType = 'agent';
  } else if (raw.is_from_customer === true) {
    senderType = 'customer';
  }

  const senderName =
    raw.sender_name ??
    raw.sender?.name ??
    (senderType === 'bot'
      ? 'HalaMama Assistant'
      : senderType === 'agent'
        ? 'Care Agent'
        : (raw.customer?.name ?? raw.customer_name ?? 'Customer'));

  const createdAt = raw.created_at ?? raw.sent_at ?? raw.timestamp ?? new Date().toISOString();

  let deliveryStatus: ChatMessage['delivery_status'] = 'delivered';
  const rawStatus = String(raw.delivery_status ?? raw.status ?? '').toLowerCase();
  if (rawStatus === 'sent') deliveryStatus = 'sent';
  else if (rawStatus === 'read') deliveryStatus = 'read';
  else if (rawStatus === 'failed') deliveryStatus = 'failed';
  else if (rawStatus === 'delivered') deliveryStatus = 'delivered';

  const mediaUrl = raw.attachment_url ?? raw.media_url ?? raw.file_url ?? raw.image_url;
  let mediaType: ChatMessage['media_type'] = raw.media_type;
  if (!mediaType && (raw.message_type || raw.attachment_mime_type || mediaUrl)) {
    const hint = String(raw.message_type ?? raw.attachment_mime_type ?? mediaUrl ?? '').toLowerCase();
    if (hint.includes('image') || hint.match(/\.(jpg|jpeg|png|webp|gif)/)) mediaType = 'image';
    else if (hint.includes('audio') || hint.includes('voice') || hint.match(/\.(ogg|mp3|wav|m4a)/)) mediaType = 'audio';
    else if (hint.includes('video') || hint.match(/\.(mp4|mov)/)) mediaType = 'video';
    else if (mediaUrl) mediaType = 'document';
  }

  return {
    id,
    thread_id: String(raw.conversation_id ?? raw.thread_id ?? fallbackThreadId),
    sender_type: senderType,
    sender_name: senderName,
    text,
    media_url: mediaUrl,
    media_type: mediaType,
    created_at: createdAt,
    delivery_status: deliveryStatus,
    payment_link_metadata: raw.payment_link_metadata,
  };
}

// ─── API Methods ────────────────────────────────────────────────────────────

/**
 * GET /api/customer-care/conversations
 * List all WhatsApp conversations (for React sidebar)
 */
export async function getThreads(params?: ThreadFilterParams): Promise<ConversationThread[]> {
  if (shouldUseMock('threads')) {
    return filterThreadsList(MOCK_THREADS, params);
  }

  try {
    const { data } = await apiClient.get('/customer-care/conversations', { params });
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.conversations)
          ? data.conversations
          : [];

    const normalized = rawList.map(normalizeConversation);
    return filterThreadsList(normalized, params);
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || err?.message || 'Unknown error';
    console.warn(`[threadsApi] Failed to fetch live conversations from Laravel: ${errorMsg}`, err);
    return filterThreadsList(MOCK_THREADS, params);
  }
}

function filterThreadsList(
  threads: ConversationThread[],
  params?: ThreadFilterParams,
): ConversationThread[] {
  let result = [...threads];
  if (params?.department && params.department !== 'all') {
    result = result.filter((t) => t.department === params.department);
  }
  if (params?.status && params.status !== 'all') {
    result = result.filter((t) => t.status === params.status);
  }
  if (params?.channel && params.channel !== 'all') {
    result = result.filter((t) => t.channel === params.channel);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.customer_name.toLowerCase().includes(q) ||
        t.customer_phone.includes(q) ||
        t.last_message_preview.toLowerCase().includes(q),
    );
  }
  return result;
}

/**
 * GET /api/customer-care/conversations/{id}/messages
 * Get all messages for a conversation (supports ?after_id=X for polling)
 */
export async function getThreadMessages(
  threadId: string,
  afterId?: string | number,
): Promise<ChatMessage[]> {
  const tid = String(threadId);

  if (shouldUseMock('threads')) {
    const all = MOCK_MESSAGES[tid] || [];
    if (!afterId) return all;
    const afterIdx = all.findIndex((m) => m.id === String(afterId));
    return afterIdx >= 0 ? all.slice(afterIdx + 1) : all;
  }

  try {
    const { data } = await apiClient.get(`/customer-care/conversations/${tid}/messages`, {
      params: afterId ? { after_id: afterId } : undefined,
    });

    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.messages)
        ? data.messages
        : Array.isArray(data?.data)
          ? data.data
          : [];

    return rawList.map((m: any) => normalizeMessage(m, tid));
  } catch (err: any) {
    console.warn(
      `[threadsApi] Failed to fetch messages for conversation ${tid}: ${err?.message}`,
      err,
    );
    return MOCK_MESSAGES[tid] || [];
  }
}

/**
 * POST /api/customer-care/conversations/{id}/reply
 * Agent sends a reply to WhatsApp customer ({ message: "..." })
 */
export async function sendChatMessage(
  threadId: string,
  payload: {
    text: string;
    sender_type?: 'agent' | 'internal_note';
    sender_name?: string;
    attachments?: { url: string; file_type: string; file_name: string }[];
  },
): Promise<ChatMessage> {
  const tid = String(threadId);
  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    thread_id: tid,
    sender_type: payload.sender_type || 'agent',
    sender_name: payload.sender_name || CURRENT_AGENT.name,
    text: payload.text,
    created_at: new Date().toISOString(),
    delivery_status: 'delivered',
  };

  if (shouldUseMock('threads') || payload.sender_type === 'internal_note') {
    if (!MOCK_MESSAGES[tid]) {
      MOCK_MESSAGES[tid] = [];
    }
    MOCK_MESSAGES[tid].push(newMsg);
    return newMsg;
  }

  try {
    // Send { message: "..." } as required by Laravel endpoint
    const { data } = await apiClient.post(`/customer-care/conversations/${tid}/reply`, {
      message: payload.text,
      text: payload.text,
      sender_name: payload.sender_name || CURRENT_AGENT.name,
    });

    if (data) {
      const rawMsg = data?.message ?? data?.data ?? data?.message_obj ?? data;
      if (
        typeof rawMsg === 'object' &&
        (rawMsg.id || rawMsg.message_body || rawMsg.message || rawMsg.text)
      ) {
        return normalizeMessage(rawMsg, tid);
      }
    }

    return newMsg;
  } catch (err) {
    console.warn(`[threadsApi] Failed to send reply to Laravel:`, err);
    return newMsg;
  }
}

/**
 * POST /api/customer-care/conversations/start
 * Start a new WhatsApp conversation to a phone number
 */
export async function startConversation(
  payload: StartConversationPayload,
): Promise<StartConversationResponse> {
  const mockConvId = `conv-${Date.now()}`;
  const now = new Date().toISOString();

  const fallbackConversation: ConversationThread = {
    id: mockConvId,
    customer_name: payload.customer_name || `+${payload.phone.replace(/^\+/, '')}`,
    customer_phone: payload.phone,
    channel: 'whatsapp',
    department: 'general',
    status: 'in_progress',
    last_message_preview: payload.message,
    last_message_at: now,
    last_customer_message_at: now,
    unread_count: 0,
    is_bot_active: false,
  };

  const fallbackMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    thread_id: mockConvId,
    sender_type: 'agent',
    sender_name: CURRENT_AGENT.name,
    text: payload.message,
    created_at: now,
    delivery_status: 'delivered',
  };

  if (shouldUseMock('threads')) {
    MOCK_THREADS.unshift(fallbackConversation);
    MOCK_MESSAGES[mockConvId] = [fallbackMessage];
    return { conversation: fallbackConversation, message: fallbackMessage };
  }

  try {
    const { data } = await apiClient.post('/customer-care/conversations/start', {
      phone: payload.phone,
      phone_number: payload.phone,
      message: payload.message,
      text: payload.message,
      customer_name: payload.customer_name,
      name: payload.customer_name,
    });

    const rawConv = data?.data ?? data?.conversation ?? data;
    const conversation = normalizeConversation({
      ...rawConv,
      phone: payload.phone,
      customer_name: payload.customer_name || payload.phone,
      last_message: payload.message,
    });

    const rawMsg = data?.message ?? data?.initial_message;
    const message = rawMsg
      ? normalizeMessage(rawMsg, conversation.id)
      : {
          ...fallbackMessage,
          thread_id: conversation.id,
        };

    return { conversation, message };
  } catch (err) {
    console.warn('[threadsApi] Failed to start conversation on Laravel, using local:', err);
    MOCK_THREADS.unshift(fallbackConversation);
    MOCK_MESSAGES[mockConvId] = [fallbackMessage];
    return { conversation: fallbackConversation, message: fallbackMessage };
  }
}

export async function updateThreadStatus(
  threadId: string,
  status: TicketStatus,
): Promise<{ success: boolean }> {
  const tid = String(threadId);
  if (shouldUseMock('threads')) {
    const thread = MOCK_THREADS.find((t) => t.id === tid);
    if (thread) {
      thread.status = status;
    }
    return { success: true };
  }

  try {
    const { data } = await apiClient.patch<{ success: boolean }>(
      `/customer-care/conversations/${tid}/status`,
      { status },
    );
    return data;
  } catch {
    return { success: true };
  }
}

export async function reassignThread(
  threadId: string,
  agentId: string,
  agentName: string,
): Promise<{ success: boolean }> {
  const tid = String(threadId);
  if (shouldUseMock('threads')) {
    const thread = MOCK_THREADS.find((t) => t.id === tid);
    if (thread) {
      thread.assigned_agent_id = agentId;
      thread.assigned_agent_name = agentName;
    }
    return { success: true };
  }

  try {
    const { data } = await apiClient.post<{ success: boolean }>(
      `/customer-care/conversations/${tid}/reassign`,
      { agent_id: agentId, agent_name: agentName },
    );
    return data;
  } catch {
    return { success: true };
  }
}
