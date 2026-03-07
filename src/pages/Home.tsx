import { Zap, Dumbbell, Activity, Timer, MoreHorizontal, TrendingUp, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { AddExerciseModal } from '@/components/features/AddExerciseModal';
import { LogEntryModal } from '@/components/features/LogEntryModal';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { startOfDay, endOfDay } from 'date-fns';

export default function HomePage() {
  const { t } = useTranslation();
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  // Fetch exercises from DB
  const exercises = useLiveQuery(() => db.exercises.toArray());

  // Fetch today's logs to calculate stats
  const todayStats = useLiveQuery(async () => {
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());
    
    const logs = await db.logs
      .where('date')
      .between(start, end)
      .toArray();

    let totalReps = 0;
    let totalTime = 0;

    // Get exercises to know units
    const allExercises = await db.exercises.toArray();
    const exerciseMap = new Map(allExercises.map(e => [e.id, e]));

    logs.forEach(log => {
      const exercise = exerciseMap.get(log.exerciseId);
      if (exercise?.unit === 'reps') {
        totalReps += log.value;
      } else if (exercise?.unit === 'seconds') {
        totalTime += log.value;
      }
    });

    return { totalReps, totalTime };
  }, []);

  // Get user settings for goals
  const settings = useLiveQuery(() => db.settings.get(1));

  const dailyGoalReps = settings?.dailyGoalReps || 100;
  const dailyGoalTime = settings?.dailyGoalTime || 600; // 10 mins

  const progressReps = todayStats ? Math.min(100, (todayStats.totalReps / dailyGoalReps) * 100) : 0;
  const progressTime = todayStats ? Math.min(100, (todayStats.totalTime / dailyGoalTime) * 100) : 0;
  
  // Combined progress (simple average for now)
  const totalProgress = Math.round((progressReps + progressTime) / 2);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell': return Dumbbell;
      case 'Activity': return Activity;
      case 'Timer': return Timer;
      default: return Activity;
    }
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
            <h2 className="text-foreground text-lg font-bold leading-tight">Hello!</h2>
            <p className="text-primary text-xs font-semibold flex items-center gap-1">
              <span>🔥</span> 5 days streak
            </p>
          </div>
        </div>
        {/* Bell icon removed */}
      </header>

      <div className="px-4 py-2 space-y-6">
        {/* Daily Goal Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-primary p-6 shadow-xl shadow-primary/10 text-white"
        >
          <div className="flex flex-col items-center">
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col gap-1 z-10">
                <p className="text-white/80 text-sm font-medium">{t('home.dailyGoal')}</p>
                <h3 className="text-2xl font-bold">{totalProgress}% Complete</h3>
                <p className="text-white/80 text-xs mt-2 max-w-[160px]">
                  Keep going! You're doing great today.
                </p>
              </div>
              <div className="relative size-24 flex items-center justify-center">
                <svg className="size-full -rotate-90">
                  <circle className="text-white/10" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-white" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.3" strokeDashoffset={`${251.3 * (1 - totalProgress / 100)}`} strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="size-8 fill-white" />
                </div>
              </div>
            </div>
            
            <div className="w-full mt-8 pt-6 border-t border-white/10 flex justify-between items-center px-8">
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold">{todayStats?.totalReps || 0}</span>
                <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Reps</span>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold">{Math.round((todayStats?.totalTime || 0) / 60)}</span>
                <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Mins</span>
              </div>
            </div>
            {/* View Details button removed */}
          </div>
          {/* Decorative blur */}
          <div className="absolute -right-4 -bottom-4 size-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        </motion.div>

        {/* Quick Add Section */}
        <div>
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-foreground text-lg font-bold tracking-tight">{t('home.quickAdd')}</h2>
            <button className="text-primary text-sm font-semibold hover:text-primary/80">View All</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {exercises?.map((exercise) => {
              const Icon = getIcon(exercise.icon);
              return (
                <motion.button 
                  key={exercise.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedExercise(exercise)}
                  className="group flex flex-col gap-3 p-4 bg-card rounded-xl border border-border text-left transition-all shadow-sm hover:shadow-md"
                >
                  <div className="size-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary" style={{ backgroundColor: `${exercise.color}20`, color: exercise.color }}>
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-foreground text-base font-bold">{exercise.name}</p>
                    <p className="text-muted-foreground text-xs font-medium uppercase">{exercise.unit}</p>
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
              onClick={() => setIsAddExerciseOpen(true)}
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
            <TrendingUp className="size-5 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between h-24 gap-2 px-1">
            <div className="w-full bg-muted rounded-t-sm h-[40%]"></div>
            <div className="w-full bg-muted rounded-t-sm h-[60%]"></div>
            <div className="w-full bg-muted rounded-t-sm h-[30%]"></div>
            <div className="w-full bg-muted rounded-t-sm h-[80%]"></div>
            <div className="w-full bg-primary rounded-t-sm h-[95%]"></div>
            <div className="w-full bg-primary/40 rounded-t-sm h-[45%]"></div>
            <div className="w-full bg-muted rounded-t-sm h-[20%]"></div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
            <span>M</span><span>T</span><span>W</span><span>T</span><span className="text-primary font-black">F</span><span>S</span><span>S</span>
          </div>
        </div>
      </div>

      <AddExerciseModal 
        isOpen={isAddExerciseOpen} 
        onClose={() => setIsAddExerciseOpen(false)} 
      />
      
      <LogEntryModal 
        isOpen={!!selectedExercise} 
        onClose={() => setSelectedExercise(null)} 
        exercise={selectedExercise} 
      />
    </div>
  );
}
