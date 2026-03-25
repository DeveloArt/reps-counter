import { MoreHorizontal, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuickAddSectionProps {
  exercises: any[];
  todayStats: any;
  openLogEntry: (exercise: any) => void;
  openAddExercise: () => void;
}

export function QuickAddSection({
  exercises,
  todayStats,
  openLogEntry,
  openAddExercise,
}: QuickAddSectionProps) {
  const { t } = useTranslation();
  const getIcon = (_iconName: string) => {
    // Icon mapping logic here
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-foreground text-lg font-bold tracking-tight">{t('home.quickAdd')}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {exercises?.map((exercise) => {
          const Icon = getIcon(exercise.icon);
          const dailyTotal = todayStats?.exerciseTotals?.[exercise.id] || 0;
          const displayTotal =
            exercise.unit === 'seconds' ? `${Math.round(dailyTotal / 60)}m` : dailyTotal;

          return (
            <button
              key={exercise.id}
              onClick={() => openLogEntry(exercise)}
              className="group relative flex flex-col gap-3 p-4 bg-card rounded-xl border border-border text-left transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-start w-full">
                <div
                  className="size-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary"
                  style={{ backgroundColor: `${exercise.color}20`, color: exercise.color }}
                >
                  <Icon className="size-6" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  {dailyTotal > 0 && (
                    <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded-full">
                      {displayTotal}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-foreground text-base font-bold">{exercise.name}</p>
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  {exercise.unit === 'reps' ? t('home.reps') : t('home.mins')}
                </p>
              </div>
              <div className="flex items-center justify-center w-full py-2 bg-primary rounded-lg hover:bg-primary/90 active:scale-95 transition-all">
                <Plus className="size-5 text-white" />
              </div>
            </button>
          );
        })}

        <button
          onClick={openAddExercise}
          className="group flex flex-col items-center justify-center gap-2 p-4 bg-muted/50 rounded-xl border-2 border-dashed border-border text-center transition-all hover:bg-muted min-h-[140px]"
        >
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <MoreHorizontal className="size-5" />
          </div>
          <p className="text-muted-foreground text-sm font-bold">{t('home.addExercise')}</p>
        </button>
      </div>
    </div>
  );
}
