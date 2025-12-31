import ical, { ICalEventData } from 'ical-generator';
import { Event } from '@/lib/types';

export function generateICS(event: Event): string {
  const calendar = ical({ name: 'What\'s On Nepal' });

  const eventData: ICalEventData = {
    start: new Date(event.start_at),
    end: event.end_at ? new Date(event.end_at) : new Date(new Date(event.start_at).getTime() + 2 * 60 * 60 * 1000),
    summary: event.title,
    description: event.description || '',
    location: event.venue_name
      ? `${event.venue_name}, ${event.city}${event.address ? ', ' + event.address : ''}`
      : event.city,
    url: event.source_url || undefined,
  };

  calendar.createEvent(eventData);

  return calendar.toString();
}

export function downloadICS(event: Event) {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getGoogleCalendarUrl(event: Event): string {
  const startDate = new Date(event.start_at);
  const endDate = event.end_at
    ? new Date(event.end_at)
    : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: event.description || '',
    location: event.venue_name
      ? `${event.venue_name}, ${event.city}${event.address ? ', ' + event.address : ''}`
      : event.city,
  });

  if (event.source_url) {
    params.append('sprop', `website:${event.source_url}`);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
