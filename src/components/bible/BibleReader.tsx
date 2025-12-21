import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getChapter, getBook, bibleBooks } from '@/lib/bibleData';
import { useApp } from '@/contexts/AppContext';
import { BookSelector } from './BookSelector';
import { ChapterSelector } from './ChapterSelector';
import { VerseDisplay } from './VerseDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';

export const BibleReader = () => {
  const { currentBook, currentChapter, setCurrentBook, setCurrentChapter } = useApp();
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  
  const book = getBook(currentBook);
  const chapter = getChapter(currentBook, currentChapter);
  
  const handleBookSelect = (bookId: string) => {
    setCurrentBook(bookId);
    setShowBookSelector(false);
    setShowChapterSelector(true);
  };
  
  const handleChapterSelect = (chapterNum: number) => {
    setCurrentChapter(chapterNum);
    setShowChapterSelector(false);
  };
  
  const goToPrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else {
      // Go to previous book's last chapter
      const currentIndex = bibleBooks.findIndex(b => b.id === currentBook);
      if (currentIndex > 0) {
        const prevBook = bibleBooks[currentIndex - 1];
        setCurrentBook(prevBook.id);
        setCurrentChapter(prevBook.chapters);
      }
    }
  };
  
  const goToNextChapter = () => {
    if (book && currentChapter < book.chapters) {
      setCurrentChapter(currentChapter + 1);
    } else {
      // Go to next book's first chapter
      const currentIndex = bibleBooks.findIndex(b => b.id === currentBook);
      if (currentIndex < bibleBooks.length - 1) {
        const nextBook = bibleBooks[currentIndex + 1];
        setCurrentBook(nextBook.id);
        setCurrentChapter(1);
      }
    }
  };
  
  if (showBookSelector) {
    return (
      <BookSelector
        onSelectBook={handleBookSelect}
        onClose={() => setShowBookSelector(false)}
      />
    );
  }
  
  if (showChapterSelector) {
    return (
      <ChapterSelector
        bookId={currentBook}
        onSelectChapter={handleChapterSelect}
        onClose={() => setShowChapterSelector(false)}
      />
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setShowBookSelector(true)}
            className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <span className="font-semibold">{book?.name}</span>
            <span className="text-muted-foreground">{currentChapter}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      {/* Content */}
      <ScrollArea className="h-[calc(100vh-140px)]">
        {/* Chapter Title */}
        <div className="text-center py-8 border-b border-border">
          <h1 className="text-3xl font-serif font-bold text-primary">{book?.name}</h1>
          <p className="text-lg text-muted-foreground mt-1">Chapter {currentChapter}</p>
        </div>
        
        {/* Verses */}
        {chapter && (
          <VerseDisplay
            verses={chapter.verses}
            bookId={currentBook}
            bookName={book?.name || ''}
            chapter={currentChapter}
          />
        )}
        
        {/* Chapter Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <button
            onClick={goToPrevChapter}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <button
            onClick={() => setShowChapterSelector(true)}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Chapters
          </button>
          
          <button
            onClick={goToNextChapter}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </ScrollArea>
    </div>
  );
};
