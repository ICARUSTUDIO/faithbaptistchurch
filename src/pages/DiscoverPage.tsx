import { useState, useEffect } from 'react';
import { Plus, Sunrise, RefreshCw, Bell, Calendar, ChevronRight, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { StoryCard } from '@/components/stories/StoryCard';
import { DailyMannaCard } from '@/components/stories/DailyMannaCard';
import { sampleStories, getTodaysManna } from '@/lib/storiesData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Story {
  id: string;
  author_name: string;
  type: 'verse' | 'quote' | 'video' | 'image' | 'devotional';
  title: string | null;
  content: string;
  media_url: string | null;
  verse_reference: string | null;
  likes_count: number;
  created_at: string;
}

interface DailyManna {
  id: string;
  date: string;
  title: string;
  verse_reference: string;
  verse_text: string;
  reflection: string;
  prayer: string | null;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  announcement_type: string;
  event_date: string | null;
  is_pinned: boolean;
  created_at: string;
}

const DiscoverPage = () => {
  const { isPastor } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [manna, setManna] = useState<DailyManna | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchContent = async () => {
    setIsLoading(true);
    
    try {
      // Fetch today's manna
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: mannaData } = await supabase
        .from('daily_manna')
        .select('*')
        .eq('date', today)
        .single();
      
      if (mannaData) {
        setManna(mannaData as DailyManna);
      }
      
      // Fetch recent stories
      const { data: storiesData } = await supabase
        .from('stories')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (storiesData) {
        setStories(storiesData as Story[]);
      }

      // Fetch active announcements
      const { data: announcementsData } = await supabase
        .from('church_announcements')
        .select('*')
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5);

      if (announcementsData) {
        setAnnouncements(announcementsData as Announcement[]);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchContent();
  }, []);
  
  // Use sample data if no database content
  const displayManna = manna ? {
    id: manna.id,
    date: manna.date,
    title: manna.title,
    verse: manna.verse_text,
    verseReference: manna.verse_reference,
    reflection: manna.reflection,
    prayer: manna.prayer || '',
    author: 'Pastor',
  } : getTodaysManna();
  
  const displayStories = stories.length > 0 
    ? stories.map(s => ({
        id: s.id,
        type: s.type as 'verse' | 'quote' | 'video' | 'image',
        title: s.title || '',
        content: s.content,
        author: s.author_name,
        authorRole: 'Pastor',
        verseReference: s.verse_reference || undefined,
        mediaUrl: s.media_url || undefined,
        createdAt: new Date(s.created_at),
        likes: s.likes_count,
      }))
    : sampleStories;

  const getAnnouncementBadge = (type: string) => {
    switch (type) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'event': return <Badge variant="secondary">Event</Badge>;
      case 'prayer': return <Badge className="bg-purple-500/10 text-purple-600">Prayer</Badge>;
      default: return null;
    }
  };
  
  return (
    <AppLayout>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Faith Baptist Church</h1>
            <p className="text-sm text-muted-foreground">Daily inspiration & church updates</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchContent}>
              <RefreshCw className="w-5 h-5" />
            </Button>
            {isPastor && (
              <Button size="sm" onClick={() => navigate('/pastor/dashboard')}>
                <Plus className="w-4 h-4 mr-1" />
                Manage
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-4 space-y-6">
          {/* Pastor Quick Actions */}
          {isPastor && (
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                className="flex-col h-auto py-3"
                onClick={() => navigate('/pastor/upload')}
              >
                <Plus className="w-4 h-4 mb-1" />
                <span className="text-xs">Story</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex-col h-auto py-3"
                onClick={() => navigate('/pastor/daily-manna')}
              >
                <Sunrise className="w-4 h-4 mb-1" />
                <span className="text-xs">Manna</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex-col h-auto py-3"
                onClick={() => navigate('/pastor/announcements')}
              >
                <Megaphone className="w-4 h-4 mb-1" />
                <span className="text-xs">Announce</span>
              </Button>
            </div>
          )}
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ) : (
            <>
              {/* Church Announcements */}
              {announcements.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-primary" />
                    Church Announcements
                  </h2>
                  <div className="space-y-3">
                    {announcements.map(announcement => (
                      <Card key={announcement.id} className={announcement.is_pinned ? 'border-primary/50 bg-primary/5' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {announcement.is_pinned && <Bell className="w-4 h-4 text-primary" />}
                              <h3 className="font-semibold">{announcement.title}</h3>
                            </div>
                            {getAnnouncementBadge(announcement.announcement_type)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                          {announcement.event_date && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(announcement.event_date), 'MMMM d, yyyy')}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Daily Manna */}
              <DailyMannaCard manna={displayManna} />
              
              {/* Church Stories */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Church Stories</h2>
                {displayStories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No stories yet.</p>
                    {isPastor && (
                      <Button 
                        variant="link" 
                        onClick={() => navigate('/pastor/upload')}
                        className="mt-2"
                      >
                        Create the first story
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayStories.map(story => (
                      <StoryCard key={story.id} story={story} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </AppLayout>
  );
};

export default DiscoverPage;
