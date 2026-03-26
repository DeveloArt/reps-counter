export const ICON_NAMES = ['Dumbbell', 'Activity', 'Timer'] as const;

export const EXERCISE_COLORS = [
  '#0D5D5D',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
] as const;

export type IconName = typeof ICON_NAMES[number];
export type ExerciseColor = typeof EXERCISE_COLORS[number];
