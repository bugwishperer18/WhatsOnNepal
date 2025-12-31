'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import EventCard from '../components/EventCard';
import { EventGridSkeleton } from '../components/LoadingSkeleton';
import { Event } from '@/lib/types';

export default function SavedEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setUser(user);
    await fetchBookmarkedEvents(user.id);
  };

  const fetchBookmarkedEvents = async (userId: string) => {
    setLoading(true);

    const { data: bookmarks } = await supabase
      .from('event_bookmarks')
      .select('event_id')
      .eq('user_id', userId);

    if (bookmarks && bookmarks.length > 0) {
      const eventIds = bookmarks.map(b => b.event_id);

      const { data: events } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds)
        .order('start_at', { ascending: true });

      if (events) {
        setEvents(events);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Saved Events</h1>
        <EventGridSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Saved Events</h1>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-4">You haven't saved any events yet.</p>
          <button onClick={() => router.push('/discover')} className="btn btn-primary">
            Discover Events
          </button>
        </div>
      )}
    </div>
  );
}
