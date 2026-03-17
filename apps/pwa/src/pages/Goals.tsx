import { AddGoalModal } from '@/components/features/AddGoalModal';
import { cn } from '@/lib/utils';
import { type Goal, db } from '@fitcounter/core';
import {
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Edit2,
  PlusCircle,
  Timer,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function GoalsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedGoalFilter, setSelectedGoalFilter] = useState<string>('all');

  const locale = i18n.language === 'pl' ? pl : enUS;

  // Fetch all goals
  const goals = useLiveQuery(() => db.goals.toArray());

  // Fetch exercises for mapping
  const exercises = useLiveQuery(() => db.exercises.toArray());
  const exerciseMap = new Map(exercises?.map((e) => [e.id, e]));

  // Calculate progress for each goal
  const goalsWithProgress = useLiveQuery(async () => {
    if (!goals) return [];

    const result = [];
    for (const goal of goals) {
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
          // Global goal
          if (goal.metric === 'reps' && logExerciseUnit === 'reps') {
            currentVal += log.value;
          } else if (goal.metric === 'time' && logExerciseUnit === 'seconds') {
            currentVal += log.value;
          } else if (goal.metric === 'workouts') {
            currentVal += 1;
          }
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

    if (!goals || goals.length === 0) {
      return days.map((day) => ({ date: day, status: 'none', metCount: 0, totalCount: 0 }));
    }

    const queryStart = startOfWeek(start, { weekStartsOn: 1 });
    const queryEnd = endOfWeek(end, { weekStartsOn: 1 });

    const logs = await db.logs.where('date').between(queryStart, queryEnd).toArray();

    const dayStats = days.map((day) => {
      let metCount = 0;
      let totalCount = 0;

      const goalsToEvaluate =
        selectedGoalFilter === 'all' ? goals : goals.filter((g) => g.id === selectedGoalFilter);

      goalsToEvaluate.forEach((goal) => {
        totalCount++;
        let pStart;
        let pEnd;
        if (goal.type === 'daily') {
          pStart = startOfDay(day).getTime();
          pEnd = endOfDay(day).getTime();
        } else {
          pStart = startOfWeek(day, { weekStartsOn: 1 }).getTime();
          pEnd = endOfWeek(day, { weekStartsOn: 1 }).getTime();
        }

        let currentVal = 0;
        logs.forEach((log) => {
          const logTime = log.date.getTime();
          if (logTime >= pStart && logTime <= pEnd) {
            const logExerciseUnit = exerciseMap.get(log.exerciseId)?.unit;
            if (goal.exerciseId) {
              if (goal.metric === 'workouts') {
                currentVal += 1;
              } else if (log.exerciseId === goal.exerciseId) {
                currentVal += log.value;
              }
            } else {
              if (goal.metric === 'reps' && logExerciseUnit === 'reps') currentVal += log.value;
              else if (goal.metric === 'time' && logExerciseUnit === 'seconds')
                currentVal += log.value;
              else if (goal.metric === 'workouts') currentVal += 1;
            }
          }
        });

        if (currentVal >= goal.targetValue) {
          metCount++;
        }
      });

      let status = 'none';
      if (totalCount > 0) {
        if (metCount === totalCount) status = 'all';
        else if (metCount > 0) status = 'some';
      }

      return {
        date: day,
        status,
        metCount,
        totalCount,
      };
    });

    return dayStats;
  }, [currentMonth, exercises, goals, selectedGoalFilter]); // Re-run when month, goals or filter changes

  const getIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'Dumbbell':
        return Dumbbell;
      case 'Activity':
        return Activity;
      case 'Timer':
        return Timer;
      default:
        return Activity;
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setGoalToEdit(goal);
    setIsAddGoalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted text-foreground"
          >
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
            {goalsWithProgress?.map((goal) => {
              const exercise = goal.exerciseId ? exerciseMap.get(goal.exerciseId) : null;
              const Icon = exercise ? getIcon(exercise.icon) : Activity;
              const progress = Math.min(
                100,
                Math.round((goal.currentVal / goal.targetValue) * 100)
              );
              const isMet = progress >= 100;

              return (
                <div
                  key={goal.id}
                  className={cn(
                    'group relative bg-card rounded-xl border border-border p-4 shadow-sm',
                    !goal.isActive && 'opacity-60'
                  )}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'size-10 rounded-lg flex items-center justify-center',
                          exercise ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        )}
                        style={
                          exercise
                            ? { backgroundColor: `${exercise.color}20`, color: exercise.color }
                            : {}
                        }
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{goal.title}</h3>
                          {!goal.isActive && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                              <AlertCircle className="size-3" />
                              Wstrzymany
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">
                          {goal.type === 'daily' ? t('goals.daily') : t('goals.weekly')} •{' '}
                          {goal.metric === 'reps' ? t('home.reps') : t('home.mins')}
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
                        <span
                          className={cn(
                            'text-lg font-bold',
                            isMet ? 'text-primary' : 'text-foreground'
                          )}
                        >
                          {goal.metric === 'time'
                            ? Math.round(goal.currentVal / 60)
                            : Math.round(goal.currentVal)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {' '}
                          /{' '}
                          {goal.metric === 'time'
                            ? Math.round(goal.targetValue / 60)
                            : goal.targetValue}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-2 text-foreground hover:bg-primary/10 rounded-full transition-colors"
                      >
                        <Edit2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'absolute top-0 left-0 h-full rounded-full transition-all duration-500',
                        isMet ? 'bg-primary' : 'bg-primary'
                      )}
                      style={{ width: `${progress}%` }}
                    />
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
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1 hover:bg-muted rounded-md"
              >
                <ChevronLeft className="size-4 text-foreground" />
              </button>
              <span className="text-xs font-bold w-24 text-center text-foreground">
                {format(currentMonth, 'MMMM yyyy', { locale })}
              </span>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1 hover:bg-muted rounded-md"
              >
                <ChevronRight className="size-4 text-foreground" />
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            {goals && goals.length > 0 && (
              <div className="mb-4">
                <select
                  value={selectedGoalFilter}
                  onChange={(e) => setSelectedGoalFilter(e.target.value)}
                  className="w-full bg-muted text-foreground rounded-lg px-3 py-2 text-sm border-none outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">{t('goals.allGoals', 'Wszystkie cele')}</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                    'aspect-square rounded-lg flex items-center justify-center text-xs font-medium border transition-all',
                    day.status === 'all'
                      ? 'bg-primary text-white border-primary'
                      : day.status === 'some'
                        ? 'bg-primary/40 text-primary border-primary/50'
                        : 'bg-muted/30 text-muted-foreground border-transparent',
                    isToday(day.date) &&
                      'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                  )}
                  title={
                    selectedGoalFilter === 'all'
                      ? `${day.metCount}/${day.totalCount} celów`
                      : day.status === 'all'
                        ? t('goals.status.met', 'Zrealizowany')
                        : t('goals.status.notMet', 'Niezrealizowany')
                  }
                >
                  {day.status === 'all' ? <Check className="size-3" /> : format(day.date, 'd')}
                </div>
              ))}
            </div>

            {selectedGoalFilter === 'all' && goals && goals.length > 0 && (
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="size-3 rounded-sm bg-muted/30 border border-transparent" />
                  <span>{t('goals.legend.none', 'Brak')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-3 rounded-sm bg-primary/40 border border-primary/50" />
                  <span>{t('goals.legend.some', 'Część')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-3 rounded-sm bg-primary border border-primary" />
                  <span>{t('goals.legend.all', 'Wszystkie')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => {
          setIsAddGoalOpen(false);
          setGoalToEdit(undefined);
        }}
        goalToEdit={goalToEdit}
      />
    </div>
  );
}
