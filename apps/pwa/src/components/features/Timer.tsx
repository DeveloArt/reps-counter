import { Play, RotateCcw, Square } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface TimerProps {
  value: number;
  onChange: (value: number) => void;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function Timer({ value, onChange, isRunning, onToggle, onReset }: TimerProps) {
  const startTimeRef = useRef<number>(0);
  const initialValueRef = useRef<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      startTimeRef.current = Date.now();
      initialValueRef.current = value;

      interval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        onChange(initialValueRef.current + elapsedSeconds);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, onChange]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return { minutes, seconds };
  };

  const { minutes, seconds } = formatTime(value);

  return (
    <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 mb-8 flex flex-col items-center w-full">
      <div className="flex gap-4 items-center mb-6">
        <div className="flex flex-col items-center">
          <div className="flex h-20 w-24 items-center justify-center rounded-2xl bg-card shadow-sm border border-primary/10">
            <span className="text-4xl font-bold text-primary">{minutes}</span>
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-2">
            Minutes
          </span>
        </div>
        <span className="text-4xl font-bold text-primary mb-6">:</span>
        <div className="flex flex-col items-center">
          <div className="flex h-20 w-24 items-center justify-center rounded-2xl bg-card shadow-sm border border-primary/10">
            <span className="text-4xl font-bold text-primary">{seconds}</span>
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-2">
            Seconds
          </span>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary h-12 text-white font-bold hover:bg-primary/90 transition-colors"
        >
          {isRunning ? <Square className="size-5 fill-current" /> : <Play className="size-5" />}
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-muted h-12 text-foreground font-bold hover:bg-muted/80 transition-colors"
        >
          <RotateCcw className="size-5" />
          Reset
        </button>
      </div>
    </div>
  );
}
