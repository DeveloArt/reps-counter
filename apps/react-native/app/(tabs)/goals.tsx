import { format } from 'date-fns';
import { enUS, pl as plLocale } from 'date-fns/locale';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Edit2,
  PlusCircle,
  Timer,
} from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getExercises, getGoals, getLogs, initDatabase } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';
import type { Exercise, Goal, LogEntry } from '../../src/types';

export default function GoalsScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const locale = (i18n.resolvedLanguage ?? i18n.language).toLowerCase().startsWith('pl')
    ? plLocale
    : enUS;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedGoalFilter, setSelectedGoalFilter] = useState<string>('all');

  const loadData = useCallback(async () => {
    await initDatabase();
    const [goalsData, exercisesData, logsData] = await Promise.all([
      getGoals(),
      getExercises(),
      getLogs(),
    ]);
    setGoals(goalsData);
    setExercises(exercisesData);
    setLogs(logsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const exerciseMap = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);

  // Calculate progress for each goal
  const goalsWithProgress = useMemo(() => {
    return goals.map((goal) => {
      let start: Date;
      let end: Date;
      const now = new Date();

      if (goal.type === 'daily') {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      } else if (goal.type === 'weekly') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(now.getFullYear(), now.getMonth(), diff);
        end = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59);
      } else {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      }

      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      const periodLogs = logs.filter((l) => {
        const logDate =
          l.date instanceof Date ? l.date.toISOString().split('T')[0] : String(l.date);
        return logDate >= startStr && logDate <= endStr;
      });

      let currentVal = 0;
      periodLogs.forEach((log) => {
        const logExerciseUnit = exerciseMap.get(log.exerciseId)?.unit;

        if (goal.exerciseId) {
          if (goal.metric === 'workouts') {
            currentVal += 1;
          } else if (log.exerciseId === goal.exerciseId) {
            currentVal += log.value;
          }
        } else {
          if (goal.metric === 'reps' && logExerciseUnit === 'reps') {
            currentVal += log.value;
          } else if (goal.metric === 'time' && logExerciseUnit === 'seconds') {
            currentVal += log.value;
          } else if (goal.metric === 'workouts') {
            currentVal += 1;
          }
        }
      });

      return { ...goal, currentVal };
    });
  }, [goals, logs, exerciseMap]);

  // History Calendar Data
  const historyData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: {
      date: Date;
      status: 'none' | 'some' | 'all';
      metCount: number;
      totalCount: number;
    }[] = [];

    // Empty days for padding
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({
        date: new Date(year, month, -startDayOfWeek + i + 1),
        status: 'none',
        metCount: 0,
        totalCount: 0,
      });
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayStart = new Date(year, month, day);
      const dayEnd = new Date(year, month, day, 23, 59, 59);

      const goalsToEvaluate =
        selectedGoalFilter === 'all' ? goals : goals.filter((g) => g.id === selectedGoalFilter);

      let metCount = 0;
      const totalCount = goalsToEvaluate.length;

      goalsToEvaluate.forEach((goal) => {
        let pStart: Date;
        let pEnd: Date;

        if (goal.type === 'daily') {
          pStart = dayStart;
          pEnd = dayEnd;
        } else {
          const dayOfWeek = date.getDay();
          const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          pStart = new Date(year, month, diff);
          pEnd = new Date(year, month, diff + 6, 23, 59, 59);
        }

        const pStartStr = pStart.toISOString().split('T')[0];
        const pEndStr = pEnd.toISOString().split('T')[0];

        const periodLogs = logs.filter((l) => {
          const logDate =
            l.date instanceof Date ? l.date.toISOString().split('T')[0] : String(l.date);
          return logDate >= pStartStr && logDate <= pEndStr;
        });

        let currentVal = 0;
        periodLogs.forEach((log) => {
          const logExerciseUnit = exerciseMap.get(log.exerciseId)?.unit;
          if (goal.exerciseId) {
            if (goal.metric === 'workouts') {
              currentVal += 1;
            } else if (log.exerciseId === goal.exerciseId) {
              currentVal += log.value;
            }
          } else {
            if (goal.metric === 'reps' && logExerciseUnit === 'reps') currentVal += log.value;
            else if (goal.metric === 'time' && logExerciseUnit === 'seconds')
              currentVal += log.value;
            else if (goal.metric === 'workouts') currentVal += 1;
          }
        });

        if (currentVal >= goal.targetValue) {
          metCount++;
        }
      });

      let status: 'none' | 'some' | 'all' = 'none';
      if (totalCount > 0) {
        if (metCount === totalCount) status = 'all';
        else if (metCount > 0) status = 'some';
      }

      days.push({ date, status, metCount, totalCount });
    }

    return days;
  }, [currentMonth, goals, logs, exerciseMap, selectedGoalFilter]);

  const getIcon = (iconName: string | undefined) => {
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

  const getDayIcon = (status: string) => {
    if (status === 'all') return <Check size={14} color="white" />;
    return null;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Month names come from date-fns locale (e.g. March -> marzec)

  const handleEditGoal = (goal: Goal) => {
    router.push(`/goal/${goal.id}` as any);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: colors.text }}>{t('common.loading')}</Text>
      </View>
    );
  }

  const activeGoals = goalsWithProgress.filter((g) => g.isActive);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Active Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('goals.activeGoals')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/goal/new')} style={styles.addButton}>
              <PlusCircle size={16} color={colors.primary} />
              <Text style={[styles.addButtonText, { color: colors.primary }]}>
                {t('goals.addGoal')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goalsList}>
            {activeGoals.map((goal) => {
              const exercise = goal.exerciseId ? exerciseMap.get(goal.exerciseId) : null;
              const Icon = exercise ? getIcon(exercise.icon) : Activity;
              const progress = Math.min(
                100,
                Math.round((goal.currentVal / goal.targetValue) * 100)
              );
              const isMet = progress >= 100;

              return (
                <View
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.goalCardHeader}>
                    <View style={styles.goalInfo}>
                      <View
                        style={[
                          styles.goalIcon,
                          {
                            backgroundColor: exercise ? `${exercise.color}20` : colors.border,
                            borderColor: exercise?.color || colors.border,
                          },
                        ]}
                      >
                        <Icon size={20} color={exercise?.color || colors.textSecondary} />
                      </View>
                      <View style={styles.goalTextContainer}>
                        <View style={styles.goalTitleRow}>
                          <Text style={[styles.goalTitle, { color: colors.text }]}>
                            {goal.title}
                          </Text>
                          {!goal.isActive && (
                            <View
                              style={[styles.pausedBadge, { backgroundColor: `${colors.error}20` }]}
                            >
                              <AlertCircle size={10} color={colors.error} />
                              <Text style={[styles.pausedBadgeText, { color: colors.error }]}>
                                {t('goals.pausedStatus')}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.goalSubtitle, { color: colors.textSecondary }]}>
                          {goal.type === 'daily'
                            ? t('goals.daily')
                            : goal.type === 'weekly'
                              ? t('goals.weekly')
                              : t('goals.monthly')}{' '}
                          •{' '}
                          {goal.metric === 'reps'
                            ? t('home.reps')
                            : goal.metric === 'time'
                              ? t('home.mins')
                              : t('goals.workouts')}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.goalProgressContainer}>
                      <View style={styles.goalProgressText}>
                        <Text
                          style={[
                            styles.goalProgressValue,
                            { color: isMet ? colors.primary : colors.text },
                          ]}
                        >
                          {goal.metric === 'time'
                            ? Math.round(goal.currentVal / 60)
                            : Math.round(goal.currentVal)}
                        </Text>
                        <Text style={[styles.goalProgressDivider, { color: colors.textSecondary }]}>
                          {' '}
                          /{' '}
                        </Text>
                        <Text style={[styles.goalProgressTarget, { color: colors.textSecondary }]}>
                          {goal.metric === 'time'
                            ? Math.round(goal.targetValue / 60)
                            : goal.targetValue}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleEditGoal(goal)}
                        style={styles.editButton}
                      >
                        <Edit2 size={16} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          backgroundColor: isMet ? colors.primary : colors.primary,
                          width: `${progress}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}

            {activeGoals.length === 0 && (
              <View style={[styles.emptyState, { borderColor: colors.border }]}>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  {t('goals.noGoals')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/goal/new')}>
                  <Text style={[styles.emptyStateLink, { color: colors.primary }]}>
                    {t('goals.createFirst')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* History Calendar */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('goals.history')}</Text>
            <View
              style={[
                styles.monthNav,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                }
                style={styles.monthNavButton}
              >
                <ChevronLeft size={16} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.monthTitle, { color: colors.text }]}>
                {format(currentMonth, 'LLLL yyyy', { locale })}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                }
                style={styles.monthNavButton}
              >
                <ChevronRight size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.calendarSection,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {goals.length > 0 && (
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor:
                        selectedGoalFilter === 'all' ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedGoalFilter('all')}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      { color: selectedGoalFilter === 'all' ? 'white' : colors.text },
                    ]}
                  >
                    {t('goals.allGoals')}
                  </Text>
                </TouchableOpacity>
                {goals.slice(0, 2).map((g) => (
                  <TouchableOpacity
                    key={g.id}
                    style={[
                      styles.filterButton,
                      {
                        backgroundColor:
                          selectedGoalFilter === g.id ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setSelectedGoalFilter(g.id)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        { color: selectedGoalFilter === g.id ? 'white' : colors.text },
                      ]}
                    >
                      {g.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Week day headers */}
            <View style={styles.weekDaysRow}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <Text key={i} style={[styles.weekDayText, { color: colors.textSecondary }]}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.calendarGrid}>
              {historyData.map((day, i) => (
                <View
                  key={i}
                  style={[
                    styles.calendarDay,
                    day.status === 'all' && { backgroundColor: colors.primary },
                    day.status === 'some' && {
                      backgroundColor: `${colors.primary}66`,
                      borderColor: colors.primary,
                    },
                    isToday(day.date) && { borderColor: colors.text, borderWidth: 2 },
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      {
                        color:
                          day.status === 'all'
                            ? 'white'
                            : day.status === 'some'
                              ? colors.text
                              : colors.textSecondary,
                      },
                    ]}
                  >
                    {getDayIcon(day.status) || day.date.getDate()}
                  </Text>
                </View>
              ))}
            </View>

            {selectedGoalFilter === 'all' && goals.length > 0 && (
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                    {t('common.none')}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: `${colors.primary}66`, borderColor: colors.primary },
                    ]}
                  />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                    {t('common.some')}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                    {t('common.all')}
                  </Text>
                </View>
              </View>
            )}
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalsList: {
    gap: 12,
  },
  goalCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  goalTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  pausedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pausedBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  goalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  goalProgressContainer: {
    alignItems: 'flex-end',
  },
  goalProgressText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goalProgressValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  goalProgressDivider: {
    fontSize: 14,
  },
  goalProgressTarget: {
    fontSize: 14,
  },
  editButton: {
    padding: 4,
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyState: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
  },
  emptyStateLink: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
  },
  monthNavButton: {
    padding: 4,
  },
  monthTitle: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 100,
    textAlign: 'center',
  },
  calendarSection: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: `${100 / 7}%`,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
  },
  bottomSpacer: {
    height: 8,
  },
});
