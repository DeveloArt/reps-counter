import { Modal } from '@/components/ui/Modal';
import { type Exercise, db } from '@fitcounter/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { Activity, Dumbbell, Plus, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onAddNew: () => void;
}

export function QuickLogModal({ isOpen, onClose, onSelectExercise, onAddNew }: QuickLogModalProps) {
  const { t } = useTranslation();
  const exercises = useLiveQuery(() => db.exercises.filter((e) => !e.isArchived).toArray());

  const getIcon = (iconName: string) => {
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('nav.logWorkout')}
      className="max-w-[480px]"
    >
      <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
        {exercises?.map((exercise) => {
          const Icon = getIcon(exercise.icon);
          return (
            <button
              key={exercise.id}
              onClick={() => {
                onSelectExercise(exercise);
                onClose();
              }}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-center"
            >
              <div
                className="size-12 rounded-full flex items-center justify-center bg-primary/10 text-primary"
                style={{ backgroundColor: `${exercise.color}20`, color: exercise.color }}
              >
                <Icon className="size-6" />
              </div>
              <div>
                <span className="block font-bold text-foreground text-sm">{exercise.name}</span>
                <span className="block text-xs text-muted-foreground uppercase mt-0.5">
                  {exercise.unit === 'reps' ? t('home.reps') : t('home.mins')}
                </span>
              </div>
            </button>
          );
        })}

        <button
          onClick={() => {
            onAddNew();
            onClose();
          }}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted transition-colors min-h-[120px]"
        >
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Plus className="size-5" />
          </div>
          <span className="text-xs font-bold text-muted-foreground">{t('home.addExercise')}</span>
        </button>
      </div>
    </Modal>
  );
}
