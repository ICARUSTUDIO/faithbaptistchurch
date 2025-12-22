import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Check, Play, ChevronRight, ArrowLeft, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReadingPlan {
  id: string;
  name: string;
  description: string | null;
  duration_days: number;
  is_active: boolean;
}

interface UserProgress {
  plan_id: string;
  current_day: number;
  completed_days: number[];
  is_completed: boolean;
}

interface PlanDay {
  day_number: number;
  title: string;
  readings: string[];
}

const ReadingPlansPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const [planDays, setPlanDays] = useState<PlanDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    try {
      const { data: plansData, error: plansError } = await supabase
        .from('reading_plans')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (plansError) throw plansError;
      setPlans(plansData || []);

      if (user) {
        const { data: progressData } = await supabase
          .from('user_reading_progress')
          .select('*')
          .eq('user_id', user.id);

        const progressMap: Record<string, UserProgress> = {};
        progressData?.forEach((p) => {
          progressMap[p.plan_id] = {
            plan_id: p.plan_id,
            current_day: p.current_day,
            completed_days: p.completed_days || [],
            is_completed: p.is_completed,
          };
        });
        setUserProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlanDays = async (planId: string) => {
    const { data, error } = await supabase
      .from('reading_plan_days')
      .select('*')
      .eq('plan_id', planId)
      .order('day_number');

    if (!error && data) {
      setPlanDays(data.map(d => ({
        day_number: d.day_number,
        title: d.title,
        readings: d.readings || [],
      })));
    }
  };

  const startPlan = async (plan: ReadingPlan) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to start a reading plan.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase.from('user_reading_progress').insert({
        user_id: user.id,
        plan_id: plan.id,
        current_day: 1,
        completed_days: [],
      });

      if (error && error.code !== '23505') throw error;

      setUserProgress(prev => ({
        ...prev,
        [plan.id]: { plan_id: plan.id, current_day: 1, completed_days: [], is_completed: false },
      }));

      toast({
        title: 'Plan Started!',
        description: `You've started "${plan.name}". Happy reading!`,
      });

      setSelectedPlan(plan);
      fetchPlanDays(plan.id);
    } catch (error) {
      console.error('Error starting plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to start the reading plan.',
        variant: 'destructive',
      });
    }
  };

  const markDayComplete = async (dayNumber: number) => {
    if (!user || !selectedPlan) return;

    const progress = userProgress[selectedPlan.id];
    const newCompletedDays = [...(progress?.completed_days || []), dayNumber];
    const isCompleted = newCompletedDays.length >= selectedPlan.duration_days;

    try {
      const { error } = await supabase
        .from('user_reading_progress')
        .update({
          completed_days: newCompletedDays,
          current_day: dayNumber + 1,
          is_completed: isCompleted,
          last_read_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('plan_id', selectedPlan.id);

      if (error) throw error;

      setUserProgress(prev => ({
        ...prev,
        [selectedPlan.id]: {
          ...prev[selectedPlan.id],
          completed_days: newCompletedDays,
          current_day: dayNumber + 1,
          is_completed: isCompleted,
        },
      }));

      if (isCompleted) {
        toast({
          title: '🎉 Congratulations!',
          description: `You've completed "${selectedPlan.name}"!`,
        });
      } else {
        toast({
          title: 'Day Completed!',
          description: `Great job! Keep going with Day ${dayNumber + 1}.`,
        });
      }
    } catch (error) {
      console.error('Error marking day complete:', error);
    }
  };

  const getProgressPercent = (plan: ReadingPlan) => {
    const progress = userProgress[plan.id];
    if (!progress) return 0;
    return Math.round((progress.completed_days.length / plan.duration_days) * 100);
  };

  if (selectedPlan) {
    const progress = userProgress[selectedPlan.id];
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto p-4 pb-24">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => {
              setSelectedPlan(null);
              setPlanDays([]);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{selectedPlan.name}</CardTitle>
              <CardDescription>{selectedPlan.description}</CardDescription>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>{progress?.completed_days.length || 0} of {selectedPlan.duration_days} days</span>
                  <span>{getProgressPercent(selectedPlan)}%</span>
                </div>
                <Progress value={getProgressPercent(selectedPlan)} className="h-2" />
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-3">
            {planDays.map((day) => {
              const isCompleted = progress?.completed_days.includes(day.day_number);
              const isCurrent = progress?.current_day === day.day_number;

              return (
                <Card
                  key={day.day_number}
                  className={`transition-all ${
                    isCurrent ? 'ring-2 ring-primary' : ''
                  } ${isCompleted ? 'bg-primary/5' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isCompleted
                              ? 'bg-primary text-primary-foreground'
                              : isCurrent
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : day.day_number}
                        </div>
                        <div>
                          <p className="font-medium">{day.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {day.readings.join(', ')}
                          </p>
                        </div>
                      </div>
                      {!isCompleted && isCurrent && (
                        <Button size="sm" onClick={() => markDayComplete(day.day_number)}>
                          <Check className="w-4 h-4 mr-1" />
                          Done
                        </Button>
                      )}
                      {isCompleted && (
                        <Badge variant="secondary">
                          <Check className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {planDays.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Reading schedule coming soon</p>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Reading Plans</h1>
          <p className="text-muted-foreground">Grow in faith with guided Bible reading</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => {
              const progress = userProgress[plan.id];
              const hasStarted = !!progress;
              const progressPercent = getProgressPercent(plan);

              return (
                <Card
                  key={plan.id}
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => {
                    if (hasStarted) {
                      setSelectedPlan(plan);
                      fetchPlanDays(plan.id);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {plan.duration_days} days
                            </span>
                            {progress?.is_completed && (
                              <Badge variant="secondary" className="text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {hasStarted ? (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startPlan(plan);
                          }}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>

                    {hasStarted && !progress.is_completed && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Day {progress.current_day} of {plan.duration_days}</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-1.5" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {plans.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">No Reading Plans Available</h3>
                <p className="text-sm">Check back later for new reading plans.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ReadingPlansPage;
