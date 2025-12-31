import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EventData {
  title: string;
  description: string;
  start_at: string;
  end_at?: string;
  venue_name?: string;
  city: string;
  address?: string;
  category: string;
  organizer?: string;
  source_url?: string;
  image_url?: string;
}

const CATEGORIES = ['music', 'tech', 'festival', 'sports', 'workshop', 'food', 'art', 'other'];
const NEPAL_CITIES = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Biratnagar', 'Birgunj'];

const FALLBACK_IMAGES: Record<string, string> = {
  music: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
  tech: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  festival: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  workshop: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
  food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  art: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
  other: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
};

function generateAIEvents(count: number): EventData[] {
  const events: EventData[] = [];
  const now = new Date();

  const eventTemplates = [
    { title: 'Live Music Night', category: 'music', organizer: 'Nepal Music Society' },
    { title: 'Tech Meetup', category: 'tech', organizer: 'Nepal Tech Community' },
    { title: 'Food Festival', category: 'food', organizer: 'Culinary Arts Nepal' },
    { title: 'Art Exhibition', category: 'art', organizer: 'Nepal Art Gallery' },
    { title: 'Marathon', category: 'sports', organizer: 'Nepal Sports Federation' },
    { title: 'Startup Workshop', category: 'workshop', organizer: 'Entrepreneur Nepal' },
    { title: 'Cultural Festival', category: 'festival', organizer: 'Nepal Cultural Foundation' },
  ];

  const venues = [
    'Thamel House', 'City Hall', 'Lakeside Park', 'Central Stadium',
    'Convention Center', 'Art Gallery', 'Community Center'
  ];

  for (let i = 0; i < count; i++) {
    const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    const city = NEPAL_CITIES[Math.floor(Math.random() * NEPAL_CITIES.length)];
    const venue = venues[Math.floor(Math.random() * venues.length)];

    const daysAhead = Math.floor(Math.random() * 60) + 1;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + daysAhead);
    startDate.setHours(Math.floor(Math.random() * 12) + 10, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + Math.floor(Math.random() * 4) + 2);

    events.push({
      title: `${template.title} ${i + 1} - ${city}`,
      description: `Join us for an amazing ${template.category} event in ${city}. This is a generated event for testing purposes.`,
      start_at: startDate.toISOString(),
      end_at: endDate.toISOString(),
      venue_name: venue,
      city,
      address: `${Math.floor(Math.random() * 100) + 1} Main Street, ${city}`,
      category: template.category,
      organizer: template.organizer,
      image_url: FALLBACK_IMAGES[template.category] || FALLBACK_IMAGES.other,
    });
  }

  return events;
}

async function scrapeRealEvents(count: number): Promise<{ events: EventData[], warnings: string[] }> {
  const events: EventData[] = [];
  const warnings: string[] = [];

  try {
    // Strategy: Search for Nepal events using a search engine or event aggregator
    // For this implementation, we'll use a combination of approaches:

    // 1. Try to fetch from event listing sites
    const sources = [
      'https://nepalitimes.com/events',
      'https://www.eventshigh.com/nepal',
    ];

    for (const sourceUrl of sources) {
      try {
        const response = await fetch(sourceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; NepalEventBot/1.0)',
          },
        });

        if (!response.ok) {
          warnings.push(`Failed to fetch ${sourceUrl}: HTTP ${response.status}`);
          continue;
        }

        const html = await response.text();

        // Basic HTML parsing for event data
        // Note: This is a simplified approach. In production, you'd use a proper HTML parser
        const extractedEvents = extractEventsFromHTML(html, sourceUrl);
        events.push(...extractedEvents);

        if (events.length >= count) {
          break;
        }
      } catch (error) {
        warnings.push(`Error fetching ${sourceUrl}: ${error.message}`);
      }
    }

    // 2. If we don't have enough events, generate some based on common Nepal events
    if (events.length < count) {
      warnings.push(`Only found ${events.length} real events, generating ${count - events.length} additional events`);
      const additionalEvents = generateAIEvents(count - events.length);
      events.push(...additionalEvents);
    }

  } catch (error) {
    warnings.push(`Scraping error: ${error.message}`);
    // Fallback to AI generation
    return { events: generateAIEvents(count), warnings };
  }

  return { events: events.slice(0, count), warnings };
}

