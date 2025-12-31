import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/lib/types';
import { formatEventDateShort, formatEventTime } from '@/utils/format';
import { getFallbackImage } from '@/utils/fallback-images';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const imageUrl = event.image_url || getFallbackImage(event.category);

  return (
    <Link href={`/event/${event.id}`} className="card hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-xs font-medium">
          {event.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatEventDateShort(event.start_at)} at {formatEventTime(event.start_at)}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.city}
        </div>
        {event.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
        )}
      </div>
    </Link>
  );
}
