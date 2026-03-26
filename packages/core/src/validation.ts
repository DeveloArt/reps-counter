import { z } from 'zod';

export const exerciseSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  unit: z.enum(['reps', 'seconds']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  icon: z.string().min(1, 'Icon is required'),
  isArchived: z.boolean().optional(),
});

export const logEntrySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  exerciseId: z.string().min(1, 'Exercise ID is required'),
  date: z.date(),
  value: z.number().positive('Value must be positive').max(100000, 'Value is too large'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  timestamp: z.number().positive(),
});

export const goalSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  trigger: z.string().max(200, 'Trigger must be less than 200 characters').optional(),
  type: z.enum(['daily', 'weekly', 'monthly']),
  targetValue: z.number().positive('Target value must be positive').max(1000000, 'Target value is too large'),
  exerciseId: z.string().optional(),
  metric: z.enum(['reps', 'time', 'workouts']),
  startDate: z.date(),
  endDate: z.date().optional(),
  isActive: z.boolean(),
});

export const userSettingsSchema = z.object({
  id: z.number(),
  theme: z.enum(['light', 'dark', 'system']),
  dailyGoalReps: z.number().nonnegative('Daily goal reps must be non-negative'),
  dailyGoalTime: z.number().nonnegative('Daily goal time must be non-negative'),
  onboardingCompleted: z.boolean(),
  notificationsEnabled: z.boolean().optional(),
  notificationFrequency: z.number().positive().optional(),
  notificationTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
});

export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type LogEntryInput = z.infer<typeof logEntrySchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
