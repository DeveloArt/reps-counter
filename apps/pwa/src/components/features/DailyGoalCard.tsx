import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DailyGoalCardProps {
  totalProgress: number;
  totalReps: number;
  totalTime: number;
}

export function DailyGoalCard({ totalProgress, totalReps, totalTime }: DailyGoalCardProps) {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-6 shadow-xl shadow-primary/10 text-white">
      <div className="flex flex-col items-center">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col gap-1 z-10">
            <p className="text-white/80 text-sm font-medium">{t('home.dailyGoal')}</p>
            <h3 className="text-2xl font-bold">
              {totalProgress}% {t('home.complete')}
            </h3>
            <p className="text-white/80 text-xs mt-2 max-w-[160px]">{t('home.keepGoing')}</p>
          </div>
          <div className="relative size-24 flex items-center justify-center">
            <svg className="size-full -rotate-90">
              <circle
                className="text-white/10"
                cx="48"
                cy="48"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-white"
                cx="48"
                cy="48"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.3"
                strokeDashoffset={`${251.3 * (1 - totalProgress / 100)}`}
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="size-8 fill-white" />
            </div>
          </div>
        </div>

        <div className="w-full mt-8 pt-6 border-t border-white/10 flex justify-between items-center px-8">
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold">{totalReps}</span>
            <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">
              {t('home.reps')}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold">{Math.round(totalTime / 60)}</span>
            <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">
              {t('home.mins')}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 size-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
}
