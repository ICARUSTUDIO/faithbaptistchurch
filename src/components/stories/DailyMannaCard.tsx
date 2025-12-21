import { BookOpen, Share2 } from 'lucide-react';
import { DailyManna } from '@/lib/storiesData';
import { Button } from '@/components/ui/button';

interface DailyMannaCardProps {
  manna: DailyManna;
}

export const DailyMannaCard = ({ manna }: DailyMannaCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl p-6 border border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{formatDate(manna.date)}</p>
          <h2 className="text-xl font-bold text-primary">{manna.title}</h2>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      {/* Verse */}
      <div className="bg-card/80 backdrop-blur rounded-xl p-4 mb-4 border border-border">
        <p className="font-serif text-lg italic leading-relaxed">"{manna.verse}"</p>
        <p className="text-sm text-primary font-medium mt-2">{manna.verseReference}</p>
      </div>
      
      {/* Reflection */}
      <div className="mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
          Today's Reflection
        </h3>
        <p className="text-foreground/90 leading-relaxed">{manna.reflection}</p>
      </div>
      
      {/* Prayer */}
      <div className="bg-muted/50 rounded-xl p-4 mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
          Prayer
        </h3>
        <p className="text-foreground/90 italic leading-relaxed">{manna.prayer}</p>
      </div>
      
      {/* Author & Share */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">By {manna.author}</p>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  );
};
