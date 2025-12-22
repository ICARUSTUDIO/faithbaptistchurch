import { useState, useEffect } from 'react';
import { X, BookOpen, Sparkles, Share2, Copy, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DailyVerse {
  id: string;
  date: string;
  verse_reference: string;
  verse_text: string;
  wisdom_message: string | null;
}

interface DailyVerseNotificationProps {
  onClose: () => void;
}

export const DailyVerseNotification = ({ onClose }: DailyVerseNotificationProps) => {
  const [verse, setVerse] = useState<DailyVerse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodaysVerse();
  }, []);

  const fetchTodaysVerse = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('daily_verses')
        .select('*')
        .eq('date', today)
        .single();

      if (!error && data) {
        setVerse(data);
      }
    } catch (error) {
      console.error('Error fetching daily verse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyVerse = () => {
    if (!verse) return;
    const text = `"${verse.verse_text}" - ${verse.verse_reference}`;
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Verse copied to clipboard.' });
  };

  const shareVerse = async () => {
    if (!verse) return;
    const text = `"${verse.verse_text}" - ${verse.verse_reference}\n\n${verse.wisdom_message || ''}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Daily Verse', text });
      } catch (error) {
        copyVerse();
      }
    } else {
      copyVerse();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-muted rounded w-1/2 mb-4" />
            <div className="h-20 bg-muted rounded mb-4" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!verse) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Verse of the Day</h3>
                <p className="text-xs text-muted-foreground">{format(new Date(), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Verse Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-serif text-lg leading-relaxed italic">
                  "{verse.verse_text}"
                </p>
                <p className="text-primary font-medium mt-2">
                  — {verse.verse_reference}
                </p>
              </div>
            </div>

            {verse.wisdom_message && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{verse.wisdom_message}</span>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={copyVerse}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={shareVerse}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <Button className="w-full" onClick={onClose}>
              Start Your Day
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
