import { ArrowLeft, Settings, PlusCircle, Dumbbell, Timer, Activity, MoreHorizontal, ChevronLeft, ChevronRight, Check, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { useState } from 'react';
import { AddGoalModal } from '@/components/features/AddGoalModal';

export default function GoalsPage() {
  const { t } = useTranslation();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const handleDeleteGoal = async (id: string) => {
      if (confirm(t('goals.confirmDelete'))) {
          await db.goals.delete(id);
      }
  };

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      {/* Header */}
      <div className="flex items-center p-4 justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <button className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer transition-colors">
          <ArrowLeft className="size-6 text-foreground" />
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center text-foreground">{t('goals.title')}</h1>
        <div className="size-10" />
      </div>

      {/* Active Goals Section */}
      <div className="px-4 pt-6 pb-2 flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{t('goals.activeGoals')}</h2>
        <button 
          onClick={() => setIsAddGoalOpen(true)}
          className="text-primary text-sm font-semibold flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors"
        >
          <PlusCircle className="size-4" />
          {t('common.add')}
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {goalsWithProgress?.length === 0 && (
            <div className="text-center p-8 text-muted-foreground bg-muted/30 rounded-xl border-2 border-dashed border-border">
                <p>No active goals.</p>
                <button onClick={() => setIsAddGoalOpen(true)} className="text-primary font-bold mt-2">Create one!</button>
            </div>
        )}
        {goalsWithProgress?.map((goal) => {
          const exercise = goal.exerciseId ? exerciseMap.get(goal.exerciseId) : null;
          const Icon = getIcon(exercise?.icon);
          const progress = Math.min(100, (goal.currentVal / goal.targetValue) * 100);

          return (
            <div key={goal.id} className="bg-card p-4 rounded-xl border border-border shadow-sm">
              <div className="flex gap-6 justify-between items-start mb-3">
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-primary/10 rounded-lg" style={{ backgroundColor: exercise ? `${exercise.color}20` : undefined }}>
                    <Icon className="size-6 text-primary" style={{ color: exercise?.color }} />
                  </div>
                  <div>
                    <p className="text-foreground text-base font-semibold">{goal.title}</p>
                    <p className="text-muted-foreground text-xs capitalize">{goal.type} Goal</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <p className="text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded">
                    {goal.metric === 'time' 
                      ? `${Math.round(goal.currentVal / 60)}/${Math.round(goal.targetValue / 60)}m` 
                      : `${goal.currentVal}/${goal.targetValue}`}
                    </p>
                </div>
              </div>
              <div className="rounded-full bg-muted h-2 w-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-500" 
                  style={{ width: `${progress}%`, backgroundColor: exercise?.color }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-primary text-xs font-medium">
                  {progress >= 100 ? 'Completed!' : 'Keep going!'}
                </p>
                <button 
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal History Calendar */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{t('goals.goalHistory')}</h2>
      </div>
      <div className="px-4 pb-4">
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-foreground capitalize">{format(currentMonth, 'MMMM yyyy')}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-foreground"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-foreground"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className="text-muted-foreground uppercase">{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for start of month */}
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
            ))}

            {historyData?.map((day, i) => {
                const isFuture = day.date > new Date();
                const isTodayDate = isToday(day.date);
                
                let content;
                let className = "aspect-square flex items-center justify-center text-xs rounded-lg font-bold transition-all";
                
                if (isFuture) {
                    className += " text-muted-foreground/30";
                    content = format(day.date, 'd');
                } else if (day.score >= 100) {
                    className += " bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
                    content = <Check className="size-4" />;
                } else if (day.score > 0) {
                    className += " bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
                    content = <span className="text-[10px]">{Math.round(day.score)}%</span>;
                } else {
                    className += " bg-muted text-muted-foreground";
                    content = format(day.date, 'd');
                }

                if (isTodayDate) {
                    className += " ring-2 ring-primary ring-offset-2 ring-offset-background";
                }

                return (
                    <div key={i} className={className}>
                        {content}
                    </div>
                );
            })}
          </div>
        </div>
      </div>

      <AddGoalModal isOpen={isAddGoalOpen} onClose={() => setIsAddGoalOpen(false)} />
    </div>
  );
}
