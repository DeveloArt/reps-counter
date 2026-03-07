import { ArrowLeft, Settings, PlusCircle, Dumbbell, Timer, Activity, MoreHorizontal, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

export default function GoalsPage() {
  const { t } = useTranslation();

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
      let progress = 0;
      let start, end;

      if (goal.type === 'daily') {
        start = startOfDay(new Date());
        end = endOfDay(new Date());
      } else if (goal.type === 'weekly') {
        start = startOfWeek(new Date(), { weekStartsOn: 1 });
        end = endOfWeek(new Date(), { weekStartsOn: 1 });
      } else {
        // Monthly not implemented yet, fallback to daily
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
        // General goal (e.g. total reps), fetch all logs
        logs = await db.logs
          .where('date')
          .between(start, end)
          .toArray();
      }

      let currentVal = 0;
      logs.forEach(log => {
        // If goal metric matches log unit (reps vs reps, time vs seconds)
        // Simplified: assuming metric matches exercise unit for now
        currentVal += log.value;
      });

      result.push({ ...goal, currentVal });
    }
    return result;
  }, [goals]);

  const getIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'Dumbbell': return Dumbbell;
      case 'Activity': return Activity;
      case 'Timer': return Timer;
      default: return Activity;
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
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
          <Settings className="size-6 text-foreground" />
        </button>
      </div>

      {/* Progress Summary Card */}
      <div className="px-4 py-2">
        <div className="bg-primary rounded-xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm opacity-80 font-light">{t('goals.overallProgress')}</p>
            <h2 className="text-3xl font-bold mt-1">78%</h2>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '78%' }}></div>
            </div>
            <p className="text-xs mt-3 opacity-90">You're 12% ahead of last week. Keep it up!</p>
          </div>
          {/* Abstract Pattern Decoration */}
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Activity className="size-32" />
          </div>
        </div>
      </div>

      {/* Active Goals Section */}
      <div className="px-4 pt-6 pb-2 flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{t('goals.activeGoals')}</h2>
        <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors">
          <PlusCircle className="size-4" />
          {t('common.add')}
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {goalsWithProgress?.map((goal) => {
          const exercise = goal.exerciseId ? exerciseMap.get(goal.exerciseId) : null;
          const Icon = getIcon(exercise?.icon);
          const progress = Math.min(100, (goal.currentVal / goal.targetValue) * 100);

          return (
            <div key={goal.id} className="bg-card p-4 rounded-xl border border-primary/10 shadow-sm">
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
                <p className="text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded">
                  {goal.currentVal}/{goal.targetValue}
                </p>
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
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <MoreHorizontal className="size-5" />
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
        <div className="bg-card rounded-xl p-4 border border-primary/10 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-foreground">October 2023</p>
            <div className="flex gap-2">
              <button className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                <ChevronLeft className="size-4" />
              </button>
              <button className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
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
            {/* Week 1 - Placeholder days */}
            {[26, 27, 28, 29, 30].map(d => (
              <div key={d} className="aspect-square flex items-center justify-center text-xs text-muted-foreground/50">{d}</div>
            ))}
            <div className="aspect-square flex items-center justify-center text-xs rounded-lg bg-green-100 text-green-600 font-bold">
              <Check className="size-4" />
            </div>
            <div className="aspect-square flex items-center justify-center text-xs rounded-lg bg-green-100 text-green-600 font-bold">
              <Check className="size-4" />
            </div>
            
            {/* Week 2 */}
            <div className="aspect-square flex items-center justify-center text-xs rounded-lg bg-red-100 text-red-600 font-bold">
              <X className="size-4" />
            </div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square flex items-center justify-center text-xs rounded-lg bg-green-100 text-green-600 font-bold">
                <Check className="size-4" />
              </div>
            ))}
            <div className="aspect-square flex items-center justify-center text-xs rounded-lg bg-red-100 text-red-600 font-bold">
              <X className="size-4" />
            </div>
            <div className="aspect-square flex items-center justify-center text-xs rounded-lg bg-green-100 text-green-600 font-bold">
              <Check className="size-4" />
            </div>

            {/* Current Week */}
            <div className="aspect-square flex items-center justify-center text-xs rounded-lg bg-green-100 text-green-600 font-bold">
              <Check className="size-4" />
            </div>
            <div className="aspect-square flex items-center justify-center text-xs rounded-lg bg-green-100 text-green-600 font-bold">
              <Check className="size-4" />
            </div>
            <div className="aspect-square flex items-center justify-center text-xs rounded-lg bg-muted text-foreground font-bold ring-2 ring-primary relative">
              12
              <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"></div>
            </div>
            {[13, 14, 15, 16].map(d => (
              <div key={d} className="aspect-square flex items-center justify-center text-xs text-muted-foreground">{d}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
