import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';
import type { Exercise, Goal, LogEntry, UserSettings } from './types';

export type { Exercise, LogEntry, Goal, UserSettings };

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('fitcounter.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      unit TEXT NOT NULL,
      color TEXT NOT NULL,
      icon TEXT NOT NULL,
      isArchived INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY NOT NULL,
      exerciseId TEXT NOT NULL,
      date TEXT NOT NULL,
      value INTEGER NOT NULL,
      notes TEXT,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      trigger TEXT,
      type TEXT NOT NULL,
      targetValue INTEGER NOT NULL,
      exerciseId TEXT,
      metric TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT,
      isActive INTEGER DEFAULT 1,
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY NOT NULL,
      theme TEXT NOT NULL DEFAULT 'system',
      dailyGoalReps INTEGER NOT NULL DEFAULT 100,
      dailyGoalTime INTEGER NOT NULL DEFAULT 600,
      onboardingCompleted INTEGER NOT NULL DEFAULT 0,
      notificationsEnabled INTEGER DEFAULT 0,
      notificationFrequency INTEGER DEFAULT 1,
      notificationTime TEXT DEFAULT '09:00'
    );
  `);

  const existingSettings = await db.getFirstAsync<UserSettings>(
    'SELECT * FROM settings WHERE id = 1'
  );
  if (!existingSettings) {
    await db.runAsync(
      'INSERT INTO settings (id, theme, dailyGoalReps, dailyGoalTime, onboardingCompleted, notificationsEnabled, notificationFrequency, notificationTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [1, 'system', 100, 600, 0, 0, 1, '09:00']
    );

    await db.runAsync(
      'INSERT INTO exercises (id, name, unit, color, icon) VALUES (?, ?, ?, ?, ?)',
      ['1', 'Pushups', 'reps', '#0D5D5D', 'Dumbbell']
    );
    await db.runAsync(
      'INSERT INTO exercises (id, name, unit, color, icon) VALUES (?, ?, ?, ?, ?)',
      ['2', 'Squats', 'reps', '#10B981', 'Activity']
    );
    await db.runAsync(
      'INSERT INTO exercises (id, name, unit, color, icon) VALUES (?, ?, ?, ?, ?)',
      ['3', 'Plank', 'seconds', '#147A7A', 'Timer']
    );

    await db.runAsync(
      'INSERT INTO goals (id, title, type, targetValue, exerciseId, metric, startDate, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['1', 'Daily Pushups', 'daily', 50, '1', 'reps', new Date().toISOString(), 1]
    );
    await db.runAsync(
      'INSERT INTO goals (id, title, type, targetValue, exerciseId, metric, startDate, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['2', 'Weekly Plank', 'weekly', 1800, '3', 'time', new Date().toISOString(), 1]
    );
  }

  return db;
}

export async function getExercises(): Promise<Exercise[]> {
  const database = await initDatabase();
  const result = await database.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE isArchived = 0'
  );
  return result;
}

export async function getExercise(id: string): Promise<Exercise | null> {
  const database = await initDatabase();
  const result = await database.getFirstAsync<Exercise>('SELECT * FROM exercises WHERE id = ?', [
    id,
  ]);
  return result || null;
}

export async function addExercise(exercise: Omit<Exercise, 'id'>): Promise<string> {
  const database = await initDatabase();
  const id = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Date.now().toString()
  );
  const shortId = id.substring(0, 8);

  await database.runAsync(
    'INSERT INTO exercises (id, name, unit, color, icon, isArchived) VALUES (?, ?, ?, ?, ?, ?)',
    [shortId, exercise.name, exercise.unit, exercise.color, exercise.icon, 0]
  );

  return shortId;
}

export async function updateExercise(id: string, exercise: Partial<Exercise>): Promise<void> {
  const database = await initDatabase();
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (exercise.name !== undefined) {
    fields.push('name = ?');
    values.push(exercise.name);
  }
  if (exercise.unit !== undefined) {
    fields.push('unit = ?');
    values.push(exercise.unit);
  }
  if (exercise.color !== undefined) {
    fields.push('color = ?');
    values.push(exercise.color);
  }
  if (exercise.icon !== undefined) {
    fields.push('icon = ?');
    values.push(exercise.icon);
  }
  if (exercise.isArchived !== undefined) {
    fields.push('isArchived = ?');
    values.push(exercise.isArchived ? 1 : 0);
  }

  if (fields.length > 0) {
    values.push(id);
    await database.runAsync(`UPDATE exercises SET ${fields.join(', ')} WHERE id = ?`, values);
  }
}

export async function deleteExercise(id: string): Promise<void> {
  const database = await initDatabase();
  await database.runAsync('UPDATE exercises SET isArchived = 1 WHERE id = ?', [id]);
}

export async function getLogs(exerciseId?: string): Promise<LogEntry[]> {
  const database = await initDatabase();
  if (exerciseId) {
    return database.getAllAsync<LogEntry>(
      'SELECT * FROM logs WHERE exerciseId = ? ORDER BY timestamp DESC',
      [exerciseId]
    );
  }
  return database.getAllAsync<LogEntry>('SELECT * FROM logs ORDER BY timestamp DESC');
}

export async function getLogsByDate(date: string): Promise<LogEntry[]> {
  const database = await initDatabase();
  return database.getAllAsync<LogEntry>('SELECT * FROM logs WHERE date = ?', [date]);
}

export async function getLogsForWeek(startDate: string, endDate: string): Promise<LogEntry[]> {
  const database = await initDatabase();
  return database.getAllAsync<LogEntry>(
    'SELECT * FROM logs WHERE date >= ? AND date <= ? ORDER BY date ASC',
    [startDate, endDate]
  );
}

export async function addLog(log: Omit<LogEntry, 'id'>): Promise<string> {
  const database = await initDatabase();
  const id = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Date.now().toString() + Math.random()
  );
  const shortId = id.substring(0, 12);

  await database.runAsync(
    'INSERT INTO logs (id, exerciseId, date, value, notes, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
    [
      shortId,
      log.exerciseId,
      log.date instanceof Date ? log.date.toISOString().split('T')[0] : log.date,
      log.value,
      log.notes || null,
      log.timestamp,
    ]
  );

  return shortId;
}

export async function deleteLog(id: string): Promise<void> {
  const database = await initDatabase();
  await database.runAsync('DELETE FROM logs WHERE id = ?', [id]);
}

export async function getGoals(): Promise<Goal[]> {
  const database = await initDatabase();
  const result = await database.getAllAsync<Goal>('SELECT * FROM goals');
  return result.map((g) => ({ ...g, isActive: Boolean(g.isActive) }));
}

export async function getGoal(id: string): Promise<Goal | null> {
  const database = await initDatabase();
  const result = await database.getFirstAsync<Goal>('SELECT * FROM goals WHERE id = ?', [id]);
  return result ? { ...result, isActive: Boolean(result.isActive) } : null;
}

export async function addGoal(goal: Omit<Goal, 'id'>): Promise<string> {
  const database = await initDatabase();
  const id = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${Date.now().toString()}goal`
  );
  const shortId = id.substring(0, 8);

  await database.runAsync(
    'INSERT INTO goals (id, title, trigger, type, targetValue, exerciseId, metric, startDate, endDate, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      shortId,
      goal.title,
      goal.trigger || null,
      goal.type,
      goal.targetValue,
      goal.exerciseId || null,
      goal.metric,
      goal.startDate instanceof Date ? goal.startDate.toISOString() : goal.startDate,
      goal.endDate
        ? goal.endDate instanceof Date
          ? goal.endDate.toISOString()
          : goal.endDate
        : null,
      goal.isActive ? 1 : 0,
    ]
  );

  return shortId;
}

