export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  venue_name: string | null;
  city: string;
  address: string | null;
  category: string;
  organizer: string | null;
  source_url: string | null;
  image_url: string | null;
  created_at: string;
  created_by: string | null;
}

export interface EventBookmark {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
}

export interface EventReminder {
  id: string;
  user_id: string;
  event_id: string;
  remind_at: string;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role: string;
  created_at: string;
}

export interface AdminScrapeRun {
  id: string;
  ran_at: string;
  ran_by: string | null;
  mode: 'ai' | 'scrape';
  requested_count: number;
  inserted_count: number;
  status: 'success' | 'failed';
  http_status: number | null;
  error_message: string | null;
  warnings: string[];
}

export type Category = 'music' | 'tech' | 'festival' | 'sports' | 'workshop' | 'food' | 'art' | 'other';

export const CATEGORIES: Category[] = ['music', 'tech', 'festival', 'sports', 'workshop', 'food', 'art', 'other'];

export const NEPAL_CITIES = [
  'Kathmandu',
  'Pokhara',
  'Lalitpur',
  'Bhaktapur',
  'Chitwan',
  'Biratnagar',
  'Birgunj',
  'Dharan',
  'Butwal',
  'Hetauda',
] as const;

export type NepalCity = typeof NEPAL_CITIES[number];
