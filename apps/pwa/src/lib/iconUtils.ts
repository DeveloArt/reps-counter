import { Activity, Dumbbell, Timer } from 'lucide-react';

export const EXERCISE_ICONS = [
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Activity', icon: Activity },
  { name: 'Timer', icon: Timer },
] as const;

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Dumbbell':
      return Dumbbell;
    case 'Activity':
      return Activity;
    case 'Timer':
      return Timer;
    default:
      return Activity;
  }
};
