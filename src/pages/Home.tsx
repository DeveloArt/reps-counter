import { Zap, Dumbbell, Activity, Timer, MoreHorizontal, TrendingUp, Plus, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Exercise } from '@/db/db';
import { startOfDay, endOfDay, subDays, isSameDay, format, eachDayOfInterval } from 'date-fns';
import { getDateLocale } from '@/lib/dateLocale';
import { cn } from '@/lib/utils';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { AdBanner } from '@/components/features/AdBanner';
import { ProfilePromoBanner } from '@/components/features/ProfilePromoBanner';

interface LayoutContext {
  openAddExercise: (exercise?: Exercise) => void;
  openLogEntry: (exercise: Exercise) => void;
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { openAddExercise, openLogEntry } = useOutletContext<LayoutContext>();
  const location = useLocation();
  const isAppUrl = location.pathname.startsWith('/app');
  const goalsPath = isAppUrl ? '/app/goals' : '/goals';

  const [weeklyMetric, setWeeklyMetric] = useState<'reps' | 'time'>('reps');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Force update current date when app becomes visible or on interval
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setCurrentDate(new Date());
      }
    };

    // Check every minute if the day has changed
    const interval = setInterval(() => {
        const now = new Date();
        if (!isSameDay(now, currentDate)) {
            setCurrentDate(now);
        }
    }, 60000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        clearInterval(interval);
    };
  }, [currentDate]);

  // Fetch exercises from DB
  const exercises = useLiveQuery(() => db.exercises.filter(e => !e.isArchived).toArray());

  // Fetch today's logs to calculate stats
  const todayStats = useLiveQuery(async () => {
    const start = startOfDay(currentDate).getTime();
    const end = endOfDay(currentDate).getTime();
    
    // Use timestamp index for reliable date filtering
    const logs = await db.logs
      .where('timestamp')
      .between(start, end)
      .toArray();

    let totalReps = 0;
    let totalTime = 0;
    const exerciseTotals: Record<string, number> = {};

    // Get exercises to know units
    const allExercises = await db.exercises.toArray();
    const exerciseMap = new Map(allExercises.map(e => [e.id, e]));

    logs.forEach(log => {
      const exercise = exerciseMap.get(log.exerciseId);
      
      // Initialize if not exists
      if (!exerciseTotals[log.exerciseId]) {
        exerciseTotals[log.exerciseId] = 0;
      }
      exerciseTotals[log.exerciseId] += log.value;

      if (exercise?.unit === 'reps') {
        totalReps += log.value;
      } else if (exercise?.unit === 'seconds') {
        totalTime += log.value;
      }
    });

    return { totalReps, totalTime, exerciseTotals };
  }, [currentDate]);

  // Calculate Weekly Performance
  const weeklyPerformance = useLiveQuery(async () => {
    const end = endOfDay(currentDate);
    const start = subDays(startOfDay(currentDate), 6);
    const days = eachDayOfInterval({ start, end });
    
    // Use timestamp for range query
    const logs = await db.logs
      .where('timestamp')
      .between(start.getTime(), end.getTime())
      .toArray();

    const allExercises = await db.exercises.toArray();
    const exerciseMap = new Map(allExercises.map(e => [e.id, e]));

    const data = days.map(day => {
        // Filter using timestamp comparison to be safe
        const dayStart = startOfDay(day).getTime();
        const dayEnd = endOfDay(day).getTime();
        
        const dayLogs = logs.filter(l => l.timestamp >= dayStart && l.timestamp <= dayEnd);
        
        const value = dayLogs.reduce((acc, log) => {
            const ex = exerciseMap.get(log.exerciseId);
            if (weeklyMetric === 'reps' && ex?.unit === 'reps') {
                return acc + log.value;
            } else if (weeklyMetric === 'time' && ex?.unit === 'seconds') {
                return acc + (log.value / 60); // minutes
            }
            return acc;
        }, 0);
        const dateLocale = getDateLocale(i18n.language);
        return {
            day: format(day, 'EEEEE', { locale: dateLocale }), // Single letter day
            fullDay: format(day, 'EEE', { locale: dateLocale }),
            value: Math.round(value),
            isToday: isSameDay(day, currentDate)
        };
    });

    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

    return { data, maxValue };
  }, [weeklyMetric, currentDate]);

  // Calculate Streak
  const streak = useLiveQuery(async () => {
    const logs = await db.logs.orderBy('timestamp').reverse().toArray();
    if (!logs.length) return 0;

    // Use timestamps for unique date calculation
    const uniqueDays = new Set(logs.map(l => startOfDay(l.timestamp).getTime()));
    const sortedUniqueDays = Array.from(uniqueDays).sort((a, b) => b - a); // Descending
    
    if (sortedUniqueDays.length === 0) return 0;

    const todayStart = startOfDay(currentDate).getTime();
    const yesterdayStart = subDays(startOfDay(currentDate), 1).getTime();
    
    // Check if the most recent log is today or yesterday
    const lastLogDay = sortedUniqueDays[0];
    if (lastLogDay !== todayStart && lastLogDay !== yesterdayStart) {
        return 0;
    }

    let currentStreak = 0;
    let checkDay = lastLogDay === todayStart ? todayStart : yesterdayStart;

    for (const day of sortedUniqueDays) {
        if (day === checkDay) {
            currentStreak++;
            checkDay = subDays(checkDay, 1).getTime();
        } else {
            // Gap found
            break;
        }
    }
    return currentStreak;
  }, [currentDate]);

  // Fetch active daily goals
  const allGoals = useLiveQuery(() => db.goals.toArray());
  const dailyGoals = allGoals?.filter(g => g.type === 'daily' && g.isActive);
  const hasDailyGoals = Boolean(dailyGoals && dailyGoals.length > 0);

  // Calculate progress based on active daily goals
  let totalProgress = 0;

  if (hasDailyGoals && todayStats && dailyGoals) {
    const sumPercentages = dailyGoals.reduce((acc, goal) => {
      let currentValue = 0;
      
      if (goal.exerciseId) {
        // Specific exercise goal
        currentValue = todayStats.exerciseTotals?.[goal.exerciseId] || 0;
      } else {
        // Global goal
        if (goal.metric === 'reps') currentValue = todayStats.totalReps || 0;
        else if (goal.metric === 'time') currentValue = todayStats.totalTime || 0;
      }

      // Calculate percentage for this goal, capped at 100%
      const percentage = Math.min(1, currentValue / (goal.targetValue || 1));
      return acc + percentage;
    }, 0);

    totalProgress = Math.round((sumPercentages / dailyGoals.length) * 100);
  }

  const getProgressMessage = () => {
    if (!hasDailyGoals) return t('home.setGoalsPrompt');
    if (totalProgress >= 100) return t('home.goalReached');
    if (totalProgress >= 50) return t('home.keepGoing');
    if (totalProgress > 0) return t('home.progressStarted');
    return t('home.progressZero');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell': return Dumbbell;
      case 'Activity': return Activity;
      case 'Timer': return Timer;
      default: return Activity;
    }
  };

  // ... (existing code)

  const handleEditExercise = (e: React.MouseEvent, exercise: Exercise) => {
      e.stopPropagation(); // Prevent opening the log modal
      openAddExercise(exercise);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="flex items-center p-4 justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="size-10 overflow-hidden rounded-full border-2 border-primary/20">
            <img 
              className="w-full h-full object-cover" 
              alt="User profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU11pk97_1WpNCDCPxOVEv1xwgI8CAoId_v6LYddV5fELtrCn_3qlK_pcM6y4_mSa0HkaD2jLwxcYNHnhgiycCORkcoi1_tL3pN7QcdTQt724gtDh9gJoZSW9BU_-qglpASKXkrJoII_EWZWenW_OPnO2zhbq0qi6xg8Hhq53mnPO3myith-w4_A40WKCgYgILqZsAfgbOfBgiuWZWgR43Sj2CfhBWjMkxFQdhIAJSv4ROrUm61_eYzY1XfkJenqiq75XyDY606LTV"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-foreground text-lg font-bold leading-tight">{t('home.hello')}</h2>
            <p className="text-primary text-xs font-semibold flex items-center gap-1">
              <span>🔥</span> {streak || 0} {t('home.streak')}
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 py-2 space-y-6">
        {/* Daily Goal Card */}
        <Link to={goalsPath} className="block group focus:outline-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="relative overflow-hidden rounded-2xl bg-primary p-6 shadow-xl shadow-primary/10 text-white transition-all hover:shadow-2xl hover:shadow-primary/20 cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="flex w-full items-start justify-between">
                <div className="flex flex-col gap-1 z-10">
                  <p className="text-white/80 text-sm font-medium">{t('home.dailyGoal')}</p>
                  <h3 className="text-2xl font-bold">
                    {hasDailyGoals ? `${totalProgress}% ${t('home.complete')}` : t('home.noActiveGoals')}
                  </h3>
                  <p className="text-white/80 text-xs mt-2 max-w-[170px] leading-relaxed">
                    {getProgressMessage()}
                  </p>
                </div>
                <div className="relative size-24 flex items-center justify-center shrink-0">
                  <svg className="size-full -rotate-90">
                    <circle className="text-white/10" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                    {hasDailyGoals && (
                      <circle 
                        className="text-white transition-all duration-500 ease-out" 
                        cx="48" 
                        cy="48" 
                        fill="transparent" 
                        r="40" 
                        stroke="currentColor" 
                        strokeDasharray="251.3" 
                        strokeDashoffset={`${251.3 * (1 - totalProgress / 100)}`} 
                        strokeLinecap="round" 
                        strokeWidth="8"
                      ></circle>
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className={cn("size-8 fill-white transition-transform group-hover:scale-110", !hasDailyGoals && "opacity-70")} />
                  </div>
                </div>
              </div>
              
              <div className="w-full mt-8 pt-6 border-t border-white/10 flex justify-between items-center px-8">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-bold">{todayStats?.totalReps || 0}</span>
                  <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">{t('home.reps')}</span>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-bold">{Math.round((todayStats?.totalTime || 0) / 60)}</span>
                  <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">{t('home.mins')}</span>
                </div>
              </div>
            </div>
            {/* Decorative blur */}
            <div className="absolute -right-4 -bottom-4 size-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          </motion.div>
        </Link>

        {/* Profile Promo Banner (zakomentowany na ten moment) */}
        {/* <ProfilePromoBanner /> */}

        {/* Ad Banner (zakomentowany na ten moment) */}
        {/* <AdBanner className="!px-0" adSlot="9872037035" /> */}

        {/* Quick Add Section */}
        <div>
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-foreground text-lg font-bold tracking-tight">{t('home.quickAdd')}</h2>
            {/* View All button removed */}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {exercises?.map((exercise) => {
              const Icon = getIcon(exercise.icon);
              const dailyTotal = todayStats?.exerciseTotals?.[exercise.id] || 0;
              const displayTotal = exercise.unit === 'seconds' ? Math.round(dailyTotal / 60) + 'm' : dailyTotal;

              return (
                <motion.button 
                  key={exercise.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openLogEntry(exercise)}
                  className="group relative flex flex-col gap-3 p-4 bg-card rounded-xl border border-border text-left transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start w-full">
                      <div className="size-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary" style={{ backgroundColor: `${exercise.color}20`, color: exercise.color }}>
                        <Icon className="size-6" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                          <div 
                            onClick={(e) => handleEditExercise(e, exercise)}
                            className="p-1.5 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                              <Edit2 className="size-4" />
                          </div>
                          {dailyTotal > 0 && (
                            <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded-full">
                                {displayTotal}
                            </span>
                          )}
                      </div>
                  </div>
                  <div>
                    <p className="text-foreground text-base font-bold">{exercise.name}</p>
                    <p className="text-muted-foreground text-xs font-medium uppercase">{exercise.unit === 'reps' ? t('home.reps') : t('home.mins')}</p>
                  </div>
                  <div className="flex items-center justify-center w-full py-2 bg-muted rounded-lg group-active:bg-primary group-active:text-white transition-colors">
                    <Plus className="size-5" />
                  </div>
                </motion.button>
              );
            })}

            {/* New Activity */}
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => openAddExercise()}
              className="group flex flex-col items-center justify-center gap-2 p-4 bg-muted/50 rounded-xl border-2 border-dashed border-border text-center transition-all hover:bg-muted min-h-[140px]"
            >
              <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <MoreHorizontal className="size-5" />
              </div>
              <p className="text-muted-foreground text-sm font-bold">{t('home.addExercise')}</p>
            </motion.button>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">{t('home.weeklyPerformance')}</h3>
            <div className="flex bg-muted rounded-lg p-1">
                <button 
                    onClick={() => setWeeklyMetric('reps')}
                    className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded-md transition-all",
                        weeklyMetric === 'reps' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {t('home.reps')}
                </button>
                <button 
                    onClick={() => setWeeklyMetric('time')}
                    className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded-md transition-all",
                        weeklyMetric === 'time' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {t('home.mins')}
                </button>
            </div>
          </div>
          <div className="flex items-end justify-between h-24 gap-2 px-1">
            {weeklyPerformance?.data.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                    <div className="relative w-full flex items-end justify-center h-full">
                        <div 
                            className={cn(
                                "w-full rounded-t-sm transition-all duration-500",
                                day.isToday ? "bg-primary" : "bg-muted group-hover:bg-primary/50"
                            )}
                            style={{ height: `${(day.value / (weeklyPerformance.maxValue || 1)) * 100}%` }}
                        ></div>
                        {/* Tooltip-ish value on hover */}
                        <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded">
                            {day.value}
                        </div>
                    </div>
                </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
            {weeklyPerformance?.data.map((day, index) => (
                <span key={index} className={cn(day.isToday && "text-primary font-black")}>
                    {day.day}
                </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
