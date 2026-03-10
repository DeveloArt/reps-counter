import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { db, type Exercise } from '@/db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Target, Calendar, Dumbbell, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddGoalModal({ isOpen, onClose }: AddGoalModalProps) {
  const { t } = useTranslation();
  const exercises = useLiveQuery(() => db.exercises.toArray());
  
  const [title, setTitle] = useState('');
  const [trigger, setTrigger] = useState('');
  const [type, setType] = useState<'daily' | 'weekly'>('daily');
  const [targetValue, setTargetValue] = useState<number | ''>(10);
  const [metric, setMetric] = useState<'reps' | 'time'>('reps');
  const [exerciseId, setExerciseId] = useState<string>(''); // Empty for general, or specific ID

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setTrigger('');
      setType('daily');
      setTargetValue(10);
      setMetric('reps');
      setExerciseId('');
    }
  }, [isOpen]);

  // robust ID generator
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let generatedTitle = title;
      if (!generatedTitle) {
        if (exerciseId) {
          const exerciseName = exercises?.find(e => e.id === exerciseId)?.name || '';
          const frequency = type === 'daily' ? t('modals.addGoal.daily') : t('modals.addGoal.weekly');
          generatedTitle = `${frequency} ${exerciseName}`;
        } else {
          generatedTitle = t('modals.addGoal.newGoal');
        }
      }

      const finalTargetValue = Number(targetValue) || 0;

      await db.goals.add({
        id: generateId(),
        title: generatedTitle,
        trigger: trigger || undefined,
        type,
        targetValue: metric === 'time' ? finalTargetValue * 60 : finalTargetValue,
        metric,
        exerciseId: exerciseId || undefined,
        startDate: new Date(),
        isActive: true
      });
      onClose();
    } catch (error) {
      console.error("Failed to add goal:", error);
      alert(t('common.error') + ": " + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.addGoal.title')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Goal Type */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('daily')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
              type === 'daily' ? "bg-primary/5 border-primary text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            <Calendar className="size-6" />
            <span className="text-xs font-bold uppercase">{t('modals.addGoal.daily')}</span>
          </button>
          <button
            type="button"
            onClick={() => setType('weekly')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
              type === 'weekly' ? "bg-primary/5 border-primary text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            <Calendar className="size-6" />
            <span className="text-xs font-bold uppercase">{t('modals.addGoal.weekly')}</span>
          </button>
        </div>

        {/* Trigger (Anchor) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('modals.addGoal.triggerLabel')}</label>
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
          <label className="text-sm font-medium text-foreground">{t('modals.addGoal.targetExercise')}</label>
          <select
            value={exerciseId}
            onChange={(e) => {
              setExerciseId(e.target.value);
              // Auto-set metric based on exercise unit
              const ex = exercises?.find(ex => ex.id === e.target.value);
              if (ex) {
                setMetric(ex.unit === 'seconds' ? 'time' : 'reps');
                setTitle(`${type === 'daily' ? 'Daily' : 'Weekly'} ${ex.name}`);
              }
            }}
            className="w-full p-3 rounded-xl bg-muted border-transparent focus:border-primary focus:ring-0 text-foreground"
          >
            <option value="">{t('modals.addGoal.selectExercise')}</option>
            {exercises?.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>

        {/* Metric & Value */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('modals.addGoal.metric')}</label>
            <div className="flex bg-muted rounded-xl p-1">
              <button
                type="button"
                onClick={() => setMetric('reps')}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                  metric === 'reps' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                {t('home.reps')}
              </button>
              <button
                type="button"
                onClick={() => setMetric('time')}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                  metric === 'time' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                {t('home.mins')}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('modals.addGoal.target')} {metric === 'time' ? `(${t('home.mins')})` : ''}</label>
            <input
              type="number"
              min="1"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
              className="w-full p-3 rounded-xl bg-muted border-transparent focus:border-primary focus:ring-0 text-foreground font-bold text-center"
            />
          </div>
        </div>

        {/* Title (Optional/Auto-generated) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('modals.addGoal.goalTitle')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('modals.addGoal.enterTitle')}
            className="w-full p-3 rounded-xl bg-muted border-transparent focus:border-primary focus:ring-0 text-foreground"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl mt-2 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Check className="size-5" />
          {t('modals.addGoal.create')}
        </button>
      </form>
    </Modal>
  );
}
