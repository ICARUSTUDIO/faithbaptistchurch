import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Sunrise, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const mannaSchema = z.object({
  date: z.date({ required_error: 'Please select a date' }),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  verseReference: z.string().min(3, 'Please enter a Bible reference'),
  verseText: z.string().min(10, 'Please enter the verse text'),
  reflection: z.string().min(20, 'Reflection must be at least 20 characters').max(3000),
  prayer: z.string().max(1000).optional(),
});

type MannaFormData = z.infer<typeof mannaSchema>;

const DailyMannaUploadPage = () => {
  const { user, isPastor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MannaFormData>({
    resolver: zodResolver(mannaSchema),
    defaultValues: {
      date: new Date(),
      title: '',
      verseReference: '',
      verseText: '',
      reflection: '',
      prayer: '',
    },
  });

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <Sunrise className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground text-center mb-4">
            You need to sign in to create Daily Manna.
          </p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </AppLayout>
    );
  }

  if (!isPastor) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <Sunrise className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Pastor Access Required</h2>
          <p className="text-muted-foreground text-center mb-4">
            Only pastors and admins can create Daily Manna.
          </p>
          <Button variant="outline" onClick={() => navigate('/discover')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Discover
          </Button>
        </div>
      </AppLayout>
    );
  }

  const onSubmit = async (data: MannaFormData) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('daily_manna').insert({
        author_id: user.id,
        date: format(data.date, 'yyyy-MM-dd'),
        title: data.title,
        verse_reference: data.verseReference,
        verse_text: data.verseText,
        reflection: data.reflection,
        prayer: data.prayer || null,
      });

      if (error) {
        if (error.code === '23505') {
          throw new Error('A Daily Manna already exists for this date.');
        }
        throw error;
      }

      toast({
        title: 'Daily Manna Published!',
        description: `Devotional for ${format(data.date, 'MMMM d, yyyy')} is now available.`,
      });

      navigate('/discover');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Failed to Publish',
        description: error instanceof Error ? error.message : 'An error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/discover')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Daily Manna</h1>
            <p className="text-muted-foreground">Prepare today's devotional</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Walking in Faith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Verse Reference */}
            <FormField
              control={form.control}
              name="verseReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bible Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Hebrews 11:1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Verse Text */}
            <FormField
              control={form.control}
              name="verseText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verse Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the scripture text..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reflection */}
            <FormField
              control={form.control}
              name="reflection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reflection</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your devotional reflection..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prayer */}
            <FormField
              control={form.control}
              name="prayer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prayer (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A prayer for the congregation..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sunrise className="w-4 h-4 mr-2" />
                  Publish Daily Manna
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
};

export default DailyMannaUploadPage;
