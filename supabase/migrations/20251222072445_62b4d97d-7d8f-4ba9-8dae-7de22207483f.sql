-- Create reading plans table
CREATE TABLE public.reading_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reading plan days table (what to read each day)
CREATE TABLE public.reading_plan_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.reading_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  readings TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(plan_id, day_number)
);

-- Create user reading plan progress table
CREATE TABLE public.user_reading_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.reading_plans(id) ON DELETE CASCADE,
  current_day INTEGER NOT NULL DEFAULT 1,
  completed_days INTEGER[] NOT NULL DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, plan_id)
);

-- Create daily verses table for notifications
CREATE TABLE public.daily_verses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  wisdom_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_verses ENABLE ROW LEVEL SECURITY;

-- Reading plans are viewable by everyone
CREATE POLICY "Reading plans are viewable by everyone" 
ON public.reading_plans FOR SELECT USING (true);

-- Reading plan days are viewable by everyone
CREATE POLICY "Reading plan days are viewable by everyone" 
ON public.reading_plan_days FOR SELECT USING (true);

-- Users can view their own reading progress
CREATE POLICY "Users can view their own reading progress" 
ON public.user_reading_progress FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own reading progress
CREATE POLICY "Users can create their own reading progress" 
ON public.user_reading_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reading progress
CREATE POLICY "Users can update their own reading progress" 
ON public.user_reading_progress FOR UPDATE USING (auth.uid() = user_id);

-- Daily verses are viewable by everyone
CREATE POLICY "Daily verses are viewable by everyone" 
ON public.daily_verses FOR SELECT USING (true);

-- Pastors can manage reading plans
CREATE POLICY "Pastors can create reading plans" 
ON public.reading_plans FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('pastor', 'admin')
));

CREATE POLICY "Pastors can update reading plans" 
ON public.reading_plans FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('pastor', 'admin')
));

CREATE POLICY "Pastors can delete reading plans" 
ON public.reading_plans FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('pastor', 'admin')
));

-- Pastors can manage reading plan days
CREATE POLICY "Pastors can create reading plan days" 
ON public.reading_plan_days FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('pastor', 'admin')
));

CREATE POLICY "Pastors can update reading plan days" 
ON public.reading_plan_days FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('pastor', 'admin')
));

CREATE POLICY "Pastors can delete reading plan days" 
ON public.reading_plan_days FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('pastor', 'admin')
));

-- Pastors can manage daily verses
CREATE POLICY "Pastors can create daily verses" 
ON public.daily_verses FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('pastor', 'admin')
));

CREATE POLICY "Pastors can update daily verses" 
ON public.daily_verses FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('pastor', 'admin')
));

-- Insert sample reading plans
INSERT INTO public.reading_plans (id, name, description, duration_days) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'New Testament in 30 Days', 'Read through the entire New Testament in one month', 30),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Psalms & Proverbs', 'Daily wisdom from Psalms and Proverbs', 31),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Gospel of John', 'Deep dive into the Gospel of John in 21 days', 21);

-- Insert sample reading plan days for Gospel of John plan
INSERT INTO public.reading_plan_days (plan_id, day_number, title, readings) VALUES
('c3d4e5f6-a7b8-9012-cdef-123456789012', 1, 'The Word Became Flesh', ARRAY['John 1:1-18']),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 2, 'John''s Testimony', ARRAY['John 1:19-51']),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 3, 'Water to Wine', ARRAY['John 2:1-25']),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 4, 'You Must Be Born Again', ARRAY['John 3:1-21']),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 5, 'Living Water', ARRAY['John 4:1-42']),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 6, 'Healing at the Pool', ARRAY['John 5:1-47']),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 7, 'Bread of Life', ARRAY['John 6:1-71']);

-- Insert sample daily verses
INSERT INTO public.daily_verses (date, verse_reference, verse_text, wisdom_message) VALUES
(CURRENT_DATE, 'Philippians 4:13', 'I can do all things through Christ who strengthens me.', 'Remember that your strength comes from God. Whatever challenges you face today, lean on Him.'),
(CURRENT_DATE + INTERVAL '1 day', 'Jeremiah 29:11', 'For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.', 'Trust in God''s perfect plan for your life, even when the path seems unclear.'),
(CURRENT_DATE + INTERVAL '2 day', 'Psalm 23:1', 'The LORD is my shepherd; I shall not want.', 'Let the Good Shepherd guide your steps today. He provides everything you need.');