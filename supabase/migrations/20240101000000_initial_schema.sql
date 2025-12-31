-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    venue_name TEXT,
    city TEXT NOT NULL,
    address TEXT,
    category TEXT NOT NULL,
    organizer TEXT,
    source_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    CONSTRAINT valid_dates CHECK (end_at IS NULL OR end_at >= start_at)
);

-- Create indexes for common queries
CREATE INDEX idx_events_start_at ON public.events(start_at);
CREATE INDEX idx_events_city ON public.events(city);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_created_at ON public.events(created_at);

-- User roles table
CREATE TABLE public.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role)
);

-- Event bookmarks table
CREATE TABLE public.event_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

CREATE INDEX idx_bookmarks_user_id ON public.event_bookmarks(user_id);
CREATE INDEX idx_bookmarks_event_id ON public.event_bookmarks(event_id);

-- Event reminders table
CREATE TABLE public.event_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    remind_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

CREATE INDEX idx_reminders_user_id ON public.event_reminders(user_id);
CREATE INDEX idx_reminders_event_id ON public.event_reminders(event_id);
CREATE INDEX idx_reminders_remind_at ON public.event_reminders(remind_at);

-- Admin scrape runs table
CREATE TABLE public.admin_scrape_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ran_by UUID REFERENCES auth.users(id),
    mode TEXT NOT NULL,
    requested_count INTEGER NOT NULL,
    inserted_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    http_status INTEGER,
    error_message TEXT,
    warnings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scrape_runs_ran_at ON public.admin_scrape_runs(ran_at DESC);
CREATE INDEX idx_scrape_runs_ran_by ON public.admin_scrape_runs(ran_by);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_scrape_runs ENABLE ROW LEVEL SECURITY;
