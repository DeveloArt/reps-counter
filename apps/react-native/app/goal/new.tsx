import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addGoal, getExercises, initDatabase } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';

export default function NewGoalScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [exercises, setExercises] = useState<any[]>([]);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [targetValue, setTargetValue] = useState('');
  const [exerciseId, setExerciseId] = useState<string>('');
  const [metric, setMetric] = useState<'reps' | 'time' | 'workouts'>('reps');

  useEffect(() => {
    async function loadData() {
      await initDatabase();
      const data = await getExercises();
      setExercises(data);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !targetValue) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    await addGoal({
      title: title.trim(),
      type,
      targetValue: Number.parseInt(targetValue, 10),
      exerciseId: exerciseId || undefined,
      metric,
      startDate: new Date(),
      isActive: true,
    });

    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>New Goal</Text>

      <Text style={[styles.label, { color: colors.text }]}>Title</Text>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
        ]}
        placeholder="Goal title"
        placeholderTextColor={colors.textSecondary}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, { color: colors.text }]}>Type</Text>
      <View style={styles.typeContainer}>
        {(['daily', 'weekly', 'monthly'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.typeButton,
              {
                backgroundColor: type === t ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.typeText, { color: type === t ? 'white' : colors.text }]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Target Value</Text>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
        ]}
        placeholder="Target"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={targetValue}
        onChangeText={setTargetValue}
      />

      <Text style={[styles.label, { color: colors.text }]}>Metric</Text>
      <View style={styles.metricContainer}>
        {(['reps', 'time', 'workouts'] as const).map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.metricButton,
              {
                backgroundColor: metric === m ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setMetric(m)}
          >
            <Text style={[styles.metricText, { color: metric === m ? 'white' : colors.text }]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Exercise (optional)</Text>
      <View style={styles.exerciseContainer}>
        <TouchableOpacity
          style={[
            styles.exerciseButton,
            {
              backgroundColor: !exerciseId ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setExerciseId('')}
        >
          <Text style={[styles.exerciseText, { color: !exerciseId ? 'white' : colors.text }]}>
            All
          </Text>
        </TouchableOpacity>
        {exercises.map((ex) => (
          <TouchableOpacity
            key={ex.id}
            style={[
              styles.exerciseButton,
              {
                backgroundColor: exerciseId === ex.id ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setExerciseId(ex.id)}
          >
            <Text
              style={[styles.exerciseText, { color: exerciseId === ex.id ? 'white' : colors.text }]}
            >
              {ex.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  metricContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  metricButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  metricText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  exerciseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
