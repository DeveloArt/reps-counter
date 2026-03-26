import { Modal } from '@/components/ui/Modal';
import { exercisesApi, goalsApi } from '@/lib/api';
import { handleError } from '@/lib/errorHandler';
import { EXERCISE_ICONS } from '@/lib/iconUtils';
import { cn } from '@/lib/utils';
import { EXERCISE_COLORS, type Exercise } from '@fitcounter/core';
import { Check, Plus, Save, Trash2 } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseToEdit?: Exercise;
}

export function AddExerciseModal({ isOpen, onClose, exerciseToEdit }: AddExerciseModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<'reps' | 'seconds'>('reps');
  const [selectedColor, setSelectedColor] = useState<string>(EXERCISE_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState('Dumbbell');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShowDeleteConfirm(false);
      setError(null);
      if (exerciseToEdit) {
        setName(exerciseToEdit.name);
        setUnit(exerciseToEdit.unit);
        setSelectedColor(exerciseToEdit.color);
        setSelectedIcon(exerciseToEdit.icon);
      } else {
        setName('');
        setUnit('reps');
        setSelectedColor(EXERCISE_COLORS[0]);
        setSelectedIcon('Dumbbell');
      }
    }
  }, [isOpen, exerciseToEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(t('modals.addExercise.nameRequired') || 'Name is required');
      return;
    }

    try {
      if (exerciseToEdit) {
        await exercisesApi.update(exerciseToEdit.id, {
          name: name.trim(),
          unit,
          color: selectedColor,
          icon: selectedIcon,
        });
      } else {
        await exercisesApi.create({
          name: name.trim(),
          unit,
          color: selectedColor,
          icon: selectedIcon,
        });
      }
      onClose();
    } catch (err) {
      const appError = handleError(err, t('common.error'));
      setError(appError.userMessage || appError.message);
    }
  };

  const handleDelete = async () => {
    if (!exerciseToEdit) return;

    try {
      await exercisesApi.archive(exerciseToEdit.id);

      const goals = await goalsApi.getAll();
      const relatedGoals = goals.filter((g) => g.exerciseId === exerciseToEdit.id);
      
      for (const goal of relatedGoals) {
        await goalsApi.update(goal.id, { isActive: false });
      }

      onClose();
    } catch (err) {
      const appError = handleError(err, t('common.error'));
      setError(appError.userMessage || appError.message);
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
            {t('home.confirmDeleteExercise')}
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
      title={
        exerciseToEdit
          ? t('modals.addExercise.editTitle')
          : t('modals.addExercise.title')
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="exercise-name" className="text-sm font-medium text-foreground">
            {t('modals.addExercise.nameLabel')}
          </label>
          <input
            id="exercise-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('modals.addExercise.namePlaceholder')}
            required
            aria-invalid={!!error}
            aria-describedby={error ? 'exercise-error' : undefined}
            className="w-full px-4 py-3 rounded-xl bg-muted border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('modals.addExercise.unitLabel')}
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl" role="group" aria-label={t('modals.addExercise.unitLabel')}>
            <button
              type="button"
              onClick={() => setUnit('reps')}
              aria-pressed={unit === 'reps'}
              className={cn(
                'py-2 rounded-lg text-sm font-bold transition-all',
                unit === 'reps'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('modals.addExercise.reps')}
            </button>
            <button
              type="button"
              onClick={() => setUnit('seconds')}
              aria-pressed={unit === 'seconds'}
              className={cn(
                'py-2 rounded-lg text-sm font-bold transition-all',
                unit === 'seconds'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('modals.addExercise.time')}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('modals.addExercise.iconLabel')}
          </label>
          <div className="flex gap-3" role="group" aria-label={t('modals.addExercise.iconLabel')}>
            {EXERCISE_ICONS.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedIcon(name)}
                aria-label={`Select ${name} icon`}
                aria-pressed={selectedIcon === name}
                className={cn(
                  'size-10 rounded-xl flex items-center justify-center transition-all',
                  selectedIcon === name
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('modals.addExercise.colorLabel')}
          </label>
          <div className="flex flex-wrap gap-3" role="group" aria-label={t('modals.addExercise.colorLabel')}>
            {EXERCISE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
                aria-pressed={selectedColor === color}
                className={cn(
                  'size-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center',
                  selectedColor === color && 'ring-2 ring-offset-2 ring-primary'
                )}
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && <Check className="size-4 text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {exerciseToEdit && (
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
            className="flex-[2] bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {exerciseToEdit ? <Save className="size-5" /> : <Plus className="size-5" />}
            {exerciseToEdit ? t('common.save') : t('modals.addExercise.create')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
