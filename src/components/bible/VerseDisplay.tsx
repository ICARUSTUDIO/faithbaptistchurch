import { useState } from 'react';
import { Bookmark, Share2, Copy, Check } from 'lucide-react';
import { Verse } from '@/lib/bibleData';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VerseDisplayProps {
  verses: Verse[];
  bookId: string;
  bookName: string;
  chapter: number;
}

export const VerseDisplay = ({ verses, bookId, bookName, chapter }: VerseDisplayProps) => {
  const { addBookmark, removeBookmark, isBookmarked, fontSize } = useApp();
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const { toast } = useToast();
  
  const fontSizeClass = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
  }[fontSize];
  
  const handleVerseClick = (verseNum: number) => {
    setSelectedVerse(selectedVerse === verseNum ? null : verseNum);
  };
  
  const handleBookmark = (verse: Verse) => {
    const bookmarked = isBookmarked(bookId, chapter, verse.number);
    if (bookmarked) {
      // Find and remove the bookmark
      // For now, just show a toast
      toast({
        title: "Bookmark removed",
        description: `${bookName} ${chapter}:${verse.number}`,
      });
    } else {
      addBookmark({
        bookId,
        bookName,
        chapter,
        verse: verse.number,
        text: verse.text,
      });
      toast({
        title: "Verse bookmarked",
        description: `${bookName} ${chapter}:${verse.number}`,
      });
    }
    setSelectedVerse(null);
  };
  
  const handleCopy = async (verse: Verse) => {
    const text = `${verse.text}\n- ${bookName} ${chapter}:${verse.number}`;
    await navigator.clipboard.writeText(text);
    setCopiedVerse(verse.number);
    toast({
      title: "Copied to clipboard",
      description: `${bookName} ${chapter}:${verse.number}`,
    });
    setTimeout(() => setCopiedVerse(null), 2000);
    setSelectedVerse(null);
  };
  
  const handleShare = async (verse: Verse) => {
    const text = `${verse.text}\n- ${bookName} ${chapter}:${verse.number}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Ready to share!",
      });
    }
    setSelectedVerse(null);
  };
  
  return (
    <div className="px-4 py-6 space-y-1">
      {verses.map((verse) => {
        const isSelected = selectedVerse === verse.number;
        const bookmarked = isBookmarked(bookId, chapter, verse.number);
        
        return (
          <div key={verse.number} className="relative">
            <p
              onClick={() => handleVerseClick(verse.number)}
              className={cn(
                "scripture-text cursor-pointer py-1 px-1 -mx-1 rounded transition-colors",
                fontSizeClass,
                isSelected && "bg-muted",
                bookmarked && "bg-highlight-yellow/30"
              )}
            >
              <span className="verse-number">{verse.number}</span>
              {verse.text}
            </p>
            
            {/* Action bar */}
            {isSelected && (
              <div className="flex items-center gap-2 py-2 animate-fade-in">
                <button
                  onClick={() => handleBookmark(verse)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors",
                    bookmarked 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
                  {bookmarked ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => handleCopy(verse)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  {copiedVerse === verse.number ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  Copy
                </button>
                <button
                  onClick={() => handleShare(verse)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
