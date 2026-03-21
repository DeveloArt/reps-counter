import { db } from '@fitcounter/core';
import { useEffect, useState } from 'react';

export default function Popup() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState({ totalReps: 0, totalTime: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const exs = await db.exercises.filter((e) => !e.isArchived).toArray();
    setExercises(exs);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logsToday = await db.logs
      .where('timestamp')
      .above(today.getTime())
      .toArray();

    const totalReps = logsToday.reduce((sum, log) => sum + log.value, 0);
    setTodayStats({ totalReps, totalTime: 0 }); // Assuming totalTime is not calculated here
  };

  const quickLog = async (exerciseId: string, value: number) => {
    await db.logs.add({
      id: crypto.randomUUID(),
      exerciseId,
      date: new Date(),
      value,
      timestamp: Date.now(),
    });
    await loadData(); // Reload data to update today's stats
    alert('Logged!');
  };

  return (
    <div className="w-[400px] h-[600px] p-4 bg-gray-50">
      <h1 className="text-xl font-bold text-teal-700 mb-4">FitCounter</h1>

      <div className="mb-4 p-3 bg-white rounded-lg shadow">
        <p className="text-sm text-gray-600">Today's Progress</p>
        <p className="text-2xl font-bold">{todayStats.totalReps} reps</p>
      </div>

      <h2 className="font-semibold mb-2">Quick Log</h2>
      <div className="space-y-2">
        {exercises.map((ex) => (
          <button
            key={ex.id}
            onClick={() => quickLog(ex.id, ex.unit === 'reps' ? 10 : 30)}
            className="w-full p-3 bg-white rounded-lg shadow hover:bg-gray-100 flex justify-between items-center"
          >
            <span>{ex.name}</span>
            <span className="text-teal-600">+{ex.unit === 'reps' ? 10 : 30}</span>
          </button>
        ))}
      </div>

      <a
        href="/app"
        target="_blank"
        className="block mt-4 text-center text-teal-600 text-sm"
        rel="noreferrer"
      >
        Open Full App →
      </a>
    </div>
  );
}