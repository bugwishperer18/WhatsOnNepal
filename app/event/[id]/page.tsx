'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Event } from '@/lib/types';
import { formatEventDate } from '@/utils/format';
import { getFallbackImage } from '@/utils/fallback-images';
import { downloadICS, getGoogleCalendarUrl } from '@/utils/calendar';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [hasReminder, setHasReminder] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchEvent();
    checkAuth();
  }, [eventId]);

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
      return;
    }

    setEvent(data);
    setLoading(false);
  };

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      // Check if bookmarked
      const { data: bookmark } = await supabase
        .from('event_bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .single();

      setIsBookmarked(!!bookmark);

      // Check if reminder exists
      const { data: reminder } = await supabase
        .from('event_reminders')
        .select('remind_at')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .single();

      if (reminder) {
        setHasReminder(true);
        setReminderDate(reminder.remind_at);
      }
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (isBookmarked) {
      await supabase
        .from('event_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);
      setIsBookmarked(false);
    } else {
      await supabase
        .from('event_bookmarks')
        .insert({ user_id: user.id, event_id: eventId });
      setIsBookmarked(true);
    }
  };

  const saveReminder = async () => {
    if (!user || !reminderDate) return;

    const { error } = await supabase
      .from('event_reminders')
      .upsert({
        user_id: user.id,
        event_id: eventId,
        remind_at: reminderDate,
      }, {
        onConflict: 'user_id,event_id'
      });

    if (!error) {
      setHasReminder(true);
      setShowReminderModal(false);
    }
  };

  const shareEvent = (platform: string) => {
    if (!event) return;

    const url = window.location.href;
    const text = `Check out ${event.title} on What's On Nepal`;

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <button onClick={() => router.push('/discover')} className="btn btn-primary">
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = event.image_url || getFallbackImage(event.category);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event Image */}
      <div className="relative h-96 rounded-lg overflow-hidden mb-8">
        <Image src={imageUrl} alt={event.title} fill className="object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <span className="px-3 py-1 bg-nepal-blue text-white rounded-full text-sm capitalize">
              {event.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-col gap-3 text-gray-700 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatEventDate(event.start_at, event.end_at)}
            </div>

            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.venue_name ? `${event.venue_name}, ${event.city}` : event.city}
            </div>

            {event.organizer && (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Organized by {event.organizer}
              </div>
            )}
          </div>

          {event.description && (
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-bold mb-3">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {event.address && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">Location</h2>
              <p className="text-gray-700">{event.address}</p>
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h3 className="font-bold text-lg mb-4">Event Actions</h3>

            <div className="flex flex-col gap-3">
              <button
                onClick={toggleBookmark}
                className={`btn ${isBookmarked ? 'btn-danger' : 'btn-primary'} w-full`}
              >
                {isBookmarked ? '❤️ Saved' : '🤍 Save Event'}
              </button>

              <button
                onClick={() => event && downloadICS(event)}
                className="btn btn-secondary w-full"
              >
                📅 Download .ics
              </button>

              <a
                href={getGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary w-full text-center"
              >
                📆 Add to Google Calendar
              </a>

              <button
                onClick={() => user ? setShowReminderModal(true) : router.push('/auth/login')}
                className="btn btn-secondary w-full"
              >
                {hasReminder ? '🔔 Update Reminder' : '🔔 Set Reminder'}
              </button>

              <hr className="my-2" />

              <h4 className="font-semibold mb-2">Share</h4>

              <button onClick={copyLink} className="btn btn-secondary w-full">
                🔗 Copy Link
              </button>

              <button onClick={() => shareEvent('twitter')} className="btn btn-secondary w-full">
                𝕏 Share on X
              </button>

              <button onClick={() => shareEvent('facebook')} className="btn btn-secondary w-full">
                📘 Share on Facebook
              </button>

              <button onClick={() => shareEvent('linkedin')} className="btn btn-secondary w-full">
                💼 Share on LinkedIn
              </button>
            </div>

            {event.source_url && (
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-nepal-blue hover:underline mt-4 block"
              >
                View Original Source →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Set Reminder</h3>
            <p className="text-gray-600 mb-4">
              When would you like to be reminded about this event?
            </p>
            <input
              type="datetime-local"
              className="input mb-4"
              value={reminderDate ? new Date(reminderDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => setReminderDate(new Date(e.target.value).toISOString())}
            />
            <div className="flex gap-3">
              <button onClick={saveReminder} className="btn btn-primary flex-1">
                Save Reminder
              </button>
              <button onClick={() => setShowReminderModal(false)} className="btn btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
