import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Dumbbell, Activity, Timer, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '@/db/db';
import { useTranslation } from 'react-i18next';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function AddExerciseModal({ isOpen, onClose }: AddExerciseModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<'reps' | 'seconds'>('reps');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState('Dumbbell');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await db.exercises.add({
        id: crypto.randomUUID(),
        name,
        unit,
        color: selectedColor,
        icon: selectedIcon
      });
      onClose();
      setName('');
      setUnit('reps');
      setSelectedColor(COLORS[0]);
      setSelectedIcon('Dumbbell');
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.addExercise.title')}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('modals.addExercise.nameLabel')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('modals.addExercise.namePlaceholder')}
            className="w-full px-4 py-3 rounded-xl bg-muted border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('modals.addExercise.unitLabel')}</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            <button
              type="button"
              onClick={() => setUnit('reps')}
              className={cn(
                "py-2 rounded-lg text-sm font-bold transition-all",
                unit === 'reps' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t('modals.addExercise.reps')}
            </button>
            <button
              type="button"
              onClick={() => setUnit('seconds')}
              className={cn(
                "py-2 rounded-lg text-sm font-bold transition-all",
                unit === 'seconds' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t('modals.addExercise.time')}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('modals.addExercise.iconLabel')}</label>
          <div className="flex gap-3">
            {ICONS.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedIcon(name)}
                className={cn(
                  "size-10 rounded-xl flex items-center justify-center transition-all",
                  selectedIcon === name ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('modals.addExercise.colorLabel')}</label>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "size-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center",
                  selectedColor === color && "ring-2 ring-offset-2 ring-primary"
                )}
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && <Check className="size-4 text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="size-5" />
          {t('modals.addExercise.create')}
        </button>
      </form>
    </Modal>
  );
}
