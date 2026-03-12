import type { LogEntry } from '@fitcounter/core';
import { db } from '@fitcounter/core';
import { useLiveQuery } from 'dexie-react-hooks';

export function useLogs() {
  const logs = useLiveQuery(() => db.logs.orderBy('timestamp').reverse().toArray());

  const addLog = async (log: Omit<LogEntry, 'id'>) => {
    const id = crypto.randomUUID();
    await db.logs.add({ id, ...log });
  };

  const deleteLog = async (id: string) => {
    await db.logs.delete(id);
  };

  const getLogsByDate = async (date: Date) => {
    const start = date.setHours(0, 0, 0, 0);
    const end = date.setHours(23, 59, 59, 999);
    return db.logs.where('timestamp').between(start, end).toArray();
  };

  return {
    logs,
    addLog,
    deleteLog,
    getLogsByDate,
  };
}
