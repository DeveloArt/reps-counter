import { Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RepsCounterProps {
  value: number | '';
  onChange: (value: number | '') => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function RepsCounter({ value, onChange, onIncrement, onDecrement }: RepsCounterProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-primary/5 rounded-2xl p-4 sm:p-8 mb-8 flex flex-col items-center w-full">
      <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6 w-full max-w-full overflow-hidden">
        <button
          onClick={onDecrement}
          className="size-12 sm:size-14 shrink-0 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary/5 active:scale-95 transition-all"
        >
          <Minus className="size-6 sm:size-8" />
        </button>
        <div className="text-center min-w-[80px] flex-shrink">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            className="text-5xl sm:text-7xl font-bold text-primary tabular-nums bg-transparent text-center w-full max-w-[150px] sm:w-[180px] focus:outline-none border-none p-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-2 block">
            {t('home.reps')}
          </span>
        </div>
        <button
          onClick={onIncrement}
          className="size-12 sm:size-14 shrink-0 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
        >
          <Plus className="size-6 sm:size-8" />
        </button>
      </div>
    </div>
  );
}
