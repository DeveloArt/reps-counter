import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Trash2, Save, Minus, Plus, Calendar, Dumbbell, Timer } from 'lucide-react';
import { db, type Exercise, type LogEntry } from '@/db/db';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface EditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logEntry: LogEntry | null;
  exercise: Exercise | null;
}

export function EditLogModal({ isOpen, onClose, logEntry, exercise }: EditLogModalProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [dateStr, setDateStr] = useState<string>('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  // Sync state with selected log entry
  useEffect(() => {
    if (isOpen && logEntry) {
      setValue(logEntry.value);
      
      // If it's a timed exercise, split value into minutes and seconds
      if (exercise?.unit === 'seconds') {
        setMinutes(Math.floor(logEntry.value / 60));
        setSeconds(logEntry.value % 60);
      }
      
      // Format timestamp for datetime-local input (yyyy-MM-ddTHH:mm)
      const d = new Date(logEntry.timestamp);
      setDateStr(format(d, "yyyy-MM-dd'T'HH:mm"));
      setIsConfirmingDelete(false);
    }
  }, [isOpen, logEntry, exercise]);

  // Update overall value when minutes or seconds change
  useEffect(() => {
    if (exercise?.unit === 'seconds') {
      setValue(minutes * 60 + seconds);
    }
  }, [minutes, seconds, exercise]);

  if (!logEntry || !exercise) return null;

  const handleSave = async () => {
    try {
      const selectedDate = new Date(dateStr);
      if (isNaN(selectedDate.getTime())) {
        alert(t('common.error'));
        return;
      }

      await db.logs.update(logEntry.id, {
        value: Number(value) || 0,
        date: selectedDate,
        timestamp: selectedDate.getTime()
      });

      onClose();
    } catch (error) {
      console.error("Failed to update log:", error);
      alert(t('common.error') + ": " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleDelete = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    try {
      await db.logs.delete(logEntry.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete log:", error);
      alert(t('common.error') + ": " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const increment = () => setValue(prev => prev + 1);
  const decrement = () => setValue(prev => Math.max(0, prev - 1));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('stats.editEntry')}
      className="max-w-[440px] w-full rounded-t-xl sm:rounded-2xl !m-0 sm:!m-auto !bottom-0 sm:!bottom-auto !top-auto sm:!top-1/2 !translate-y-0 sm:!-translate-y-1/2 bg-card"
    >
      <div className="flex flex-col gap-6 px-1">
        {/* Exercise Header */}
        <div className="flex items-center gap-3">
          <div 
            className="size-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary shrink-0" 
            style={{ backgroundColor: `${exercise.color}20`, color: exercise.color }}
          >
            {exercise.unit === 'seconds' ? <Timer className="size-5" /> : <Dumbbell className="size-5" />}
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">{exercise.name}</h4>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              {exercise.unit === 'reps' ? t('home.reps') : t('home.mins')}
            </p>
          </div>
        </div>

        {/* Value inputs */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            {exercise.unit === 'reps' ? <Dumbbell className="size-4 text-muted-foreground" /> : <Timer className="size-4 text-muted-foreground" />}
            {t('stats.amount')}
          </label>
          
          {exercise.unit === 'reps' ? (
            <div className="bg-muted/50 dark:bg-muted/20 rounded-xl p-4 flex items-center justify-between border border-border">
              <button
                type="button"
                onClick={decrement}
                className="size-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all shadow-sm"
              >
                <Minus className="size-5" />
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="text-3xl font-bold text-primary tabular-nums bg-transparent text-center w-[100px] focus:outline-none border-none p-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-sm font-bold text-muted-foreground">{t('home.reps').toLowerCase()}</span>
              </div>
              <button
                type="button"
                onClick={increment}
                className="size-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
              >
                <Plus className="size-5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 bg-muted/50 dark:bg-muted/20 rounded-xl p-4 border border-border">
              <div className="flex flex-col gap-1 items-center">
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    value={minutes}
                    min={0}
                    onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-2xl font-bold text-primary tabular-nums bg-transparent text-center w-12 focus:outline-none border-none p-0"
                  />
                  <span className="text-xs font-bold text-muted-foreground">m</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{t('home.mins')}</span>
              </div>
              <div className="flex flex-col gap-1 items-center border-l border-border">
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    value={seconds}
                    min={0}
                    max={59}
                    onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="text-2xl font-bold text-primary tabular-nums bg-transparent text-center w-12 focus:outline-none border-none p-0"
                  />
                  <span className="text-xs font-bold text-muted-foreground">s</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{t('home.seconds') || "Sekundy"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Date and Time input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            {t('stats.date')}
          </label>
          <input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full rounded-xl border border-border bg-card focus:border-primary focus:ring-primary h-12 text-sm font-medium px-4 text-foreground shadow-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="size-5" />
            {t('common.save')}
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className={`font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                isConfirmingDelete 
                  ? "bg-destructive text-white border-destructive hover:bg-destructive/90" 
                  : "bg-background hover:bg-muted text-destructive border-border"
              }`}
            >
              <Trash2 className="size-5" />
              {isConfirmingDelete ? (t('common.delete') + "?") : t('common.delete')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-muted hover:bg-muted/80 text-foreground font-bold h-12 rounded-xl flex items-center justify-center transition-colors cursor-pointer border border-transparent"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