export async function updateGoal(id: string, goal: Partial<Goal>): Promise<void> {
  const database = await initDatabase();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (goal.title !== undefined) {
    fields.push('title = ?');
    values.push(goal.title);
  }
  if (goal.trigger !== undefined) {
    fields.push('trigger = ?');
    values.push(goal.trigger || null);
  }
  if (goal.type !== undefined) {
    fields.push('type = ?');
    values.push(goal.type);
  }
  if (goal.targetValue !== undefined) {
    fields.push('targetValue = ?');
    values.push(goal.targetValue);
  }
  if (goal.exerciseId !== undefined) {
    fields.push('exerciseId = ?');
    values.push(goal.exerciseId || null);
  }
  if (goal.metric !== undefined) {
    fields.push('metric = ?');
    values.push(goal.metric);
  }
  if (goal.startDate !== undefined) {
    fields.push('startDate = ?');
    values.push(goal.startDate instanceof Date ? goal.startDate.toISOString() : goal.startDate);
  }
  if (goal.endDate !== undefined) {
    fields.push('endDate = ?');
    values.push(
      goal.endDate
        ? goal.endDate instanceof Date
          ? goal.endDate.toISOString()
          : goal.endDate
        : null
    );
  }
  if (goal.isActive !== undefined) {
    fields.push('isActive = ?');
    values.push(goal.isActive ? 1 : 0);
  }

  if (fields.length > 0) {
    values.push(id);
    await database.runAsync(`UPDATE goals SET ${fields.join(', ')} WHERE id = ?`, values);
  }
}

export async function deleteGoal(id: string): Promise<void> {
  const database = await initDatabase();
  await database.runAsync('DELETE FROM goals WHERE id = ?', [id]);
}

export async function getSettings(): Promise<UserSettings | null> {
  const database = await initDatabase();
  const result = await database.getFirstAsync<UserSettings>('SELECT * FROM settings WHERE id = 1');
  return result
    ? {
        ...result,
        onboardingCompleted: Boolean(result.onboardingCompleted),
        notificationsEnabled: result.notificationsEnabled
          ? Boolean(result.notificationsEnabled)
          : false,
      }
    : null;
}

