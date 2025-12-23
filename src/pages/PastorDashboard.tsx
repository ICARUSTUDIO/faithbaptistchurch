import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Upload, Calendar, Bell, Users, 
  FileText, Heart, Video, Quote, Image, 
  ArrowRight, Plus, BarChart3, LogOut,
  Sparkles, ChevronRight, Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface DashboardStats {
  totalStories: number;
  totalDailyManna: number;
  totalLikes: number;
  activePlans: number;
}

const PastorDashboard = () => {
  const { user, profile, isPastor, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    totalDailyManna: 0,
    totalLikes: 0,
    activePlans: 0,
  });
  const [recentStories, setRecentStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/pastor/login');
      return;
    }
    if (!isPastor) {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user, isPastor, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch stories count
      const { count: storiesCount } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id);

      // Fetch daily manna count
      const { count: mannaCount } = await supabase
        .from('daily_manna')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id);

      // Fetch total likes on user's stories
      const { data: likesData } = await supabase
        .from('stories')
        .select('likes_count')
        .eq('author_id', user.id);
      const totalLikes = likesData?.reduce((sum, s) => sum + (s.likes_count || 0), 0) || 0;

      // Fetch active reading plans
      const { count: plansCount } = await supabase
        .from('reading_plans')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch recent stories
      const { data: stories } = await supabase
        .from('stories')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalStories: storiesCount || 0,
        totalDailyManna: mannaCount || 0,
        totalLikes,
        activePlans: plansCount || 0,
      });
      setRecentStories(stories || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const quickActions = [
    { icon: Upload, label: 'New Story', path: '/pastor/upload', color: 'bg-blue-500/10 text-blue-500' },
    { icon: Calendar, label: 'Daily Manna', path: '/pastor/daily-manna', color: 'bg-amber-500/10 text-amber-500' },
    { icon: Megaphone, label: 'Announcement', path: '/pastor/announcements', color: 'bg-rose-500/10 text-rose-500' },
    { icon: BookOpen, label: 'Reading Plan', path: '/pastor/reading-plans', color: 'bg-green-500/10 text-green-500' },
    { icon: Sparkles, label: 'Daily Verse', path: '/pastor/daily-verse', color: 'bg-purple-500/10 text-purple-500' },
  ];

  const contentTypes = [
    { icon: BookOpen, label: 'Bible Verses', description: 'Share verses with reflections' },
    { icon: Quote, label: 'Quotes', description: 'Inspirational quotes and sayings' },
    { icon: Heart, label: 'Devotionals', description: 'Daily devotional messages' },
    { icon: Image, label: 'Images', description: 'Visual content with captions' },
    { icon: Video, label: 'Videos', description: 'Video messages and teachings' },
  ];

  if (!isPastor) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Pastor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {profile?.full_name || 'Pastor'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <BookOpen className="w-4 h-4 mr-2" />
              View App
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalStories}</p>
                  <p className="text-xs text-muted-foreground">Stories</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalDailyManna}</p>
                  <p className="text-xs text-muted-foreground">Daily Manna</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalLikes}</p>
                  <p className="text-xs text-muted-foreground">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activePlans}</p>
                  <p className="text-xs text-muted-foreground">Reading Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.path}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate(action.path)}
              >
                <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Content
            </CardTitle>
            <CardDescription>Choose what type of content you want to share</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {contentTypes.map((type) => (
              <button
                key={type.label}
                onClick={() => navigate('/pastor/upload')}
                className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left flex items-center gap-3"
              >
                <type.icon className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{type.label}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Your latest published content</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pastor/upload')}>
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentStories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No content published yet</p>
                <Button className="mt-4" onClick={() => navigate('/pastor/upload')}>
                  Create Your First Story
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentStories.map((story) => (
                  <div
                    key={story.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        {story.type === 'verse' && <BookOpen className="w-5 h-5 text-primary" />}
                        {story.type === 'quote' && <Quote className="w-5 h-5 text-primary" />}
                        {story.type === 'video' && <Video className="w-5 h-5 text-primary" />}
                        {story.type === 'image' && <Image className="w-5 h-5 text-primary" />}
                        {story.type === 'devotional' && <Heart className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{story.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(story.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={story.is_published ? 'default' : 'secondary'}>
                        {story.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {story.likes_count}
                      </span>
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

export default PastorDashboard;