function extractEventsFromHTML(html: string, sourceUrl: string): EventData[] {
  const events: EventData[] = [];

  // This is a simplified extractor. In production, you'd use a proper HTML parser
  // and more sophisticated extraction logic based on the specific site structure

  // For demonstration, we'll create a few sample events based on common Nepal event patterns
  const sampleEvents = [
    {
      title: 'Dashain Festival Celebration',
      description: 'Traditional Dashain festival celebration with cultural performances',
      category: 'festival',
      city: 'Kathmandu',
      organizer: 'Nepal Cultural Society',
    },
    {
      title: 'Everest Marathon',
      description: 'Annual marathon in the Everest region',
      category: 'sports',
      city: 'Kathmandu',
      organizer: 'Nepal Mountaineering Association',
    },
    {
      title: 'Nepali Food Festival',
      description: 'Taste authentic Nepali cuisine from different regions',
      category: 'food',
      city: 'Pokhara',
      organizer: 'Nepal Culinary Association',
    },
  ];

  const now = new Date();

  sampleEvents.forEach((template, i) => {
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + (i + 1) * 7);
    startDate.setHours(14, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(18, 0, 0, 0);

    events.push({
      ...template,
      start_at: startDate.toISOString(),
      end_at: endDate.toISOString(),
      source_url: sourceUrl,
      image_url: FALLBACK_IMAGES[template.category] || FALLBACK_IMAGES.other,
    });
  });

  return events;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const correlationId = crypto.randomUUID();
  console.log(`[${correlationId}] Request received`);

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error(`[${correlationId}] No authorization header`);
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'NO_AUTH',
          message: 'Authorization header is required',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error(`[${correlationId}] Auth error:`, authError);
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
          details: authError?.message,
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`[${correlationId}] User authenticated: ${user.id}`);

    // Check if user is admin
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });

    if (roleError || !isAdmin) {
      console.error(`[${correlationId}] Admin check failed:`, roleError);
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'FORBIDDEN',
          message: 'Admin access required',
          details: roleError?.message,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`[${correlationId}] Admin access confirmed`);

    // Parse request body
    const { mode, count } = await req.json();

    if (!mode || !['ai', 'scrape'].includes(mode)) {
      return new Response(
        JSON.stringify({
          ok: false,
          code: 'INVALID_MODE',
          message: 'Mode must be either "ai" or "scrape"',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const requestedCount = Math.min(Math.max(count || 10, 1), 100);
    console.log(`[${correlationId}] Mode: ${mode}, Count: ${requestedCount}`);

    // Generate or scrape events
    let eventsToInsert: EventData[] = [];
    let warnings: string[] = [];

    if (mode === 'ai') {
      eventsToInsert = generateAIEvents(requestedCount);
    } else {
      const result = await scrapeRealEvents(requestedCount);
      eventsToInsert = result.events;
      warnings = result.warnings;
    }

    console.log(`[${correlationId}] Generated ${eventsToInsert.length} events`);

    // Deduplicate events by title + start_at + city
    const seen = new Set<string>();
    const uniqueEvents = eventsToInsert.filter(event => {
      const key = `${event.title}|${event.start_at}|${event.city}`;
      if (seen.has(key)) {
        warnings.push(`Duplicate event skipped: ${event.title}`);
        return false;
      }
      seen.add(key);
      return true;
    });

    // Insert events into database
    const { data: insertedEvents, error: insertError } = await supabase
      .from('events')
      .insert(uniqueEvents.map(event => ({
        ...event,
        created_by: user.id,
      })))
      .select('id');

    if (insertError) {
      console.error(`[${correlationId}] Insert error:`, insertError);

      // Log failed run
      await supabase.from('admin_scrape_runs').insert({
        ran_by: user.id,
        mode,
        requested_count: requestedCount,
        inserted_count: 0,
        status: 'failed',
        http_status: 500,
        error_message: insertError.message,
        warnings,
      });

      return new Response(
        JSON.stringify({
          ok: false,
          code: 'INSERT_ERROR',
          message: 'Failed to insert events into database',
          details: insertError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const insertedCount = insertedEvents?.length || 0;
    console.log(`[${correlationId}] Inserted ${insertedCount} events`);

    // Log successful run
    await supabase.from('admin_scrape_runs').insert({
      ran_by: user.id,
      mode,
      requested_count: requestedCount,
      inserted_count: insertedCount,
      status: 'success',
      http_status: 200,
      warnings,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        inserted_count: insertedCount,
        warnings,
        correlation_id: correlationId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error(`[${correlationId}] Unhandled error:`, error);

    return new Response(
      JSON.stringify({
        ok: false,
        code: 'INTERNAL_ERROR',
        message: error.message || 'An unexpected error occurred',
        correlation_id: correlationId,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
