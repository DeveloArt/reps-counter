import type { Exercise } from '@fitcounter/core';
import { db } from '@fitcounter/core';
import { useLiveQuery } from 'dexie-react-hooks';

export function useExercises() {
  const exercises = useLiveQuery(() => db.exercises.filter((e) => !e.isArchived).toArray());

  const addExercise = async (exercise: Omit<Exercise, 'id'>) => {
    const id = crypto.randomUUID();
    await db.exercises.add({ id, ...exercise });
  };

  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    await db.exercises.update(id, updates);
  };

  const deleteExercise = async (id: string) => {
    await db.exercises.update(id, { isArchived: true });
  };

  return {
    exercises,
    addExercise,
    updateExercise,
    deleteExercise,
  };
}
