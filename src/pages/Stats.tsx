import { ArrowLeft, TrendingUp, Dumbbell, Activity, Timer } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { AdBanner } from '@/components/features/AdBanner';
import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { startOfDay, endOfDay, subDays, isSameDay, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears, eachMonthOfInterval, startOfWeek, endOfWeek, format, eachDayOfInterval, subWeeks } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function StatsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'year'>('week');
  const [activityMetric, setActivityMetric] = useState<'reps' | 'time'>('reps');
  const [currentDate, setCurrentDate] = useState(new Date());

  const locale = i18n.language === 'pl' ? pl : enUS;

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

  const stats = useLiveQuery(async () => {
    const exercises = await db.exercises.toArray();
    const logs = await db.logs.toArray();

    // Calculate Totals for the selected period
    let start, end;
    let daysCount = 1;

    if (activeTab === 'week') {
        end = endOfDay(currentDate);
        start = subDays(startOfDay(currentDate), 6);
        daysCount = 7;
    } else if (activeTab === 'month') {
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        daysCount = currentDate.getDate(); // Days elapsed in current month
    } else {
        start = startOfYear(currentDate);
        end = endOfYear(currentDate);
        const diffTime = Math.abs(currentDate.getTime() - start.getTime());
        daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    }

    const periodLogs = logs.filter(l => l.timestamp >= start.getTime() && l.timestamp <= end.getTime());

    let totalReps = 0;
    let totalTime = 0; // seconds

    periodLogs.forEach(l => {
        const ex = exercises.find(e => e.id === l.exerciseId);
        if (ex?.unit === 'reps') totalReps += l.value;
        if (ex?.unit === 'seconds') totalTime += l.value;
    });

    const avgRepsPerDay = Math.round(totalReps / daysCount);
    const avgMinutesPerDay = Math.round((totalTime / 60) / daysCount);
    const totalMinutes = Math.round(totalTime / 60);

    // Data filtering based on activeTab (Existing logic preserved/adapted)
    let dailyData = [];
    let weeklyData = [];
    
    if (activeTab === 'week') {
        const interval = eachDayOfInterval({ start, end });
        dailyData = interval.map(day => {
            const dayStart = startOfDay(day).getTime();
            const dayEnd = endOfDay(day).getTime();
            const dayLogs = logs.filter(l => l.timestamp >= dayStart && l.timestamp <= dayEnd);
            
            const value = dayLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            return { day: format(day, 'EEE', { locale }).toUpperCase(), value: Math.round(value) };
        });

        // Weekly Comparison: Last 4 weeks
        for (let i = 3; i >= 0; i--) {
            const weekStart = startOfWeek(subWeeks(currentDate, i), { weekStartsOn: 1 });
            const weekEnd = endOfWeek(subWeeks(currentDate, i), { weekStartsOn: 1 });
            const weekStartTs = weekStart.getTime();
            const weekEndTs = weekEnd.getTime();
            
            const weekLogs = logs.filter(l => l.timestamp >= weekStartTs && l.timestamp <= weekEndTs);
            const value = weekLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            weeklyData.push({ week: `W${4-i}`, value: Math.round(value) });
        }

    } else if (activeTab === 'month') {
        const interval = eachDayOfInterval({ start, end });
        dailyData = interval.map(day => {
            const dayStart = startOfDay(day).getTime();
            const dayEnd = endOfDay(day).getTime();
            const dayLogs = logs.filter(l => l.timestamp >= dayStart && l.timestamp <= dayEnd);
            
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
            const monthStart = startOfMonth(subMonths(currentDate, i));
            const monthEnd = endOfMonth(subMonths(currentDate, i));
            const monthStartTs = monthStart.getTime();
            const monthEndTs = monthEnd.getTime();

            const monthLogs = logs.filter(l => l.timestamp >= monthStartTs && l.timestamp <= monthEndTs);
            const value = monthLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            weeklyData.push({ week: format(monthStart, 'MMM', { locale }), value: Math.round(value) });
        }

    } else if (activeTab === 'year') {
        const interval = eachMonthOfInterval({ start, end });
        dailyData = interval.map(month => {
            const monthStart = startOfMonth(month).getTime();
            const monthEnd = endOfMonth(month).getTime();
            const monthLogs = logs.filter(l => l.timestamp >= monthStart && l.timestamp <= monthEnd);
            
            const value = monthLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            return { day: format(month, 'MMM', { locale }), value: Math.round(value) };
        });

        // Weekly Comparison: Last 5 years
        for (let i = 4; i >= 0; i--) {
            const yearStart = startOfYear(subYears(currentDate, i));
            const yearEnd = endOfYear(subYears(currentDate, i));
            const yearStartTs = yearStart.getTime();
            const yearEndTs = yearEnd.getTime();

            const yearLogs = logs.filter(l => l.timestamp >= yearStartTs && l.timestamp <= yearEndTs);
            const value = yearLogs.reduce((acc, l) => {
                const ex = exercises.find(e => e.id === l.exerciseId);
                if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
                if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + (l.value / 60);
                return acc;
            }, 0);
            weeklyData.push({ week: format(yearStart, 'yyyy'), value: Math.round(value) });
        }
    }

    return {
        totalReps,
        avgRepsPerDay,
        totalMinutes,
        avgMinutesPerDay,
        dailyData,
        weeklyData
    };
  }, [activeTab, activityMetric, currentDate, locale]);

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
          {/* Reps Section */}
          <div className="flex flex-col gap-3 p-4 bg-card rounded-xl shadow-sm border border-border">
            <div className="flex items-center gap-2 text-primary">
                <Dumbbell className="size-4" />
                <p className="text-sm font-bold">{t('home.reps')}</p>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold text-foreground">{stats?.totalReps?.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground">{t('stats.total')}</p>
            </div>
            <div className="h-px bg-border w-full"></div>
            <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold text-foreground">{stats?.avgRepsPerDay?.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('stats.avgPerDay')}</p>
            </div>
          </div>

          {/* Time Section */}
          <div className="flex flex-col gap-3 p-4 bg-card rounded-xl shadow-sm border border-border">
            <div className="flex items-center gap-2 text-primary">
                <Timer className="size-4" />
                <p className="text-sm font-bold">{t('home.mins')}</p>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold text-foreground">{stats?.totalMinutes?.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground">{t('stats.total')}</p>
            </div>
            <div className="h-px bg-border w-full"></div>
            <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold text-foreground">{stats?.avgMinutesPerDay?.toLocaleString() || 0}m</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('stats.avgPerDay')}</p>
            </div>
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
                        {t('home.reps')}
                    </button>
                    <button 
                        onClick={() => setActivityMetric('time')}
                        className={cn(
                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                            activityMetric === 'time' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {t('home.mins')}
                    </button>
                </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <p className="text-foreground tracking-tight text-3xl font-bold">
                  {stats?.dailyData.reduce((a, b) => a + b.value, 0).toLocaleString()}
              </p>
              <p className="text-muted-foreground text-sm font-medium">
                {t('stats.total')} {activityMetric === 'reps' ? t('home.reps') : t('home.mins')}
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

        {/* Ad Banner pod dzienna aktywnoscia */}
        <AdBanner className="!px-0 mt-2" adSlot="3946895151" />

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
                        {t('home.reps')}
                    </button>
                    <button 
                        onClick={() => setActivityMetric('time')}
                        className={cn(
                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                            activityMetric === 'time' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {t('home.mins')}
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
      </div>
    </div>
  );
}
