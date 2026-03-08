import { Dexie, type EntityTable } from 'dexie';

interface Exercise {
  id: string;
  name: string;
  unit: 'reps' | 'seconds';
  color: string;
  icon: string;
  isArchived?: boolean;
}

interface LogEntry {
  id: string;
  exerciseId: string;
  date: Date;
  value: number; // reps or seconds
  notes?: string;
  timestamp: number;
}

interface Goal {
  id: string;
  title: string;
  trigger?: string; // The "When [X]" part of the habit
  type: 'daily' | 'weekly' | 'monthly';
  targetValue: number;
  exerciseId?: string; // If specific to an exercise
  metric: 'reps' | 'time' | 'workouts'; // 'time' in seconds
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

interface UserSettings {
  id: number;
  theme: 'light' | 'dark' | 'system';
  dailyGoalReps: number;
  dailyGoalTime: number; // seconds
  onboardingCompleted: boolean;
}

const db = new Dexie('FitCounterDB') as Dexie & {
  exercises: EntityTable<Exercise, 'id'>;
  logs: EntityTable<LogEntry, 'id'>;
  goals: EntityTable<Goal, 'id'>;
  settings: EntityTable<UserSettings, 'id'>;
};

db.version(2).stores({
  exercises: 'id, name, isArchived',
  logs: 'id, exerciseId, date, timestamp',
  goals: 'id, type, isActive',
  settings: 'id'
}).upgrade(tx => {
  // Upgrade existing goals to have a default trigger if needed, or just leave it undefined
});

db.version(1).stores({
  exercises: 'id, name, isArchived',
  logs: 'id, exerciseId, date, timestamp',
  goals: 'id, type, isActive',
  settings: 'id'
});

// Seed initial data if empty
db.on('populate', async () => {
  await db.exercises.bulkAdd([
    { id: '1', name: 'Pushups', unit: 'reps', color: '#0D5D5D', icon: 'Dumbbell' },
    { id: '2', name: 'Squats', unit: 'reps', color: '#10B981', icon: 'Activity' },
    { id: '3', name: 'Plank', unit: 'seconds', color: '#147A7A', icon: 'Timer' },
  ]);
  
  await db.settings.add({
    id: 1,
    theme: 'system',
    dailyGoalReps: 100,
    dailyGoalTime: 600, // 10 mins
    onboardingCompleted: false
  });

  await db.goals.bulkAdd([
    {
      id: '1',
      title: 'Daily Pushups',
      type: 'daily',
      targetValue: 50,
      exerciseId: '1',
      metric: 'reps',
      startDate: new Date(),
      isActive: true
    },
    {
      id: '2',
      title: 'Weekly Plank',
      type: 'weekly',
      targetValue: 1800, // 30 mins
      exerciseId: '3',
      metric: 'time',
      startDate: new Date(),
      isActive: true
    }
  ]);
});

export { db };
export type { Exercise, LogEntry, Goal, UserSettings };
