import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Play, Square, Save, Minus, Plus, Edit2, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db, type Exercise } from '@/db/db';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

export function LogEntryModal({ isOpen, onClose, exercise }: LogEntryModalProps) {
  const [value, setValue] = useState<number>(25); // Default value
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState('');
  
  if (!exercise) return null;

  const handleSave = async () => {
    try {
      await db.logs.add({
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
        date: new Date(),
        value: value,
        notes: notes,
        timestamp: Date.now()
      });
      
      onClose();
      setValue(25);
      setIsRunning(false);
      setNotes('');
    } catch (error) {
      console.error("Failed to save log:", error);
    }
  };

  const increment = () => setValue(prev => prev + 1);
  const decrement = () => setValue(prev => Math.max(0, prev - 1));

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="New Entry"
      className="max-w-[600px] w-full rounded-t-xl sm:rounded-xl !m-0 sm:!m-auto !bottom-0 sm:!bottom-auto !top-auto sm:!top-1/2 !translate-y-0 sm:!-translate-y-1/2"
    >
      <div className="flex flex-col h-full">
        {/* Icon & Category */}
        <div className="flex flex-col items-center mb-8 pt-4">
          <div 
            className="size-20 rounded-full flex items-center justify-center mb-3 bg-primary/10"
            style={{ backgroundColor: `${exercise.color}20` }}
          >
            {/* We render the icon in Home.tsx, here we might need a helper or just pass the component. 
                For now, let's assume exercise.icon is a string name and we need to map it, 
                OR we can just use a generic icon if we don't want to duplicate the mapping logic here.
                Actually, let's just use a generic icon for now or pass the icon component from parent if possible.
                But passing component is not serializable if we were using Redux, but here it's props.
                However, exercise from DB has icon string.
            */}
            <div className="text-primary font-bold text-2xl" style={{ color: exercise.color }}>
              {exercise.name.charAt(0)}
            </div>
          </div>
          <h3 className="text-primary text-base font-bold tracking-wide uppercase" style={{ color: exercise.color }}>{exercise.name}</h3>
        </div>

        {exercise.unit === 'reps' ? (
          // Reps Counter View
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-foreground text-xl font-medium mb-6">Repetitions</h1>
            <div className="flex items-center gap-8">
              <button 
                onClick={decrement}
                className="size-14 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary/5 active:scale-95 transition-all"
                style={{ borderColor: `${exercise.color}40`, color: exercise.color }}
              >
                <Minus className="size-8" />
              </button>
              <div className="text-center min-w-[100px]">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="text-7xl font-bold text-foreground tabular-nums bg-transparent text-center w-[180px] focus:outline-none border-none p-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <button 
                onClick={increment}
                className="size-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
                style={{ backgroundColor: exercise.color, boxShadow: `0 10px 15px -3px ${exercise.color}40` }}
              >
                <Plus className="size-8" />
              </button>
            </div>
          </div>
        ) : (
          // Timer View
          <div className="flex flex-col items-center mb-8">
             <div className="bg-primary/5 rounded-2xl p-6 mb-6 flex flex-col items-center w-full">
              <div className="flex gap-4 items-center mb-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-24 items-center justify-center rounded-2xl bg-card shadow-sm border border-primary/10">
                    <span className="text-4xl font-bold text-primary" style={{ color: exercise.color }}>{Math.floor(value / 60).toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-2">Minutes</span>
                </div>
                <span className="text-4xl font-bold text-primary mb-6" style={{ color: exercise.color }}>:</span>
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-24 items-center justify-center rounded-2xl bg-card shadow-sm border border-primary/10">
                    <span className="text-4xl font-bold text-primary" style={{ color: exercise.color }}>{(value % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-2">Seconds</span>
                </div>
              </div>
              
              <div className="flex gap-3 w-full max-w-xs">
                {/* Timer logic would go here, for now just manual entry */}
              </div>
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Edit2 className="size-4" />
                Manual Entry (Seconds)
              </label>
              <input 
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full rounded-xl border-border bg-card focus:border-primary focus:ring-primary h-14 text-lg font-medium px-4 placeholder:text-muted-foreground"
                placeholder="e.g. 60"
              />
            </div>
          </div>
        )}

        {/* Notes Field */}
        <div className="space-y-2 mb-8 w-full">
          <label className="text-sm font-semibold text-muted-foreground ml-1 flex items-center gap-2">
            <FileText className="size-4" />
            Notes (Optional)
          </label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border-border bg-card focus:ring-primary focus:border-primary p-4 text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none" 
            placeholder="How did it feel? Added weight?"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-colors mb-4"
        >
          <CheckCircle className="size-6" />
          Save Workout
        </button>
      </div>
    </Modal>
  );
}
