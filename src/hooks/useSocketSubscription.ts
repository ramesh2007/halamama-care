// ─── useSocketSubscription Hook ─────────────────────────────────────────────
// Binds socket event listeners on mount and cleans them up on unmount
// to prevent memory leaks in long-lived components.

import { useEffect } from 'react';
import { getSocket } from '../services/socket';

type EventHandler = (...args: unknown[]) => void;

export function useSocketSubscription(event: string, handler: EventHandler): void {
  useEffect(() => {
    const socket = getSocket();
    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
}

export function useSocketSubscriptions(subscriptions: Record<string, EventHandler>): void {
  useEffect(() => {
    const socket = getSocket();

    Object.entries(subscriptions).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(subscriptions).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
