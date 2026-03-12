import type { Goal } from '@fitcounter/core';
import { db } from '@fitcounter/core';
import { useLiveQuery } from 'dexie-react-hooks';

export function useGoals() {
  const goals = useLiveQuery(() => db.goals.toArray());

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    const id = crypto.randomUUID();
    await db.goals.add({ id, ...goal });
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    await db.goals.update(id, updates);
  };

  const deleteGoal = async (id: string) => {
    await db.goals.delete(id);
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}
