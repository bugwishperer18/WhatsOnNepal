import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';

export function formatEventDate(startAt: string, endAt?: string | null): string {
  const start = new Date(startAt);

  if (!endAt) {
    return format(start, 'PPP p');
  }

  const end = new Date(endAt);
  const startDate = format(start, 'PPP');
  const endDate = format(end, 'PPP');

  if (startDate === endDate) {
    return `${format(start, 'PPP')} ${format(start, 'p')} - ${format(end, 'p')}`;
  }

  return `${format(start, 'PPP p')} - ${format(end, 'PPP p')}`;
}

export function formatEventDateShort(startAt: string): string {
  const start = new Date(startAt);
  return format(start, 'MMM d, yyyy');
}

export function formatEventTime(startAt: string): string {
  const start = new Date(startAt);
  return format(start, 'p');
}

export function getRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isEventPast(startAt: string): boolean {
  return isPast(new Date(startAt));
}

export function isEventUpcoming(startAt: string): boolean {
  return isFuture(new Date(startAt));
}
