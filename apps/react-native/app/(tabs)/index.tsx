import { useRouter } from 'expo-router';
import {
  Activity,
  Dumbbell,
  Edit2,
  Flame,
  MoreHorizontal,
  Plus,
  Timer,
  Zap,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  getExercises,
  getGoals,
  getLogsByDate,
  getLogsForWeek,
  getSettings,
  initDatabase,
} from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';
import type { Exercise, Goal, LogEntry, UserSettings } from '../../src/types';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [weeklyLogs, setWeeklyLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyMetric, setWeeklyMetric] = useState<'reps' | 'time'>('reps');
  const [_currentDate] = useState(new Date());

  useEffect(() => {
    async function loadData() {
      await initDatabase();
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Calculate start and end of week (last 7 days)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(startOfWeek.getDate() - 6);
      const startStr = startOfWeek.toISOString().split('T')[0];

      const [exercisesData, logsData, settingsData, goalsData, weeklyData] = await Promise.all([
        getExercises(),
        getLogsByDate(todayStr),
        getSettings(),
        getGoals(),
        getLogsForWeek(startStr, todayStr),
      ]);
      setExercises(exercisesData);
      setLogs(logsData);
      setWeeklyLogs(weeklyData);
      setSettings(settingsData);
      setGoals(goalsData.filter((g) => g.type === 'daily' && g.isActive));
      setLoading(false);
    }
    loadData();
  }, []);

  // Calculate today's stats
  const todayStats = logs.reduce(
    (acc, log) => {
      const exercise = exercises.find((e) => e.id === log.exerciseId);
      if (exercise?.unit === 'reps') {
        acc.totalReps += log.value;
      } else if (exercise?.unit === 'seconds') {
        acc.totalTime += log.value;
      }
      // Track per exercise
      acc.exerciseTotals[log.exerciseId] = (acc.exerciseTotals[log.exerciseId] || 0) + log.value;
      return acc;
    },
    { totalReps: 0, totalTime: 0, exerciseTotals: {} as Record<string, number> }
  );

  // Calculate weekly performance data
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Get the start of the week (Monday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  // Calculate weekly data for each day
  const weeklyData = dayLabels.map((_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    const dateStr = date.toISOString().split('T')[0];

    const dayLogs = weeklyLogs.filter((log) => log.date === dateStr);

    const value = dayLogs.reduce((acc, log) => {
      const exercise = exercises.find((e) => e.id === log.exerciseId);
      if (weeklyMetric === 'reps' && exercise?.unit === 'reps') {
        return acc + log.value;
      }
      if (weeklyMetric === 'time' && exercise?.unit === 'seconds') {
        return acc + log.value / 60; // Convert to minutes
      }
      return acc;
    }, 0);

    return {
      day: dayLabels[index],
      value: Math.round(value),
      isToday: index === (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
    };
  });

  const maxWeeklyValue = Math.max(...weeklyData.map((d) => d.value), 1);

  // Calculate daily goal progress
  const dailyGoalReps = settings?.dailyGoalReps || 100;
  const dailyGoalTime = settings?.dailyGoalTime || 600;

  let totalProgress = 0;
  if (goals.length > 0) {
    const sumPercentages = goals.reduce((acc, goal) => {
      let currentValue = 0;
      if (goal.exerciseId) {
        currentValue = todayStats.exerciseTotals[goal.exerciseId] || 0;
      } else {
        if (goal.metric === 'reps') currentValue = todayStats.totalReps;
        else if (goal.metric === 'time') currentValue = todayStats.totalTime;
      }
      const percentage = Math.min(1, currentValue / (goal.targetValue || 1));
      return acc + percentage;
    }, 0);
    totalProgress = Math.round((sumPercentages / goals.length) * 100);
  } else {
    const progressReps = Math.min(100, (todayStats.totalReps / dailyGoalReps) * 100);
    const progressTime = Math.min(100, (todayStats.totalTime / dailyGoalTime) * 100);
    totalProgress = Math.round((progressReps + progressTime) / 2);
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return Dumbbell;
      case 'Activity':
        return Activity;
      case 'Timer':
        return Timer;
      default:
        return Activity;
    }
  };

  const handleLogExercise = (exercise: Exercise) => {
    router.push(`/log/${exercise.id}`);
  };

  const handleEditExercise = (exercise: Exercise) => {
    router.push(`/exercise/${exercise.id}`);
  };

  const handleAddExercise = () => {
    router.push('/exercise/new');
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.text }]}>Hello!</Text>
          <View style={styles.streakContainer}>
            <Flame size={14} color={colors.primary} />
            <Text style={[styles.streakText, { color: colors.primary }]}>0 days streak</Text>
          </View>
        </View>
      </View>

      {/* Daily Goal Card */}
      <View style={[styles.dailyGoalCard, { backgroundColor: colors.primary }]}>
        <View style={styles.dailyGoalContent}>
          <View style={styles.dailyGoalLeft}>
            <Text style={styles.dailyGoalLabel}>Daily Goal</Text>
            <Text style={styles.dailyGoalValue}>{totalProgress}% Complete</Text>
            <Text style={styles.dailyGoalHint}>Keep going! You're doing great today.</Text>
          </View>
          <View style={styles.circularProgress}>
            <View
              style={[styles.circularProgressBackground, { borderColor: 'rgba(255,255,255,0.1)' }]}
            >
              <View
                style={[
                  styles.circularProgressFill,
                  {
                    borderColor: 'white',
                    borderRightColor: 'transparent',
                    borderBottomColor: totalProgress > 25 ? 'white' : 'transparent',
                    borderLeftColor: totalProgress > 50 ? 'white' : 'transparent',
                    borderTopColor: totalProgress > 75 ? 'white' : 'transparent',
                    transform: [{ rotate: `${totalProgress * 3.6}deg` }],
                  },
                ]}
              />
            </View>
            <View style={styles.circularProgressCenter}>
              <Zap size={32} color="white" fill="white" />
            </View>
          </View>
        </View>
        <View style={styles.dailyGoalStats}>
          <View style={styles.dailyGoalStat}>
            <Text style={styles.dailyGoalStatValue}>{todayStats.totalReps}</Text>
            <Text style={styles.dailyGoalStatLabel}>Reps</Text>
          </View>
          <View style={[styles.dailyGoalDivider, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
          <View style={styles.dailyGoalStat}>
            <Text style={styles.dailyGoalStatValue}>{Math.round(todayStats.totalTime / 60)}</Text>
            <Text style={styles.dailyGoalStatLabel}>Mins</Text>
          </View>
        </View>
      </View>

      {/* Quick Add Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Add</Text>
        <View style={styles.exercisesGrid}>
          {exercises.map((exercise) => {
            const Icon = getIcon(exercise.icon);
            const dailyTotal = todayStats.exerciseTotals[exercise.id] || 0;
            const displayTotal =
              exercise.unit === 'seconds' ? `${Math.round(dailyTotal / 60)}m` : dailyTotal;

            return (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.exerciseCard, { backgroundColor: colors.card }]}
                onPress={() => handleLogExercise(exercise)}
                activeOpacity={0.7}
              >
                <View style={styles.exerciseCardHeader}>
                  <View
                    style={[
                      styles.exerciseIconContainer,
                      { backgroundColor: `${exercise.color}20` },
                    ]}
                  >
                    <Icon size={24} color={exercise.color} />
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditExercise(exercise)}
                  >
                    <Edit2 size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.exerciseCardContent}>
                  <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
                  <Text style={[styles.exerciseUnit, { color: colors.textSecondary }]}>
                    {exercise.unit === 'reps' ? 'Reps' : 'Mins'}
                  </Text>
                </View>
                {dailyTotal > 0 && (
                  <View style={[styles.exerciseBadge, { backgroundColor: colors.border }]}>
                    <Text style={[styles.exerciseBadgeText, { color: colors.text }]}>
                      {displayTotal}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: colors.border }]}
                  onPress={() => handleLogExercise(exercise)}
                >
                  <Plus size={20} color={colors.text} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          {/* Add New Exercise */}
          <TouchableOpacity
            style={[styles.addExerciseCard, { backgroundColor: colors.border }]}
            onPress={handleAddExercise}
            activeOpacity={0.7}
          >
            <View style={styles.addExerciseIcon}>
              <MoreHorizontal size={24} color={colors.textSecondary} />
            </View>
            <Text style={[styles.addExerciseText, { color: colors.textSecondary }]}>
              Add Exercise
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekly Performance */}
      <View style={[styles.weeklyPerformanceCard, { backgroundColor: colors.card }]}>
        <View style={styles.weeklyPerformanceHeader}>
          <Text style={[styles.weeklyPerformanceTitle, { color: colors.text }]}>
            Weekly Performance
          </Text>
          <View style={[styles.metricToggle, { backgroundColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.metricButton,
                weeklyMetric === 'reps' && { backgroundColor: colors.card },
              ]}
              onPress={() => setWeeklyMetric('reps')}
            >
              <Text
                style={[
                  styles.metricButtonText,
                  { color: weeklyMetric === 'reps' ? colors.text : colors.textSecondary },
                ]}
              >
                Reps
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.metricButton,
                weeklyMetric === 'time' && { backgroundColor: colors.card },
              ]}
              onPress={() => setWeeklyMetric('time')}
            >
              <Text
                style={[
                  styles.metricButtonText,
                  { color: weeklyMetric === 'time' ? colors.text : colors.textSecondary },
                ]}
              >
                Mins
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.weeklyPerformanceBars}>
          {weeklyData.map((dayData, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: dayData.isToday ? colors.primary : colors.border,
                      height: `${Math.max((dayData.value / maxWeeklyValue) * 100, 10)}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  {
                    color: dayData.isToday ? colors.primary : colors.textSecondary,
                    fontWeight: dayData.isToday ? '700' : '400',
                  },
                ]}
              >
                {dayData.day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    gap: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Daily Goal Card
  dailyGoalCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dailyGoalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dailyGoalLeft: {
    flex: 1,
    gap: 4,
  },
  dailyGoalLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  dailyGoalValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  dailyGoalHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 8,
    maxWidth: 160,
  },
  circularProgress: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 8,
    position: 'absolute',
  },
  circularProgressFill: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 8,
    position: 'absolute',
  },
  circularProgressCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyGoalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  dailyGoalStat: {
    alignItems: 'center',
    gap: 4,
  },
  dailyGoalStatValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  dailyGoalStatLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  dailyGoalDivider: {
    width: 1,
    height: 32,
  },
  // Quick Add Section

  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exerciseCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exerciseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    padding: 6,
    borderRadius: 20,
  },
  exerciseCardContent: {
    marginTop: 12,
    gap: 2,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseUnit: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  exerciseBadge: {
    position: 'absolute',
    top: 16,
    right: 40,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  exerciseBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addExerciseCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addExerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addExerciseText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Weekly Performance
  weeklyPerformanceCard: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  weeklyPerformanceHeader: {
    marginBottom: 16,
  },
  weeklyPerformanceTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  metricToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  metricButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metricButtonText: {
    fontSize: 10,
    fontWeight: '700',
  },
  weeklyPerformanceBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    alignItems: 'flex-end',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '60%',
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 32,
  },
});
