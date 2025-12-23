import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Megaphone, Calendar, Loader2, Trash2, Bell, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const announcementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters').max(2000),
  announcement_type: z.enum(['general', 'event', 'prayer', 'urgent']),
  event_date: z.string().optional(),
  is_pinned: z.boolean(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface Announcement {
  id: string;
  title: string;
  content: string;
  announcement_type: string;
  event_date: string | null;
  is_pinned: boolean;
  is_active: boolean;
  created_at: string;
}

const PastorAnnouncementsPage = () => {
  const { user, isPastor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      announcement_type: 'general',
      event_date: '',
      is_pinned: false,
    },
  });

  useEffect(() => {
    if (!user || !isPastor) {
      navigate('/pastor/login');
      return;
    }
    fetchAnnouncements();
  }, [user, isPastor, navigate]);

  const fetchAnnouncements = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('church_announcements')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error) {
        setAnnouncements(data || []);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AnnouncementFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('church_announcements').insert({
        author_id: user.id,
        title: data.title,
        content: data.content,
        announcement_type: data.announcement_type,
        event_date: data.event_date || null,
        is_pinned: data.is_pinned,
      });

      if (error) throw error;

      toast({
        title: 'Announcement Posted!',
        description: 'Your announcement is now visible to the congregation.',
      });

      form.reset();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error posting announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to post announcement.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase.from('church_announcements').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Deleted', description: 'Announcement has been removed.' });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('church_announcements')
        .update({ is_active: !isActive })
        .eq('id', id);
      
      if (error) throw error;
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
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
            <h1 className="text-xl font-bold">Church Announcements</h1>
            <p className="text-sm text-muted-foreground">Post updates for the congregation</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              New Announcement
            </CardTitle>
            <CardDescription>
              Share important updates with your congregation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Announcement title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="announcement_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="prayer">Prayer Request</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('announcement_type') === 'event' && (
                  <FormField
                    control={form.control}
                    name="event_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your announcement..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_pinned"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel>Pin Announcement</FormLabel>
                        <p className="text-xs text-muted-foreground">Pinned announcements appear at the top</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Megaphone className="w-4 h-4 mr-2" />
                  Post Announcement
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Existing Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Your Announcements</CardTitle>
            <CardDescription>Manage your posted announcements</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No announcements yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`flex items-start justify-between p-4 rounded-lg ${
                      announcement.is_active ? 'bg-muted/50' : 'bg-muted/20 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {announcement.is_pinned ? (
                          <Pin className="w-5 h-5 text-primary" />
                        ) : (
                          <Megaphone className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{announcement.title}</p>
                          {announcement.announcement_type === 'urgent' && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                          {announcement.announcement_type === 'event' && (
                            <Badge variant="secondary" className="text-xs">Event</Badge>
                          )}
                          {!announcement.is_active && (
                            <Badge variant="outline" className="text-xs">Hidden</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {announcement.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(announcement.id, announcement.is_active)}
                      >
                        {announcement.is_active ? 'Hide' : 'Show'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default PastorAnnouncementsPage;
