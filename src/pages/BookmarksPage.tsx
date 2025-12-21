import { Bookmark, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const BookmarksPage = () => {
  const { bookmarks, removeBookmark } = useApp();
  
  return (
    <AppLayout>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-2xl font-bold">Saved Verses</h1>
        <p className="text-sm text-muted-foreground">{bookmarks.length} bookmarks</p>
      </header>
      
      <ScrollArea className="h-[calc(100vh-140px)]">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Bookmark className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved verses yet</h2>
            <p className="text-muted-foreground">Tap on any verse while reading to save it here</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {bookmarks.map(bookmark => (
              <div key={bookmark.id} className="bg-card border border-border rounded-xl p-4">
                <p className="font-serif text-lg leading-relaxed mb-2">"{bookmark.text}"</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-primary font-medium">
                    {bookmark.bookName} {bookmark.chapter}:{bookmark.verse}
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => removeBookmark(bookmark.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </AppLayout>
  );
};

export default BookmarksPage;
