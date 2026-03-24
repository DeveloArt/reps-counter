import { Modal } from '@/components/ui/Modal';
import { type Exercise, db } from '@fitcounter/core';
import { Edit2, Minus, Play, Plus, RotateCcw, Save, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  onSaveComplete?: () => void;
}

export function LogEntryModal({ isOpen, onClose, exercise, onSaveComplete }: LogEntryModalProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState<number | ''>(0); // Default value 0
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number>(0);
  const initialValueRef = useRef<number>(0);

  // Reset state when modal opens/closes or exercise changes
  useEffect(() => {
    if (isOpen) {
      setValue(0);
      setIsRunning(false);
    }
  }, [isOpen, exercise]);

  // Wake Lock logic to prevent screen from sleeping
  useEffect(() => {
    let wakeLock: any = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err: any) {
        console.error(`Wake Lock error: ${err.name}, ${err.message}`);
      }
    };

    if (isOpen) {
      requestWakeLock();
    }

    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible' && isOpen) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock !== null) {
        wakeLock.release().catch(console.error);
        wakeLock = null;
      }
    };
  }, [isOpen]);

  // Robust Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      startTimeRef.current = Date.now();
      initialValueRef.current = Number(value) || 0;

      interval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setValue(initialValueRef.current + elapsedSeconds);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]); // Intentionally omitting value to avoid resetting interval

  // robust ID generator
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  };

  if (!exercise) return null;

  const handleSave = async () => {
    try {
      await db.logs.add({
        id: generateId(),
        exerciseId: exercise.id,
        date: new Date(),
        value: Number(value) || 0,
        timestamp: Date.now(),
      });

      // Trigger callback to refresh stats immediately
      onSaveComplete?.();
      onClose();
    } catch (error) {
      console.error('Failed to save log:', error);
      alert(`${t('common.error')}: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const increment = () => setValue((prev) => (Number(prev) || 0) + 1);
  const decrement = () => setValue((prev) => Math.max(0, (Number(prev) || 0) - 1));

  const toggleTimer = () => setIsRunning(!isRunning);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return { minutes, seconds };
  };

  const { minutes, seconds } = formatTime(Number(value) || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('modals.logEntry.title') || exercise.name}
      className="max-w-[600px] w-full rounded-t-xl sm:rounded-xl !m-0 sm:!m-auto !bottom-0 sm:!bottom-auto !top-auto sm:!top-1/2 !translate-y-0 sm:!-translate-y-1/2 bg-background"
    >
      <div className="flex flex-col h-full px-2">
        {/* Header - Custom to match requested design */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="text-2xl font-bold">{exercise.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground">
                {exercise.name}
              </h2>
              <p className="text-sm text-muted-foreground">{t('modals.logEntry.addNewEntry')}</p>
            </div>
          </div>
        </div>

        {exercise.unit === 'reps' ? (
          // Reps Counter View
          <div className="flex flex-col items-center mb-10">
            <div className="bg-primary/5 rounded-2xl p-4 sm:p-8 mb-8 flex flex-col items-center w-full">
              <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6 w-full max-w-full overflow-hidden">
                <button
                  onClick={decrement}
                  className="size-12 sm:size-14 shrink-0 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary/5 active:scale-95 transition-all"
                >
                  <Minus className="size-6 sm:size-8" />
                </button>
                <div className="text-center flex-1 min-w-[80px]">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setValue(val === '' ? '' : Math.max(0, val));
                    }}
                    min="0"
                    className="text-5xl sm:text-7xl font-bold text-primary tabular-nums bg-transparent text-center w-full focus:outline-none border-none p-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-2 block">
                    {t('modals.logEntry.reps')}
                  </span>
                </div>
                <button
                  onClick={increment}
                  className="size-12 sm:size-14 shrink-0 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
                >
                  <Plus className="size-6 sm:size-8" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Timer View
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 mb-8 flex flex-col items-center w-full">
              <div className="flex gap-4 items-center mb-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-24 items-center justify-center rounded-2xl bg-card shadow-sm border border-primary/10">
                    <span className="text-4xl font-bold text-primary">{minutes}</span>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-2">
                    {t('home.mins')}
                  </span>
                </div>
                <span className="text-4xl font-bold text-primary mb-6">:</span>
                <div className="flex flex-col items-center">
                  <div className="flex h-20 w-24 items-center justify-center rounded-2xl bg-card shadow-sm border border-primary/10">
                    <span className="text-4xl font-bold text-primary">{seconds}</span>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-2">
                    {t('home.seconds')}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 w-full max-w-xs">
                <button
                  onClick={toggleTimer}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary h-12 text-white font-bold hover:bg-primary/90 transition-colors"
                >
                  {isRunning ? (
                    <Square className="size-5 fill-current" />
                  ) : (
                    <Play className="size-5" />
                  )}
                  {isRunning ? t('modals.logEntry.stop') : t('modals.logEntry.start')}
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setValue(0);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-muted h-12 text-foreground font-bold hover:bg-muted/80 transition-colors"
                >
                  <RotateCcw className="size-5" />
                  {t('modals.logEntry.reset')}
                </button>
              </div>
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Edit2 className="size-4" />
                {t('modals.logEntry.manualEntry')}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setValue(val === '' ? '' : Math.max(0, val));
                }}
                min="0"
                className="w-full rounded-xl border-border bg-card focus:border-primary focus:ring-primary h-14 text-lg font-medium px-4 placeholder:text-muted-foreground"
                placeholder={t('components.manualEntry.placeholder')}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors mb-4"
        >
          <Save className="size-6" />
          {t('modals.logEntry.saveWorkout')}
        </button>
      </div>
    </Modal>
  );
}
