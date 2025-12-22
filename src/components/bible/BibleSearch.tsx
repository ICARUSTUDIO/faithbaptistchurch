import { useState, useMemo } from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { bibleBooks } from '@/lib/bibleData';

interface SearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleSearchProps {
  onSelectVerse: (bookId: string, chapter: number, verse: number) => void;
}

export const BibleSearch = ({ onSelectVerse }: BibleSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (query.trim().length < 3) return [];

    const results: SearchResult[] = [];
    const searchLower = query.toLowerCase();

    for (const book of bibleBooks) {
      for (const chapter of book.chapters) {
        for (const verse of chapter.verses) {
          if (verse.text.toLowerCase().includes(searchLower)) {
            results.push({
              bookId: book.id,
              bookName: book.name,
              chapter: chapter.number,
              verse: verse.number,
              text: verse.text,
            });
          }
        }
      }
      // Limit results to prevent performance issues
      if (results.length >= 50) break;
    }

    return results;
  }, [query]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-primary/20 text-primary font-medium px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const handleSelectResult = (result: SearchResult) => {
    onSelectVerse(result.bookId, result.chapter, result.verse);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Bible
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for words or phrases..."
            className="pl-10 pr-10"
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              onClick={() => setQuery('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 -mx-6 px-6">
          {query.length < 3 ? (
            <p className="text-center text-muted-foreground py-8">
              Enter at least 3 characters to search
            </p>
          ) : searchResults.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No results found for "{query}"
            </p>
          ) : (
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">
                {searchResults.length >= 50 ? '50+' : searchResults.length} results
              </p>
              {searchResults.map((result, index) => (
                <button
                  key={`${result.bookId}-${result.chapter}-${result.verse}-${index}`}
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm text-primary">
                      {result.bookName} {result.chapter}:{result.verse}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                    {highlightText(result.text, query)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
