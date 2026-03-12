import { Plus, Save, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ExerciseFormProps } from '@/types/components';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';

export function ExerciseForm({
  name,
  unit,
  selectedColor,
  selectedIcon,
  onNameChange,
  onUnitChange,
  onColorChange,
  onIconChange,
  onSubmit,
  onDelete,
  exerciseToEdit,
}: ExerciseFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {t('modals.addExercise.nameLabel')}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
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
            onClick={() => onUnitChange('reps')}
            className={`py-2 rounded-lg text-sm font-bold transition-all ${
              unit === 'reps'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('modals.addExercise.reps')}
          </button>
          <button
            type="button"
            onClick={() => onUnitChange('seconds')}
            className={`py-2 rounded-lg text-sm font-bold transition-all ${
              unit === 'seconds'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('modals.addExercise.time')}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {t('modals.addExercise.iconLabel')}
        </label>
        <IconPicker selectedIcon={selectedIcon} onIconChange={onIconChange} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {t('modals.addExercise.colorLabel')}
        </label>
        <ColorPicker selectedColor={selectedColor} onColorChange={onColorChange} />
      </div>

      <div className="flex gap-3">
        {exerciseToEdit && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 bg-destructive/10 text-destructive font-bold py-4 rounded-xl hover:bg-destructive/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="size-5" />
            {t('common.delete') || 'Usuń'}
          </button>
        )}
        <button
          type="submit"
          className="flex-[2] bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {exerciseToEdit ? <Save className="size-5" /> : <Plus className="size-5" />}
          {exerciseToEdit ? t('common.save') || 'Zapisz' : t('modals.addExercise.create')}
        </button>
      </div>
    </form>
  );
}
