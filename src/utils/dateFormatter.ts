// ─── Date Formatter ─────────────────────────────────────────────────────────
// Relative and absolute date formatting utilities using date-fns.

import { formatDistanceToNow, format, differenceInHours, differenceInMinutes, isToday, isYesterday } from 'date-fns';

function parseDateSafe(dateString?: string | null): Date | null {
  if (!dateString) return null;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? null : d;
}

export function formatRelativeTime(dateString: string): string {
  const date = parseDateSafe(dateString);
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatMessageTime(dateString: string): string {
  const date = parseDateSafe(dateString);
  if (!date) return '';
  return format(date, 'h:mm a');
}

export function formatThreadTimestamp(dateString: string): string {
  const date = parseDateSafe(dateString);
  if (!date) return '';

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'dd/MM/yyyy');
}

export function formatSLACountdown(deadlineString: string): { text: string; urgency: 'safe' | 'warning' | 'critical' } {
  const deadline = parseDateSafe(deadlineString);
  if (!deadline) {
    return { text: 'N/A', urgency: 'safe' };
  }
  const now = new Date();
  const minutesLeft = differenceInMinutes(deadline, now);

  if (minutesLeft <= 0) {
    return { text: 'BREACHED', urgency: 'critical' };
  }
  if (minutesLeft <= 5) {
    return { text: `${minutesLeft}m left`, urgency: 'critical' };
  }
  if (minutesLeft <= 15) {
    return { text: `${minutesLeft}m left`, urgency: 'warning' };
  }

  const hoursLeft = differenceInHours(deadline, now);
  if (hoursLeft > 0) {
    return { text: `${hoursLeft}h ${minutesLeft % 60}m`, urgency: 'safe' };
  }

  return { text: `${minutesLeft}m left`, urgency: 'safe' };
}

export function formatTimeRemaining(deadlineString: string): string {
  const { text } = formatSLACountdown(deadlineString);
  return text;
}

export function isWithin24Hours(dateString: string): boolean {
  const date = parseDateSafe(dateString);
  if (!date) return false;
  const hours = differenceInHours(new Date(), date);
  return hours < 24;
}

export function formatFullDate(dateString: string): string {
  const date = parseDateSafe(dateString);
  if (!date) return '';
  return format(date, 'dd MMM yyyy, h:mm a');
}
