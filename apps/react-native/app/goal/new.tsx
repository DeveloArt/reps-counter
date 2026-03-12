import { useRouter } from 'expo-router';
import { Calendar, Check } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Modal } from '../../src/components/Modal';
import { addGoal, getExercises, initDatabase } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';

export default function NewGoalScreen() {
  const { t } = useTranslation();
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
      Alert.alert(t('common.error'), t('common.fillAllFields'));
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
    <Modal isOpen={true} onClose={() => router.back()} title={t('goals.newGoal')}>
      <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>

        <View style={styles.typeGrid}>
          <TouchableOpacity
            style={[
              styles.typeCard,
              {
                backgroundColor: type === 'daily' ? `${colors.primary}05` : colors.card,
                borderColor: type === 'daily' ? colors.primary : colors.border,
                borderWidth: 2,
              },
            ]}
            onPress={() => setType('daily')}
          >
            <Calendar size={24} color={type === 'daily' ? colors.primary : colors.textSecondary} />
            <Text
              style={[
                styles.typeLabel,
                { color: type === 'daily' ? colors.primary : colors.textSecondary },
              ]}
            >
              {t('goals.daily').toUpperCase()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeCard,
              {
                backgroundColor: type === 'weekly' ? `${colors.primary}05` : colors.card,
                borderColor: type === 'weekly' ? colors.primary : colors.border,
                borderWidth: 2,
              },
            ]}
            onPress={() => setType('weekly')}
          >
            <Calendar size={24} color={type === 'weekly' ? colors.primary : colors.textSecondary} />
            <Text
              style={[
                styles.typeLabel,
                { color: type === 'weekly' ? colors.primary : colors.textSecondary },
              ]}
            >
              {t('goals.weekly').toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>{t('goals.exercise')}</Text>
          <View style={styles.exerciseGrid}>
            <TouchableOpacity
              style={[
                styles.exerciseChip,
                {
                  backgroundColor: !exerciseId ? colors.primary : colors.muted,
                  borderColor: !exerciseId ? colors.primary : 'transparent',
                },
              ]}
              onPress={() => setExerciseId('')}
            >
              <Text style={[styles.exerciseChipText, { color: !exerciseId ? 'white' : colors.text }]}>
                {t('common.all')}
              </Text>
            </TouchableOpacity>
            {exercises.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={[
                  styles.exerciseChip,
                  {
                    backgroundColor: exerciseId === ex.id ? colors.primary : colors.muted,
                    borderColor: exerciseId === ex.id ? colors.primary : 'transparent',
                  },
                ]}
                onPress={() => setExerciseId(ex.id)}
              >
                <Text
                  style={[
                    styles.exerciseChipText,
                    { color: exerciseId === ex.id ? 'white' : colors.text },
                  ]}
                >
                  {ex.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricSection}>
            <Text style={[styles.label, { color: colors.text }]}>{t('goals.metric')}</Text>
            <View style={[styles.segmentedControl, { backgroundColor: colors.muted }]}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  metric === 'reps' && [
                    styles.segmentButtonActive,
                    { backgroundColor: colors.card },
                  ],
                ]}
                onPress={() => setMetric('reps')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: metric === 'reps' ? colors.text : colors.textSecondary },
                  ]}
                >
                  {t('home.reps')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  metric === 'time' && [
                    styles.segmentButtonActive,
                    { backgroundColor: colors.card },
                  ],
                ]}
                onPress={() => setMetric('time')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: metric === 'time' ? colors.text : colors.textSecondary },
                  ]}
                >
                  {t('home.mins')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.targetSection}>
            <Text style={[styles.label, { color: colors.text }]}>{t('goals.target')}</Text>
            <TextInput
              style={[
                styles.targetInput,
                { color: colors.text, backgroundColor: colors.muted, borderColor: 'transparent' },
              ]}
              placeholder="10"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={targetValue}
              onChangeText={setTargetValue}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>{t('goals.goalTitle')}</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, backgroundColor: colors.muted, borderColor: 'transparent' },
            ]}
            placeholder={t('goals.enterGoalTitle')}
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Check size={20} color="white" />
          <Text style={styles.saveButtonText}>{t('goals.createGoal')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    gap: 24,
    paddingBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  formSection: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metricSection: {
    flex: 1,
    gap: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  targetSection: {
    flex: 1,
    gap: 8,
  },
  targetInput: {
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  saveButton: {
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
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
