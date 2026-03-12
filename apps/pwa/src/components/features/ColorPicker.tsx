import { Check } from 'lucide-react';
import type { ColorPickerProps } from '@/types/components';

const COLORS = [
  '#0D5D5D', // Primary
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorChange(color)}
          className={`size-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${
            selectedColor === color && 'ring-2 ring-offset-2 ring-primary'
          }`}
          style={{ backgroundColor: color }}
        >
          {selectedColor === color && <Check className="size-4 text-white" strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}
