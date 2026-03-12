import { useRouter } from 'expo-router';
import { ArrowLeft, Dumbbell, Timer, TrendingUp } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { getExercises, getLogs, initDatabase } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';
import type { Exercise, LogEntry } from '../../src/types';

type TabType = 'week' | 'month' | 'year';
type MetricType = 'reps' | 'time';

export default function StatsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('week');
  const [activityMetric, setActivityMetric] = useState<MetricType>('reps');
  const [_currentDate] = useState(new Date());

  useEffect(() => {
    async function loadData() {
      await initDatabase();
      const [logsData, exercisesData] = await Promise.all([getLogs(), getExercises()]);
      setLogs(logsData);
      setExercises(exercisesData);
      setLoading(false);
    }
    loadData();
  }, []);

  const stats = useMemo(() => {
    if (!logs || !exercises) {
      return {
        totalReps: 0,
        totalMinutes: 0,
        avgRepsPerDay: 0,
        avgMinutesPerDay: 0,
        dailyData: [],
        weeklyData: [],
      };
    }

    const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

    let start: Date;
    let end: Date;
    let daysCount = 1;

    const now = new Date();
    if (activeTab === 'week') {
      end = new Date(now);
      start = new Date(now);
      start.setDate(start.getDate() - 6);
      daysCount = 7;
    } else if (activeTab === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      daysCount = now.getDate();
    } else {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
      const diffTime = Math.abs(now.getTime() - start.getTime());
      daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    const periodLogs = logs.filter((l) => {
      const logDate = new Date(l.date);
      return logDate >= start && logDate <= end;
    });

    let totalReps = 0;
    let totalTime = 0;

    periodLogs.forEach((l) => {
      const ex = exerciseMap.get(l.exerciseId);
      if (ex?.unit === 'reps') totalReps += l.value;
      if (ex?.unit === 'seconds') totalTime += l.value;
    });

    const avgRepsPerDay = Math.round(totalReps / daysCount);
    const avgMinutesPerDay = Math.round(totalTime / 60 / daysCount);
    const totalMinutes = Math.round(totalTime / 60);

    // Daily data
    const dailyData: { day: string; value: number }[] = [];
    if (activeTab === 'week') {
      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const dayStr = date.toISOString().split('T')[0];
        const dayLogs = periodLogs.filter((l) => l.date === dayStr);

        const value = dayLogs.reduce((acc, l) => {
          const ex = exerciseMap.get(l.exerciseId);
          if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
          if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + l.value / 60;
          return acc;
        }, 0);

        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 1);
        dailyData.push({ day: dayLabel.toUpperCase(), value: Math.round(value) });
      }
    } else if (activeTab === 'month') {
      const daysInMonth = end.getDate();
      for (let i = 1; i <= daysInMonth; i += Math.ceil(daysInMonth / 7)) {
        const date = new Date(now.getFullYear(), now.getMonth(), i);
        const dayStr = date.toISOString().split('T')[0];
        const dayLogs = periodLogs.filter((l) => l.date === dayStr);

        const value = dayLogs.reduce((acc, l) => {
          const ex = exerciseMap.get(l.exerciseId);
          if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
          if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + l.value / 60;
          return acc;
        }, 0);

        dailyData.push({ day: String(i), value: Math.round(value) });
      }
    } else {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(now.getFullYear(), i, 1);
        const monthEnd = new Date(now.getFullYear(), i + 1, 0);
        const monthLogs = periodLogs.filter((l) => {
          const logDate = new Date(l.date);
          return logDate >= monthStart && logDate <= monthEnd;
        });

        const value = monthLogs.reduce((acc, l) => {
          const ex = exerciseMap.get(l.exerciseId);
          if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
          if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + l.value / 60;
          return acc;
        }, 0);

        dailyData.push({ day: months[i], value: Math.round(value) });
      }
    }

    // Weekly data for comparison
    const weeklyData: { week: string; value: number }[] = [];
    if (activeTab === 'week') {
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekLogs = periodLogs.filter((l) => {
          const logDate = new Date(l.date);
          return logDate >= weekStart && logDate <= weekEnd;
        });

        const value = weekLogs.reduce((acc, l) => {
          const ex = exerciseMap.get(l.exerciseId);
          if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
          if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + l.value / 60;
          return acc;
        }, 0);

        weeklyData.push({ week: `W${4 - i}`, value: Math.round(value) });
      }
    } else if (activeTab === 'month') {
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

        const monthLogs = periodLogs.filter((l) => {
          const logDate = new Date(l.date);
          return logDate >= monthStart && logDate <= monthEnd;
        });

        const value = monthLogs.reduce((acc, l) => {
          const ex = exerciseMap.get(l.exerciseId);
          if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
          if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + l.value / 60;
          return acc;
        }, 0);

        const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'short' });
        weeklyData.push({ week: monthLabel, value: Math.round(value) });
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        const yearDate = new Date(now.getFullYear() - i, 0, 1);
        const yearStart = new Date(yearDate.getFullYear(), 0, 1);
        const yearEnd = new Date(yearDate.getFullYear(), 11, 31);

        const yearLogs = periodLogs.filter((l) => {
          const logDate = new Date(l.date);
          return logDate >= yearStart && logDate <= yearEnd;
        });

        const value = yearLogs.reduce((acc, l) => {
          const ex = exerciseMap.get(l.exerciseId);
          if (activityMetric === 'reps' && ex?.unit === 'reps') return acc + l.value;
          if (activityMetric === 'time' && ex?.unit === 'seconds') return acc + l.value / 60;
          return acc;
        }, 0);

        weeklyData.push({ week: String(yearDate.getFullYear()), value: Math.round(value) });
      }
    }

    // Calculate percentage change
    let percentChange = 0;
    if (weeklyData.length >= 2) {
      const current = weeklyData[weeklyData.length - 1]?.value || 0;
      const previous = weeklyData[weeklyData.length - 2]?.value || 0;
      if (previous > 0) {
        percentChange = Math.round(((current - previous) / previous) * 100);
      }
    }

    return {
      totalReps,
      totalMinutes,
      avgRepsPerDay,
      avgMinutesPerDay,
      dailyData,
      weeklyData,
      percentChange,
    };
  }, [logs, exercises, activeTab, activityMetric]);

  const _maxDailyValue = Math.max(...stats.dailyData.map((d) => d.value), 1);
  const maxWeeklyValue = Math.max(...stats.weeklyData.map((d) => d.value), 1);

  // Render Area Chart
  const renderAreaChart = () => {
    const data = stats.dailyData;
    const width = 320;
    const height = 140;
    const padding = 20;

    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const stepX = (width - padding * 2) / (data.length - 1);

    let pathD = '';
    let fillPathD = '';

    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (point.value / maxValue) * (height - padding * 2);

      if (index === 0) {
        pathD += `M ${x} ${y}`;
        fillPathD += `M ${x} ${height - padding} L ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
        fillPathD += ` L ${x} ${y}`;
      }
    });

    fillPathD += ` L ${padding + (data.length - 1) * stepX} ${height - padding} Z`;

    return (
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={fillPathD} fill="url(#areaGradient)" />
        <Path
          d={pathD}
          stroke={colors.primary}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  };

  // Render Bar Chart
  const renderBarChart = () => {
    const data = stats.weeklyData;
    const _barWidth = 28;
    const chartHeight = 140;
    const padding = 20;

    return (
      <View style={styles.barChartContainer}>
        {data.map((item, index) => {
          const barHeight = Math.max((item.value / maxWeeklyValue) * (chartHeight - padding), 4);
          return (
            <View key={index} style={styles.barWrapper}>
              <View style={[styles.bar, { backgroundColor: colors.primary, height: barHeight }]} />
              <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{item.week}</Text>
            </View>
          );
        })}
      </View>
    );
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

  const totalActivity = stats.dailyData.reduce((acc, d) => acc + d.value, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
        {(['week', 'month', 'year'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 3 },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.primary : colors.textSecondary },
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {/* Key Summary Cards */}
        <View style={styles.cardsRow}>
          {/* Reps Card */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Dumbbell size={16} color={colors.primary} />
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Reps</Text>
            </View>
            <Text style={[styles.cardValue, { color: colors.text }]}>
              {stats.totalReps.toLocaleString()}
            </Text>
            <Text style={[styles.cardSubLabel, { color: colors.textSecondary }]}>Total</Text>
            <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
            <Text style={[styles.cardSmallValue, { color: colors.text }]}>
              {stats.avgRepsPerDay}
            </Text>
            <Text style={[styles.cardSmallLabel, { color: colors.textSecondary }]}>
              Avg per Day
            </Text>
          </View>

          {/* Time Card */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Timer size={16} color={colors.primary} />
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Mins</Text>
            </View>
            <Text style={[styles.cardValue, { color: colors.text }]}>
              {stats.totalMinutes.toLocaleString()}
            </Text>
            <Text style={[styles.cardSubLabel, { color: colors.textSecondary }]}>Total</Text>
            <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
            <Text style={[styles.cardSmallValue, { color: colors.text }]}>
              {stats.avgMinutesPerDay}m
            </Text>
            <Text style={[styles.cardSmallLabel, { color: colors.textSecondary }]}>
              Avg per Day
            </Text>
          </View>
        </View>

        {/* Daily Activity Section */}
        <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
          <View style={styles.chartSectionHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Daily Activity</Text>
            <View style={[styles.metricToggle, { backgroundColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.metricButton,
                  activityMetric === 'reps' && { backgroundColor: colors.card },
                ]}
                onPress={() => setActivityMetric('reps')}
              >
                <Text
                  style={[
                    styles.metricButtonText,
                    { color: activityMetric === 'reps' ? colors.text : colors.textSecondary },
                  ]}
                >
                  Reps
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.metricButton,
                  activityMetric === 'time' && { backgroundColor: colors.card },
                ]}
                onPress={() => setActivityMetric('time')}
              >
                <Text
                  style={[
                    styles.metricButtonText,
                    { color: activityMetric === 'time' ? colors.text : colors.textSecondary },
                  ]}
                >
                  Mins
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.chartValueRow}>
            <Text style={[styles.chartTotalValue, { color: colors.text }]}>
              {totalActivity.toLocaleString()}
            </Text>
            <Text style={[styles.chartTotalLabel, { color: colors.textSecondary }]}>
              Total {activityMetric === 'reps' ? 'Reps' : 'Mins'}
            </Text>
          </View>

          {renderAreaChart()}

          {/* X-axis labels */}
          <View style={styles.xAxisLabels}>
            {stats.dailyData.map((d, i) => (
              <Text key={i} style={[styles.xAxisLabel, { color: colors.textSecondary }]}>
                {d.day}
              </Text>
            ))}
          </View>
        </View>

        {/* Weekly Comparison Section */}
        <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
          <View style={styles.chartSectionHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Weekly Comparison</Text>
            <View style={[styles.metricToggle, { backgroundColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.metricButton,
                  activityMetric === 'reps' && { backgroundColor: colors.card },
                ]}
                onPress={() => setActivityMetric('reps')}
              >
                <Text
                  style={[
                    styles.metricButtonText,
                    { color: activityMetric === 'reps' ? colors.text : colors.textSecondary },
                  ]}
                >
                  Reps
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.metricButton,
                  activityMetric === 'time' && { backgroundColor: colors.card },
                ]}
                onPress={() => setActivityMetric('time')}
              >
                <Text
                  style={[
                    styles.metricButtonText,
                    { color: activityMetric === 'time' ? colors.text : colors.textSecondary },
                  ]}
                >
                  Mins
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.chartValueRow}>
            <View style={styles.changeRow}>
              <Text
                style={[
                  styles.changeValue,
                  { color: (stats.percentChange ?? 0) >= 0 ? colors.primary : colors.error },
                ]}
              >
                {(stats.percentChange ?? 0) > 0 ? '+' : ''}
                {stats.percentChange ?? 0}%
              </Text>
              <TrendingUp
                size={16}
                color={(stats.percentChange ?? 0) >= 0 ? colors.primary : colors.error}
              />
            </View>
            <Text style={[styles.chartTotalLabel, { color: colors.textSecondary }]}>
              vs last period
            </Text>
          </View>

          {renderBarChart()}
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  cardSubLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    marginVertical: 12,
  },
  cardSmallValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSmallLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  chartSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  chartSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 11,
    fontWeight: '700',
  },
  chartValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  chartTotalValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  chartTotalLabel: {
    fontSize: 14,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  xAxisLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 20,
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    width: 28,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 32,
  },
});
