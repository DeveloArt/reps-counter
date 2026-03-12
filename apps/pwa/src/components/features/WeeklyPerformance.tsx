interface WeeklyPerformanceProps {
  weeklyData: any;
  weeklyMetric: 'reps' | 'time';
  onMetricChange: (metric: 'reps' | 'time') => void;
}

export function WeeklyPerformance({
  weeklyData,
  weeklyMetric,
  onMetricChange,
}: WeeklyPerformanceProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground">Weekly Performance</h3>
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => onMetricChange('reps')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
              weeklyMetric === 'reps'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Reps
          </button>
          <button
            onClick={() => onMetricChange('time')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
              weeklyMetric === 'time'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mins
          </button>
        </div>
      </div>
      <div className="flex items-end justify-between h-24 gap-2 px-1">
        {weeklyData?.data.map((day: any, index: number) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 flex-1 h-full justify-end group"
          >
            <div className="relative w-full flex items-end justify-center h-full">
              <div
                className={`w-full rounded-t-sm transition-all duration-500 ${
                  day.isToday ? 'bg-primary' : 'bg-muted group-hover:bg-primary/50'
                }`}
                style={{ height: `${(day.value / (weeklyData.maxValue || 1)) * 100}%` }}
              />
              <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded">
                {day.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
        {weeklyData?.data.map((day: any, index: number) => (
          <span key={index} className={day.isToday && 'text-primary font-black'}>
            {day.day}
          </span>
        ))}
      </div>
    </div>
  );
}
