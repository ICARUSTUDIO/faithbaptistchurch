import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, BookOpen, Plus, Loader2, Trash2, Calendar, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const planSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  duration_days: z.number().min(1, 'Duration must be at least 1 day').max(365),
});

type PlanFormData = z.infer<typeof planSchema>;

interface ReadingPlan {
  id: string;
  name: string;
  description: string | null;
  duration_days: number;
  is_active: boolean;
  created_at: string;
}

const PastorReadingPlansPage = () => {
  const { user, isPastor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      description: '',
      duration_days: 21,
    },
  });

  useEffect(() => {
    if (!user || !isPastor) {
      navigate('/pastor/login');
      return;
    }
    fetchPlans();
  }, [user, isPastor, navigate]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setPlans(data || []);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PlanFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reading_plans').insert({
        name: data.name,
        description: data.description || null,
        duration_days: data.duration_days,
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: 'Reading Plan Created!',
        description: 'You can now add daily readings to this plan.',
      });

      form.reset();
      setShowForm(false);
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to create reading plan.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePlanActive = async (plan: ReadingPlan) => {
    try {
      const { error } = await supabase
        .from('reading_plans')
        .update({ is_active: !plan.is_active })
        .eq('id', plan.id);

      if (error) throw error;
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm('Are you sure? This will delete the plan and all its readings.')) return;
    
    try {
      const { error } = await supabase.from('reading_plans').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Deleted', description: 'Reading plan has been removed.' });
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  if (!isPastor) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/pastor/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Reading Plans</h1>
              <p className="text-sm text-muted-foreground">Create and manage reading plans</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            New Plan
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Reading Plan</CardTitle>
              <CardDescription>
                Set up a new Bible reading plan for your congregation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 30 Days Through Psalms" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what this reading plan covers..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={365}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Create Plan
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Existing Plans */}
        <Card>
          <CardHeader>
            <CardTitle>All Reading Plans</CardTitle>
            <CardDescription>Manage your church's reading plans</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No reading plans yet</p>
                <Button className="mt-4" onClick={() => setShowForm(true)}>
                  Create Your First Plan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{plan.name}</h3>
                          <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                            {plan.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {plan.duration_days} days • {plan.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Active</span>
                        <Switch
                          checked={plan.is_active}
                          onCheckedChange={() => togglePlanActive(plan)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deletePlan(plan.id)}
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

export default PastorReadingPlansPage;
