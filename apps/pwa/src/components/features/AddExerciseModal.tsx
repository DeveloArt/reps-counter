import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { type Exercise, db } from '@fitcounter/core';
import { Activity, Check, Dumbbell, Plus, Save, Timer, Trash2 } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseToEdit?: Exercise;
}

const ICONS = [
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Activity', icon: Activity },
  { name: 'Timer', icon: Timer },
];

const COLORS = [
  '#0D5D5D', // Primary
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

export function AddExerciseModal({ isOpen, onClose, exerciseToEdit }: AddExerciseModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<'reps' | 'seconds'>('reps');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState('Dumbbell');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowDeleteConfirm(false);
      if (exerciseToEdit) {
        setName(exerciseToEdit.name);
        setUnit(exerciseToEdit.unit);
        setSelectedColor(exerciseToEdit.color);
        setSelectedIcon(exerciseToEdit.icon);
      } else {
        setName('');
        setUnit('reps');
        setSelectedColor(COLORS[0]);
        setSelectedIcon('Dumbbell');
      }
    }
  }, [isOpen, exerciseToEdit]);

  // robust ID generator
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (exerciseToEdit) {
        await db.exercises.update(exerciseToEdit.id, {
          name,
          unit,
          color: selectedColor,
          icon: selectedIcon,
        });
      } else {
        await db.exercises.add({
          id: generateId(),
          name,
          unit,
          color: selectedColor,
          icon: selectedIcon,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save exercise:', error);
      alert(`${t('common.error')}: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDelete = async () => {
    if (!exerciseToEdit) return;

    try {
      await db.exercises.update(exerciseToEdit.id, { isArchived: true });

      // Pause goals that depend on this exercise
      const goals = await db.goals.where('exerciseId').equals(exerciseToEdit.id).toArray();
      for (const goal of goals) {
        await db.goals.update(goal.id, { isActive: false });
      }

      onClose();
    } catch (error) {
      console.error('Failed to delete exercise:', error);
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
          <p className="text-muted-foreground text-sm">{t('home.confirmDeleteExercise')}</p>
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
      title={exerciseToEdit ? t('modals.addExercise.editTitle') : t('modals.addExercise.title')}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('modals.addExercise.nameLabel')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('modals.addExercise.namePlaceholder')}
            className="w-full px-4 py-3 rounded-xl bg-muted border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('modals.addExercise.unitLabel')}
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            <button
              type="button"
              onClick={() => setUnit('reps')}
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
          <div className="flex gap-3">
            {ICONS.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedIcon(name)}
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
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
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
