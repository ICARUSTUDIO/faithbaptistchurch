import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Calendar, Sparkles, Loader2, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';

const verseSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  verse_reference: z.string().min(3, 'Bible reference is required'),
  verse_text: z.string().min(10, 'Verse text is required'),
  wisdom_message: z.string().optional(),
});

type VerseFormData = z.infer<typeof verseSchema>;

interface DailyVerse {
  id: string;
  date: string;
  verse_reference: string;
  verse_text: string;
  wisdom_message: string | null;
}

const PastorDailyVersePage = () => {
  const { user, isPastor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verses, setVerses] = useState<DailyVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<VerseFormData>({
    resolver: zodResolver(verseSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      verse_reference: '',
      verse_text: '',
      wisdom_message: '',
    },
  });

  useEffect(() => {
    if (!user || !isPastor) {
      navigate('/pastor/login');
      return;
    }
    fetchVerses();
  }, [user, isPastor, navigate]);

  const fetchVerses = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_verses')
        .select('*')
        .gte('date', format(new Date(), 'yyyy-MM-dd'))
        .order('date')
        .limit(14);

      if (!error) {
        setVerses(data || []);
      }
    } catch (error) {
      console.error('Error fetching verses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: VerseFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('daily_verses').upsert({
        date: data.date,
        verse_reference: data.verse_reference,
        verse_text: data.verse_text,
        wisdom_message: data.wisdom_message || null,
      }, { onConflict: 'date' });

      if (error) throw error;

      toast({
        title: 'Daily Verse Saved!',
        description: `Verse for ${format(new Date(data.date), 'MMMM d, yyyy')} has been scheduled.`,
      });

      form.reset({
        date: format(addDays(new Date(data.date), 1), 'yyyy-MM-dd'),
        verse_reference: '',
        verse_text: '',
        wisdom_message: '',
      });
      
      fetchVerses();
    } catch (error) {
      console.error('Error saving verse:', error);
      toast({
        title: 'Error',
        description: 'Failed to save daily verse.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteVerse = async (id: string) => {
    try {
      const { error } = await supabase.from('daily_verses').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Deleted', description: 'Daily verse has been removed.' });
      fetchVerses();
    } catch (error) {
      console.error('Error deleting verse:', error);
    }
  };

  if (!isPastor) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/pastor/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Daily Verses</h1>
            <p className="text-sm text-muted-foreground">Schedule verses for notifications</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Add Daily Verse
            </CardTitle>
            <CardDescription>
              Schedule a verse of the day with an encouraging message
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verse_reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bible Reference</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John 3:16" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verse_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verse Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the verse text..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wisdom_message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Words of Wisdom (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add an encouraging reflection or application..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Verse
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Upcoming Verses */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Verses</CardTitle>
            <CardDescription>Scheduled verses for the next 2 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : verses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No verses scheduled yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {verses.map((verse) => (
                  <div
                    key={verse.id}
                    className="flex items-start justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{verse.verse_reference}</p>
                        <p className="text-xs text-muted-foreground mb-1">
                          {format(new Date(verse.date), 'MMMM d, yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {verse.verse_text}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteVerse(verse.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PastorDailyVersePage;
