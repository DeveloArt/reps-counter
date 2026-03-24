import { db } from '@/db';
import { cn } from '@/lib/utils';

import { endOfDay, endOfWeek, startOfDay, startOfWeek } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddGoalModal } from '../components/features/AddGoalModal';

export default function GoalsPage() {
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch all goals
  const goals = useLiveQuery(() => db.goals.toArray());

  // Fetch exercises for mapping
  const exercises = useLiveQuery(() => db.exercises.toArray());
  const exerciseMap = new Map(exercises?.map((e) => [e.id, e]));

  // Calculate progress for each goal
  const goalsWithProgress = useLiveQuery(async () => {
    // Explicitly reference tables to ensure this hook re-runs when they change
    const [allGoals, allExercises, allLogs] = await Promise.all([
      db.goals.toArray(),
      db.exercises.toArray(),
      db.logs.toArray(),
    ]);

    if (!allGoals.length) return [];

    const result = [];
    for (const goal of allGoals) {
      let start;
      let end;

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
          .filter((l) => l.exerciseId === goal.exerciseId)
          .toArray();
      } else {
        logs = await db.logs.where('date').between(start, end).toArray();
      }

      let currentVal = 0;
      logs.forEach((log) => {
        const logExerciseUnit = exerciseMap.get(log.exerciseId)?.unit;

        if (goal.exerciseId) {
          // Specific exercise goal
          if (goal.metric === 'workouts') {
            currentVal += 1;
          } else {
            currentVal += log.value;
          }
        } else {
          // General goal (e.g., "Total Reps")
          if (goal.metric === 'workouts') {
            currentVal += 1;
          } else if (goal.metric === 'reps' && logExerciseUnit === 'reps') {
            currentVal += log.value;
          } else if (goal.metric === 'weight' && logExerciseUnit === 'weight') {
            currentVal += log.value;
          } else if (goal.metric === 'time' && logExerciseUnit === 'time') {
            currentVal += log.value;
          }
        }
      });

      result.push({
        ...goal,
        currentValue: currentVal,
        progress: Math.min(Math.round((currentVal / goal.targetValue) * 100), 100),
      });
    }

    return result;
  }, [goals, exercises]); // Include external data as dependencies

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 backdrop-blur-md p-4 border-b border-primary/10">
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight">
          {t('goals.title')}
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex size-10 items-center justify-center bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
        >
          <Plus className="size-6" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                {t('goals.active')}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">{goals?.length || 0}</div>
          </div>
          <div className="bg-card p-4 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                {t('goals.completed')}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {goalsWithProgress?.filter((g) => g.progress >= 100).length || 0}
            </div>
          </div>
        </div>

        {/* Goals List */}
        {!goalsWithProgress || goalsWithProgress.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Target className="size-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-foreground font-semibold mb-1">{t('goals.noGoals')}</h3>
            <p className="text-muted-foreground text-sm max-w-[200px]">{t('goals.noGoalsDesc')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goalsWithProgress.map((goal) => (
              <div
                key={goal.id}
                className="bg-card p-4 rounded-2xl border border-border/50 hover:border-primary/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {goal.exerciseId
                        ? exerciseMap.get(goal.exerciseId)?.name
                        : t(`goals.metrics.${goal.metric}`)}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {t(`goals.types.${goal.type}`)} • {goal.targetValue}{' '}
                      {goal.metric === 'workouts'
                        ? t('goals.units.workouts')
                        : exerciseMap.get(goal.exerciseId)?.unit || goal.metric}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        'text-sm font-bold',
                        goal.progress >= 100 ? 'text-green-500' : 'text-primary'
                      )}
                    >
                      {goal.progress}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      goal.progress >= 100 ? 'bg-green-500' : 'bg-primary'
                    )}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  <span>
                    {goal.currentValue} {t('goals.current')}
                  </span>
                  <span>
                    {goal.targetValue} {t('goals.target')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddGoalModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
