import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import EventCard from './components/EventCard';
import { CATEGORIES } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createClient();

  // Fetch featured events (upcoming events, sorted by start date)
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })
    .limit(6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-nepal-blue to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Events Across Nepal</h1>
          <p className="text-xl mb-8">
            Find concerts, festivals, workshops, sports events, and more happening in cities across Nepal
          </p>
          <Link href="/discover" className="btn bg-white text-nepal-blue hover:bg-gray-100 text-lg px-8 py-3">
            Explore Events
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/discover?category=${category}`}
                className="px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 capitalize"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/discover" className="text-nepal-blue hover:underline">
              View All →
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No upcoming events yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Events by City</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Chitwan'].map((city) => (
              <Link
                key={city}
                href={`/discover?city=${city}`}
                className="card p-6 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg">{city}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
