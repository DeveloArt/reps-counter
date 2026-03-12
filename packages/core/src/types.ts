export interface Exercise {
  id: string;
  name: string;
  unit: 'reps' | 'seconds';
  color: string;
  icon: string;
  isArchived?: boolean;
}

export interface LogEntry {
  id: string;
  exerciseId: string;
  date: Date;
  value: number;
  notes?: string;
  timestamp: number;
}

export interface Goal {
  id: string;
  title: string;
  trigger?: string;
  type: 'daily' | 'weekly' | 'monthly';
  targetValue: number;
  exerciseId?: string;
  metric: 'reps' | 'time' | 'workouts';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface UserSettings {
  id: number;
  theme: 'light' | 'dark' | 'system';
  dailyGoalReps: number;
  dailyGoalTime: number;
  onboardingCompleted: boolean;
  notificationsEnabled?: boolean;
  notificationFrequency?: number;
  notificationTime?: string;
}
