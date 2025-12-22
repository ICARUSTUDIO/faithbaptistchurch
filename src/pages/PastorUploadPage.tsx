import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, ArrowLeft, Image, Video, Quote, BookOpen, Heart, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';

const storySchema = z.object({
  type: z.enum(['verse', 'quote', 'video', 'image', 'devotional']),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000),
  verseReference: z.string().optional(),
  mediaUrl: z.string().url().optional().or(z.literal('')),
});

type StoryFormData = z.infer<typeof storySchema>;

const contentTypes = [
  { value: 'verse', label: 'Bible Verse', icon: BookOpen, description: 'Share a verse with your reflection' },
  { value: 'quote', label: 'Quote', icon: Quote, description: 'Share an inspirational quote' },
  { value: 'devotional', label: 'Devotional', icon: Heart, description: 'Share a devotional message' },
  { value: 'image', label: 'Image Post', icon: Image, description: 'Share an image with caption' },
  { value: 'video', label: 'Video', icon: Video, description: 'Share a video message' },
];

const PastorUploadPage = () => {
  const { user, profile, isPastor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      type: 'verse',
      title: '',
      content: '',
      verseReference: '',
      mediaUrl: '',
    },
  });

  const selectedType = form.watch('type');

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <Upload className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground text-center mb-4">
            You need to sign in to upload content.
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
          <Upload className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Pastor Access Required</h2>
          <p className="text-muted-foreground text-center mb-4">
            Only pastors and admins can upload content. Contact your church administrator.
          </p>
          <Button variant="outline" onClick={() => navigate('/discover')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Discover
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleFileUpload = async (file: File) => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error('Failed to upload file: ' + error.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const onSubmit = async (data: StoryFormData) => {
    if (!user || !profile) return;

    setIsSubmitting(true);

    try {
      let mediaUrl = data.mediaUrl || null;

      // Upload file if selected
      if (uploadedFile) {
        setUploadProgress(30);
        mediaUrl = await handleFileUpload(uploadedFile);
        setUploadProgress(70);
      }

      const { error } = await supabase.from('stories').insert({
        author_id: user.id,
        author_name: profile.full_name || profile.email || 'Pastor',
        type: data.type,
        title: data.title,
        content: data.content,
        verse_reference: data.verseReference || null,
        media_url: mediaUrl,
      });

      if (error) throw error;

      setUploadProgress(100);
      toast({
        title: 'Content Published!',
        description: 'Your content has been shared with the congregation.',
      });

      navigate('/discover');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to publish content.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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
            <h1 className="text-2xl font-bold">Create Content</h1>
            <p className="text-muted-foreground">Share with your congregation</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Content Type Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => form.setValue('type', type.value as any)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="font-medium text-sm">{type.label}</p>
                  </button>
                );
              })}
            </div>

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Verse Reference (for verse type) */}
            {(selectedType === 'verse' || selectedType === 'devotional') && (
              <FormField
                control={form.control}
                name="verseReference"
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
            )}

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        selectedType === 'verse'
                          ? 'Enter the verse text and your reflection...'
                          : selectedType === 'quote'
                          ? 'Enter the quote and its meaning...'
                          : 'Write your message...'
                      }
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Media Upload (for image/video types) */}
            {(selectedType === 'image' || selectedType === 'video') && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="mediaUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-center text-sm text-muted-foreground">or</div>

                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                  {uploadedFile ? (
                    <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                      <span className="text-sm truncate">{uploadedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setUploadedFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept={selectedType === 'video' ? 'video/*' : 'image/*'}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadedFile(file);
                        }}
                      />
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload {selectedType === 'video' ? 'a video' : 'an image'}
                      </p>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Publish Content
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
};

export default PastorUploadPage;
