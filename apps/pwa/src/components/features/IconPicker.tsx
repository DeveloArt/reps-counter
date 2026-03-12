import { Activity, Dumbbell, Timer } from 'lucide-react';
import type { IconPickerProps } from '@/types/components';

const ICONS = [
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Activity', icon: Activity },
  { name: 'Timer', icon: Timer },
];

export function IconPicker({ selectedIcon, onIconChange }: IconPickerProps) {
  return (
    <div className="flex gap-3">
      {ICONS.map(({ name, icon: Icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => onIconChange(name)}
          className={`size-10 rounded-xl flex items-center justify-center transition-all ${
            selectedIcon === name
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Icon className="size-5" />
        </button>
      ))}
    </div>
  );
}
