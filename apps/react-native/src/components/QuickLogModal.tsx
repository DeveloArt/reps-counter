import { useRouter } from 'expo-router';
import { Activity, Dumbbell, Plus, Timer } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getExercises } from '../db';
import { useTheme } from '../hooks/useTheme';
import type { Exercise } from '../types';
import { Modal } from './Modal';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickLogModal({ isOpen, onClose }: QuickLogModalProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadExercises();
    }
  }, [isOpen]);

  const loadExercises = async () => {
    const data = await getExercises();
    setExercises(data);
  };

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

  const handleSelectExercise = (exercise: Exercise) => {
    onClose();
    router.push(`/log/${exercise.id}`);
  };

  const handleAddNew = () => {
    onClose();
    router.push('/exercise/new');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Zaloguj aktywność">
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {exercises.map((exercise) => {
            const Icon = getIcon(exercise.icon);
            return (
              <TouchableOpacity
                key={exercise.id}
                onPress={() => handleSelectExercise(exercise)}
                style={[
                  styles.exerciseButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${exercise.color}20` }]}>
                  <Icon size={24} color={exercise.color} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
                  <Text style={[styles.exerciseUnit, { color: colors.textSecondary }]}>
                    {exercise.unit === 'reps' ? 'REPS' : 'MINS'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={handleAddNew}
            style={[
              styles.addNewButton,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
            activeOpacity={0.7}
          >
            <View style={[styles.addIconContainer, { backgroundColor: colors.border }]}>
              <Plus size={20} color={colors.textSecondary} />
            </View>
            <Text style={[styles.addNewText, { color: colors.textSecondary }]}>
              Dodaj ćwiczenie
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 500,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exerciseButton: {
    width: '47%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 4,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  exerciseUnit: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  addNewButton: {
    width: '47%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    minHeight: 120,
  },
  addIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
