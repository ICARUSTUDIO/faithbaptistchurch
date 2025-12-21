import { ChevronLeft } from 'lucide-react';
import { getBook } from '@/lib/bibleData';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChapterSelectorProps {
  bookId: string;
  onSelectChapter: (chapter: number) => void;
  onClose: () => void;
}

export const ChapterSelector = ({ bookId, onSelectChapter, onClose }: ChapterSelectorProps) => {
  const book = getBook(bookId);
  
  if (!book) return null;
  
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);
  
  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="flex items-center gap-3 p-4">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">{book.name}</h1>
            <p className="text-sm text-muted-foreground">Select a chapter</p>
          </div>
        </div>
      </div>
      
      {/* Chapter Grid */}
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="p-4 grid grid-cols-5 gap-2">
          {chapters.map((chapter) => (
            <button
              key={chapter}
              onClick={() => onSelectChapter(chapter)}
              className="aspect-square flex items-center justify-center bg-card hover:bg-primary hover:text-primary-foreground rounded-lg border border-border transition-colors text-lg font-medium"
            >
              {chapter}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
