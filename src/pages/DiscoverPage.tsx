import { useState, useEffect } from 'react';
import { Plus, Sunrise, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { StoryCard } from '@/components/stories/StoryCard';
import { DailyMannaCard } from '@/components/stories/DailyMannaCard';
import { sampleStories, getTodaysManna } from '@/lib/storiesData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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

const DiscoverPage = () => {
  const { isPastor } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [manna, setManna] = useState<DailyManna | null>(null);
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
  
  return (
    <AppLayout>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Discover</h1>
            <p className="text-sm text-muted-foreground">Daily inspiration & church stories</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchContent}>
              <RefreshCw className="w-5 h-5" />
            </Button>
            {isPastor && (
              <Button size="sm" onClick={() => navigate('/pastor/upload')}>
                <Plus className="w-4 h-4 mr-1" />
                Create
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-4 space-y-6">
          {/* Pastor Quick Actions */}
          {isPastor && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/pastor/upload')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Story
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/pastor/daily-manna')}
              >
                <Sunrise className="w-4 h-4 mr-2" />
                Daily Manna
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
              <DailyMannaCard manna={displayManna} />
              
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
