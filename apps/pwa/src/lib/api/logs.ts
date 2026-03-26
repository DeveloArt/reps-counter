import { db, logEntrySchema, type LogEntry } from '@fitcounter/core';
import { endOfDay, startOfDay } from 'date-fns';
import { logError } from '../errorHandler';

export const logsApi = {
  async getAll(): Promise<LogEntry[]> {
    try {
      return await db.logs.toArray();
    } catch (error) {
      logError(error, 'logsApi.getAll');
      throw error;
    }
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<LogEntry[]> {
    try {
      const start = startOfDay(startDate).getTime();
      const end = endOfDay(endDate).getTime();
      
      return await db.logs
        .where('timestamp')
        .between(start, end)
        .toArray();
    } catch (error) {
      logError(error, 'logsApi.getByDateRange');
      throw error;
    }
  },

  async getByExercise(exerciseId: string): Promise<LogEntry[]> {
    try {
      return await db.logs
        .where('exerciseId')
        .equals(exerciseId)
        .toArray();
    } catch (error) {
      logError(error, 'logsApi.getByExercise');
      throw error;
    }
  },

  async create(data: Omit<LogEntry, 'id' | 'timestamp'>): Promise<string> {
    try {
      const id = crypto.randomUUID();
      const timestamp = data.date.getTime();
      const logEntry = { ...data, id, timestamp };
      
      const validated = logEntrySchema.parse(logEntry);
      await db.logs.add(validated);
      
      return id;
    } catch (error) {
      logError(error, 'logsApi.create');
      throw error;
    }
  },

  async update(id: string, data: Partial<LogEntry>): Promise<void> {
    try {
      const existing = await db.logs.get(id);
      if (!existing) {
        throw new Error('Log entry not found');
      }

      const updated = { ...existing, ...data, id };
      if (data.date) {
        updated.timestamp = data.date.getTime();
      }
      
      const validated = logEntrySchema.parse(updated);
      await db.logs.update(id, validated);
    } catch (error) {
      logError(error, 'logsApi.update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await db.logs.delete(id);
    } catch (error) {
      logError(error, 'logsApi.delete');
      throw error;
    }
  },
};
