import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { db, type Exercise } from '@/db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Target, Calendar, Dumbbell, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddGoalModal({ isOpen, onClose }: AddGoalModalProps) {
  const exercises = useLiveQuery(() => db.exercises.toArray());
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'daily' | 'weekly'>('daily');
  const [targetValue, setTargetValue] = useState<number>(10);
  const [metric, setMetric] = useState<'reps' | 'time'>('reps');
  const [exerciseId, setExerciseId] = useState<string>(''); // Empty for general, or specific ID

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setType('daily');
      setTargetValue(10);
      setMetric('reps');
      setExerciseId('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await db.goals.add({
        id: crypto.randomUUID(),
        title: title || (exerciseId ? `${type === 'daily' ? 'Daily' : 'Weekly'} ${exercises?.find(e => e.id === exerciseId)?.name}` : 'New Goal'),
        type,
        targetValue: metric === 'time' ? targetValue * 60 : targetValue,
        metric,
        exerciseId: exerciseId || undefined,
        startDate: new Date(),
        isActive: true
      });
      onClose();
    } catch (error) {
      console.error("Failed to add goal:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Goal">
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
            <span className="text-xs font-bold uppercase">Daily</span>
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
            <span className="text-xs font-bold uppercase">Weekly</span>
          </button>
        </div>

        {/* Exercise Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Target Exercise (Optional)</label>
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
            <option value="">Any Exercise</option>
            {exercises?.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>

        {/* Metric & Value */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Metric</label>
            <div className="flex bg-muted rounded-xl p-1">
              <button
                type="button"
                onClick={() => setMetric('reps')}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                  metric === 'reps' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                Reps
              </button>
              <button
                type="button"
                onClick={() => setMetric('time')}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                  metric === 'time' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                Time
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Target {metric === 'time' ? '(minutes)' : '(count)'}</label>
            <input
              type="number"
              min="1"
              value={targetValue}
              onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
              className="w-full p-3 rounded-xl bg-muted border-transparent focus:border-primary focus:ring-0 text-foreground font-bold text-center"
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Goal Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Morning Routine"
            className="w-full p-3 rounded-xl bg-muted border-transparent focus:border-primary focus:ring-0 text-foreground"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl mt-2 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Check className="size-5" />
          Create Goal
        </button>
      </form>
    </Modal>
  );
}
