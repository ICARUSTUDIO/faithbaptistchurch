-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'pastor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger for new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  book_name TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  verse_text TEXT NOT NULL,
  highlight_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks" 
ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Create stories table for pastor content
CREATE TABLE public.stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('verse', 'quote', 'video', 'image', 'devotional')),
  title TEXT,
  content TEXT NOT NULL,
  media_url TEXT,
  verse_reference TEXT,
  likes_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published stories are viewable by everyone" 
ON public.stories FOR SELECT USING (is_published = true);

CREATE POLICY "Pastors can view all their stories" 
ON public.stories FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Pastors can create stories" 
ON public.stories FOR INSERT WITH CHECK (
  auth.uid() = author_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('pastor', 'admin'))
);

CREATE POLICY "Pastors can update their own stories" 
ON public.stories FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Pastors can delete their own stories" 
ON public.stories FOR DELETE USING (auth.uid() = author_id);

-- Create daily_manna table
CREATE TABLE public.daily_manna (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  date DATE NOT NULL UNIQUE,
  title TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  reflection TEXT NOT NULL,
  prayer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_manna ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Daily manna is viewable by everyone" 
ON public.daily_manna FOR SELECT USING (true);

CREATE POLICY "Pastors can create daily manna" 
ON public.daily_manna FOR INSERT WITH CHECK (
  auth.uid() = author_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('pastor', 'admin'))
);

CREATE POLICY "Pastors can update their daily manna" 
ON public.daily_manna FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Pastors can delete their daily manna" 
ON public.daily_manna FOR DELETE USING (auth.uid() = author_id);

-- Create story_likes table
CREATE TABLE public.story_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, user_id)
);

ALTER TABLE public.story_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all likes" 
ON public.story_likes FOR SELECT USING (true);

CREATE POLICY "Users can like stories" 
ON public.story_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike stories" 
ON public.story_likes FOR DELETE USING (auth.uid() = user_id);

-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes" 
ON public.notes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
ON public.notes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Storage policies for media
CREATE POLICY "Media is publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Pastors can upload media" 
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'media' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('pastor', 'admin'))
);

CREATE POLICY "Pastors can update their media" 
ON storage.objects FOR UPDATE USING (
  bucket_id = 'media' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('pastor', 'admin'))
);

CREATE POLICY "Pastors can delete their media" 
ON storage.objects FOR DELETE USING (
  bucket_id = 'media' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('pastor', 'admin'))
);