import { AppLayout } from '@/components/layout/AppLayout';
import { StoryCard } from '@/components/stories/StoryCard';
import { DailyMannaCard } from '@/components/stories/DailyMannaCard';
import { sampleStories, getTodaysManna } from '@/lib/storiesData';
import { ScrollArea } from '@/components/ui/scroll-area';

const DiscoverPage = () => {
  const todaysManna = getTodaysManna();
  
  return (
    <AppLayout>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-2xl font-bold">Discover</h1>
        <p className="text-sm text-muted-foreground">Daily inspiration & church stories</p>
      </header>
      
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-4 space-y-6">
          <DailyMannaCard manna={todaysManna} />
          
          <div>
            <h2 className="text-lg font-semibold mb-3">Church Stories</h2>
            <div className="space-y-4">
              {sampleStories.map(story => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </AppLayout>
  );
};

export default DiscoverPage;
