// ─── SP1-09: Socket.io Core Foundation ──────────────────────────────────────
// Real-time WebSocket connection to the Laravel/Redis gateway.
// Event listeners update the Zustand store to drive reactive UI updates.

import { io, type Socket } from 'socket.io-client';
import { useCareStore } from '../store/useCareStore';
import type { ChatMessage } from '../types/care';

let socket: Socket | null = null;
let initialized = false;

function playNotification(): void {
  try {
    new Audio('/sounds/notification.wav').play().catch(() => {
      /* audio blocked or unavailable */
    });
  } catch {
    /* audio API unavailable */
  }
}

export function getSocket(): Socket {
  if (!socket) {
    socket = io(import.meta.env.VITE_WS_ENDPOINT || 'http://localhost:6001', {
      auth: { token: localStorage.getItem('halamama_auth_token') },
      autoConnect: false,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });
  }
  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  const store = useCareStore.getState();

  s.on('connect', () => {
    store.setIsConnected(true);
  });

  s.on('disconnect', () => {
    store.setIsConnected(false);
  });

  s.on('connect_error', (err) => {
    store.setIsConnected(false);
    console.error('[Socket] Connection error:', err.message);
  });

  s.connect();
}

export function registerSocketListeners(): void {
  const s = getSocket();

  // Inbound customer message from WhatsApp / IG / FB
  s.on('chat:inbound_message', (payload: { thread_id: string; message: ChatMessage }) => {
    playNotification();
    const currentStore = useCareStore.getState();
    currentStore.addMessage(payload.thread_id, payload.message);

    // Update thread preview
    currentStore.updateThread(payload.thread_id, {
      last_message_preview: payload.message.text || '[Media]',
      last_message_at: payload.message.created_at,
      last_customer_message_at: payload.message.sender_type === 'customer'
        ? payload.message.created_at
        : currentStore.threads.find((t) => t.id === payload.thread_id)?.last_customer_message_at || '',
      unread_count:
        currentStore.selectedThreadId === payload.thread_id
          ? 0
          : (currentStore.threads.find((t) => t.id === payload.thread_id)?.unread_count || 0) + 1,
    });
  });

  // Thread reassigned to new department or agent
  s.on('chat:thread_reassigned', (payload: { thread_id: string; department: string; agent_id?: string; agent_name?: string }) => {
    const currentStore = useCareStore.getState();
    currentStore.updateThread(payload.thread_id, {
      department: payload.department as import('../types/care').DepartmentType,
      assigned_agent_id: payload.agent_id,
      assigned_agent_name: payload.agent_name,
    });
  });

  // Operations Manager approval notification for returns > 200 QAR
  s.on('returns:approval_required', (_payload: { return_id: string; amount: number; order_id: string; agent_name: string }) => {
    const userRole = localStorage.getItem('user_role');
    if (userRole === 'operations_manager') {
      // Play alert sound
      try {
        new Audio('/sounds/approval_alert.wav').play().catch(() => { /* silent fail */ });
      } catch {
        /* Audio not available */
      }
    }
  });

  // Return status updated
  s.on('returns:status_updated', (payload: { return_id: string; status: string; approved_by?: string }) => {
    void payload;
  });

  // Delivery status updated from driver app
  s.on('oms:delivery_status_changed', (payload: { order_id: string; delivery_status: string; driver_name?: string }) => {
    const currentStore = useCareStore.getState();
    currentStore.setActiveOrders(
      currentStore.activeOrders.map((order) =>
        order.name === payload.order_id
          ? { ...order, delivery_status: payload.delivery_status as import('../types/care').DeliveryStatus, driver_name: payload.driver_name || order.driver_name }
          : order
      )
    );
  });

  // Agent presence changed
  s.on('agent:presence_changed', (payload: { agent_id: string; presence: string }) => {
    void payload;
  });

  // Dashboard metrics updated
  s.on('metrics:updated', (payload: Record<string, number>) => {
    void payload;
  });
}

export function initSocket(): void {
  if (initialized) return;
  initialized = true;
  registerSocketListeners();
  connectSocket();
}

export function disconnectSocket(): void {
  initialized = false;
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    useCareStore.getState().setIsConnected(false);
  }
}

// Emit helpers
export function emitPresence(presence: string): void {
  getSocket().emit('agent:set_presence', { presence });
}

export function emitSendMessage(threadId: string, text: string, senderType: string): void {
  getSocket().emit('chat:send_message', { thread_id: threadId, text, sender_type: senderType });
}

export function emitReassignThread(threadId: string, department: string, agentId?: string): void {
  getSocket().emit('chat:reassign_thread', { thread_id: threadId, department, agent_id: agentId });
}

export function emitMarkResolved(threadId: string): void {
  getSocket().emit('chat:mark_resolved', { thread_id: threadId });
}
