import { ArrowLeft, Share2, TrendingUp, TrendingDown, Dumbbell, Activity, Timer, Calendar } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const dailyData = [
  { day: 'MON', value: 30 },
  { day: 'TUE', value: 45 },
  { day: 'WED', value: 60 },
  { day: 'THU', value: 40 },
  { day: 'FRI', value: 75 },
  { day: 'SAT', value: 50 },
  { day: 'SUN', value: 45 },
];

const weeklyData = [
  { week: 'W1', value: 40 },
  { week: 'W2', value: 65 },
  { week: 'W3', value: 55 },
  { week: 'W4', value: 85 },
];

export default function StatsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'year'>('week');

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="size-6 text-foreground" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center text-foreground">{t('stats.title')}</h2>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <Share2 className="size-5 text-foreground" />
        </button>
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
            <p className="text-xl font-bold text-foreground">42</p>
          </div>
          <div className="flex flex-col gap-1 p-4 bg-card rounded-xl shadow-sm border border-border">
            <p className="text-muted-foreground text-xs font-medium">{t('stats.avgPerDay')}</p>
            <p className="text-xl font-bold text-foreground">58m</p>
          </div>
          <div className="flex flex-col gap-1 p-4 bg-card rounded-xl shadow-sm border border-border">
            <p className="text-muted-foreground text-xs font-medium">{t('stats.totalVolume')}</p>
            <p className="text-xl font-bold text-foreground">12.4k kg</p>
          </div>
          <div className="flex flex-col gap-1 p-4 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
            <p className="text-primary text-xs font-bold">{t('stats.bestDay')}</p>
            <p className="text-xl font-bold text-primary">Thursday</p>
          </div>
        </div>

        {/* Line Chart Section */}
        <div className="flex flex-col gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
          <div className="flex flex-col gap-1">
            <p className="text-foreground text-base font-semibold">{t('stats.dailyActivity')}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-foreground tracking-tight text-3xl font-bold">452</p>
              <p className="text-emerald-600 text-sm font-medium flex items-center">
                +12% {t('stats.vsLastPeriod')}
              </p>
            </div>
          </div>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
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
          <div className="flex flex-col gap-1">
            <p className="text-foreground text-base font-semibold">{t('stats.weeklyComparison')}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-foreground tracking-tight text-3xl font-bold">+18%</p>
              <p className="text-muted-foreground text-sm font-medium">{t('stats.overallProgress')}</p>
            </div>
          </div>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
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
            {/* Pushups */}
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Dumbbell className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Pushups</p>
                  <p className="text-xs text-muted-foreground">150 {t('stats.repsTotal')}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-emerald-600">
                  <p className="text-sm font-bold">+8.4%</p>
                  <TrendingUp className="size-4" />
                </div>
                <p className="text-xs text-muted-foreground">{t('stats.vsLastPeriod')}</p>
              </div>
            </div>

            {/* Squats */}
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Activity className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Squats</p>
                  <p className="text-xs text-muted-foreground">200 {t('stats.repsTotal')}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-emerald-600">
                  <p className="text-sm font-bold">+10.2%</p>
                  <TrendingUp className="size-4" />
                </div>
                <p className="text-xs text-muted-foreground">{t('stats.vsLastPeriod')}</p>
              </div>
            </div>

            {/* Plank */}
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Timer className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Plank</p>
                  <p className="text-xs text-muted-foreground">15m {t('stats.total')}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-emerald-600">
                  <p className="text-sm font-bold">+5.5%</p>
                  <TrendingUp className="size-4" />
                </div>
                <p className="text-xs text-muted-foreground">{t('stats.vsLastPeriod')}</p>
              </div>
            </div>

            {/* Crunches */}
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Activity className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Crunches</p>
                  <p className="text-xs text-muted-foreground">300 {t('stats.repsTotal')}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-red-600">
                  <p className="text-sm font-bold">-2.1%</p>
                  <TrendingDown className="size-4" />
                </div>
                <p className="text-xs text-muted-foreground">{t('stats.vsLastPeriod')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
