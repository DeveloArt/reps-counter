import { ArrowLeft, Settings, PlusCircle, Dumbbell, Timer, Activity, MoreHorizontal, ChevronLeft, ChevronRight, Check, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { useState } from 'react';
import { AddGoalModal } from '@/components/features/AddGoalModal';
import { useNavigate } from 'react-router-dom';

export default function GoalsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const locale = i18n.language === 'pl' ? pl : enUS;

  // Fetch active goals
  const goals = useLiveQuery(() => db.goals.filter(g => g.isActive).toArray());

  // Fetch exercises for mapping
  const exercises = useLiveQuery(() => db.exercises.toArray());
  const exerciseMap = new Map(exercises?.map(e => [e.id, e]));

  // Calculate progress for each goal
  const goalsWithProgress = useLiveQuery(async () => {
    if (!goals) return [];

    const result = [];
    for (const goal of goals) {
      let start, end;

      if (goal.type === 'daily') {
        start = startOfDay(new Date());
        end = endOfDay(new Date());
      } else if (goal.type === 'weekly') {
        start = startOfWeek(new Date(), { weekStartsOn: 1 });
        end = endOfWeek(new Date(), { weekStartsOn: 1 });
      } else {
        start = startOfDay(new Date());
        end = endOfDay(new Date());
      }

      let logs = [];
      if (goal.exerciseId) {
        logs = await db.logs
          .where('date')
          .between(start, end)
          .filter(l => l.exerciseId === goal.exerciseId)
          .toArray();
      } else {
        logs = await db.logs
          .where('date')
          .between(start, end)
          .toArray();
      }

      let currentVal = 0;
      logs.forEach(log => {
        // Simple metric matching
        if (goal.metric === 'reps' && (!goal.exerciseId || exerciseMap.get(goal.exerciseId)?.unit === 'reps')) {
             currentVal += log.value;
        } else if (goal.metric === 'time' && (!goal.exerciseId || exerciseMap.get(goal.exerciseId)?.unit === 'seconds')) {
             currentVal += log.value;
        } else if (!goal.metric) {
             currentVal += log.value;
        }
      });

      result.push({ ...goal, currentVal });
    }
    return result;
  }, [goals, exercises]); // Re-run if goals or exercises change

  // History Logic
  const historyData = useLiveQuery(async () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Get settings for daily goals
    const settings = await db.settings.get(1);
    const goalReps = settings?.dailyGoalReps || 100;
    const goalTime = settings?.dailyGoalTime || 600;

    const logs = await db.logs.where('date').between(start, end).toArray();
    
    // Map logs to days
    const dayStats = days.map(day => {
      const dayLogs = logs.filter(l => isSameDay(l.date, day));
      let totalReps = 0;
      let totalTime = 0;
      
      dayLogs.forEach(l => {
         const ex = exerciseMap.get(l.exerciseId);
         if (ex?.unit === 'reps') totalReps += l.value;
         if (ex?.unit === 'seconds') totalTime += l.value;
      });

      const progressReps = Math.min(100, (totalReps / goalReps) * 100);
      const progressTime = Math.min(100, (totalTime / goalTime) * 100);
      const score = (progressReps + progressTime) / 2;

      return {
        date: day,
        score,
        met: score >= 100
      };
    });

    return dayStats;
  }, [currentMonth, exercises]); // Re-run when month changes

  const getIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'Dumbbell': return Dumbbell;
      case 'Activity': return Activity;
      case 'Timer': return Timer;
      default: return Activity;
    }
  };

  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  
  // ... (existing code)

  const handleDeleteGoal = (id: string) => {
      setGoalToDelete(id);
  };

  const confirmDelete = async () => {
      if (goalToDelete) {
          await db.goals.delete(goalToDelete);
          setGoalToDelete(null);
      }
  };

  // ... (existing code)

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-muted text-foreground">
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-xl font-bold text-foreground">{t('goals.title')}</h1>
        </div>
        {/* Settings button removed as per request */}
      </header>

      <div className="px-4 space-y-6">
        {/* Active Goals Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">{t('goals.activeGoals')}</h2>
            <button 
              onClick={() => setIsAddGoalOpen(true)}
              className="flex items-center gap-1 text-primary text-sm font-bold hover:opacity-80 transition-opacity"
            >
              <PlusCircle className="size-4" />
              {t('goals.addGoal')}
            </button>
          </div>

          <div className="grid gap-3">
            {goalsWithProgress?.map(goal => {
              const exercise = goal.exerciseId ? exerciseMap.get(goal.exerciseId) : null;
              const Icon = exercise ? getIcon(exercise.icon) : Activity;
              const progress = Math.min(100, Math.round((goal.currentVal / goal.targetValue) * 100));
              const isMet = progress >= 100;

              return (
                <div key={goal.id} className="group relative bg-card rounded-xl border border-border p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("size-10 rounded-lg flex items-center justify-center", exercise ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")} style={exercise ? { backgroundColor: `${exercise.color}20`, color: exercise.color } : {}}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{goal.title}</h3>
                        <p className="text-xs text-muted-foreground capitalize">
                          {goal.type === 'daily' ? t('goals.daily') : t('goals.weekly')} • {goal.metric === 'reps' ? t('home.reps') : t('home.mins')}
                        </p>
                        {goal.trigger && (
                          <p className="text-xs text-primary mt-1 font-medium">
                            {t('goals.trigger')}: {goal.trigger}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <span className={cn("text-lg font-bold", isMet ? "text-primary" : "text-foreground")}>
                                {Math.round(goal.currentVal)}
                            </span>
                            <span className="text-xs text-muted-foreground"> / {goal.targetValue}</span>
                        </div>
                        <button 
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>
                  </div>
                  
                  <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-500", isMet ? "bg-primary" : "bg-primary")}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {(!goals || goals.length === 0) && (
              <div className="text-center py-8 bg-muted/30 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground text-sm">{t('goals.noGoals')}</p>
                <button 
                  onClick={() => setIsAddGoalOpen(true)}
                  className="mt-2 text-primary font-bold text-sm hover:underline"
                >
                  {t('goals.createFirst')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* History Calendar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">{t('goals.history')}</h2>
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-muted rounded-md">
                <ChevronLeft className="size-4 text-foreground" />
              </button>
              <span className="text-xs font-bold w-24 text-center text-foreground">
                {format(currentMonth, 'MMMM yyyy', { locale })}
              </span>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-muted rounded-md">
                <ChevronRight className="size-4 text-foreground" />
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-bold text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {historyData?.map((day, i) => (
                <div 
                  key={i}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center text-xs font-medium border transition-all",
                    day.met 
                      ? "bg-primary text-white border-primary" 
                      : day.score > 0 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : "bg-muted/30 text-muted-foreground border-transparent",
                    isToday(day.date) && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  )}
                >
                  {day.met ? <Check className="size-3" /> : format(day.date, 'd')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddGoalModal isOpen={isAddGoalOpen} onClose={() => setIsAddGoalOpen(false)} />

      {/* Delete Confirmation Modal */}
      {goalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl border border-border">
            <h3 className="text-lg font-bold text-foreground mb-2">{t('common.delete')}?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              {t('goals.confirmDelete')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setGoalToDelete(null)}
                className="flex-1 rounded-xl bg-muted py-3 text-sm font-bold text-foreground hover:bg-muted/80 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
