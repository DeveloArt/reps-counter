import { useLocalSearchParams, useRouter } from 'expo-router';
import { Edit2, Minus, Play, Plus, RotateCcw, Save, Square } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Modal } from '../../src/components/Modal';
import { addLog, getExercise, initDatabase } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';

export default function LogEntryScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const [exercise, setExercise] = useState<any>(null);
  const [value, setValue] = useState<number | ''>(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const initialValueRef = useRef<number>(0);

  useEffect(() => {
    async function loadData() {
      await initDatabase();
      if (exerciseId) {
        const data = await getExercise(exerciseId);
        setExercise(data);
      }
    }
    loadData();
  }, [exerciseId]);

  useEffect(() => {
    setValue(0);
    setIsRunning(false);
  }, [exerciseId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      startTimeRef.current = Date.now();
      initialValueRef.current = Number(value) || 0;

      interval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setValue(initialValueRef.current + elapsedSeconds);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleSave = async () => {
    if (!exerciseId) return;

    await addLog({
      exerciseId,
      date: new Date(),
      value: Number(value) || 0,
      timestamp: Date.now(),
    });

    router.back();
  };

  const increment = () => setValue((prev) => (Number(prev) || 0) + 1);
  const decrement = () => setValue((prev) => Math.max(0, (Number(prev) || 0) - 1));
  const toggleTimer = () => setIsRunning(!isRunning);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return { minutes, seconds };
  };

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.text }]}>Exercise not found</Text>
      </View>
    );
  }

  const { minutes, seconds } = formatTime(Number(value) || 0);

  return (
    <Modal isOpen={true} onClose={() => router.back()} title={exercise.name}>
      <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.exerciseIcon,
                { backgroundColor: `${colors.primary}10` },
              ]}
            >
              <Text style={[styles.exerciseInitial, { color: colors.primary }]}>
                {exercise.name.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
              <Text style={[styles.exerciseSubtitle, { color: colors.textSecondary }]}>Dodaj nowy wpis</Text>
            </View>
          </View>
        </View>

        {exercise.unit === 'reps' ? (
          <View style={styles.counterSection}>
            <View style={[styles.counterBox, { backgroundColor: `${colors.primary}05` }]}>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  onPress={decrement}
                  style={[styles.counterButton, { borderColor: `${colors.primary}20` }]}
                >
                  <Minus size={32} color={colors.primary} />
                </TouchableOpacity>
                <View style={styles.counterValueContainer}>
                  <TextInput
                    style={[styles.counterValue, { color: colors.primary }]}
                    value={String(value)}
                    onChangeText={(text) => setValue(text === '' ? '' : Number(text))}
                    keyboardType="numeric"
                  />
                  <Text style={[styles.counterLabel, { color: colors.textSecondary }]}>REPS</Text>
                </View>
                <TouchableOpacity
                  onPress={increment}
                  style={[styles.counterButtonPrimary, { backgroundColor: colors.primary }]}
                >
                  <Plus size={32} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.timerSection}>
            <View style={[styles.timerBox, { backgroundColor: `${colors.primary}05` }]}>
              <View style={styles.timerDisplay}>
                <View style={styles.timeUnit}>
                  <View style={[styles.timeCard, { backgroundColor: colors.card, borderColor: `${colors.primary}10` }]}>
                    <Text style={[styles.timeValue, { color: colors.primary }]}>{minutes}</Text>
                  </View>
                  <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>MINUTES</Text>
                </View>
                <Text style={[styles.timeSeparator, { color: colors.primary }]}>:</Text>
                <View style={styles.timeUnit}>
                  <View style={[styles.timeCard, { backgroundColor: colors.card, borderColor: `${colors.primary}10` }]}>
                    <Text style={[styles.timeValue, { color: colors.primary }]}>{seconds}</Text>
                  </View>
                  <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>SECONDS</Text>
                </View>
              </View>

              <View style={styles.timerControls}>
                <TouchableOpacity
                  onPress={toggleTimer}
                  style={[styles.timerButton, { backgroundColor: colors.primary }]}
                >
                  {isRunning ? <Square size={20} color="white" /> : <Play size={20} color="white" />}
                  <Text style={styles.timerButtonText}>{isRunning ? 'Stop' : 'Start'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsRunning(false);
                    setValue(0);
                  }}
                  style={[styles.timerButton, { backgroundColor: colors.muted }]}
                >
                  <RotateCcw size={20} color={colors.text} />
                  <Text style={[styles.timerButtonText, { color: colors.text }]}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.manualEntry}>
              <View style={styles.manualLabelContainer}>
                <Edit2 size={16} color={colors.text} />
                <Text style={[styles.manualLabel, { color: colors.text }]}>
                  Wpisz ręcznie (Sekundy)
                </Text>
              </View>
              <TextInput
                style={[
                  styles.manualInput,
                  { color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
                ]}
                placeholder="np. 60"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={String(value)}
                onChangeText={(text) => setValue(text === '' ? '' : Number(text))}
              />
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
        >
          <Save size={24} color="white" />
          <Text style={styles.saveButtonText}>Save Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  modalContent: {
    gap: 16,
  },
  header: {
    marginBottom: 32,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInitial: {
    fontSize: 24,
    fontWeight: '700',
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  exerciseSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  counterSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  counterBox: {
    borderRadius: 16,
    padding: 32,
    width: '100%',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  counterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonPrimary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  counterValueContainer: {
    alignItems: 'center',
    minWidth: 100,
  },
  counterValue: {
    fontSize: 72,
    fontWeight: '700',
    textAlign: 'center',
  },
  counterLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 8,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerBox: {
    borderRadius: 16,
    padding: 32,
    width: '100%',
    marginBottom: 32,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeCard: {
    width: 96,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeValue: {
    fontSize: 40,
    fontWeight: '700',
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 8,
  },
  timeSeparator: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 24,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
  },
  timerButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  manualEntry: {
    width: '100%',
    gap: 8,
  },
  manualLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manualLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  manualInput: {
    borderRadius: 12,
    borderWidth: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
