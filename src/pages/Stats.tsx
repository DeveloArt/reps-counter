import { ArrowLeft, TrendingUp, Dumbbell, Activity, Timer } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { startOfWeek, endOfWeek, subWeeks, format, eachDayOfInterval, startOfDay, endOfDay, subDays, isSameDay, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears, eachMonthOfInterval } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function StatsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'year'>('week');
  const [activityMetric, setActivityMetric] = useState<'reps' | 'time'>('reps');

  const stats = useLiveQuery(async () => {
    const exercises = await db.exercises.toArray();
    const logs = await db.logs.toArray();

    // Total Exercises
    const totalExercisesCount = exercises.length;

    // Avg Time Per Day (of days with workouts)
    const daysWithWorkouts = new Set(logs.map(l => startOfDay(l.date).toISOString())).size;
    const totalTime = logs.reduce((acc, log) => {
        const ex = exercises.find(e => e.id === log.exerciseId);
        return ex?.unit === 'seconds' ? acc + log.value : acc;
    }, 0);
    const avgTimePerDay = daysWithWorkouts ? Math.round((totalTime / 60) / daysWithWorkouts) : 0;

    // Data filtering based on activeTab
    let dailyData = [];
    let weeklyData = [];
    
    if (activeTab === 'week') {
        // Daily Activity: Last 7 days
        const end = endOfDay(new Date());
        const start = subDays(startOfDay(new Date()), 6);
        const interval = eachDayOfInterval({ start, end });
        
        dailyData = interval.map(day => {
            const dayLogs = logs.filter(l => isSameDay(l.date, day));
            const value = dayLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            return { day: format(day, 'EEE').toUpperCase(), value: Math.round(value) };
        });

        // Weekly Comparison: Last 4 weeks
        for (let i = 3; i >= 0; i--) {
            const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
            const weekEnd = endOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
            const weekLogs = logs.filter(l => l.date >= weekStart && l.date <= weekEnd);
            const value = weekLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            weeklyData.push({ week: `W${4-i}`, value: Math.round(value) });
        }

    } else if (activeTab === 'month') {
        // Daily Activity: Days of current month
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());
        const interval = eachDayOfInterval({ start, end });

        dailyData = interval.map(day => {
            const dayLogs = logs.filter(l => isSameDay(l.date, day));
            const value = dayLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            return { day: format(day, 'd'), value: Math.round(value) };
        });

        // Weekly Comparison: Last 6 months
        for (let i = 5; i >= 0; i--) {
            const monthStart = startOfMonth(subMonths(new Date(), i));
            const monthEnd = endOfMonth(subMonths(new Date(), i));
            const monthLogs = logs.filter(l => l.date >= monthStart && l.date <= monthEnd);
            const value = monthLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            weeklyData.push({ week: format(monthStart, 'MMM'), value: Math.round(value) });
        }

    } else if (activeTab === 'year') {
        // Daily Activity: Months of current year
        const start = startOfYear(new Date());
        const end = endOfYear(new Date());
        const interval = eachMonthOfInterval({ start, end });

        dailyData = interval.map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);
            const monthLogs = logs.filter(l => l.date >= monthStart && l.date <= monthEnd);
            const value = monthLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            return { day: format(month, 'MMM'), value: Math.round(value) };
        });

        // Weekly Comparison: Last 5 years
        for (let i = 4; i >= 0; i--) {
            const yearStart = startOfYear(subYears(new Date(), i));
            const yearEnd = endOfYear(subYears(new Date(), i));
            const yearLogs = logs.filter(l => l.date >= yearStart && l.date <= yearEnd);
            const value = yearLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            weeklyData.push({ week: format(yearStart, 'yyyy'), value: Math.round(value) });
        }
    }

    // Exercise Breakdown
    const exerciseBreakdown = exercises.map(ex => {
        const exLogs = logs.filter(l => l.exerciseId === ex.id);
        const total = exLogs.reduce((acc, l) => acc + l.value, 0);
        return {
            ...ex,
            total
        };
    }).sort((a, b) => b.total - a.total).slice(0, 5);

    return {
        totalExercisesCount,
        avgTimePerDay,
        dailyData,
        weeklyData,
        exerciseBreakdown
    };
  }, [activeTab, activityMetric]);

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-6 text-foreground" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center text-foreground">{t('stats.title')}</h2>
        <div className="size-10"></div> {/* Spacer for removed share button */}
      </div>

      {/* Navigation Tabs */}
      <div className="pb-3 sticky top-16 bg-background z-10">
        <div className="flex border-b border-border px-4 justify-between">
          <button 
            onClick={() => setActiveTab('week')}
            className={cn(
              "flex flex-col items-center justify-center pb-[13px] pt-4 flex-1 transition-colors",
              activeTab === 'week' ? "text-primary border-b-[3px] border-primary" : "border-b-[3px] border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="text-sm font-bold">{t('stats.week')}</span>
          </button>
          <button 
            onClick={() => setActiveTab('month')}
            className={cn(
              "flex flex-col items-center justify-center pb-[13px] pt-4 flex-1 transition-colors",
              activeTab === 'month' ? "text-primary border-b-[3px] border-primary" : "border-b-[3px] border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="text-sm font-bold">{t('stats.month')}</span>
          </button>
          <button 
            onClick={() => setActiveTab('year')}
            className={cn(
              "flex flex-col items-center justify-center pb-[13px] pt-4 flex-1 transition-colors",
              activeTab === 'year' ? "text-primary border-b-[3px] border-primary" : "border-b-[3px] border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="text-sm font-bold">{t('stats.year')}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 px-4 py-6">
        {/* Key Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-4 bg-card rounded-xl shadow-sm border border-border">
            <p className="text-muted-foreground text-xs font-medium">{t('stats.totalExercises')}</p>
            <p className="text-xl font-bold text-foreground">{stats?.totalExercisesCount || 0}</p>
          </div>
          <div className="flex flex-col gap-1 p-4 bg-card rounded-xl shadow-sm border border-border">
            <p className="text-muted-foreground text-xs font-medium">{t('stats.avgPerDay')}</p>
            <p className="text-xl font-bold text-foreground">{stats?.avgTimePerDay || 0}m</p>
          </div>
        </div>

        {/* Daily Activity Chart Section */}
        <div className="flex flex-col gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <p className="text-foreground text-base font-semibold">{t('stats.dailyActivity')}</p>
                <div className="flex bg-muted rounded-lg p-1">
                    <button 
                        onClick={() => setActivityMetric('reps')}
                        className={cn(
                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                            activityMetric === 'reps' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Reps
                    </button>
                    <button 
                        onClick={() => setActivityMetric('time')}
                        className={cn(
                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                            activityMetric === 'time' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Mins
                    </button>
                </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <p className="text-foreground tracking-tight text-3xl font-bold">
                  {stats?.dailyData.reduce((a, b) => a + b.value, 0).toLocaleString()}
              </p>
              <p className="text-muted-foreground text-sm font-medium">
                {t('stats.total')} {activityMetric === 'reps' ? 'Reps' : 'Mins'}
              </p>
            </div>
          </div>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.dailyData || []}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  itemStyle={{ color: 'var(--color-foreground)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10, fontWeight: 'bold' }} 
                  dy={10}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Section */}
        <div className="flex flex-col gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <p className="text-foreground text-base font-semibold">{t('stats.weeklyComparison')}</p>
                <div className="flex bg-muted rounded-lg p-1">
                    <button 
                        onClick={() => setActivityMetric('reps')}
                        className={cn(
                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                            activityMetric === 'reps' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Reps
                    </button>
                    <button 
                        onClick={() => setActivityMetric('time')}
                        className={cn(
                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                            activityMetric === 'time' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Mins
                    </button>
                </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-foreground tracking-tight text-3xl font-bold">
                  {stats?.weeklyData[stats.weeklyData.length - 1]?.value > stats?.weeklyData[stats.weeklyData.length - 2]?.value ? '+' : ''}
                  {stats?.weeklyData[stats.weeklyData.length - 1]?.value && stats?.weeklyData[stats.weeklyData.length - 2]?.value 
                    ? Math.round(((stats.weeklyData[stats.weeklyData.length - 1].value - stats.weeklyData[stats.weeklyData.length - 2].value) / stats.weeklyData[stats.weeklyData.length - 2].value) * 100) 
                    : 0}%
              </p>
              <p className="text-muted-foreground text-sm font-medium">{t('stats.overallProgress')}</p>
            </div>
          </div>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.weeklyData || []}>
                <Bar 
                  dataKey="value" 
                  fill="var(--color-primary)" 
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.8}
                />
                <XAxis 
                  dataKey="week" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10, fontWeight: 'bold' }} 
                  dy={10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exercise Breakdown */}
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground text-lg font-bold leading-tight tracking-tight">{t('stats.perExerciseBreakdown')}</h3>
          <div className="flex flex-col gap-2">
            {stats?.exerciseBreakdown.map((ex) => {
                const Icon = ex.icon === 'Dumbbell' ? Dumbbell : ex.icon === 'Timer' ? Timer : Activity;
                return (
                    <div key={ex.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary" style={{ backgroundColor: `${ex.color}20`, color: ex.color }}>
                        <Icon className="size-6" />
                        </div>
                        <div>
                        <p className="text-sm font-bold text-foreground">{ex.name}</p>
                        <p className="text-xs text-muted-foreground">{ex.total} {ex.unit === 'seconds' ? 'seconds' : 'reps'}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-emerald-600">
                        <p className="text-sm font-bold">{t('stats.active')}</p>
                        <TrendingUp className="size-4" />
                        </div>
                    </div>
                    </div>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
