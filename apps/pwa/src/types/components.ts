export interface ExerciseFormProps {
  name: string;
  unit: 'reps' | 'seconds';
  selectedColor: string;
  selectedIcon: string;
  onNameChange: (value: string) => void;
  onUnitChange: (value: 'reps' | 'seconds') => void;
  onColorChange: (value: string) => void;
  onIconChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  exerciseToEdit?: boolean;
}

export interface IconPickerProps {
  selectedIcon: string;
  onIconChange: (value: string) => void;
}

export interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (value: string) => void;
}

export interface Exercise {
  id: string;
  name: string;
  unit: 'reps' | 'seconds';
  color: string;
  icon: string;
  isArchived?: boolean;
}
