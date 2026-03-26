import { db, exerciseSchema, type Exercise } from '@fitcounter/core';
import { logError } from '../errorHandler';

export const exercisesApi = {
  async getAll(): Promise<Exercise[]> {
    try {
      return await db.exercises.filter((e) => !e.isArchived).toArray();
    } catch (error) {
      logError(error, 'exercisesApi.getAll');
      throw error;
    }
  },

  async getById(id: string): Promise<Exercise | undefined> {
    try {
      return await db.exercises.get(id);
    } catch (error) {
      logError(error, 'exercisesApi.getById');
      throw error;
    }
  },

  async create(data: Omit<Exercise, 'id'>): Promise<string> {
    try {
      const id = crypto.randomUUID();
      const exercise = { ...data, id };
      
      const validated = exerciseSchema.parse(exercise);
      await db.exercises.add(validated);
      
      return id;
    } catch (error) {
      logError(error, 'exercisesApi.create');
      throw error;
    }
  },

  async update(id: string, data: Partial<Exercise>): Promise<void> {
    try {
      const existing = await db.exercises.get(id);
      if (!existing) {
        throw new Error('Exercise not found');
      }

      const updated = { ...existing, ...data, id };
      const validated = exerciseSchema.parse(updated);
      
      await db.exercises.update(id, validated);
    } catch (error) {
      logError(error, 'exercisesApi.update');
      throw error;
    }
  },

  async archive(id: string): Promise<void> {
    try {
      await db.exercises.update(id, { isArchived: true });
    } catch (error) {
      logError(error, 'exercisesApi.archive');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await db.exercises.delete(id);
    } catch (error) {
      logError(error, 'exercisesApi.delete');
      throw error;
    }
  },
};
