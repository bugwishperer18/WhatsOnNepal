'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import EventCard from '../components/EventCard';
import { EventGridSkeleton } from '../components/LoadingSkeleton';
import { Event, CATEGORIES, NEPAL_CITIES } from '@/lib/types';

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    dateRange: searchParams.get('dateRange') || 'upcoming',
  });

  const supabase = createClient();

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    setLoading(true);

    let query = supabase
      .from('events')
      .select('*');

    // Apply filters
    if (filters.keyword) {
      query = query.or(`title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    // Date range filters
    const now = new Date();
    if (filters.dateRange === 'upcoming') {
      query = query.gte('start_at', now.toISOString());
    } else if (filters.dateRange === 'this-week') {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      query = query
        .gte('start_at', now.toISOString())
        .lte('start_at', weekFromNow.toISOString());
    } else if (filters.dateRange === 'this-month') {
      const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      query = query
        .gte('start_at', now.toISOString())
        .lte('start_at', monthFromNow.toISOString());
    }

    query = query.order('start_at', { ascending: true }).limit(50);

    const { data, error } = await query;

    if (!error && data) {
      setEvents(data);
    }

    setLoading(false);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Discover Events</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Search</label>
            <input
              type="text"
              placeholder="Search events..."
              className="input"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
          </div>

          <div>
            <label className="label">City</label>
            <select
              className="input"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              <option value="">All Cities</option>
              {NEPAL_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Date Range</label>
            <select
              className="input"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="all">All Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <EventGridSkeleton />
      ) : events.length > 0 ? (
        <>
          <p className="text-gray-600 mb-4">{events.length} events found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No events found matching your filters.</p>
          <button
            onClick={() =>
              setFilters({ keyword: '', city: '', category: '', dateRange: 'upcoming' })
            }
            className="btn btn-primary mt-4"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