export async function updateSettings(settings: Partial<UserSettings>): Promise<void> {
  const database = await initDatabase();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (settings.theme !== undefined) {
    fields.push('theme = ?');
    values.push(settings.theme);
  }
  if (settings.dailyGoalReps !== undefined) {
    fields.push('dailyGoalReps = ?');
    values.push(settings.dailyGoalReps);
  }
  if (settings.dailyGoalTime !== undefined) {
    fields.push('dailyGoalTime = ?');
    values.push(settings.dailyGoalTime);
  }
  if (settings.onboardingCompleted !== undefined) {
    fields.push('onboardingCompleted = ?');
    values.push(settings.onboardingCompleted ? 1 : 0);
  }
  if (settings.notificationsEnabled !== undefined) {
    fields.push('notificationsEnabled = ?');
    values.push(settings.notificationsEnabled ? 1 : 0);
  }
  if (settings.notificationFrequency !== undefined) {
    fields.push('notificationFrequency = ?');
    values.push(settings.notificationFrequency);
  }
  if (settings.notificationTime !== undefined) {
    fields.push('notificationTime = ?');
    values.push(settings.notificationTime);
  }

  if (fields.length > 0) {
    await database.runAsync(`UPDATE settings SET ${fields.join(', ')} WHERE id = 1`, values);
  }
}

export async function seedE2EMockData(): Promise<void> {
  const database = await initDatabase();
  const today = new Date();

  const formatDate = (offsetDays: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() - offsetDays);
    return date.toISOString().split('T')[0];
  };

  await database.execAsync(`
    DELETE FROM logs;
    DELETE FROM goals;
    DELETE FROM exercises;
  `);

  await database.runAsync(
    'INSERT INTO exercises (id, name, unit, color, icon, isArchived) VALUES (?, ?, ?, ?, ?, ?)',
    ['e2e-pushups', 'Pushups', 'reps', '#0D5D5D', 'Dumbbell', 0]
  );
  await database.runAsync(
    'INSERT INTO exercises (id, name, unit, color, icon, isArchived) VALUES (?, ?, ?, ?, ?, ?)',
    ['e2e-squats', 'Squats', 'reps', '#10B981', 'Activity', 0]
  );
  await database.runAsync(
    'INSERT INTO exercises (id, name, unit, color, icon, isArchived) VALUES (?, ?, ?, ?, ?, ?)',
    ['e2e-plank', 'Plank', 'seconds', '#147A7A', 'Timer', 0]
  );

  await database.runAsync(
    'INSERT INTO goals (id, title, type, targetValue, exerciseId, metric, startDate, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['e2e-goal-daily-push', 'Daily Pushups', 'daily', 120, 'e2e-pushups', 'reps', today.toISOString(), 1]
  );
  await database.runAsync(
    'INSERT INTO goals (id, title, type, targetValue, exerciseId, metric, startDate, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['e2e-goal-weekly-plank', 'Weekly Plank', 'weekly', 2400, 'e2e-plank', 'time', today.toISOString(), 1]
  );

  const mockLogs: Array<[string, string, string, number, string, number]> = [
    ['e2e-log-1', 'e2e-pushups', formatDate(0), 80, '', Date.now() - 1_000],
    ['e2e-log-2', 'e2e-squats', formatDate(0), 60, '', Date.now() - 2_000],
    ['e2e-log-3', 'e2e-plank', formatDate(0), 180, '', Date.now() - 3_000],
    ['e2e-log-4', 'e2e-pushups', formatDate(1), 110, '', Date.now() - 86_400_000],
    ['e2e-log-5', 'e2e-plank', formatDate(1), 240, '', Date.now() - 86_401_000],
    ['e2e-log-6', 'e2e-squats', formatDate(2), 75, '', Date.now() - 172_800_000],
    ['e2e-log-7', 'e2e-pushups', formatDate(3), 95, '', Date.now() - 259_200_000],
    ['e2e-log-8', 'e2e-plank', formatDate(4), 300, '', Date.now() - 345_600_000],
    ['e2e-log-9', 'e2e-squats', formatDate(5), 65, '', Date.now() - 432_000_000],
    ['e2e-log-10', 'e2e-pushups', formatDate(6), 120, '', Date.now() - 518_400_000],
  ];

  for (const log of mockLogs) {
    await database.runAsync(
      'INSERT INTO logs (id, exerciseId, date, value, notes, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
      log
    );
  }

  await database.runAsync(
    'UPDATE settings SET theme = ?, dailyGoalReps = ?, dailyGoalTime = ?, onboardingCompleted = ?, notificationsEnabled = ?, notificationFrequency = ?, notificationTime = ? WHERE id = 1',
    ['system', 150, 900, 1, 0, 1, '09:00']
  );
}
