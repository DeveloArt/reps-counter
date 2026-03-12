import { db } from '@fitcounter/core';
import { eachDayOfInterval, endOfDay, format, startOfDay, subDays } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';

export function useStats(currentDate: Date = new Date()) {
  const exercises = useLiveQuery(() => db.exercises.toArray());
  const logs = useLiveQuery(() => db.logs.toArray());

  const stats = useMemo(() => {
    if (!logs || !exercises) return null;

    // Today's stats
    const todayStart = startOfDay(currentDate).getTime();
    const todayEnd = endOfDay(currentDate).getTime();
    const todayLogs = logs.filter((l) => l.timestamp >= todayStart && l.timestamp <= todayEnd);

    let totalReps = 0;
    let totalTime = 0;

    todayLogs.forEach((log) => {
      const exercise = exercises.find((e) => e.id === log.exerciseId);
      if (exercise?.unit === 'reps') {
        totalReps += log.value;
      } else if (exercise?.unit === 'seconds') {
        totalTime += log.value;
      }
    });

    // Weekly performance
    const weekEnd = endOfDay(currentDate);
    const weekStart = subDays(startOfDay(currentDate), 6);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weeklyData = weekDays.map((day) => {
      const dayStart = startOfDay(day).getTime();
      const dayEnd = endOfDay(day).getTime();
      const dayLogs = logs.filter((l) => l.timestamp >= dayStart && l.timestamp <= dayEnd);

      const dayReps = dayLogs.reduce((acc, log) => {
        const exercise = exercises.find((e) => e.id === log.exerciseId);
        return exercise?.unit === 'reps' ? acc + log.value : acc;
      }, 0);

      return {
        day: format(day, 'EEEEE'),
        fullDay: format(day, 'EEE'),
        value: dayReps,
        isToday: day.getTime() === currentDate.getTime(),
      };
    });

    const maxValue = Math.max(...weeklyData.map((d) => d.value), 1);

    return {
      totalReps,
      totalTime,
      weeklyData: { data: weeklyData, maxValue },
    };
  }, [logs, exercises, currentDate]);

  return stats;
}
