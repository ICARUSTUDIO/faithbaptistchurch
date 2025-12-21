import { useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { bibleBooks, BibleBook } from '@/lib/bibleData';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BookSelectorProps {
  onSelectBook: (bookId: string) => void;
  onClose: () => void;
}

export const BookSelector = ({ onSelectBook, onClose }: BookSelectorProps) => {
  const [search, setSearch] = useState('');
  const [activeTestament, setActiveTestament] = useState<'old' | 'new'>('old');
  
  const filteredBooks = bibleBooks.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(search.toLowerCase());
    const matchesTestament = search ? true : book.testament === activeTestament;
    return matchesSearch && matchesTestament;
  });
  
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
          <h1 className="text-xl font-semibold">Select Book</h1>
        </div>
        
        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Testament Tabs */}
        {!search && (
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTestament('old')}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors relative",
                activeTestament === 'old' 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Old Testament
              {activeTestament === 'old' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTestament('new')}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors relative",
                activeTestament === 'new' 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              New Testament
              {activeTestament === 'new' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Book List */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 grid grid-cols-2 gap-2">
          {filteredBooks.map((book) => (
            <button
              key={book.id}
              onClick={() => onSelectBook(book.id)}
              className="p-3 text-left bg-card hover:bg-muted rounded-lg border border-border transition-colors"
            >
              <span className="font-medium text-sm">{book.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {book.chapters} ch
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
