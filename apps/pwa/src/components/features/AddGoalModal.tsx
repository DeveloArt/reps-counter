import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { type Goal, db } from '@fitcounter/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar, Check, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: Goal;
}

export function AddGoalModal({ isOpen, onClose, goalToEdit }: AddGoalModalProps) {
  const { t } = useTranslation();
  const exercises = useLiveQuery(() => db.exercises.filter((e) => !e.isArchived).toArray());

  const [title, setTitle] = useState('');
  const [trigger, setTrigger] = useState('');
  const [type, setType] = useState<'daily' | 'weekly'>('daily');
  const [targetValue, setTargetValue] = useState<number | ''>(10);
  const [metric, setMetric] = useState<'reps' | 'time' | 'workouts'>('reps');
  const [exerciseId, setExerciseId] = useState<string>(''); // Empty for general, or specific ID
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setShowDeleteConfirm(false);
      if (goalToEdit) {
        setTitle(goalToEdit.title);
        setTrigger(goalToEdit.trigger || '');
        setType(goalToEdit.type as 'daily' | 'weekly');
        setTargetValue(
          goalToEdit.metric === 'time' ? goalToEdit.targetValue / 60 : goalToEdit.targetValue
        );
        setMetric(goalToEdit.metric);
        setExerciseId(goalToEdit.exerciseId || '');
      } else {
        setTitle('');
        setTrigger('');
        setType('daily');
        setTargetValue(10);
        setMetric('reps');
        setExerciseId('');
      }
    }
  }, [isOpen, goalToEdit]);

  // robust ID generator
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let generatedTitle = title;
      if (!generatedTitle) {
        if (exerciseId) {
          const exerciseName = exercises?.find((e) => e.id === exerciseId)?.name || '';
          const frequency =
            type === 'daily' ? t('modals.addGoal.daily') : t('modals.addGoal.weekly');
          generatedTitle = `${frequency} ${exerciseName}`;
        } else {
          generatedTitle = t('modals.addGoal.newGoal');
        }
      }

      const finalTargetValue = Number(targetValue) || 0;

      if (goalToEdit) {
        await db.goals.update(goalToEdit.id, {
          title: generatedTitle,
          trigger: trigger || undefined,
          type,
          targetValue: metric === 'time' ? finalTargetValue * 60 : finalTargetValue,
          metric,
          exerciseId: exerciseId || undefined,
          isActive: true, // Re-activate if it was paused
        });
      } else {
        await db.goals.add({
          id: generateId(),
          title: generatedTitle,
          trigger: trigger || undefined,
          type,
          targetValue: metric === 'time' ? finalTargetValue * 60 : finalTargetValue,
          metric,
          exerciseId: exerciseId || undefined,
          startDate: new Date(),
          isActive: true,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save goal:', error);
      alert(`${t('common.error')}: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDelete = async () => {
    if (!goalToEdit) return;

    try {
      await db.goals.delete(goalToEdit.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      alert(`${t('common.error')}: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (showDeleteConfirm) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setShowDeleteConfirm(false)}
        title={`${t('common.delete')}?`}
      >
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">
            {t('goals.confirmDelete')}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 rounded-xl bg-muted py-3 text-sm font-bold text-foreground hover:bg-muted/80 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              {t('common.delete')}
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? String(t('modals.addGoal.editTitle')) : String(t('modals.addGoal.title'))}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Goal Type */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('daily')}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
              type === 'daily'
                ? 'bg-primary/5 border-primary text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-muted'
            )}
          >
            <Calendar className="size-6" />
            <span className="text-xs font-bold uppercase">{t('modals.addGoal.daily')}</span>
          </button>
          <button
            type="button"
            onClick={() => setType('weekly')}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
              type === 'weekly'
                ? 'bg-primary/5 border-primary text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-muted'
            )}
          >
            <Calendar className="size-6" />
            <span className="text-xs font-bold uppercase">{t('modals.addGoal.weekly')}</span>
          </button>
        </div>

        {/* Trigger (Anchor) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('modals.addGoal.triggerLabel')}
          </label>
          <input
            type="text"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            placeholder={t('modals.addGoal.triggerPlaceholder')}
            className="w-full p-3 rounded-xl bg-muted border-transparent focus:border-primary focus:ring-0 text-foreground"
          />
        </div>

        {/* Exercise Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('modals.addGoal.targetExercise')}
          </label>
          <select
            value={exerciseId}
            onChange={(e) => {
              setExerciseId(e.target.value);
              // Auto-set metric based on exercise unit
              const ex = exercises?.find((ex) => ex.id === e.target.value);
              if (ex) {
                setMetric(ex.unit === 'seconds' ? 'time' : 'reps');
                const frequency = type === 'daily' ? t('modals.addGoal.daily') : t('modals.addGoal.weekly');
                setTitle(`${frequency} ${ex.name}`);
              }
            }}
            className="w-full p-3 rounded-xl bg-muted border-transparent focus:border-primary focus:ring-0 text-foreground"
          >
            <option value="">{t('modals.addGoal.selectExercise')}</option>
            {exercises?.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        {/* Metric & Value */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('modals.addGoal.metric')}
            </label>
            <div className="flex bg-muted rounded-xl p-1">
              <button
                type="button"
                onClick={() => setMetric('reps')}
                className={cn(
                  'flex-1 py-2 rounded-lg text-xs font-bold transition-all',
                  metric === 'reps' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                )}
              >
                {t('home.reps')}
              </button>
              <button
                type="button"
                onClick={() => setMetric('time')}
                className={cn(
                  'flex-1 py-2 rounded-lg text-xs font-bold transition-all',
                  metric === 'time' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                )}
              >
                {t('home.mins')}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('modals.addGoal.target')} {metric === 'time' ? `(${t('home.mins')})` : ''}
            </label>
            <input
              type="number"
              min="1"
              value={targetValue}
              onChange={(e) =>
                setTargetValue(
                  e.target.value === '' ? '' : Number.parseInt(e.target.value, 10) || 0
                )
              }
              className="w-full p-3 rounded-xl bg-muted border-transparent focus:border-primary focus:ring-0 text-foreground font-bold text-center"
            />
          </div>
        </div>

        {/* Title (Optional/Auto-generated) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('modals.addGoal.goalTitle')}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('modals.addGoal.enterTitle')}
            className="w-full p-3 rounded-xl bg-muted border-transparent focus:border-primary focus:ring-0 text-foreground"
          />
        </div>

        <div className="flex gap-3 mt-2">
          {goalToEdit && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 bg-destructive/10 text-destructive font-bold py-4 rounded-xl hover:bg-destructive/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="size-5" />
              {t('common.delete')}
            </button>
          )}
          <button
            type="submit"
            className="flex-[2] bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            {goalToEdit ? <Save className="size-5" /> : <Check className="size-5" />}
            {goalToEdit ? t('common.save') : t('modals.addGoal.create')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
