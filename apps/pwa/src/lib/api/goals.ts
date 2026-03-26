import { db, goalSchema, type Goal } from '@fitcounter/core';
import { logError } from '../errorHandler';

export const goalsApi = {
  async getAll(): Promise<Goal[]> {
    try {
      return await db.goals.toArray();
    } catch (error) {
      logError(error, 'goalsApi.getAll');
      throw error;
    }
  },

  async getActive(): Promise<Goal[]> {
    try {
      return await db.goals.filter((g) => g.isActive).toArray();
    } catch (error) {
      logError(error, 'goalsApi.getActive');
      throw error;
    }
  },

  async getById(id: string): Promise<Goal | undefined> {
    try {
      return await db.goals.get(id);
    } catch (error) {
      logError(error, 'goalsApi.getById');
      throw error;
    }
  },

  async create(data: Omit<Goal, 'id'>): Promise<string> {
    try {
      const id = crypto.randomUUID();
      const goal = { ...data, id };
      
      const validated = goalSchema.parse(goal);
      await db.goals.add(validated);
      
      return id;
    } catch (error) {
      logError(error, 'goalsApi.create');
      throw error;
    }
  },

  async update(id: string, data: Partial<Goal>): Promise<void> {
    try {
      const existing = await db.goals.get(id);
      if (!existing) {
        throw new Error('Goal not found');
      }

      const updated = { ...existing, ...data, id };
      const validated = goalSchema.parse(updated);
      
      await db.goals.update(id, validated);
    } catch (error) {
      logError(error, 'goalsApi.update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await db.goals.delete(id);
    } catch (error) {
      logError(error, 'goalsApi.delete');
      throw error;
    }
  },
};
