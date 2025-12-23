-- Table to track user reading activity for AI personalization
CREATE TABLE public.user_reading_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER,
    activity_type TEXT NOT NULL DEFAULT 'read', -- 'read', 'bookmark', 'highlight', 'search'
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_reading_activity ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own activity"
ON public.user_reading_activity
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity"
ON public.user_reading_activity
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Table for church announcements
CREATE TABLE public.church_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    announcement_type TEXT NOT NULL DEFAULT 'general', -- 'general', 'event', 'prayer', 'urgent'
    event_date DATE,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.church_announcements ENABLE ROW LEVEL SECURITY;

-- RLS policies for announcements
CREATE POLICY "Announcements are viewable by everyone"
ON public.church_announcements
FOR SELECT
USING (is_active = true);

CREATE POLICY "Pastors can create announcements"
ON public.church_announcements
FOR INSERT
WITH CHECK (
    auth.uid() = author_id AND 
    public.has_role(auth.uid(), 'pastor') OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Pastors can update their announcements"
ON public.church_announcements
FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Pastors can delete their announcements"
ON public.church_announcements
FOR DELETE
USING (auth.uid() = author_id);

-- Trigger for updated_at
CREATE TRIGGER update_church_announcements_updated_at
    BEFORE UPDATE ON public.church_announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster queries
CREATE INDEX idx_user_reading_activity_user ON public.user_reading_activity(user_id);
CREATE INDEX idx_user_reading_activity_book ON public.user_reading_activity(book_id);
CREATE INDEX idx_church_announcements_active ON public.church_announcements(is_active, is_pinned);