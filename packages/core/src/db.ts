import Dexie from 'dexie';
import type { Exercise, Goal, LogEntry, UserSettings } from './types';

export type { Exercise, LogEntry, Goal, UserSettings };

const db = new Dexie('FitCounterDB') as Dexie & {
  exercises: Dexie.Table<Exercise, string>;
  logs: Dexie.Table<LogEntry, string>;
  goals: Dexie.Table<Goal, string>;
  settings: Dexie.Table<UserSettings, number>;
};

db.version(3).stores({
  exercises: 'id, name, isArchived',
  logs: 'id, exerciseId, timestamp, [exerciseId+timestamp]',
  goals: 'id, type, isActive, exerciseId, [exerciseId+isActive]',
  settings: 'id',
});

db.version(2).stores({
  exercises: 'id, name, isArchived',
  logs: 'id, exerciseId, date, timestamp',
  goals: 'id, type, isActive',
  settings: 'id',
});

db.version(1).stores({
  exercises: 'id, name, isArchived',
  logs: 'id, exerciseId, date, timestamp',
  goals: 'id, type, isActive',
  settings: 'id',
});

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
    dailyGoalTime: 600,
    onboardingCompleted: false,
    notificationsEnabled: false,
    notificationFrequency: 1,
    notificationTime: '09:00',
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
      isActive: true,
    },
    {
      id: '2',
      title: 'Weekly Plank',
      type: 'weekly',
      targetValue: 1800,
      exerciseId: '3',
      metric: 'time',
      startDate: new Date(),
      isActive: true,
    },
  ]);
});

export { db };
